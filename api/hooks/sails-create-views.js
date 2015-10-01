/**
 * sails-create-views
 *
 * In order to support database views in sails, one needs to drop views before
 * the ORM loads and recreate views after the ORM has loaded otherwise sails
 * won't know what to do with the models defined in models/views.
 * Here we read the config/db directory an iterate over the sql files there,
 * parse and execute them as sql statements to recreate our views.
 */

(function() {
  var fs = require('fs');
  var pg = require('pg');
  var _ = require('lodash');
  var Promise = require('q');

  module.exports = function (sails) {
    var env = sails.config.environment;
    var connection = sails.config.connections['dados_' + env];

    var connectionStr = [
      'postgres://', connection.user, ':', connection.password,
      '@', connection.host, ':', connection.port, '/', connection.database
    ].join('');

    return {
      initialize: function (next) {
        sails.after('hook:orm:loaded', function () {
          pg.connect(connectionStr, function (err, client, done) {
            if (err) {
              sails.log.error('Error fetching client from pool', err);
              return next(err);
            }

            var createQuery = _.map(fs.readdirSync('config/db'), function (view) {
              return fs.readFileSync('config/db/' + view, 'utf-8');
            }).join(' ');

            client.query(createQuery, function (err, result) {
              if (err) {
                sails.log.error('Error running query: ' + err);
              }
              done();
              sails.log.info('Create View Query executed successfully');
              next();
            });
          });
        });
      }
    };
  };

})();



