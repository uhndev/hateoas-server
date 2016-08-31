/**
 * Test File: Testing Invoice Model
 * File Location: test/models/Invoice.spec.js
 */

var should = require('should');

describe('The Invoice Model', function () {

  var invoice = null;

  describe('after the invoice is created with multiple services', function () {

    before(function (done) {
      this.timeout(10000);
      Invoice
        .create({
          number: '50000000',
          referral: {
            claimNumber: 123
          },
          payor: {
            name: 'Dummy Payor'
          }
        })
        .then(function (createdInvoice) {
          return Invoice.update({id: createdInvoice.id}, {
            invoiceServices: [
              {
                referral: createdInvoice.referral,
                altumService: {name: 'altumservice1'},
                programService: {name: 'programservice1'},
                numberDetailName: 'invoiceservice'
              },
              {
                referral: createdInvoice.referral,
                altumService: {name: 'altumservice2'},
                programService: {name: 'programservice2'},
                numberDetailName: 'invoiceservice'
              }
            ]
          });
        })
        .then(function (createdInvoice) {
          invoice = createdInvoice;
          done();
        })
        .catch(done);
    });

    it('should void all associated services if invoice status changed to Voided', function (done) {
      Invoice.update({id: invoice.id}, {
        status: 'Voided'
      }).then(function (updatedInvoice) {
        return [
          Service.find({numberDetailName: 'invoiceservice'}).populate('currentBillingStatus'),
          Status.findOne({systemName: 'SUSPENDED'})
        ];
      }).spread(function (invoiceServices, suspendedStatus) {
        _.each(invoiceServices, function (service) {
          service.currentBillingStatus.status.should.equal(suspendedStatus.id);
        });
        done();
      }).catch(done);
    });

    after(function (done) {
      Invoice.destroy({number: '50000000'}).exec(function (err) {
        Service.destroy({numberDetailName: 'invoiceservice'}).exec(function (err) {
          Referral.destroy({claimNumber: 123}).exec(function (err) {
            done(err);
          });
        });
      });
    });

  });

});
