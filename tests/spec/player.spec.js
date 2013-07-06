/*global define, describe, it, expect, jasmine, spyOn, MOCKS*/
define(function(require) {
    'use strict';

    var Player = require('modules/player'),
        SC = require('soundcloud'),
        Events = require('modules/events');

    describe('Player', function() {
        beforeEach(function(){
            MOCKS.sound.play.reset();
            MOCKS.sound.pause.reset();
            MOCKS.sound.resume.reset();
            MOCKS.sound.stop.reset();
            Events.getDispatcher().reset();
        });
        it('Prepares a track for playing, and triggers an event when ready', function() {
            var trackReadyCallback = jasmine.createSpy('Track ready callback');
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback({});
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            player.prepare(123);

            expect(SC.stream).toHaveBeenCalledWith(
                '/tracks/123',
                { preferFlash: false },
                jasmine.any(Function)
            );
            expect(trackReadyCallback).toHaveBeenCalled();
        });
        it('Can play a track after the track is ready', function(){
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback(MOCKS.sound);
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            var trackReadyCallback = function(){
                player.play();
            };

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            player.prepare(123);
            expect(MOCKS.sound.play).toHaveBeenCalled();
        });
        it('Can pause a track', function(){
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback(MOCKS.sound);
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            var trackReadyCallback = function(){
                player.play();
                player.pause();
            };

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            player.prepare(123);
            expect(MOCKS.sound.pause).toHaveBeenCalled();
        });
        it('Resumes a track after pause', function(){
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback(MOCKS.sound);
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            var trackReadyCallback = function(){
                player.play();
                player.pause();
                player.resume();
            };

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            player.prepare(123);
            expect(MOCKS.sound.resume).toHaveBeenCalled();
        });
        it('Stops a track', function(){
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback(MOCKS.sound);
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            var trackReadyCallback = function(){
                player.play();
                player.stop();
            };

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            player.prepare(123);
            expect(MOCKS.sound.stop).toHaveBeenCalled();
            expect(player.currentTrack).toBe(null);
        });
        it('Fires an event when a track is finished', function(){
            var trackFinishedCallback = jasmine.createSpy('Track finished callback');
            spyOn(SC, 'stream').andCallFake(function(path, options, callback){
                callback(MOCKS.sound);
            });
            MOCKS.sound.play.andCallFake(function(configuration){
                configuration.onfinish();
            });

            var player = Player.getPlayer(),
                dispatcher = Events.getDispatcher();

            var trackReadyCallback = function(){
                player.play();
            };

            dispatcher.on(Events.TRACK_READY, trackReadyCallback);
            dispatcher.on(Events.TRACK_FINISHED, trackFinishedCallback);

            player.prepare(123);
            expect(trackFinishedCallback).toHaveBeenCalled();
        });
    });
});