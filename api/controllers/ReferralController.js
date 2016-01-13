/**
 * ReferralController
 *
 * @module  controllers/Referral
 * @description Server-side logic for managing Referrals
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var StudyBase = require('./BaseControllers/ModelBaseController');

  _.merge(exports, StudyBase);      // inherits StudyBaseController.findByBaseModel
  _.merge(exports, {

      /**
       * findOne
       * @description Finds one collection centre given an id
       *              and populates enrolled coordinators and subjects
       */
      findOne: function (req, res) {
          Referral.findOne(req.param('id'))
              .exec(function (err, referral) {
                  if (err) {
                      return res.serverError(err);
                  }

                  if (_.isUndefined(referral)) {
                      res.notFound();
                  } else {
                      clientcontact.findOne(referral.client).then(function (client) {
                          referral.clientcontact = client;
                          res.ok(referral, {
                              links: client.getResponseLinks()
                          });
                      });
                  }
              });
      },


      find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('referral')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('payors');
      //query.populate('services');
      query.exec(function found(err, sites) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(sites);
      });
    }

  });
})();
