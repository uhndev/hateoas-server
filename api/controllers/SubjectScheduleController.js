/**
 * SubjectScheduleController
 *
 * @description :: Server-side logic for managing Subjectschedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var moment = require('moment'); // I need a minute
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var Promise = require('q');

  module.exports = {

    findScheduledForm: function(req, res, next) {
      var formID = req.param('formID');
      
      SubjectSchedule.findOne(req.param('id')).populate('answerSets').exec(function (err, schedule) {
        sails.log.debug(schedule);
        var response = _.pick(schedule, 'id', 'status', 'session', 'subjectEnrollment');
        sails.log.debug(response);
        // use schedule.subjectEnrollment
        
        Session.findOne({id: schedule.session})
          .populate('formVersions')
          .then(function (session) {
            return _.find(session.formVersions, function (formVersion) {
              return formVersion.id == formID;
            });
          })
          .then(function (formVersion) {
            if(formVersion === undefined) {
              res.notFound();
            } else {
              var answerSet = _.find(schedule.answerSets, function (as) {
                return as.formVersion == formID;
              });
              if (answerSet !== undefined) {
                formVersion.answerSetID = answerSet.id;
              }
              formVersion.subjectEnrollmentID = schedule.subjectEnrollment;
              formVersion.scheduleID = schedule.id;
              formVersion.sessionID = schedule.session;
              res.ok(formVersion);
            }
          });
      });
    }
    
  };

})();
