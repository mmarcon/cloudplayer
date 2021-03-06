/*global define*/
//This is the only module where the DOM is ever touched.
//While other modules provide more generic functionalities
//this module bridges what happens in the UI with the
//application logic.
//
//Calls to other components, e.g. *search*, *player*, are direct function
//calls via a unified, stateless module – called `*controller*. The inverse
//flow is done via events rather than via callback to keep the code cleaner
//and more mantainable.
define(function(require) {
    'use strict';

    var searchFormSubmitted,
        trackEnqueueClicked,
        sliderActivated,
        playToggled,
        iosPlayToggled,
        othersPlayToggled,
        playNext,
        skip,
        showMoreClicked,
        reorderOrDeleteClicked,

        Controller = require('modules/controller'),
        Events = require('modules/events'),
        Queue = require('modules/queue'),
        Template = require('modules/ui/template'),
        $ = require('jquery'),
        dispatcher = Events.getDispatcher(),

        toggleplay = $('.toggleplay'),
        playlist = $('.playlist'),
        searchResultsList = $('.search .results'),
        loader = $('.loader'),
        body = $('body');


    //Module entrypoint. Binds DOM event listeners
    //and starts the event observers.
    function bind(){
        listen();
        observe();
    }

    function listen(){
        $('.search form').on('submit', searchFormSubmitted);
        searchResultsList.on('touchstart click', '.enqueue', trackEnqueueClicked);
        $('.slide-control').on('touchstart click', sliderActivated);
        playlist.on('touchstart click', '.more a', showMoreClicked);
        playlist.on('touchstart click', '.move', reorderOrDeleteClicked);
        toggleplay.on('touchstart click', playToggled);
        $('.skip').on('touchstart click', skip);
    }

    //`play` unfortunately does nothing on Mobile Safari
    //when launched in non-standalone mode, unless it is
    //triggered by a user action.
    //
    //Unfortunately there is no way to tell whether
    //the track is being played, but in `index.html`
    //we are setting a class on the body.
    //
    //This function returns `true` if the current browser
    //is able to play sounds with no user action required.
    //It returns `false` otherwise.
    function canPlay(){
        if(body.hasClass('ios') && !body.hasClass('standalone')) {
            return false;
        }
        return true;
    }

    searchFormSubmitted = function(e) {
        //Let's just handle everything JS side
        e.preventDefault();

        loader.show();

        var searchBox = $('#searchTerms');
        //Should hide the keyboard on iOS
        searchBox.blur();
        //Basic query validation
        var searchTerms = searchBox.val();
        if(searchTerms && searchTerms.length > 1) {
            Controller.search(searchTerms);
        }
    };

    //When users touch/click the `+` button on tracks
    //that are in the search results list this handler
    //enqueues them and disables the control under the
    //assumption that duplicate tracks aren't allowed.
    trackEnqueueClicked = function(e) {
        e.preventDefault();
        var target = $(this);
        if(target.hasClass('disabled')) {
            return;
        }
        target.addClass('disabled');
        target.parent().addClass('selected');
        Queue.enqueue(target.parent().data('track'));
        return false;
    };

    //Handles toggling between player and search.
    sliderActivated = function(e) {
        e.preventDefault();
        $('.slider').toggleClass('slide');
        //When iOS non standalone preload
        //when going from search to player
        if(!canPlay()){
            playNext();
        }
        return false;
    };

    //Tracks contenxtual menu in playlist (for deleting and reordering tracks)
    showMoreClicked = function(e) {
        e.preventDefault();
        $(this).parents('.item').toggleClass('translated');
        return false;
    };

    playToggled = function(e) {
        e.preventDefault();
        if(canPlay()) {
            othersPlayToggled.call(this, e);
        } else {
            iosPlayToggled.call(this, e);
        }
        return false;
    };

    //This function handles events on the special toggle play
    //used for iOS where tracks can't be played continuosly when
    //browser is in non-standalone mode.
    //
    //It seems much cleaner to separate event handlers rather than having a bunch of if
    //contitions on the same one.
    iosPlayToggled = function(e) {
        var target = $(this);
        if(target.hasClass('preparing')) {
            return;
        }
        //For Mobile safari this handler **assumes
        //the first track in the queue has been preloaded already**.
        //
        //Every time a tracks finishes playing it is preloaded
        //down in the `TRACK_FINISHED` event handler.
        //
        //Before any track is played, every time the UI changes state the
        //first track in the list is preloaded.
        if(target.hasClass('pause')) {
            Controller.pause();
        } else if(target.hasClass('play')) {
            if(!Controller.resume()) {
                $('.playlist li').first().addClass('disabled');
                Controller.play();
            }
        }
    };

    //This instead handles play on all other browsers
    //The logic of this method is a little contorted.
    //If the control is a *pause* control then we should definitely pause.
    //If the control is a *play* control then it could be either *play* or *resume*.
    //In this last case the handler tries to resume via the `Controller`. If resume
    //fails that means nothing was playing and it is therefore an actual play.
    othersPlayToggled = function(e) {
        var target = $(this);
        if(target.hasClass('pause')) {
            Controller.pause();
        } else if(target.hasClass('play')) {
            if(!Controller.resume()) {
                playNext();
            }
        }
    };

    //Prepare next track in queue to be played
    playNext = function() {
        var track = Queue.get(0);
        if(track) {
            loader.show();
            toggleplay.addClass('preparing');
            Controller.prepare(track.id);
        } else {
            //No more tracks in queue. Bring UI back to
            //initial state.
            toggleplay.removeClass('pause').addClass('play');
            playlist.removeClass('playing');
        }
        return false;
    };

    //Skip track that is currently playing.
    skip = function(e) {
        e.preventDefault();
        Controller.stop();
        $('.player .playlist li').first().remove();
        toggleplay.removeClass('pause').addClass('play');
        Queue.shift();
        playNext();
        return false;
    };

    //Support for track reordering or deleting from the playlist
    reorderOrDeleteClicked = function(e) {
        e.preventDefault();
        var target = $(this), track = target.parents('li').eq(0), sourceIndex, destinationIndex;
        //Sometimes controls can be disabled
        //e.g. playing track can't be modified.
        if(track.hasClass('disabled')) {
            return false;
        }
        //Determine the index of the item in the dom that has to be moved
        sourceIndex = track.index();
        if(target.hasClass('remove')) {
            //Delete item from queue
            return Queue.remove(sourceIndex);
        }
        destinationIndex = getDestinationIndex(target, sourceIndex);
        if(destinationIndex !== false) {
            Queue.swap(sourceIndex, destinationIndex);
        }
        if(!canPlay()){
            playNext();
        }
        return false;
    };

    //When a track is reordered determine where it should go
    function getDestinationIndex(target, sourceIndex) {
        if (target.hasClass('up')) {
            if(sourceIndex === 0 ||
                (sourceIndex === 1 && $('.player .playlist li').first().hasClass('disabled'))) {
                //First in queue or second item in queue
                //with the first one already playing:
                //can't be moved up
                return false;
            }
            return sourceIndex - 1;
        } else if(target.hasClass('down')) {
            if(sourceIndex === Queue.length() - 1) {
                //Last in queue, can't be moved down
                return false;
            }
            return sourceIndex + 1;
        }
    }

    //Internal event handling
    function observe(){
        dispatcher.on(Events.SEARCH_RESULTS, function(results){
            searchResultsList.empty();

            if(!results) {
                return;
            }
            results.forEach(function(res){
                var li = $('<li>');
                //If the track does not have an artwork then use default image
                res.artwork_url = res.artwork_url || 'img/default-artwork.png';
                res.sec_artwork_url = res.artwork_url.replace('http://', 'https://');
                //Attach the original search result to the DOM node
                //so we can easy retrieve it when it is time to enqueue
                //this track
                li.data('track', res);
                li.html(Template.parse('searchResult', res));
                searchResultsList.append(li);
            });
            loader.hide();
        });

        dispatcher.on(Events.SEARCH_TRACKINFO, function(track){
            track.artwork_url = track.artwork_url || 'img/default-artwork.png';
            track.sec_artwork_url = track.artwork_url.replace('http://', 'https://');
            Queue.enqueue(track);
        });

        dispatcher.on(Events.QUEUE_CHANGED, function(queue){
            var playlist = $('.playlist');
            playlist.empty();
            if(!queue) {
                return;
            }
            queue.forEach(function(item){
                var li = $('<li>');
                //Attach the original item to the DOM node
                //so we can easy retrieve it when it is time to enqueue
                //this track
                li.data('track', item);
                li.html(Template.parse('playlistItem', item));
                playlist.append(li);
            });
        });

        dispatcher.on(Events.QUEUE_ITEM_REMOVED, function(index){
            var item = $('.playlist li').eq(index);
            item.addClass('fade');
            //Get rid of the list item once the CSS transition is completed.
            //A nicer way would be to listen for `transitionend`, however
            //that has proven to work inconsistently across browsers.
            setTimeout(function(){
                item.remove();
            }, 300);
        });

        dispatcher.on(Events.QUEUE_ITEMS_SWAPPED, function(index0, index1){
            var list = $('.playlist li'),
                item0 = list.eq(index0),
                item1 = list.eq(index1),
                clone0 = item0.clone(true),
                clone1 = item1.clone(true);

            item1.replaceWith(clone0);
            item0.replaceWith(clone1);
        });

        dispatcher.on(Events.TRACK_READY, function(){
            //Only play if the browser is capable of playing
            if(canPlay()) {
                $('.playlist li').first().addClass('disabled');
                Controller.play();
            }
            toggleplay.removeClass('preparing');
            loader.hide();
        });

        dispatcher.on(Events.TRACK_FINISHED, function(){
            $('.playlist li').first().remove();
            toggleplay.removeClass('pause').addClass('play');
            Queue.shift();
            playNext();
        });

        dispatcher.on(Events.TRACK_PLAYING, function(){
            toggleplay.addClass('pause').removeClass('play');
            playlist.addClass('playing');
        });

        dispatcher.on(Events.TRACK_PAUSED, function(){
            toggleplay.removeClass('pause').addClass('play');
        });

        dispatcher.on(Events.DROPBOX_LOADED, function(dropbox){
            dropbox.forEach(function(trackId){
                Controller.loadTrackInfo(trackId);
            });
        });
    }

    return {
        bind: bind
    };
});