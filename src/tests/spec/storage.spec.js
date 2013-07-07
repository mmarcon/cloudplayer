/*global define, describe, it, expect*/
define(function(require) {
    'use strict';

    var Storage = require('modules/storage'),
        Events = require('modules/events'),
        $ = require('jquery');

    describe('Storage', function() {
        it('Loads track ids from dropbox when initialized, fires the related event and clears dropbox', function() {
            var dispatcher = Events.getDispatcher();

            var dropboxLoadedSpy = jasmine.createSpy('dropbox loaded');
            MOCKS.localStorage.getItem.andReturn(JSON.stringify(['123', '456']));

            dispatcher.on(Events.DROPBOX_LOADED, dropboxLoadedSpy);

            Storage.init(MOCKS.localStorage);

            expect(MOCKS.localStorage.getItem).toHaveBeenCalledWith('cloudplayer-dropbox');
            expect(dropboxLoadedSpy).toHaveBeenCalledWith(['123', '456']);
            expect(MOCKS.localStorage.removeItem).toHaveBeenCalledWith('cloudplayer-dropbox');
        });
        it('Loads track ids from dropbox when localStorage gets updated by bookmarklet, fires the related event and clears dropbox', function() {
            var dispatcher = Events.getDispatcher();

            var dropboxLoadedSpy = jasmine.createSpy('dropbox loaded');
            MOCKS.localStorage.getItem.andReturn(null);

            dispatcher.on(Events.DROPBOX_LOADED, dropboxLoadedSpy);
            Storage.init(MOCKS.localStorage);

            MOCKS.localStorage.getItem.andReturn(JSON.stringify(['123', '456']));

            $(window).trigger('storage');


            expect(MOCKS.localStorage.getItem).toHaveBeenCalledWith('cloudplayer-dropbox');
            expect(dropboxLoadedSpy).toHaveBeenCalledWith(['123', '456']);
            expect(MOCKS.localStorage.removeItem).toHaveBeenCalledWith('cloudplayer-dropbox');
        });
    });
});