/**
 * AnswerSetController
 *
 * @module controllers/AnswerSet
 * @description Server-side logic for managing Answersets
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {

  module.exports = {

    identity: 'answerset',

    /**
     * create
     * @description Creates a new answerset given a schedule, form and answers array.
     */
    create: function(req, res, next) {
      var scheduleID = req.param('scheduleID'),
          formID = req.param('formID'),
          answers = req.param('answers');

      SubjectSchedule.findOne({ id: scheduleID })
        .then(function (subjectSchedule) {
          if (_.isUndefined(subjectSchedule)) {
            err = new Error('Subject schedule '+scheduleID+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            this.schedule = subjectSchedule;

            return studysession.findOne({ id: this.schedule.session });
          }

        })
        .then(function (studySession) {
          if (_.isUndefined(studySession)) {
            err = new Error('Session '+this.schedule.session+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            this.studySessionView = studySession;

            return SubjectEnrollment.findOne(this.schedule.subjectEnrollment);
          }
        })
        .then(function (subjectEnrollment) {
          if (_.isUndefined(subjectEnrollment)) {
            err = new Error('SubjectEnrollment '+this.schedule.subjectEnrollment+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            return UserEnrollment.findOne({
              user: req.user.id,
              collectionCentre: subjectEnrollment.collectionCentre
            });
          }
        })
        .then(function (userEnrollment) {
          // user enrollment can be null
          var userEnrollmentID = null;
          if (!_.isUndefined(userEnrollment)) {
            userEnrollmentID = userEnrollment.id;
          }

          return AnswerSet.create({
            answers : answers,
            study : this.studySessionView.study,
            surveyVersion : this.studySessionView.surveyVersion,
            formVersion : formID,
            subjectSchedule : scheduleID,
            subjectEnrollment : this.schedule.subjectEnrollment,
            userEnrollment : userEnrollmentID
          });
        })
        .then(function (answerSet) {
          res.status(201).jsonx(answerSet);
        })
        .catch(function (err) {
          res.serverError(err);
        });
    }
  };
})();


