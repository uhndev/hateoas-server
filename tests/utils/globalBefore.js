/**
 * Utility script for ensuring that sails.js has lifted fully before running tests.
 */

before(function(done) {
    console.log('Lifting sails...');
    this.timeout(15000);
    var Sails = require('sails');
    Sails.lift({
        log: {
            level: 'error',
            noShip: true
        },
        models: {
            connection: 'dados_test'
        },
        environment: 'test'
    }, function(err, app) {
        global.sails = app;
        done();
    });
});