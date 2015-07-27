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

    create: function(req, res, next) {
      var options = _.pick(_.pick(req.body,
        'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob'
      ), _.identity);

      Group.findOne({ name: 'subject' })
      .then(function (subjectGroup) { // create user with subject group
        options.group = subjectGroup.id;
        return User.create(options);
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
        return CollectionCentre.findOne(req.param('collectionCentre')).populate('study')
          .then(function (centre) {
            return centre.study;
          });
      })
      .then(function (study) { // verify studyMapping is valid
        var studyMapping = req.param('studyMapping');
        // only if both empty we allow
        if (_.isEmpty(study.attributes) && _.isEmpty(studyMapping)) {
          return true;
        } else {
          // verify keys of study attributes mirror keys of studyMapping
          var valid = _.isEmpty(_.xor(_.keys(study.attributes), _.keys(studyMapping)));
          // verify value of studyMapping corresponds directly to one of the values in study attributes
          _.forIn(study.attributes, function (value, key) {
            valid = valid && _.includes(value, studyMapping[key]);
          });
          return valid;
        }
      })
      .then(function (validMapping) { // if valid, create subject enrollment
        if (validMapping) {
          return SubjectEnrollment.create({
            collectionCentre: req.param('collectionCentre'),
            doe: req.param('doe'),
            subject: this.subject.id,
            studyMapping: req.param('studyMapping')
          });
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
          message: err.message || 'Error creating subject'
        });
      });
    },

    findByStudyName: function(req, res) {
      var studyName = req.param('name');
      SubjectEnrollment.findByStudyName(studyName, req.user,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) },
        function(err, subjects) {
          if (err) res.serverError(err);
          res.ok(subjects);
        });
    }

  };

})();
