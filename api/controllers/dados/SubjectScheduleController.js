/**
 * SubjectScheduleController
 *
 * @description :: Server-side logic for managing Subjectschedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');

  module.exports = {

    identity: 'subjectschedule',

    /**
     * findScheduledForm
     * @description Given a schedule and form version IDs returns the form with
     *              its answerSet if exists.
     */
    findScheduledForm: function(req, res, next) {
      var formVersionID = req.param('formID');
      var scheduleID = req.param('id');

      SubjectSchedule.findOne(scheduleID).populate('answerSets')
        .then(function (schedule) {
          if (_.isUndefined(schedule)) {
            err = new Error('Schedule '+scheduleID+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            this.schedule = schedule;            

            return Session.findOne({id: schedule.session}).populate('formVersions');
          }
        })
        .then(function (session) {
          if (_.isUndefined(session)) {
            err = new Error('Session '+this.schedule.session+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            return _.find(session.formVersions, function (formVersion) {
              return formVersion.id == formVersionID;
            });
          }
        })
        .then(function (formVersion) {
          if(formVersion === undefined) {
            res.notFound();
          } else {
            var validSets = _.filter(this.schedule.answerSets, function(as){ return _.isNull(as.expiredAt); });
            var answerSet = _.find(validSets, function (answers) {
              return answers.formVersion == formVersionID;
            });
            if (answerSet !== undefined) {
              formVersion.answerSetID = answerSet.id;
            }
            formVersion.scheduleID = this.schedule.id;
            res.ok(formVersion);
          }
        })
        .catch(function (err) {
          res.badRequest(err);
        });
    }

  };

})();
