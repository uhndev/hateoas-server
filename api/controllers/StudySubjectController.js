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
      User.findOne(req.user.id).populate('enrollments')
        .then(function (user) {
          this.user = user;
          return Group.findOne(req.user.group);
        })
        .then(function (group) {
          var query = {};
          switch (group.level) {
            case 1: break;
            case 2: query = { collectionCentre: _.pluck(_.filter(this.user.enrollments, { expiredAt: null }), 'collectionCentre') }; break;
            case 3: query = { user: req.user.id }; break;
            default: return null;
          }
          return [
            studysubject.count(query),
            studysubject.find(query)
              .where( actionUtil.parseCriteria(req) )
              .limit( actionUtil.parseLimit(req) )
              .skip( actionUtil.parseSkip(req) )
              .sort( actionUtil.parseSort(req) )
          ];
        })
        .spread(function (filteredTotal, studySubjects) {
          res.ok(studySubjects, { filteredTotal: filteredTotal });
        })
        .catch(function (err) {
          res.serverError({
            title: 'StudySubject Error',
            code: err.status || 500,
            message: 'An error occurred when fetching studysubject for user: ' + req.user.username + '\n' + err.details
          });
        });
    }

  };

})();
