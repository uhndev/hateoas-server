/**
 * Test File: Testing Form Model
 * File Location: test/models/Form.spec.js
 */

var should = require('should');

describe('The Form Model', function() {

  before(function (done) {
    Form.create({
      name: 'TESTFORM',
      metaData: {},
      questions: []
    }).exec(function (err, form) {
      done(err);
    });
  });

  describe('after the form is created/modified', function() {
    it('should create initial form version after create', function(done) {
      FormVersion.findOne({ form: 1 })
        .exec(function (err, formVersion) {
          formVersion.revision.should.equal(0);
          done(err);
        });
    });

    it('should update the head revision in place if no AnswerSets filled yet', function(done) {
      Form.update({ name: 'TESTFORM' }, {
        name: 'TESTFORM2'
      }).exec(function (err, updatedForm) {
        FormVersion.find().exec(function (err, versions) {
          versions.length.should.equal(1);
          done(err);
        });
      });
    });

    it('should set form to published and create new FormVersion', function(done) {
      Form.update({ name: 'TESTFORM2' }, { lastPublished: new Date() })
        .then(function (updated) {
          FormVersion.find().exec(function (err, versions) {
            versions.length.should.equal(2);
            done(err);
          });
        });
    });

    it('should update the head revision and create new FormVersion if AnswerSet exists', function(done) {
      Form.update({ name: 'TESTFORM2' }, { name: 'TESTFORM3' })
        .then(function (finalForm) {
          FormVersion.find().exec(function (err, versions) {
            versions.length.should.equal(3);
            done(err);
          });
        });
    });

    it('should update the head revision in place and update reference to latest FormVersion', function(done) {
      Form.update({ name: 'TESTFORM3' }, {
        name: 'TESTFORM4'
      }).exec(function (err, updatedForm) {
        FormVersion.find().sort('revision DESC')
          .exec(function (err, formVersions) {
            formVersions.length.should.equal(4);
            done(err);
          });
      });
    });

  });
});
