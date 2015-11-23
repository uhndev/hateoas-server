/**
 * ScheduleSubjectController
 *
 * @description Server-side logic for managing ScheduleSubjects
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    find: function(req, res) {
      User.findOne(req.user.id).populate('enrollments')
        .then(function (user) {
          this.user = user;
          return Group.findOne(req.user.group);
        })
        .then(function (group) {
          var query = {};
          switch (group.level) {
            case 1: break;
            case 2: query = { collectionCentre: _.pluck(_.filter(this.user.enrollments, { expiredAt: null }), 'collectionCentre') }; break;
            case 3: query = { user: req.user.id }; break;
            default: return null;
          }
          return [
            schedulesubjects.count(query),
            schedulesubjects.find(query)
              .where( actionUtil.parseCriteria(req) )
              .limit( actionUtil.parseLimit(req) )
              .skip( actionUtil.parseSkip(req) )
              .sort( actionUtil.parseSort(req) )
          ];
        })
        .spread(function (filteredTotal, scheduleSubjects) {
          res.ok(scheduleSubjects, { filteredTotal: filteredTotal });
        })
        .catch(function (err) {
          res.serverError(err);
        });
    }

  };

})();
