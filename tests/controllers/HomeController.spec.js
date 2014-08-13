/**
 * Test File: Testing HomeController
 * File Location: test/controllers/HomeController.spec.js
 */

require('../utils/globalBefore.js');

var HomeController = require('../../api/controllers/HomeController'),
    should = require('should'),
    sinon = require('sinon');

describe('The Home Controller', function() {
    describe('when we invoke index action', function() {
        it('should render the index page', function() {
            // mocks the res.send() method using a sinon spy
            var view = sinon.spy();
            var req = {session:{authenticated:false}};
            HomeController.index(req, {
                view: view
            });
            
            view.called.should.be.ok;
        });
    });
});