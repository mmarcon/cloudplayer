/*global define*/
define(function(){
    'use strict';
    //Dispatches events across the application.
    //Note that events are dispatched **synchronously**.
    var EventDispatcher = function(){
        this.handlers = {};
    };
    EventDispatcher.prototype.on = function(event, callback){
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(callback);
    };
    EventDispatcher.prototype.trigger = function(event){
        var args;
        if(this.handlers[event]) {
            args = [].slice.call(arguments, 1);
            this.handlers[event].forEach(function(callback){
                callback.apply(null, args);
            });
        }
    };
    EventDispatcher.prototype.reset = function(){
        this.handlers = {};
    };


    return {
        //The idea is to use a single *EventDispatcher* in the
        //entire application to dispatch events between modules
        //and to make the UI react to changes.
        //
        //This pattern gives me a *Singleton*.
        getDispatcher: (function(){
            var dispatcher = null;
            return function(){
                if(dispatcher === null) {
                    dispatcher = new EventDispatcher();
                }
                return dispatcher;
            };
        })(),
        SEARCH_RESULTS: 'searchresults',
        QUEUE_CHANGED: 'queuechanged',
        QUEUE_ITEM_REMOVED: 'queueitemremoved',
        QUEUE_ITEMS_SWAPPED: 'queueitemsswapped',
        TRACK_READY: 'trackready',
        TRACK_FINISHED: 'trackfinished'
    };
});