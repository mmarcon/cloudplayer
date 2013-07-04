/*global define*/

//The ides is to use a simple, stateless controller
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

    function prepare(trackId) {
        player.prepare(trackId);
    }

    function play() {
        player.play();
    }

    function stop() {
        player.stop();
    }

    return {
        search: search,
        prepare: prepare,
        play: play,
        stop: stop
    };
});