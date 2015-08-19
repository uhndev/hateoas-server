/**
 * FormController
 *
 * @description Server-side logic for managing forms
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  
  module.exports = {

    /**
     * findByStudyName
     * @description Finds forms by their associations to a given study.
     */
    findByStudyName: function (req, res) {
      var studyName = req.param('name');

      Form.findByStudyName(studyName, req.user,
        {
          where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req)
        }
      ).then(function (forms) {
          var err = forms[0];
          var formItems = forms[1];
          if (err) res.serverError(err);
          res.ok(formItems);
        });
    }
  };
})();

