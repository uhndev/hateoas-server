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

    /**
     * find
     * @description Controller find method for the schedulesubjects view, containing the scheduled sessions
     *              any particular subject may have upcoming. Primarily used exclusively by subjects to pull
     *              only their relevant data.
     */
    find: function(req, res) {
      schedulesubjects.find({
        or: [
          {
            availableFrom: { '<=': new Date() },
            availableTo:   { '>=': new Date() }
          },
          {
            availableFrom: null,
            availableTo:   null,
            type:          'non-scheduled'
          }
        ]
      })
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) )
      .then(function (scheduleSubjects) {
        var filteredTotal = PermissionService.filterByCriteria(req.criteria, scheduleSubjects).length;
        res.ok(scheduleSubjects, { filteredTotal: filteredTotal });
      })
      .catch(function (err) {
        res.serverError({
          title: 'ScheduleSubjects Error',
          code: err.status || 500,
          message: 'An error occurred when fetching schedulesubjects for user: ' + req.user.username + '\n' + err.details
        });
      });
    }

  };

})();
