/**
 * FormController
 *
 * @description Server-side logic for managing forms
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var Promise = require('q');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var StudyBase = require('./Base/StudyBaseController');

  _.merge(exports, StudyBase); // inherits StudyBaseController.findByStudyName
  _.merge(exports, {

    destroy: function (req, res) {
      var formID = req.param('id'); // form primary key to remove

      FormVersion.hasAnswerSets(formID).then(function (hasAnswerSets) {
        if (hasAnswerSets) {
          return res.badRequest({
            title: 'Form Error',
            code: 400,
            message: 'Unable to archive form, there are answers associated to the requested form.'
          });
        } else {
          return Form.destroyLifecycle(formID, {}).then(function () {
            return require('../blueprints/destroy')(req, res);
          });
        }
      });
    }

  });

})();

