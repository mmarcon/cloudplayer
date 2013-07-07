/*global define*/

//This module provides an interface to localStorage.
//
//When initialized checks localStorage to verify whether tracks
//where added to queue while application was inactive (via bookmarklet).
//
//Also binds on `storage` event so it is notified immediately if tracks are
//added from other pages (again via bookmarklet).
define(function(require){
    'use strict';

    var Events = require('modules/events'),
        $ = require('jquery'),
        eventDispatcher = Events.getDispatcher(),
        KEY = 'cloudplayer-dropbox',
        storage;

    //From the storage object loads track ids that should
    //be enequeued.
    //Typically called when application is initialized.
    function loadDropbox(){
        //Attempt to load dropbox from localStorage
        var dropbox = storage.getItem(KEY);
        if(!dropbox) {
            return false;
        }
        dropbox = JSON.parse(dropbox);
        if(dropbox.length > 0) {
            //Some tracks are ready to be loaded.
            eventDispatcher.trigger(Events.DROPBOX_LOADED, dropbox);
            //Now clear the dropbox, ready to accept new items.
            clearDropbox();
        }
    }

    function clearDropbox(){
        storage.removeItem(KEY);
    }

    function bindStorageEvents(){
        $(window).on('storage', loadDropbox);
    }

    return {
        //A convenience method that makes testing easy,
        //as it is not possible to overwrite the actual `localStorage`
        //object with a mocked one.
        //
        //The application will call Storage.init(), while a test
        //will call Storage.init(mockedLocalStorage);
        init: function(storageAdapter) {
            storage = storageAdapter || window.localStorage;
            bindStorageEvents();
            loadDropbox();
        }
    };
});