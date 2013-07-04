/*global define*/
define(function(){
    'use strict';
    var EventDispatcher = function(){
        this.handlers = {};
    };
    EventDispatcher.prototype.on = function(event, callback){
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(callback);
    };
    EventDispatcher.prototype.trigger = function(event, data){
        if(this.handlers[event]) {
            this.handlers[event].forEach(function(callback){
                callback.call(null, data);
            });
        }
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
        QUEUE_CHANGED: 'queuechanged'
    };
});