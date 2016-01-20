/**
 * ReferralController
 *
 * @module  controllers/Referral
 * @description Server-side logic for managing Referrals
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

    var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
    var StudyBase = require('./BaseControllers/ModelBaseController');

    _.merge(exports, StudyBase);      // inherits StudyBaseController.findByBaseModel
    _.merge(exports, {


    find: function (req, res, next) {
      // manually override model name for pagination in ok.js
      req.options.model = sails.models.referraldetail.identity;
      var query = referraldetail.find()
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));

      query.exec(function found(err, referrals) {
        if (err) {
          return res.serverError(err);
        }

        res.ok(referrals);
      });
    },

    /**
     * findOne
     * @description Finds one referral given an id
     *              and populates program, site, physician and referralContact data
     */
    findOne: function (req, res) {
      Referral.findOne(req.param('id'))
        .populate('notes')
        .populate('program')
        .populate('site')
        .populate('physician')
        .populate('referralContact')
        .exec(function (err, referral) {
          if (err) {
            return res.serverError(err);
          }

          if (_.isUndefined(referral)) {
            res.notFound();
          } else {
            if (referral.client) { // only populate if referral has client set
              clientcontact.findOne(referral.client).then(function (client) {
                referral.clientcontact = client;
                res.ok(referral, {
                  links: client.getResponseLinks()
                });
              });
            } else {
              res.ok(referral);
            }
          }
        });
    }

    });
})();
