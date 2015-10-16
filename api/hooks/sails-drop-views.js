/**
 * sails-drop-views
 *
 * In order to support database views in sails, one needs to drop views before
 * the ORM loads, otherwise sails won't know what to do with the models defined
 * in models/views.  Here we read the config/db directory an iterate over the
 * filenames to create and execute a drop view query.
 */

(function() {
  var fs = require('fs');
  var pgp = require('pg-promise')();
  var _ = require('lodash');
  var Promise = require('q');

  module.exports = function (sails) {
    var env = sails.config.environment;

    var connections = [];
    _.each(fs.readdirSync('config/db'), function(db) {
      var connection = sails.config.connections[db + '_' + env];
      if (connection) {
        var connectionStr = [
          'postgres://', connection.user, ':', connection.password,
          '@', connection.host, ':', connection.port, '/', connection.database
        ].join('');
        connections.push({ dbName: db, pgConnection: pgp(connectionStr) });
      }
    });

    return {
      initialize: function (next) {
        sails.after('hook:blueprints:loaded', function () {
          Promise.all(
            _.map(connections, function (connection) {
              var dropQuery = _.map(fs.readdirSync('config/db/' + connection.dbName), function(file) {
                return 'DROP VIEW IF EXISTS ' + file.slice(0, -4).toString() + ';';
              }).join(' ');
              return connection.pgConnection.query(dropQuery);
            }))
            .then(function (result) {
              sails.log.info('Drop View Query executed successfully');
              next();
            })
            .catch(function (err) {
              sails.log.error('Error running query: ' + err);
              sails.log.error(dropQuery);
              next(err);
            });
          })
        }
      }
    };

})();

