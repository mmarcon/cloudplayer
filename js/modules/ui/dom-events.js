/*global define*/
define(function(require) {
    'use strict';

    var searchFormSubmitted, trackEnqueueClicked, sliderActivated, playToggled, playNext, skip, showMoreClicked, reorderOrDeleteClicked;

    var Controller = require('modules/controller'),
        Events = require('modules/events'),
        Queue = require('modules/queue'),
        Template = require('modules/ui/template'),
        $ = require('jquery'),
        dispatcher = Events.getDispatcher();

    function bind(){
        $('.search form').on('submit', searchFormSubmitted);
        $('.search .results').on('touchstart click', '.enqueue', trackEnqueueClicked);
        $('.slide-control').on('touchstart click', sliderActivated);
        $('.playlist').on('touchstart click', '.more a', showMoreClicked);
        $('.playlist').on('touchstart click', '.move', reorderOrDeleteClicked);
        $('.toggleplay').on('touchstart click', playToggled);
        $('.skip').on('touchstart click', skip);
        observe();
    }

    searchFormSubmitted = function(e) {
        //Let's just handle everything JS side
        e.preventDefault();

        var searchBox = $('#searchTerms');
        //Should hide the keyboard on iOS
        searchBox.blur();
        //Basic query validation
        var searchTerms = searchBox.val();
        if(searchTerms && searchTerms.length > 1) {
            Controller.search(searchTerms);
        }
    };

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

    sliderActivated = function(e) {
        e.preventDefault();
        $('.slider').toggleClass('slide');
        return false;
    };

    showMoreClicked = function(e) {
        e.preventDefault();
        $(this).parents('.item').toggleClass('translated');
        return false;
    };

    playToggled = function(e) {
        e.preventDefault();
        playNext();
        return false;
    };

    playNext = function() {
        var track = Queue.get(0);
        if(track) {
            Controller.prepare(track.id);
            console.log(track);
        }
        return false;
    };

    skip = function(e) {
        e.preventDefault();
        Controller.stop();
        $('.player .playlist li').first().remove();
        Queue.shift();
        playNext();
        return false;
    };

    reorderOrDeleteClicked = function(e) {
        e.preventDefault();
        var target = $(this), track = target.parents('li').eq(0), sourceIndex, destinationIndex;
        //Sometimes controls can be disabled
        //e.g. playing track can't be modified.
        if(target.hasClass('disabled')) {
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
        return false;
    };

    function getDestinationIndex(target, sourceIndex) {
        if (target.hasClass('up')) {
            if(sourceIndex === 0) {
                //First in queue, can't be moved up
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

    function observe(){
        dispatcher.on(Events.SEARCH_RESULTS, function(results){
            var searchResultsList = $('.search .results');
            searchResultsList.empty();

            if(!results) {
                return;
            }
            results.forEach(function(res){
                var li = $('<li>');
                //If the track does not have an artwork then use default image
                res.artwork_url = res.artwork_url || 'img/default-artwork.png';
                //Attach the original search result to the DOM node
                //so we can easy retrieve it when it is time to enqueue
                //this track
                li.data('track', res);
                li.html(Template.parse('searchResult', res));
                searchResultsList.append(li);
            });
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
            console.log(arguments);
            var list = $('.playlist li'),
                item0 = list.eq(index0),
                item1 = list.eq(index1),
                clone0 = item0.clone(true),
                clone1 = item1.clone(true);

            item1.replaceWith(clone0);
            item0.replaceWith(clone1);
        });
        dispatcher.on(Events.TRACK_READY, function(){
            Controller.play();
        });
        dispatcher.on(Events.TRACK_FINISHED, function(){
            $('.playlist li').first().remove();
            Queue.shift();
            playNext();
        });
    }

    return {
        bind: bind
    };
});