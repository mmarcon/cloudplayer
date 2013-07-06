/*global define*/

//This module provides an interface to Soundcloud's search.
define(function(require){
    'use strict';
    var SC = require('soundcloud'),
        Events = require('modules/events'),
        eventDispatcher = Events.getDispatcher(),
        Player, P;

    Player = function(){
        this.currentTrack = null;
    };

    P = Player.prototype;

    //When Mobile Safari on iOS is not in *standalone* mode
    //sounds cannot be played in a callback.
    //While we will support continuos playing just in standalone mode
    //we still want to be able to play tracks one after each other
    //if the user interacts with some control in the UI.
    //
    //`prepare` will then get the stream from Soundcloud and fire an event
    //when the sound is ready to be played.
    //At this point the track can be played with `play`.
    P.prepare = function(trackId) {
        var self = this;
        SC.stream(
            '/tracks/' + trackId,
            { preferFlash: false },
            function(track){
                self.currentTrack = track;
                eventDispatcher.trigger(Events.TRACK_READY);
            }
        );
    };

    P.play = function() {
        if(this.currentTrack) {
            this.currentTrack.play({
                onfinish: function(){
                    eventDispatcher.trigger(Events.TRACK_FINISHED);
                }
            });
        }
    };

    P.pause = function() {
        this.currentTrack.pause();
    };

    P.resume = function() {
        this.currentTrack.resume();
    };

    P.stop = function() {
        this.currentTrack.stop();
        this.currentTrack = null;
    };

    return {
        getPlayer: (function(){
            var player = null;
            return function(){
                if(player === null) {
                    player = new Player();
                }
                return player;
            };
        })()
    };
});