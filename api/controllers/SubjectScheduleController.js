/**
 * SubjectScheduleController
 *
 * @description :: Server-side logic for managing Subjectschedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {

  module.exports = {

    /**
     * findScheduledForm
     * @description Given a schedule and form version IDs returns the form with
     *              session and subject enrollment needed to create answerSets.
     */
    findScheduledForm: function(req, res, next) {
      var formID = req.param('formID');
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
          return _.find(session.formVersions, function (formVersion) {
            return formVersion.id == formID;
          });
        })
        .then(function (formVersion) {
          if(formVersion === undefined) {
            res.notFound();
          } else {
            var answerSet = _.find(session.formVersions, { id: formID });
            if (answerSet !== undefined) {
              formVersion.answerSetID = answerSet.id;
            }
            formVersion.subjectEnrollmentID = this.schedule.subjectEnrollment;
            formVersion.scheduleID = this.schedule.id;
            formVersion.sessionID = this.schedule.session;
            res.ok(formVersion);
          }
        })
        .catch(function (err) {
          res.badRequest({
            title: 'Error',
            code: err.status,
            message: err.details
          });
        });
    }
    
  };

})();
