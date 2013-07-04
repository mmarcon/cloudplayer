/*global define*/

//This module provides an interface to Soundcloud's search.
define(function(require){
    'use strict';
    var SC = require('soundcloud'),
        Events = require('modules/events'),
        eventDispatcher = Events.getDispatcher(),
        currentTrack;



    //`play(trackId)`
    //
    function play(trackId) {
        SC.stream('/tracks/' + trackId, function(sound){
            sound.play();
        });
    }

    function stop() {
        if(currentTrack && currentTrack.stop) {
            currentTrack.stop();
        }
        currentTrack = null;
    }

    function pause() {
        if(currentTrack && currentTrack.pause) {
            currentTrack.pause();
        }
    }

    function resume() {
        if(currentTrack && currentTrack.resume) {
            currentTrack.resume();
        }
    }

    return {
        play: play,
        pause: pause,
        resume: resume,
        stop: stop
    };
});