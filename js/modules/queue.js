/*global define*/

//This module provides an interface to Soundcloud's search.
define(function(require){
    'use strict';
    var Events = require('modules/events'),
        eventDispatcher = Events.getDispatcher();

    var queue = [];

    function enqueue(trackId) {
        queue.push(trackId);
        eventDispatcher.trigger(Events.QUEUE_CHANGED, queue);
    }

    function get(index) {
        return (index < queue.length && queue[index]);
    }

    function length() {
        return queue.length;
    }

    return {
        enqueue: enqueue,
        length: length,
        get: get
    };
});