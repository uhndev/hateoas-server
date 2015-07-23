// before

(function() {
  var pg = require('pg');
  var _ = require('lodash');
  var Promise = require('q');

  module.exports = function (sails) {
    var connection = sails.config.connections.dados_postgresql;

    var connectionStr = [
      'postgres://', connection.user, ':', connection.password,
      '@', connection.host, ':', connection.port, '/', connection.database
    ].join('');

    var views = _.map(require('fs').readdirSync('config/db'), function(file) {
      return file.slice(0, -4);
    });

    return {
      initialize: function (next) {
        sails.after('hook:sails-auth:loaded', function () {
          pg.connect(connectionStr, function (err, client, done) {
            if (err) {
              console.log('Error fetching client from pool', err);
              return next(err);
            }
            var dropQuery = _.map(views, function (view) {
              return 'DROP VIEW ' + view + ';';
            }).join(' ');
            client.query(dropQuery, function (err, result) {
              if (err) {
                console.log('Error running query: ' + err);
              }
              done();
              sails.log('Query executed successfully: ' + result);
              next();
            })
          })
        });
      }
    };
  };

})();

