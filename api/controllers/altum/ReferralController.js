/**
 * ReferralController
 *
 * @module  controllers/Referral
 * @description Server-side logic for managing Referrals
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {
  var _ = require('lodash');
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var StudyBase = require('./../BaseControllers/ModelBaseController');

  _.merge(exports, StudyBase);      // inherits StudyBaseController.findByBaseModel
  _.merge(exports, {

    identity: 'Referral',

    find: function (req, res, next) {
      var searchQuery = actionUtil.parseCriteria(req);
      if (_.has(searchQuery, 'or') && _.isArray(searchQuery.or)) {
        searchQuery.or.push({
          'displayName': {
            'contains': _.first(_.values(searchQuery.or))
          }
        });
      }
      // manually override model name for pagination in ok.js
      req.options.model = sails.models.referraldetail.identity;
      var query = referraldetail.find()
        .where(searchQuery)
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
      var populateFields = ['program', 'site', 'physician', 'staff', 'payors'];

      // if hitting findOne for Referral overview (not triage), override base model and populate additional fields
      if (req.route.path === '/api/referral/:id') {
        req.options.model = sails.models.referraldetail.identity;
        ['referralContacts'].map(function (model) {
          populateFields.push(model);
        });
      }

      Referral.findOne(req.param('id'))
        .populate(populateFields)
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
                  links: referraldetail.getResponseLinks(referral.id, client.displayName)
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
