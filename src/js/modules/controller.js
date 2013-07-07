/*global define*/

//The idea is to use a simple, stateless controller
//that is called from DOM event handlers and takes care
//of calling the right method on the right object that
//invokes other services, e.g. Soundcould's search.
define(function(require) {
    'use strict';

    var Search = require('modules/search'),
        Player = require('modules/player'),
        player = Player.getPlayer();

    function search(searchTerm) {
        Search.search(searchTerm);
    }

    function loadTrackInfo(trackId) {
        Search.loadTrackInfo(trackId);
    }

    function prepare(trackId) {
        player.prepare(trackId);
    }

    function play() {
        player.play();
    }

    function stop() {
        player.stop();
    }

    function pause() {
        player.pause();
    }

    //Attempts to resume a track. If the player was not
    //playing a track then returns false so other components
    //can act accordingly.
    //
    //This solution isn't ideal and should be refactored.
    //However, since it's there it comes with unit tests.
    function resume() {
        if(player.isPlaying()) {
            player.resume();
            return true;
        }
        return false;
    }

    return {
        search: search,
        prepare: prepare,
        play: play,
        stop: stop,
        pause: pause,
        resume: resume,
        loadTrackInfo: loadTrackInfo
    };
});