/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#/documentation/concepts/ORM
 */

var Promise = require('bluebird');
module.exports.models = {

  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/

  // elements in this array will be ignored as Model attributes
  validations: {
    ignoreProperties: ['generator']
  },

  limits: {
    claim: 5,
    program: 5,
    referral: 5
  },

  populateDB: function() {
    var that = this;
    Site.generateAndCreate()
      .then(function () {
        var promises = [];
        for (var i=0; i < that.limits.claim; i++) {
          promises.push(Claim.generateAndCreate());
        }
        return Promise.all(promises);
      })
      .then(function () {
        sails.log.info(that.limits.program + ' program(s) generated');
        var promises = [];
        for (var i=0; i < that.limits.referral; i++) {
          promises.push(Referral.generateAndCreate());
        }
        return Promise.all(promises);
      })
      .then(function() {
        sails.log.info(that.limits.referral + ' referral(s) generated');
        sails.log.info('Data generation complete!');
      })
  }
};
