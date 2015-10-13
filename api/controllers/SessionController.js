/**
 * SessionController
 *
 * @description Server-side logic for managing Sessions
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    create: function (req, res) {
      // Create data object (monolithic combination of all parameters)
      // Omit the blacklisted params (like JSONP callback param, etc.)
      var data = actionUtil.parseValues(req);

      // Create new instance of model using data from params
      Session.create(data).exec(function created (err, newSession) {

        // Differentiate between waterline-originated validation errors
        // and serious underlying issues. Respond with badRequest if a
        // validation error is encountered, w/ validation info.
        if (err) return res.negotiate(err);

        // If we have the pubsub hook, use the model class's publish method
        // to notify all subscribers about the created item
        if (req._sails.hooks.pubsub) {
          if (req.isSocket) {
            Session.subscribe(req, newSession);
            Session.introduce(newSession);
          }
          Session.publishCreate(newSession, !req.options.mirror && req);
        }

        // Send JSONP-friendly response if it's supported
        res.created(newSession);
      });
    }

  };

})();
