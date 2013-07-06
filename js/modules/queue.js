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

    function shift() {
        return queue.shift();
    }

    function remove(index) {
        queue.splice(index, 1);
        eventDispatcher.trigger(Events.QUEUE_ITEM_REMOVED, index);
    }

    function swap(indexA, indexB) {
        var b = queue[indexB];
        queue[indexB] = queue[indexA];
        queue[indexA] = b;
        eventDispatcher.trigger(Events.QUEUE_ITEMS_SWAPPED, [indexA, indexB]);
    }

    function length() {
        return queue.length;
    }

    return {
        enqueue: enqueue,
        length: length,
        get: get,
        shift: shift,
        remove: remove,
        swap: swap
    };
});