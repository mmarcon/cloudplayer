/*global define, describe, it, expect*/
define(function(require) {
    'use strict';

    var Controller = require('modules/controller'),
        Player = require('modules/player');

    describe('Controller: resume tracks', function() {
        it('Tries to resume track and returns true when resumed track is resumable', function() {
            var player = Player.getPlayer();

            spyOn(player, 'isPlaying').andReturn(true);
            spyOn(player, 'resume');

            var rv = Controller.resume();
            expect(player.isPlaying).toHaveBeenCalled();
            expect(rv).toBe(true);
        });
        it('Tries to resume track and returns false when resumed track is NOT resumable', function() {
            var player = Player.getPlayer();

            spyOn(player, 'isPlaying').andReturn(false);
            spyOn(player, 'resume');

            var rv = Controller.resume();
            expect(player.isPlaying).toHaveBeenCalled();
            expect(rv).toBe(false);
        });
    });
});