/**
 * SubjectController
 *
 * @description :: Server-side logic for managing Subjects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = {

  create: function(req, res, next) {
    // create user/person first and save userId
    Role.findOneByName('subject')
    .then(function (subjectRole) {
      console.log(subjectRole);
      this.subjectRole = subjectRole.id;
    })
    .then(function () {
      console.log('Creating person');
      return Person.create({
        prefix: req.param('prefix'),
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        gender: req.param('gender'),
        dob: req.param('dob')
      });
    })
    .then(function (person) {
      this.person = person;
      console.log('Creating user');
      console.log(person);
      return User.create({
        username: req.param('username'),
        email: req.param('email'),
        roles: [this.subjectRole],
        person: person.id
      });
    })
    .then(function (user) {
      this.user = user;
      console.log('Creating passport');
      console.log(user);
      return Passport.create({
        protocol : 'local',
        password : req.param('password'),
        user     : user.id
      });
    })
    .then(function (passport) {
      this.passport = passport;
      console.log('Creating subject');
      console.log(passport);
      return Subject.create({
        subjectId: req.param('subjectId'),
        user: this.user.id,
        doe: req.param('doe'),
        collectionCentres: req.param('collectionCentres')
      });
    })
    .then(function (subject) {
      this.subject = subject;
      console.log(subject);
      res.ok(subject);
    })
    .catch(function (err) {
      console.log(err);
      this.subject.destroy(function (destroyErr) {
        this.passport.destroy(function (destroyErr) {
          this.user.destroy(function (destroyErr) {
            this.person.destroy(function (destroyErr) {
              next(destroyErr || err);
            })
          });
        });
      });
    });

    // create subject as relation to collectionCentre
    // 
  },

  findByStudyName: function(req, res) {
    var studyName = req.param('name');
    PermissionService.getCurrentRole(req).then(function (roleName) {
      Subject.findByStudyName(studyName, roleName, req.user.id,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) }, 
        function(err, subjects) {
          if (err) res.serverError(err);
          res.ok(subjects);
        });    
    });    
  }

};
