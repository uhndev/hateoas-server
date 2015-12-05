/**
 * FormController
 *
 * @description Server-side logic for managing forms
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var Promise = require('bluebird');
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
          // update any associated sessions to form in question
          return Form.destroyLifecycle(formID, {}).then(function () {
            // call blueprint destroy to actually destroy
            return require('../blueprints/destroy')(req, res);
          }).catch(function (err) {
            return res.serverError({
              title: 'Form Error',
              code: 500,
              message: 'An error occurred when archiving form ' + formID + ': ' + err.details
            });
          });
        }
      });
    }

  });

})();

