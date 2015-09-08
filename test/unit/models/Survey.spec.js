/**
 * Test File: Testing Survey Model
 * File Location: test/models/Survey.spec.js
 */

var should = require('should');

describe('The Survey Model', function() {

  before(function (done) {
    Study.create({
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
    }).exec(function (err, study) {
      Survey.create({
        study: study.id,
        name: 'SURVEY',
        completedBy: 'subject'
      }).exec(function (err, survey) {
        Session.create([
          {
            survey: survey.id,
            surveyVersion: 1,
            name: 'Baseline',
            timepoint: 0,
            availableFrom: 5,
            availableTo: 2,
            type: 'scheduled',
            formVersions: [1, 2]
          },
          {
            survey: survey.id,
            surveyVersion: 1,
            name: '90 Day',
            timepoint: 90,
            availableFrom: 5,
            availableTo: 2,
            type: 'scheduled',
            formVersions: [1, 2]
          }
        ]).exec(function (err, session) {
          done(err);
        });
      });
    });
  });

  describe('after the survey is created', function() {
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
  });

  describe('after the survey is modified', function() {
    it('should update the head revision in place if no AnswerSets filled yet', function(done) {
      Survey.update({ name: 'SURVEY' }, {
        name: 'SURVEY2'
      }).exec(function (err, updatedSurvey) {
        SurveyVersion.find({ survey: 1 }).exec(function (err, surveyVersions) {
          surveyVersions.length.should.equal(1);
          done(err);
        });
      });
    });

    it('should update the head revision and create new SurveyVersion if AnswerSet exists', function(done) {
      Survey
        .update({ name: 'SURVEY2' }, { lastPublished: new Date() })
        .then(function (updated) {
          return Survey.update({ name: 'SURVEY2' }, { name: 'SURVEY3' })
            .then(function (finalForm) {
              SurveyVersion.count().exec(function (err, versions) {
                versions.should.equal(3);
                done(err);
              });
            });
        });
    });
  });

  describe('after the survey is expired', function() {
    it('should set expiredAt all associated Sessions, SurveyVersions, and SubjectSchedules', function (done) {
      Survey.update({ id: 1 }, { expiredAt: new Date() })
        .then(function (survey) {
          return [
            SurveyVersion.find(),
            Session.find(),
            SubjectSchedule.find()
          ];
        })
        .spread(function (versions, sessions, schedules) {
          _.each([versions, sessions, schedules], function (entity) {
            _.each(entity, function (item) {
              item.expiredAt.should.not.equal(null);
            });
          });
          done();
        });
    });
  });
});
