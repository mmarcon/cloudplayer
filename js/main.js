/*global define*/
define(function(require){
    'use strict';

    var SC = require('soundcloud'),
        config = require('config'),
        DOMEvents = require('modules/ui/dom-events');
    //This is the application entry-point.
    //Therefore the first thing we do is initializing
    //the soundcloud SDK.
    SC.initialize({
        client_id: config.clientId
    });

    DOMEvents.bind();

    return {
        version: '0.0.0',
        initialize: function(){

        }
    };
});