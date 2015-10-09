/**
 * Test File: Testing Survey Model
 * File Location: test/models/Survey.spec.js
 */

var should = require('should');
var moment = require('moment');

describe('The Survey Model', function() {
  var studyID;

  before(function (done) {
    Study
      .create({
        name: 'STUDY',
        attributes: {},
        reb: '123',
        collectionCentres: [
          { name: 'CC1' }, { name: 'CC2' }
        ],
        forms: [
          { name: 'FORM1', metaData: {}, questions: [] },
          { name: 'FORM2', metaData: {}, questions: [] }
        ]
      })
      .then(function (study) {
        return Study.findOne(study.id).populate('forms');
      })
      .then(function (study) {
        this.study = study;
        return FormVersion.find({form: _.pluck(study.forms, 'id')});
      })
      .then(function (formVersions) {
        Survey.create({
          study: this.study.id,
          name: 'SURVEY',
          completedBy: 'subject',
          sessions: [
            {
              surveyVersion: 1,
              name: 'Baseline',
              timepoint: 0,
              availableFrom: 5,
              availableTo: 2,
              type: 'scheduled',
              formVersions: _.pluck(formVersions, 'id')
            },
            {
              surveyVersion: 1,
              name: '90 Day',
              timepoint: 90,
              availableFrom: 5,
              availableTo: 2,
              type: 'scheduled',
              formVersions: _.pluck(formVersions, 'id')
            }
          ]
        }).exec(function (err, survey) {
          done(err);
        });
      });
  });

  describe('before subjects have been enrolled', function() {
    it('should create initial survey version after create', function (done) {
      SurveyVersion.findOne({survey: 1})
        .exec(function (err, surveyVersion) {
          surveyVersion.revision.should.equal(0);
          done(err);
        });
    });

    it('should have two sessions registered in survey with initial survey version', function (done) {
      Survey.findOneByName('SURVEY')
        .populate('sessions')
        .exec(function (err, surveys) {
          surveys.sessions.length.should.equal(2);
          surveys.sessions[0].surveyVersion.should.equal(1);
          surveys.sessions[1].surveyVersion.should.equal(1);
          done(err);
        });
    });

    it('should update the head revision in place if no AnswerSets filled yet', function(done) {
      Survey.update({ name: 'SURVEY' }, {
        name: 'SURVEY2'
      }).exec(function (err, updatedSurvey) {
        Survey.findOne({ name: 'SURVEY2' })
          .populate('sessions')
          .exec(function (err, survey) {
            survey.sessions[0].surveyVersion.should.equal(1);
            survey.sessions[1].surveyVersion.should.equal(1);
            SurveyVersion.find({ survey: 1 }).exec(function (err, surveyVersions) {
              surveyVersions.length.should.equal(1);
              done(err);
            });
          });
      });
    });

    it('should not create subject schedules if no subjects enrolled yet', function(done) {
      Survey.findOneByName('SURVEY2')
        .populate('sessions')
        .then(function (survey) {
          return SubjectSchedule.count({ session:_.pluck(survey.sessions, 'id') });
        })
        .then(function (schedules) {
          schedules.should.equal(0);
          done();
        });
    });

    it('should have edited survey in place and not have created new version if not published yet', function(done) {
      Survey.findOneByName('SURVEY2')
        .populate('versions')
        .exec(function (err, survey) {
          survey.versions.length.should.equal(1);
          done(err);
        });
    });
  });

  describe('after subjects have been enrolled but before being published', function() {
    var enrollment1, enrollment2;
    before(function (done) {
      Study.findOneByName('STUDY')
        .populate('collectionCentres')
        .exec(function (err, study) {
          SubjectEnrollment.create([
            {
              study: study.id,
              status: 'ONGOING',
              subject: globals.subjects.subjectId,
              collectionCentre: study.collectionCentres[0],
              doe: new Date,
              studyMapping: {}
            },
            {
              study: study.id,
              status: 'ONGOING',
              subject: globals.subjects.subjectId,
              collectionCentre: study.collectionCentres[1],
              doe: new Date,
              studyMapping: {}
            }
          ]).exec(function (err, enrollments) {
            enrollment1 = enrollments[0];
            enrollment2 = enrollments[1];
            done(err);
          });
        });
    });

    it('should update the head revision in place if no AnswerSets filled yet', function(done) {
      Survey.update({ name: 'SURVEY2' }, {
        name: 'SURVEY3'
      }).exec(function (err, updatedSurvey) {
        SurveyVersion.find({ survey: 1 }).exec(function (err, surveyVersions) {
          surveyVersions.length.should.equal(1);
          done(err);
        });
      });
    });

    it('should have created subject schedules if subjects enrolled', function(done) {
      SubjectSchedule
        .find({ subjectEnrollment: [enrollment1.id, enrollment2.id] })
        .exec(function (err, schedules) {
          schedules.length.should.equal(4);
          done();
        });
    });

    it('should calculate availableFrom and availableTo times correctly for SubjectSchedule', function(done) {
      Session.updateLifecycle({ id: 1 }, { availableFrom: 10, availableTo: 10 })
        .then(function (updatedSession) {
          _.first(updatedSession).surveyVersion.should.equal(1);
          return SurveyVersion.count().then(function (versions) {
            versions.should.equal(1);
            return Session.findOne(1).populate('subjectSchedules');
          });
        })
        .then(function (session) {
          this.session = session;
          return SubjectSchedule.findOne(_.first(session.subjectSchedules).id).populate('subjectEnrollment');
        })
        .then(function (schedule) {
          var correctFrom = moment(schedule.subjectEnrollment.doe).subtract(10, 'days').toDate();
          var correctTo = moment(schedule.subjectEnrollment.doe).add(10, 'days').toDate();
          schedule.availableFrom.should.eql(correctFrom);
          schedule.availableTo.should.eql(correctTo);
          done();
        })
        .catch(done);
    });
  });

  describe('after subjects enrolled and Survey is published', function() {
    before(function (done) {
      Survey.update({name: 'SURVEY3'}, {lastPublished: new Date()}).exec(function (err, survey) {
        Form.update({ name: ['FORM1', 'FORM2' ] }, { lastPublished: new Date()}).exec(function (err, forms) {
          done(err);
        });
      });
    });

    it('should update the head revision and create new SurveyVersion if published', function(done) {
      Survey.update({name: 'SURVEY3'}, {name: 'SURVEY4'})
        .then(function (finalSurvey) {
          SurveyVersion.count().exec(function (err, versions) {
            versions.should.equal(2);
            done(err);
          });
        });
    });

    it('should not create a new SurveyVersion if Session is edited', function(done) {
      Session.updateLifecycle({ id: 1 }, { availableFrom: 5, availableTo: 5 })
        .then(function (updatedSession) {
          _.first(updatedSession).surveyVersion.should.equal(1);
          return SurveyVersion.count();
        })
        .then(function (versions) {
          versions.should.equal(2);
          return Session.findOne(1).populate('subjectSchedules');
        })
        .then(function (session) {
          this.session = session;
          return SubjectSchedule.findOne(_.first(session.subjectSchedules).id).populate('subjectEnrollment');
        })
        .then(function (schedule) {
          var correctFrom = moment(schedule.subjectEnrollment.doe).subtract(5, 'days').toDate();
          var correctTo = moment(schedule.subjectEnrollment.doe).add(5, 'days').toDate();
          schedule.availableFrom.should.eql(correctFrom);
          schedule.availableTo.should.eql(correctTo);
          done();
        })
        .catch(done);
    });

    it('should create a new SurveyVersion if adding a Session to Survey', function(done) {
      Survey.findOne({name: 'SURVEY4'})
        .populate('sessions')
        .exec(function (err, survey) {
          Session.createLifecycle({
            survey: survey.id,
            surveyVersion: 1,
            name: 'Future',
            timepoint: 300,
            availableFrom: 6,
            availableTo: 6,
            type: 'non-scheduled'
          }).then(function (session) {
            SurveyVersion.count().exec(function (err, versions) {
              versions.should.equal(3);
              done();
            });
          }).catch(done);
        });
    });

    it('should have set availableFrom/To to null if session type was non-scheduled', function(done) {
      Session.findOneByName('Future').populate('subjectSchedules').exec(function (err, session) {
        _.each(session.subjectSchedules, function (schedule) {
          _.isNull(schedule.availableFrom).should.be.ok;
          _.isNull(schedule.availableTo).should.be.ok;
        });
        done(err);
      })
    });

    it('should create a new SurveyVersion if removing a Session from a Survey', function(done) {
      Survey.findOne({name: 'SURVEY4'})
        .populate('sessions')
        .then(function (survey) {
          var removeSession = _.find(survey.sessions, {name: 'Future'}).id;
          survey.sessions.remove(removeSession);
          return survey.save();
        })
        .then(function (survey) {
          SurveyVersion.count().exec(function (err, versions) {
            versions.should.equal(3);
            done(err);
          });
        });
    });

    it('should not create a new SurveyVersion if a formVersion is added to a Session', function(done) {
      Form.create({ name: 'FORM3', metaData: {}, questions: [] })
        .then(function (form) {
          this.form = form;
          return Session.findOneByName('Baseline').populate('formVersions');
        })
        .then(function (session) {
          session.formVersions.add(this.form.id);
          return session.save();
        })
        .then(function (session) {
          SurveyVersion.count().exec(function (err, versions) {
            versions.should.equal(3);
            done(err);
          });
        })
        .catch(done);
    });

    it('should not allow user to remove formVersion from Session if already published', function(done) {
      // TODO: this cannot be done using Model lifecycle methods.  Will probably need to overwrite the
      // blueprint remove() function for the FormVersion controller.
      done();
      //Session.findOneByName('Baseline').populate('formVersions')
      //  .then(function (session) {
      //    this.session = session;
      //    this.formToRemove = _.first(session.formVersions).id;
      //    return FormVersion.update({ id: this.formToRemove }, { activeOn: new Date() });
      //  })
      //  .then(function (formVersion) {
      //    this.session.formVersions.remove(this.formToRemove);
      //    return this.session.save();
      //  })
      //  .then(function (session) {
      //    session.formVersions.length.should.equal(3);
      //    done();
      //  })
      //  .catch(done);
    });

    it('should set expiredAt for all associated Sessions, SurveyVersions, and SubjectSchedules', function (done) {
      Survey.update({ id: 1 }, { expiredAt: new Date() })
        .exec(function (err, survey) {
          SurveyVersion.find()
            .then(function (surveys) {
              _.all(surveys, function (survey) {
                return _.isNull(survey.expiredAt);
              }).should.equal(false);
              return Session.find();
            })
            .then(function (sessions) {
              _.all(sessions, function (session) {
                return _.isNull(session.expiredAt);
              }).should.equal(false);
              return SubjectSchedule.find();
            })
            .then(function (schedules) {
              _.all(schedules, function (schedule) {
                return _.isNull(schedule.expiredAt);
              }).should.equal(false);
              done();
            });
        });
    });

  });

});
