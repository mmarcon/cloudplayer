/*global define*/

//This module provides an interface to Soundcloud's search.
define(function(require){
    'use strict';
    var SC = require('soundcloud'),
        Events = require('modules/events'),
        eventDispatcher = Events.getDispatcher();

    //`search(query, callback)`
    //
    //Simple search. Given a `query` it performs a search asynchronously
    //using Soundcloud's `/tracks` endpoint and returns the result either
    //via a `callback` or via the central *EventDispatcher*.
    function search(query, callback) {
        SC.get('/tracks', {q: query}, function(tracks) {
            if(typeof callback === 'function') {
                callback.call(null, tracks);
            }
            eventDispatcher.trigger(Events.SEARCH_RESULTS, tracks);
        });
    }

    function loadTrackInfo(trackId) {
        SC.get('/tracks/' + trackId, function(track){
            eventDispatcher.trigger(Events.SEARCH_TRACKINFO, track);
        });
    }

    return {
        search: search,
        loadTrackInfo: loadTrackInfo
    };
});