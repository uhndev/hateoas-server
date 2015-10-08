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

    it('should update the expiry date on revisions if it was set on a form', function(done) {
      Form.update({ name: 'TESTFORM' }, {
        expiredAt: new Date()
      }).exec(function (err, updatedForm) {
        FormVersion.findOne({ form: 1 })
          .exec(function (err, formVersion) {
            formVersion.expiredAt.should.notEqual(null);
            done(err);
          });
      });
    });

  });
});
