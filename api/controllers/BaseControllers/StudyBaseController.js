/**
 * StudyBaseController
 *
 * @module controllers/StudyBase
 * @description Server-side logic for managing models are submodules to Study
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var Promise = require('bluebird');
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * findByStudy
     * @description Calls the respective model function findByStudy to return the list
     *              of models under a particular study.
     */
    findByStudy: function(req, res) {
      var study = req.param('id');
      var model = actionUtil.parseModel(req);

      model.findByStudy(study, req.user, { where: actionUtil.parseCriteria(req) })
        .then(function (totalCollection) {
          this.totalCollection = totalCollection[1];
          return model.findByStudy(study, req.user,
            { where: actionUtil.parseCriteria(req),
              limit: actionUtil.parseLimit(req),
              skip: actionUtil.parseSkip(req),
              sort: actionUtil.parseSort(req) }
          );
        })
        .then(function(collection) {
          var err = collection[0];
          var collectionItems = collection[1];
          if (err) {
            return res.serverError(err);
          }
          var filteredTotal = PermissionService.filterByCriteria(req.criteria, this.totalCollection).length;
          return res.ok(collectionItems, { filteredTotal: filteredTotal });
        });
    }

  };

})();
