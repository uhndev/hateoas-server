/**
 * 
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
  if (req.model.identity === 'study') {
    query.populate('users');
    query.populate('collectionCentres');
  }

  query = actionUtil.populateEach(query, req);
  query.exec(function found(err, matchingRecord) {
    if (err) return res.serverError(err);
    if(!matchingRecord) return res.notFound('No record found with the specified `id`.');

    if (sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, matchingRecord);
      actionUtil.subscribeDeep(req, matchingRecord);
    }
    
    /**
     * Currently used for: [STUDY]
     */
    PermissionService.getCurrentRole(req).then(function (role) {
      this.role = role;
      if (role === 'admin') {
        return null;
      }
      else if (role === 'coordinator' || role === 'interviewer') {
        return User.findOne(req.user.id);
      }
      else {
        return Subject.findOne({user: req.user.id});
      }
    })
    .then(function (user) {
      if (user) {
        if (_.some(matchingRecord.collectionCentres, function(centre) {
          return !_.isUndefined(user.centreAccess[centre.id]);
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
    })
    .catch(function (err) {
      res.serverError(err);
    });    
  });

};