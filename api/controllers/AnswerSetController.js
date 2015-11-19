/**
 * AnswerSetController
 *
 * @module controllers/AnswerSet
 * @description Server-side logic for managing Answersets
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {

  module.exports = {
    /**
     * create
     * @description Creates a new answerset given a schedule, subject enrollment,
     *              session, form and answers array.
     */
    create: function(req, res, next) {
      var sessionID = req.param('sessionID'),
          scheduleID = req.param('scheduleID'),
          subjectEnrollmentID = req.param('subjectEnrollmentID'),
          formID = req.param('formID'),
          answers = req.param('answers');
          
      console.log(answers);
      
      studysession.findOne({ id: sessionID })
        .then(function (studysess) {
          if (_.isUndefined(studysess)) {
            err = new Error('Session '+sessionID+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            this.studySessionView = studysess;
            
            return SubjectEnrollment.findOne(subjectEnrollmentID);
          }
        })
        .then(function (sEnroll) {
          if (_.isUndefined(sEnroll)) {
            err = new Error('SubjectEnrollment '+subjectEnrollmentID+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            return UserEnrollment.findOne({
              user: req.user.id,
              collectionCentre: sEnroll.collectionCentre
            });
          }
        })
        .then(function (uEnroll) {
          // user enrollment can be null
          var userEnrollmentID = null;
          if (!_.isUndefined(uEnroll)) {
            userEnrollmentID = uEnroll.id;
          }
          
          return AnswerSet.create({
            answers : answers,
            study : this.studySessionView.study,
            surveyVersion : this.studySessionView.surveyVersion,
            formVersion : formID,
            subjectSchedule : scheduleID,
            subjectEnrollment : subjectEnrollmentID,
            userEnrollment : userEnrollmentID,
          });
        })
        .then(function (answerSet) {
          res.status(201).jsonx(answerSet);
        })
        .catch(function (err) {
          res.badRequest({
            title: 'Error',
            code: err.status,
            message: err.details
          });
        });
    },
  };
})();


