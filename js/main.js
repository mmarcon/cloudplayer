/*global define*/
define(function(require){
    'use strict';

    var SC = require('soundcloud'),
        config = require('config'),
        DOMEvents = require('modules/ui/dom-events');

    // var Search = require('modules/search'),
    //     Events = require('modules/events');

    //This is the application entry-point.
    //Therefore the first thing we do is initializing
    //the soundcloud SDK.
    SC.initialize({
        client_id: config.clientId
    });

    DOMEvents.bind();

    // Events.getDispatcher().on(Events.SEARCH_RESULTS, function(data){
    //     console.log(JSON.stringify(data[0]));
    // });

    // Search.search('buskers');

    return {
        version: '0.0.0'
    };
});