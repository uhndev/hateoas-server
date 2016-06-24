/**
 * ClientController
 *
 * @module  controllers/Client
 * @description Server-side logic for managing Clients
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    identity: 'Client',

    findOne: function (req, res) {
      // manually override model name for pagination in ok.js
      req.options.model = sails.models.clientcontact.identity;
      clientcontact.findOne(req.param('id'))
        .populate('primaryEmergencyContact')
        .exec(function (err, client) {
          if (err) {
            return res.serverError(err);
          }
          res.ok(client);
        });
    },

    find: function (req, res, next) {
      var searchQuery = actionUtil.parseCriteria(req);
      if (_.has(searchQuery, 'or') && _.isArray(searchQuery.or)) {
        searchQuery.or.push({
          'displayName': {
            'contains': _.first(_.values(searchQuery.or))
          }
        });
      }

      // manually override model name for pagination in ok.js
      req.options.model = sails.models.clientcontact.identity;
      var query = clientcontact.find()
        .where(searchQuery)
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));

      query.exec(function found(err, clients) {
        if (err) {
          return res.serverError(err);
        }

        res.ok(clients);
      });
    }

  };
})();
