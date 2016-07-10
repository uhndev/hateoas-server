// api/controllers/ModelController.js

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var redis = require('redis'),
      client = redis.createClient();

  _.merge(exports, require('sails-permissions/api/controllers/ModelController'));
  _.merge(exports, {

    /**
     * checkExists
     * @description Endpoint for verifying if a particular record is unique given some waterline
     *              criteria to verify against.  Returns number of matched rows.
     * @param req
     * @param res
     */
    checkExists: function(req, res) {
      var model = req.param('model');
      var query = sails.models[model].count()
        .where(actionUtil.parseCriteria(req));

      query.exec(function (err, results) {
        if (err) {
          res.badRequest(err);
        } else {
          res.json({ status: results === 0 });
        }
      });
    },

    /**
     * fetchTemplate
     * @description Endpoint for returning a hateoas template
     * @param req
     * @param res
     */
    fetchTemplate: function (req, res) {
      var model = req.param('model');
      client.hget("templates", model, function (err, cachedTemplate) {
        if (cachedTemplate) {
          res.json({ template: JSON.parse(cachedTemplate) });
        } else {
          var computedTemplate = HateoasService.makeTemplate(model, []);
          client.hset("templates", model, JSON.stringify(computedTemplate));
          client.expire("templates", 28800);
          res.json({ template: computedTemplate });
        }
      });
    }

  });
})();

