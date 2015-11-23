/**
 * EnrollmentBaseController
 *
 * @module controllers/EnrollmentBase
 * @description Server-side logic for managing models that need to be filtered by enrollments
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var Promise = require('q');
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * find
     * @description Finds and returns arbitrary collections by enrollment.  The model must have
     *              either a collectionCentres collection or a collectionCentre association, otherwise
     *              this methods will return a default find.
     */
    find: function (req, res, next) {
      var model = actionUtil.parseModel(req);
      var hasCollection  = _.find(model.associations, { alias: 'collectionCentres' });
      var hasAssociation = _.find(model.associations, { alias: 'collectionCentre'  });

      var query = (_.has(model.definition, 'expiredAt')) ? model.find({expiredAt: null}) : model.find();

      query.where( actionUtil.parseCriteria(req) )
        .limit( actionUtil.parseLimit(req) )
        .skip( actionUtil.parseSkip(req) )
        .sort( actionUtil.parseSort(req) );

      if (hasCollection) {
        query.populate('collectionCentres');
      }

      query.exec(function found(err, collection) {
        if (err) {
          return res.serverError({
            title: 'EnrollmentBase Error',
            code: err.status || 500,
            message: err.details
          });
        }

        if (hasCollection || hasAssociation) {
          PermissionService.filterByEnrollment(req.user, collection)
            .then(function (filteredCollection) {
              res.ok(filteredCollection, { filteredTotal: filteredCollection.length });
            }).catch(function (err) {
              return res.serverError({
                title: 'EnrollmentBase Error',
                code: err.status || 500,
                message: 'An error occurred when filtering collection by enrollment for user: ' + req.user.username + '\n' + err.details
              });
            });
        } else {
          res.ok(collection);
        }
      });
    }
  };

})();
