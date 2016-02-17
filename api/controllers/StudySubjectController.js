/**
 * StudySubjectController
 *
 * @description Server-side logic for managing StudySubjects
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * find
     * @description Controller find method for the studysubject view, containing the valid studies any particular
     *              subject may be enrolled in. Primarily used exclusively by subjects to pull only their relevant data.
     */
    find: function(req, res) {
      studysubject.find()
        .where( actionUtil.parseCriteria(req) )
        .then(function (totalStudySubjects) {
          this.totalStudySubjects = totalStudySubjects;
          return studysubject.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );
        })
        .then(function (studySubjects) {
          var filteredTotal = PermissionService.filterByCriteria(req.criteria, this.totalStudySubjects).length;
          res.ok(studySubjects, { filteredTotal: filteredTotal });
        })
        .catch(function (err) {
          res.serverError(err);
        });
    }

  };

})();
