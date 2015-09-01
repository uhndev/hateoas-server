/**
 * SurveyController
 *
 * @description Server-side logic for managing surveys
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * findByStudyName
     * @description Finds studies by their associations to a given study.
     */
    findByStudyName: function (req, res) {
      var studyName = req.param('name');

      Survey.findByStudyName(studyName, req.user,
        {
          where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req)
        }
      ).then(function (surveys) {
          var err = surveys[0];
          var surveyItems = surveys[1];
          if (err) res.serverError(err);
          res.ok(surveyItems);
        });
    }
  };
})();

