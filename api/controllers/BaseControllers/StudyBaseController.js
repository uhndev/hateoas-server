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
     * findByStudyName
     * @description Calls the respective model function findByStudyName to return the list
     *              of models under a particular study.
     */
    findByStudyName: function(req, res) {
      var studyName = req.param('name');
      var model = actionUtil.parseModel(req);

      model.findByStudyName(studyName, req.user, { where: actionUtil.parseCriteria(req) })
        .then(function (totalCollection) {
          this.filteredTotal = PermissionService.filterByCriteria(req.criteria, totalCollection[1]).length;
          return model.findByStudyName(studyName, req.user,
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
            sails.log.error([
              'StudyBase.findByStudyName for user: ' + req.user.id,
              'Error fetching ' + model.adapter.identity + ' by study name: ' + studyName,
              'Error: ' + JSON.stringify(err)
            ].join('\n'));
            return res.serverError();
          }
          return res.ok(collectionItems, { filteredTotal: this.filteredTotal });
        });
    }

  };

})();
