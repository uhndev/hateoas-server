/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var glob = require('glob');

module.exports.bootstrap = function (cb) {
    sails.services.passport.loadStrategies();
    
    glob('./config/env/' + process.env.NODE_ENV + '.js', {
        sync: true
    }, function(err, environmentFiles) {
        console.log();
        if (!environmentFiles.length) {
            if(process.env.NODE_ENV) {
                console.log('\x1b[31m', 'No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
            } else {
                console.log('\x1b[31m', 'NODE_ENV is not defined! Using default development environment');
            }

            process.env.NODE_ENV = 'development';
        } else {
            sails.config.models.connection = 'dados_' + process.env.NODE_ENV;
            console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV + '" environment configuration');
            console.log('\x1b[7m', 'Using the ' + sails.config.models.connection + ' database')
        }
        console.log('\x1b[0m');         
    });

    // It's very important to trigger this callack method when you are finished 
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};