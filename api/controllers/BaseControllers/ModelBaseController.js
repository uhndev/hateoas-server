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
     * findByBaseModel
     * @description Calls the respective model function findByBaseModel to return the list
     *              of models under a particular BaseModel.
     */
    findByBaseModel: function(req, res) {
      var modelID = req.param('id');
      var model = actionUtil.parseModel(req);

      model.findByBaseModel(modelID, req.user, { where: actionUtil.parseCriteria(req) })
        .then(function (totalCollection) {
          this.totalCollection = totalCollection.data;
          // if not given any request params in req, use defaults found in Model
          return model.findByBaseModel(modelID, req.user,
            { where: actionUtil.parseCriteria(req) || model['defaultQuery'],
              limit: actionUtil.parseLimit(req) || model['defaultLimit'],
              skip: actionUtil.parseSkip(req) || model['defaultSkip'],
              sort: actionUtil.parseSort(req) || model['defaultSortBy']}
          );
        })
        .then(function(collection) {
          var filteredTotal = PermissionService.filterByCriteria(req.criteria, this.totalCollection).length;
          return res.ok(collection.data, {
            filteredTotal: filteredTotal,
            links: collection.links
          });
        })
        .catch(function (err) {
          return res.badRequest(err);
        });
    }

  };

})();
