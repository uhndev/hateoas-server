/**
 * A virtual model representing a database view.
 * See config/db/studyuser.sql for view definition.
 */
(function () {
  var AltumServiceModel = require('./../../altum/AltumService.js');
  var _super = require('./altumBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      altumServiceName: {
        type: 'string'
      },
      serviceCategory: {
        model: 'servicecategory'
      },
      serviceCategoryName: {
        type: 'string'
      },
      programService: {
        model: 'programservice'
      },
      programServiceName: {
        type: 'string'
      },
      programServiceCode: {
        type: 'string'
      },
      programServicePrice: {
        type: 'float'
      },
      program: {
        model: 'program'
      },
      serviceVariation: {
        model: 'servicevariation'
      },
      hasTelemedicine: {
        type: 'boolean'
      },
      repeatable: {
        type: 'boolean'
      },
      approvalNeeded: {
        type: 'boolean'
      },
      approvalRequired: {
        type: 'boolean'
      },
      reportRequired: {
        type: 'boolean'
      },
      programName: {
        type: 'string'
      },

      toJSON: AltumServiceModel.attributes.toJSON
    }

  });
})();

