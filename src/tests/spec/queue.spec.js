/*global define, describe, it, expect, jasmine*/
define(function(require) {
    'use strict';

    var Events = require('modules/events'),
        Queue = require('modules/queue');

    describe('Queue', function() {
        beforeEach(function(){
            Events.getDispatcher().reset();
            Queue.empty();
        });
        it('Enqueues items and notifies listeners', function() {
            var dispatcher = Events.getDispatcher(),
                spy = jasmine.createSpy('Queue Changed');

            dispatcher.on(Events.QUEUE_CHANGED, spy);

            expect(Queue.length()).toBe(0);

            Queue.enqueue({title: 'Beer Money'});

            expect(Queue.length()).toBe(1);
            expect(spy).toHaveBeenCalledWith([{title: 'Beer Money'}]);
        });
        it('Retrieves nth item in the queue', function() {
            var dispatcher = Events.getDispatcher();

            Queue.enqueue({title: 'Beer Money'});
            Queue.enqueue({title: 'Jack Johnson Banana Pancakes'});
            Queue.enqueue({title: 'Havana Brown - Big Banana'});

            expect(Queue.get(1)).toEqual({title: 'Jack Johnson Banana Pancakes'});
        });
        it('Remove items and notifies listeners', function() {
            var dispatcher = Events.getDispatcher(),
                spy = jasmine.createSpy('Queue Item Removed');

            dispatcher.on(Events.QUEUE_ITEM_REMOVED, spy);

            Queue.enqueue({title: 'Beer Money'});
            Queue.enqueue({title: 'Jack Johnson Banana Pancakes'});
            Queue.enqueue({title: 'Havana Brown - Big Banana'});
            Queue.remove(1);

            expect(Queue.length()).toBe(2);
            expect(Queue.get(1)).toEqual({title: 'Havana Brown - Big Banana'});
            expect(spy).toHaveBeenCalledWith(1);
        });
        it('Swap items and notifies listeners', function() {
            var dispatcher = Events.getDispatcher(),
                spy = jasmine.createSpy('Queue Item Removed');

            dispatcher.on(Events.QUEUE_ITEMS_SWAPPED, spy);

            Queue.enqueue({title: 'Beer Money'});
            Queue.enqueue({title: 'Jack Johnson Banana Pancakes'});
            Queue.enqueue({title: 'Havana Brown - Big Banana'});
            Queue.swap(2, 1);

            expect(Queue.length()).toBe(3);
            expect(Queue.get(1)).toEqual({title: 'Havana Brown - Big Banana'});
            expect(Queue.get(2)).toEqual({title: 'Jack Johnson Banana Pancakes'});
            expect(spy).toHaveBeenCalledWith(2, 1);
        });
    });
});