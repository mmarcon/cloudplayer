/*global define*/
define(function(require) {
    'use strict';

    //@TODO: add touch events

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
        $('.toggleplay').on('touchstart click', playToggled);
        $('.skip').on('touchstart click', skip);
        observe();
    }

    function searchFormSubmitted(e) {
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
    }

    function trackEnqueueClicked(e) {
        e.preventDefault();
        var target = $(this);
        target.addClass('disabled');
        Queue.enqueue(target.parent().data('track'));
    }

    function sliderActivated(e) {
        e.preventDefault();
        $('.slider').toggleClass('slide');
    }

    function playToggled(e) {
        e.preventDefault();
        playNext();
    }

    function playNext() {
        var track = Queue.get(0);
        if(track) {
            Controller.prepare(track.id);
            console.log(track);
        }
    }

    function skip(e) {
        e.preventDefault();
        Controller.stop();
        $('.player .playlist li').first().remove();
        Queue.shift();
        playNext();
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
            var playlist = $('.player .playlist');
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
        dispatcher.on(Events.TRACK_READY, function(){
            Controller.play();
        });
        dispatcher.on(Events.TRACK_FINISHED, function(){
            $('.player .playlist li').first().remove();
            Queue.shift();
            playNext();
        });
    }

    return {
        bind: bind
    };
});