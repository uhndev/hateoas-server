/**
 * @namespace SurveyService
 * @description Helper service for performing survey lifecycle functions
 */

(function() {
  var pgp = require('pg-promise')();
  var _ = require('lodash');
  var moment = require('moment');
  var Promise = require('bluebird');

  module.exports = {

    /**
     * checkSurveyVersion
     * @description Checks if survey was published and creates new survey version if true
     * @param survey survey object with sessions populated
     * @returns {null | Promise}
     */
    checkSurveyVersion: function (survey) {
      // if lastPublished set on Survey, then there are AnswerSets referring to this version
      if (survey.lastPublished !== null && _.isNull(survey.expiredAt)) {
        // in that case, stamp out next survey version
        // create new survey version with updated revision number
        return SurveyVersion.getLatestSurveyVersion(survey.id)
          .then(function (latestSurveyVersion) {
            // create new SurveyVersion iff we've added or removed a session
            var currentSessions = _.pluck(survey.sessions, 'id');
            var previousSessions = latestSurveyVersion.sessions;
            if (_.difference(currentSessions, previousSessions).length > 0) {
              var newSurveyVersion = {
                revision: latestSurveyVersion.revision + 1,
                survey: survey.id,
                sessions: _.pluck(survey.sessions, 'id')
              };
              _.merge(newSurveyVersion, _.pick(survey, 'name', 'completedBy'));
              return SurveyVersion.create(newSurveyVersion);
            }
            return null;
          });
      } else {
        return null;
      }
    },

    /**
     * batchUpdateSessions
     * @description Given a survey object with sessions, generate SubjectSchedules for each
     *              Sessions X SubjectEnrollment if applicable.
     * @param createdSurvey survey object
     * @return {null | Promise}
     */
    batchUpdateSessions: function (createdSurvey) {
      var self = this;
      return Survey.findOne(createdSurvey.id)
        .populate('sessions')
        .then(function (survey) {
          // find subject enrollments for study
          this.currentSurvey = survey;
          return studysubject.find({study: this.currentSurvey.study});
        })
        .then(function (subjectEnrollments) {
          // if subjects are enrolled already, create SubjectSchedules for them
          if (subjectEnrollments) {
            // for each Session X SubjectEnrollment, generate a SubjectSchedule
            var sessions = this.currentSurvey.sessions;
            var queryTotal = sessions.length * subjectEnrollments.length;
            var now =  pgp.as.date(new Date());
            var connection = sails.config.connections['arm_' + sails.config.environment];
            var db = pgp(connection);

            return db.tx(function (t) {
              var queries = [];
              // creating a sequence of transaction queries:
              _.each(sessions, function (session) {
                _.each(subjectEnrollments, function (enrollment) {
                  var availableFrom = moment(enrollment.doe).add(session.timepoint, 'days')
                    .subtract(session.availableFrom, 'days');
                  var availableTo = moment(enrollment.doe).add(session.timepoint, 'days')
                    .add(session.availableTo, 'days');
                  queries.push({
                    from: (session.type !== 'non-scheduled') ? availableFrom.toDate() : null,
                    to: (session.type !== 'non-scheduled') ? availableTo.toDate() : null,
                    status: 'IN PROGRESS',
                    session: session.id,
                    enrollment: enrollment.id,
                    created: now,
                    updated: now
                  });
                });
              });

              return t.sequence(function (idx) {
                sails.log.info(idx + '/' + queryTotal);
                if (idx < queryTotal) {
                  return t.none("INSERT INTO subjectschedule " +
                    "(\"availableFrom\", \"availableTo\", status, session, \"subjectEnrollment\", \"createdAt\", \"updatedAt\") VALUES " +
                    "(${from}, ${to}, ${status}, ${session}, ${enrollment}, ${created}, ${updated})", queries[idx]);
                }
              }, true);
            })
            .then(function (data) {
              return data;
            }, function (reason) {
              sails.log.error(reason);
              return reason;
            });
          } else {
            return null;
          }
        });
    },

    /**
     * afterCreateSession
     * @description After creating a session, create SubjectSchedules iff there are subjects
     *              enrolled in the study at the time of creation.  We create a new SurveyVersion
     *              iff the current Survey is published.
     */
    afterCreateSession: function (sessionObj) {
      var self = this;
      return Survey.findOne(sessionObj.survey)
        .populate('sessions')
        .then(function (survey) {
          this.currentSurvey = survey;
          return self.checkSurveyVersion(survey);
        })
        .then(function (newSurveyVersion) {
          // find subject enrollments for study
          return studysubject.find({study: this.currentSurvey.study});
        })
        .then(function (subjectEnrollments) {
          // if subjects are enrolled already, create SubjectSchedules for them
          if (subjectEnrollments) {
            return Promise.all(
              _.map(subjectEnrollments, function (enrollment) {
                var availableFrom = moment(enrollment.doe).add(sessionObj.timepoint, 'days')
                  .subtract(sessionObj.availableFrom, 'days');
                var availableTo = moment(enrollment.doe).add(sessionObj.timepoint, 'days')
                  .add(sessionObj.availableTo, 'days');
                return SubjectSchedule.findOrCreate({
                  availableFrom: (sessionObj.type !== 'non-scheduled') ? availableFrom.toDate() : null,
                  availableTo: (sessionObj.type !== 'non-scheduled') ? availableTo.toDate() : null,
                  status: 'IN PROGRESS',
                  session: sessionObj.id,
                  subjectEnrollment: enrollment.id
                });
              })
            )
          } else {
            return null;
          }
        });
    },

    /**
     * afterUpdateSession
     * @description After updating the head revision, depending on whether or not users have
     *              filled out any AnswerSets, we create new SurveyVersions as needed.
     */
    afterUpdateSession: function (updatedSession) {
      var self = this;
      return Survey.findOne(updatedSession.survey).populate('sessions')
        .then(function (survey) {
          this.currentSurvey = survey;
          return self.checkSurveyVersion(survey);
        })
        .then(function () {
          /**
           * otherwise updates are done in place for the current head but
           * since its not published yet, we have two more scenarios:
           * 1) no subjects enrolled yet = do nothing
           * 2) subject already enrolled = create if not exist, update if exist
           */
          return studysubject.find({study: this.currentSurvey.study});
        })
        .then(function (subjectEnrollments) {
          // scenario 1; no subjects enrolled yet so do nothing
          if (!subjectEnrollments) {
            return null;
          }
          // scenario 2; subjects enrolled, create or update SubjectSchedules
          else {
            return Promise.all(
              _.map(subjectEnrollments, function (enrollment) {
                var availableFrom = moment(enrollment.doe).add(updatedSession.timepoint, 'days')
                  .subtract(updatedSession.availableFrom, 'days');
                var availableTo = moment(enrollment.doe).add(updatedSession.timepoint, 'days')
                  .add(updatedSession.availableTo, 'days');

                // create subjectSchedules if not exist
                if (!updatedSession.subjectSchedules) {
                  return SubjectSchedule.create({
                    availableFrom: (updatedSession.type !== 'non-scheduled') ? availableFrom.toDate() : null,
                    availableTo: (updatedSession.type !== 'non-scheduled') ? availableTo.toDate() : null,
                    status: 'IN PROGRESS',
                    session: updatedSession.id,
                    subjectEnrollment: enrollment.id
                  });
                }
                // update existing subjectSchedules
                else {
                  return SubjectSchedule.update({session: updatedSession.id, subjectEnrollment: enrollment.id}, {
                    availableFrom: (updatedSession.type !== 'non-scheduled') ? availableFrom.toDate() : null,
                    availableTo: (updatedSession.type !== 'non-scheduled') ? availableTo.toDate() : null
                  });
                }
              })
            );
          }
        });
    },

    /**
     * buildScheduleQueries
     * @description After adding/updating/removing sessions from an existing survey, checks if new SurveyVersion
     *              needs to be created, then based on the changed session(s), updates SubjectSchedules accordingly.
     * @param surveyID  ID of survey where sessions were changed
     * @param sessions  array of changed sessions that should be used to update SubjectSchedules
     * @returns {Array}
     */
    buildScheduleQueries: function (surveyID, sessions) {
      var self = this;
      return Survey.findOne(surveyID)
        .populate('sessions')
        .then(function (survey) {
          this.currentSurvey = survey;
          return self.checkSurveyVersion(survey);
        })
        .then(function (newSurveyVersion) {
          // find subject enrollments for study
          return studysubject.find({study: this.currentSurvey.study});
        })
        .then(function (subjectEnrollments) {
          // if subjects are enrolled already, create SubjectSchedules for them
          if (subjectEnrollments) {
            var queries = [];
            _.each(sessions, function (session) {
              _.each(subjectEnrollments, function (enrollment) {
                var availableFrom = moment(enrollment.doe).add(session.timepoint, 'days')
                  .subtract(session.availableFrom, 'days');
                var availableTo = moment(enrollment.doe).add(session.timepoint, 'days')
                  .add(session.availableTo, 'days');
                queries.push({
                  availableFrom: (session.type !== 'non-scheduled') ? availableFrom.toDate() : null,
                  availableTo: (session.type !== 'non-scheduled') ? availableTo.toDate() : null,
                  status: 'IN PROGRESS',
                  session: session.id,
                  subjectEnrollment: enrollment.id
                });
              });
            });

            return queries;
          } else {
            return null;
          }
        });
    }
  };

})();
