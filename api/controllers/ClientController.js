/**
 * ClientController
 *
 * @module  controllers/Client
 * @description Server-side logic for managing Clients
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {
    findOne: function (req, res) {
      Client.findOne(req.param('id'))
        .populate('person')
        .exec(function (err, client) {
          if (err) {
            return res.serverError(err);
          }
          res.ok(client);
        });
    },

    find: function (req, res, next) {
      // manually override model name for pagination in ok.js
      req.options.model = sails.models.clientcontact.identity;
      var query = clientcontact.find()
        .where(actionUtil.parseCriteria(req))
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
