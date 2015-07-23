// before

(function() {
  var fs = require('fs');
  var pg = require('pg');
  var _ = require('lodash');
  var Promise = require('q');

  module.exports = function (sails) {
    var connection = sails.config.connections.dados_postgresql;

    var connectionStr = [
      'postgres://', connection.user, ':', connection.password,
      '@', connection.host, ':', connection.port, '/', connection.database
    ].join('');

    return {
      initialize: function (next) {
        sails.after('hook:orm:loaded', function () {
          pg.connect(connectionStr, function (err, client, done) {
            if (err) {
              console.log('Error fetching client from pool', err);
              return next(err);
            }

            var createQuery = _.map(fs.readdirSync('config/db'), function (view) {
              return fs.readFileSync('config/db/' + view, 'utf-8');
            }).join(' ');

            client.query(createQuery, function (err, result) {
              if (err) {
                console.log('Error running query: ' + err);
              }
              done();
              sails.log('Query executed successfully: ' + result);
              next();
            });
          });
        });
      }
    };
  };

})();



