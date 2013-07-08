/*global define*/

//This modules defines a queue that is used as the model
//behind the playlist.
//It is essentially a bunch of functions that perform
//operations on a private array, nothing really fancy.
define(function(require){
    'use strict';
    var Events = require('modules/events'),
        eventDispatcher = Events.getDispatcher();

    var queue = [];

    function enqueue(object) {
        queue.push(object);
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
        eventDispatcher.trigger(Events.QUEUE_ITEMS_SWAPPED, indexA, indexB);
    }

    function length() {
        return queue.length;
    }

    function empty() {
        queue.length = 0;
    }

    return {
        enqueue: enqueue,
        length: length,
        get: get,
        shift: shift,
        remove: remove,
        swap: swap,
        empty: empty
    };
});