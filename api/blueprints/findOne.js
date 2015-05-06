/**
 * Module dependencies
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

/**
 * Find One Record
 *
 * get /:modelIdentity/:id
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified id.
 *
 * Required:
 * @param {Integer|String} id  - the unique id of the particular instance you'd like to look up *
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findOneRecord (req, res) {

  var Model = actionUtil.parseModel(req);
  var pk = actionUtil.requirePk(req);

  var query = Model.findOne(pk);
  if (_.any(Model.associations, function (assoc) {
    return (_.has(assoc, 'collection') && assoc.collection === 'user');
  })) {
    query.populate('users');
  }

  query = actionUtil.populateEach(query, req);
  query.exec(function found(err, matchingRecord) {
    if (err) return res.serverError(err);
    if(!matchingRecord) return res.notFound('No record found with the specified `id`.');

    if (sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, matchingRecord);
      actionUtil.subscribeDeep(req, matchingRecord);
    }

    // if the model has a users collection, return filtered results depending on role
    if (_.has(matchingRecord, 'users')) {
      if (_.some(matchingRecord.users, function(user) {
        return user.id === req.user.id;
      })) {
        res.ok(matchingRecord);
      } else {
        res.status(403).json({
          "error": "User "+req.user.email+" is not permitted to GET "
        });
      }
    } else {
      res.ok(matchingRecord);
    }
  });

};