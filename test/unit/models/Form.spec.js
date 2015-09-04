/**
 * Test File: Testing Form Model
 * File Location: test/models/Form.spec.js
 */

var should = require('should');

describe('The Form Model', function() {
  describe('after the form is created/modified', function() {

    after(function (done) {
      Form.destroy({ name: 'TESTFORM3' }).exec(function (err) {
        done(err);
      });
    });

    it('should create initial form version after create', function(done) {
      Form.create({
        name: 'TESTFORM',
        metaData: {},
        questions: []
      }).exec(function (err, form) {
        FormVersion.findOne({ form: form.id})
          .exec(function (err, formVersion) {
            formVersion.revision.should.equal(0);
            done(err);
          });
      });
    });

    it('should updating the head revision in place if no AnswerSets filled yet', function(done) {
      Form.update({ name: 'TESTFORM' }, {
        name: 'TESTFORM2'
      }).exec(function (err, updatedForm) {
        FormVersion.find({ form: 1 }).exec(function (err, formVersions) {
          formVersions.length.should.equal(1);
          done(err);
        });
      });
    });

    it('should update the head revision and create new FormVersion if AnswerSet exists', function(done) {
      Form.update({ name: 'TESTFORM2' }, { lastPublished: new Date() }).exec(function (err, updated) {
        Form.update({ name: 'TESTFORM2' }, { name: 'TESTFORM3' }).exec(function (err, finalForm) {
          FormVersion.count().exec(function (err, versions) {
            versions.should.equal(2);
            done(err);
          });
        });
      });
    });

  });
});
