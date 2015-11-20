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

    find: function(req, res) {
      User.findOne(req.user.id).populate('enrollments')
        .then(function (user) {
          this.user = user;
          return Group.findOne(req.user.group);
        })
        .then(function (group) {
          switch (group.level) {
            case 1: return studysubject.find();
            case 2: return studysubject.find({ collectionCentre: _.pluck(this.user.enrollments, 'collectionCentre') });
            case 3: return studysubject.find({ user: req.user.id });
            default: return null;
          }
        })
        .then(function (studySubjects) {
          res.ok(studySubjects);
        })
        .catch(function (err) {
          res.serverError(err);
        });
    }

  };

})();
