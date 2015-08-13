/**
 * SubjectEnrollmentController
 *
 * @module controllers/SubjectEnrollment
 * @description Server-side logic for managing Subject Enrollments
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var Promise = require('q');

  module.exports = {

    findOne: function(req, res, next) {
      studysubject.findOne({ id: req.param('id') }).exec(function (err, enrollment) {
        res.ok(enrollment);
      });
    },

    create: function(req, res, next) {
      var options = _.pick(_.pick(req.body,
        'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob'
      ), _.identity);

      var enrollmentOptions = _.pick(_.pick(req.body,
        'study', 'collectionCentre', 'studyMapping', 'doe', 'status'
      ), _.identity);

      Group.findOne({ name: 'subject' })
      .then(function (subjectGroup) { // create user with subject group
        options.group = subjectGroup.id;
        return User.create(options).then(function (user) {
          return PermissionService.setUserRoles(user);
        });
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
        res.serverError({
          title: 'Subject Enrollment Error',
          code: err.status || 500,
          message: err.details || 'Error creating subject'
        });
      });
    },

    findByStudyName: function(req, res) {
      var studyName = req.param('name');
      SubjectEnrollment.findByStudyName(studyName, req.user,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) }
      ).then(function(subjects) {
        var err = subjects[0];
        var subjectItems = subjects[1];
        if (err) res.serverError(err);
        res.ok(subjectItems);
      });
    }

  };

})();
