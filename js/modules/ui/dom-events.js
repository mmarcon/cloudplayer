/*global define*/
define(function(require) {
    'use strict';

    var DOM = require('modules/ui/dom'),
        Controller = require('modules/controller'),
        Events = require('modules/events'),
        Queue = require('modules/queue'),
        $ = DOM.$,
        dispatcher = Events.getDispatcher();

    function bind(){
        $('.search form')[0].on('submit', function(e){
            //Let's just handle everything JS side
            e.preventDefault();

            //Basic query validation
            var searchTerms = $('#searchTerms')[0].value;
            if(searchTerms && searchTerms.length > 2) {
                Controller.search(searchTerms);
            }
        });
        $('.search .results')[0].on('click', function(e){
            e.preventDefault();
            var target = e.target,
                className = target.className;

            if(target && /enqueue/.test(className) && !(/disabled/.test(className))) {
                target.className += ' disabled';
                Queue.enqueue(DOM.data(target.parentNode, 'track'));
            }
        });
        $('.slider')[0].on('click', function(e){
            e.preventDefault();
            var target = e.target,
                className = target.className;
            if(target && /slide-control/.test(className)) {
                if(this.className === 'slider') {
                    this.className = 'slider slide';
                } else {
                    this.className = 'slider';
                }
            } else if(target && /toggleplay/.test(className)) {
                var track = Queue.get(0);
                console.log(track);
                Controller.play(track.id);
            }
        });
        observe();
    }

    function observe(){
        dispatcher.on(Events.SEARCH_RESULTS, function(results){
            var searchResultsList = $('.search .results')[0];
            DOM.empty(searchResultsList);

            if(!results) {
                return;
            }
            results.forEach(function(res){
                var li;
                //If the track does not have an artwork then use default image
                res.artwork_url = res.artwork_url || 'img/default-artwork.png';
                li = document.createElement('li');
                //Attach the original search result to the DOM node
                //so we can easy retrieve it when it is time to enqueue
                //this track
                DOM.data(li, 'track', res);
                li.innerHTML = DOM.tmpl('searchResult', res);
                searchResultsList.appendChild(li);
            });
        });
        dispatcher.on(Events.QUEUE_CHANGED, function(queue){
            var playlist = $('.player .playlist')[0];
            DOM.empty(playlist);
            if(!queue) {
                return;
            }
            queue.forEach(function(item){
                var li = document.createElement('li');
                //Attach the original item to the DOM node
                //so we can easy retrieve it when it is time to enqueue
                //this track
                DOM.data(li, 'track', item);
                li.innerHTML = DOM.tmpl('playlistItem', item);
                playlist.appendChild(li);
            });
        });
    }

    return {
        bind: bind
    };
});