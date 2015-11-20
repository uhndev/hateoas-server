/**
 * ScheduleSubjectController
 *
 * @description Server-side logic for managing ScheduleSubjects
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
            case 1: return schedulesubjects.find();
            case 2: return schedulesubjects.find({ collectionCentre: _.pluck(this.user.enrollments, 'collectionCentre') });
            case 3: return schedulesubjects.find({ user: req.user.id });
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
