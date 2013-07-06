/*global define, describe, it, expect*/
define(function(require) {
    'use strict';

    var main = require('main'),
        SC = require('soundcloud');

    describe('main', function() {
        it('loads main', function() {
            expect(main.version).toBeDefined();
            expect(SC.initialize).toHaveBeenCalledWith({
                client_id: '9cedb0d36189d0ab5a0c5f0e66e03a06'
            });
        });
    });
});