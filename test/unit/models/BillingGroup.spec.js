/**
 * Test File: Testing BillingGroup Model
 * File Location: test/models/BillingGroup.spec.js
 */

var should = require('should');

describe('The BillingGroup Model', function () {

  var billingGroup = null;

  describe('after the billing group with a single service is created', function () {

    before(function (done) {
      BillingGroup.create({
        billingGroupName: 'Test Billing Group',
        templateService: {
          referral: {
            claimNumber: 123
          },
          altumService: {name: 'altumservice'},
          programService: {name: 'programservice'},
          numberDetailName: 'singlebillingservice'
        },
        totalItems: 1
      }).exec(function (err, createdBillingGroup) {
        billingGroup = createdBillingGroup;
        done(err);
      });
    });

    it('should have set correct itemCount in Service', function (done) {
      Service.findOne({numberDetailName: 'singlebillingservice'})
        .exec(function (err, service) {
          service.itemCount.should.equal(1);
          service.billingGroupItemLabel.should.equal('altumservice 1');
          done(err);
        });
    });

    it('should have set correct totalItems in BillingGroup', function (done) {
      BillingGroup.findOne({billingGroupName: 'Test Billing Group'}).populate('services').exec(function (err, billingGroup) {
        billingGroup.totalItems.should.equal(1);
        billingGroup.services.length.should.equal(1);
        done(err);
      });
    });

    after(function (done) {
      BillingGroup.destroy({billingGroupName: 'Test Billing Group'}).exec(function (err) {
        Service.destroy({numberDetailName: 'singlebillingservice'}).exec(function (err) {
          Referral.destroy({claimNumber: 123}).exec(function (err) {
            done(err);
          });
        });
      });
    });

  });

  describe('after the billing group with multiple services is created', function () {
    before(function (done) {
      BillingGroup.create({
        billingGroupName: 'Test Billing Groups x5',
        templateService: {
          referral: {
            claimNumber: 123
          },
          altumService: 2,
          programService: 1,
          numberDetailName: 'multiplebillingservice'
        },
        totalItems: 5
      }).exec(function (err, createdBillingGroup) {
        billingGroup = createdBillingGroup;
        done(err);
      });
    });

    it('should have set correct itemCount in Service', function (done) {
      Service.find().exec(function (err, services) {
        _.xor(_.map(services, 'itemCount'), [1,2,3,4,5]).length.should.equal(0);
        _.each(services, function (service) {
          service.billingGroupItemLabel.should.equal('altumservice ' + service.itemCount);
        });
        done(err);
      });
    });

    it('should have set correct totalItems in BillingGroup', function (done) {
      BillingGroup.findOne({billingGroupName: 'Test Billing Groups x5'}).populate('services').exec(function (err, billingGroup) {
        billingGroup.totalItems.should.equal(5);
        billingGroup.services.length.should.equal(5);
        billingGroup.templateService.should.equal(_.first(billingGroup.services).id);
        done(err);
      });
    });

    it('should have added all created services to the underlying referral', function (done) {
      Referral.findOne({claimNumber: 123}).populate('services').exec(function (err, referral) {
        referral.services.length.should.equal(5);
        done(err);
      });
    });

    after(function (done) {
      BillingGroup.destroy({billingGroupName: 'Test Billing Groups x5'}).exec(function (err) {
        Service.destroy({numberDetailName: 'multiplebillingservice'}).exec(function (err) {
          Referral.destroy({claimNumber: 123}).exec(function (err) {
            done(err);
          });
        });
      });
    });
  });

});
