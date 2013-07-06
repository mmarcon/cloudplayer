/*global define, describe, it, expect, jasmine*/
define(function(require) {
    'use strict';

    var Events = require('modules/events');

    describe('Events', function() {
        beforeEach(function(){
            Events.getDispatcher().reset();
        });
        it('Triggers a callback when an event is generated', function() {
            var dispatcher = Events.getDispatcher(),
                dummySpy = jasmine.createSpy('Dummy Spy');
            dispatcher.on('dummyevent', dummySpy);
            dispatcher.trigger('dummyevent', {foo: 'bar'});
            expect(dummySpy).toHaveBeenCalledWith({foo: 'bar'});
        });
        it('Triggers multiple callback when an event is generated and more than one callback is registered', function() {
            var dispatcher = Events.getDispatcher(),
                dummySpy = jasmine.createSpy('Dummy Spy'),
                otherSpy = jasmine.createSpy('Other Spy');

            dispatcher.on('dummyevent', dummySpy);
            dispatcher.on('dummyevent', otherSpy);

            dispatcher.trigger('dummyevent', {foo: 'bar'});

            expect(dummySpy).toHaveBeenCalledWith({foo: 'bar'});
            expect(otherSpy).toHaveBeenCalledWith({foo: 'bar'});
        });
        it('Does not trigger callbacks for non-fired events', function() {
            var dispatcher = Events.getDispatcher(),
                dummySpy = jasmine.createSpy('Dummy Spy'),
                otherSpy = jasmine.createSpy('Other Spy');

            dispatcher.on('dummyevent', dummySpy);
            dispatcher.on('otherevent', otherSpy);

            dispatcher.trigger('dummyevent', {foo: 'bar'});

            expect(dummySpy).toHaveBeenCalledWith({foo: 'bar'});
            expect(otherSpy).not.toHaveBeenCalled();
        });
        it('Supports events with multiple arguments', function() {
            var dispatcher = Events.getDispatcher(),
                dummySpy = jasmine.createSpy('Dummy Spy');

            dispatcher.on('dummyevent', dummySpy);

            dispatcher.trigger('dummyevent', 'foo', 123, {bar: Math.PI});

            expect(dummySpy).toHaveBeenCalledWith('foo', 123, {bar: Math.PI});
        });
    });
});