/**
 * AltumProgramServicesController
 *
 * @description Server-side logic for managing altum program services
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var Promise = require('bluebird');
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * find
     * @description Finds and returns altum program service info
     */
    find: function(req, res, next) {
      var query = altumprogramservices.find()
        .where( actionUtil.parseCriteria(req) )
        .limit( actionUtil.parseLimit(req) )
        .skip( actionUtil.parseSkip(req) )
        .sort( actionUtil.parseSort(req) );

      query.exec(function found(err, services) {
        if (err) {
          return res.serverError(err);
        }

        AltumService.find({ id: _.pluck(services, 'id') })
          .populate('sites')
          .exec(function (err, serviceSites) {
            var serviceDirectory = _.indexBy(serviceSites, 'id');
            res.ok(_.map(services, function (service) {
              service.sites = serviceDirectory[service.id].sites;
              return service;
            }));
          });
      });
    }
  };
})();
