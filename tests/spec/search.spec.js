/*global define, describe, it, expect, jasmine, spyOn, MOCKS*/
define(function(require) {
    'use strict';

    var Search = require('modules/search'),
        SC = require('soundcloud'),
        Events = require('modules/events');

    describe('Search', function() {
        it('Triggers a search when search method is invoked', function() {
            spyOn(SC, 'get');
            Search.search('x-ray life');
            expect(SC.get).toHaveBeenCalledWith('/tracks', {q: 'x-ray life'}, jasmine.any(Function));
        });
        describe('Search callbacks', function(){
            it('Triggers the callback with search results when search is done', function() {
                var searchCallback = jasmine.createSpy('Search callback');
                spyOn(SC, 'get').andCallFake(function(path, options, callback){
                    callback([MOCKS.singleSearchResult]);
                });
                Search.search('x-ray life', searchCallback);
                expect(searchCallback).toHaveBeenCalledWith([MOCKS.singleSearchResult]);
            });
            it('Triggers the SEARCH_RESULTS event with search results when search is done', function() {
                var searchCallback = jasmine.createSpy('Search callback'),
                    dispatcher = Events.getDispatcher();
                spyOn(SC, 'get').andCallFake(function(path, options, callback){
                    callback([MOCKS.singleSearchResult]);
                });
                dispatcher.on(Events.SEARCH_RESULTS, searchCallback);
                Search.search('x-ray life');
                expect(searchCallback).toHaveBeenCalledWith([MOCKS.singleSearchResult]);
            });
        });
    });
});