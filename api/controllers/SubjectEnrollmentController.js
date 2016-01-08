/**
 * SubjectEnrollmentController
 *
 * @module controllers/SubjectEnrollment
 * @description Server-side logic for managing Subject Enrollments
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var moment = require('moment'); // I need a minute
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var Promise = require('bluebird');

  var StudyBase = require('./BaseControllers/StudyBaseController');

  _.merge(exports, StudyBase);      // inherits StudyBaseController.findByStudy
  _.merge(exports, {

    findOne: function(req, res, next) {
      studysubject.findOne(req.param('id')).exec(function (err, enrollment) {
        if (_.isUndefined(enrollment)) {
          res.notFound();
        } else {
          // find subject schedule with session information
          schedulesessions.find({ subjectEnrollment: enrollment.id })
            .then(function (schedules) {
              this.schedules = _.sortBy(schedules, 'timepoint');
              // get flattened dictionary of possible formVersions in each schedule
              return FormVersion.find({ id: _.flatten(_.pluck(schedules, 'formVersions'))})
                .then(function (formVersions) {
                  return _.indexBy(_.map(formVersions, function (form) {
                    return _.pick(form, 'id', 'name', 'revision', 'form');
                  }), 'id');
                });
            })
            .then(function (possibleForms) {
              enrollment.formSchedules = [];
              // create 1D list of scheduled forms
              _.each(this.schedules, function (schedule) {
                _.each(schedule.formOrder, function (formOrderId) {
                  // if ordered form is active for this session
                  if (_.includes(schedule.formVersions, formOrderId) || schedule.formVersions == formOrderId) {
                    var scheduledForm = _.clone(schedule);
                    scheduledForm.scheduledForm = possibleForms[formOrderId];
                    enrollment.formSchedules.push(scheduledForm);
                  }
                });
              });
            })
            .then(function () {
              return Promise.all(
                _.map(enrollment.formSchedules, function (schedule) {
                  return AnswerSet.count({
                    formVersion: schedule.scheduledForm.id,
                    surveyVersion: schedule.surveyVersion,
                    subjectSchedule: schedule.id,
                    subjectEnrollment: enrollment.id
                  }).then(function (answers) {
                    // TODO: Support [unavailable, late, incomplete, and completed] status types
                    // TODO: Verify semi-completed answer sets (possibly store state in AnswerSet itself?)
                    schedule.scheduledForm.status = (answers > 0) ? "Complete" : "Incomplete";
                  })
                })
              );
            })
            .then(function (answers) {
              if (enrollment.providers) {
                Provider.find({ id: enrollment.providers }).then(function (providers) {
                  enrollment.providers = providers;
                  res.ok(enrollment);
                });
              } else {
                res.ok(enrollment);
              }
            })
            .catch(function (err) {
              res.serverError(err);
            });
        }
      });
    },

    create: function(req, res, next) {
      var options = _.pick(_.pick(req.body,
        'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob'
      ), _.identity);

      var enrollmentOptions = _.pick(_.pick(req.body,
        'study', 'collectionCentre', 'providers', 'studyMapping', 'doe', 'status'
      ), _.identity);

      options.group = 'subject';
      User.create(options).then(function (user) {
        return PermissionService.setDefaultGroupRoles(user);
      })
      .then(function (user) { // create passport
        this.user = user;
        return Passport.create({
          protocol : 'local',
          password : req.param('password'),
          user     : user.id
        }).catch(function (err) {
          this.user.destroy(function (destroyErr) {
            throw err;
          });
        });
      })
      .then(function (passport) { // create subject
        this.passport = passport;
        return Subject.create({
          user: this.user.id
        }).catch(function (err) {
          this.passport.destroy(function (destroyErr) {
            this.user.destroy(function (destroyErr) {
              throw err;
            });
          });
        });
      })
      .then(function (subject) { // find collection centre's study
        this.subject = subject;
        return Study.findOne(enrollmentOptions.study).then(function (study) {
          return study.attributes;
        });
      })
      .then(function (attributes) { // verify studyMapping is valid
        var studyMapping = enrollmentOptions.studyMapping;
        // only if both empty we allow or if status is set to REGISTERED
        if (_.isEmpty(attributes) && _.isEmpty(studyMapping) ||
            _.isEmpty(studyMapping) && enrollmentOptions.status == 'REGISTERED') {
          return true;
        } else {
          // verify keys of study attributes mirror keys of studyMapping
          var valid = _.isEmpty(_.xor(_.keys(attributes), _.keys(studyMapping)));
          // verify value of studyMapping corresponds directly to one of the values in study attributes
          _.forIn(attributes, function (value, key) {
            valid = valid && _.includes(value, studyMapping[key]);
          });
          return valid;
        }
      })
      .then(function (validMapping) { // if valid, create subject enrollment
        if (validMapping) {
          enrollmentOptions.subject = this.subject.id;
          return SubjectEnrollment.create(enrollmentOptions);
        } else {
          return null;
        }
      })
      .then(function (enrollment) {
        if (enrollment) {
          res.ok(enrollment);
        } else {
          this.subject.destroy(function (destroyErr) {
            this.passport.destroy(function (destroyErr) {
              this.user.destroy(function (destroyErr) {
                res.badRequest({
                  title: 'Subject Enrollment Error',
                  code: 400,
                  message: 'Study mapping is invalid, please ensure options match study attributes.'
                });
              });
            });
          });
        }
      })
      .catch(function (err) {
        res.serverError(err);
      });
    }

  });

})();
