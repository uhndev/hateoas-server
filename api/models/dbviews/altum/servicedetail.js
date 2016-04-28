/**
 * A virtual model representing a database view.
 * See config/db/servicedetail.sql for view definition.
 */
(function () {
  var ServiceModel = require('./../../altum/Service.js');
  var _super = require('./altumBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      referral: {
        model: 'referral'
      },
      displayName: {
        type: 'string'
      },
      altumService: {
        model: 'altumservice'
      },
      altumServiceName: {
        type: 'string'
      },
      programService: {
        model: 'programservice'
      },
      programServiceName: {
        type: 'string'
      },
      program: {
        model: 'program'
      },
      programName: {
        type: 'string'
      },
      site: {
        model: 'site'
      },
      siteName: {
        type: 'string'
      },
      workStatus: {
        type: 'string'
      },
      prognosis: {
        type: 'string'
      },
      prognosisTimeframe: {
        type: 'string'
      },
      serviceDate: {
        type: 'datetime'
      },
      visitService: {
        model: 'service'
      },
      approvalNeeded: {
        type: 'boolean'
      },
      currentApproval: {
        model: 'approval'
      },
      currentStatus: {
        model: 'status'
      },
      currentCompletion: {
        model: 'completion'
      },
      currentCompletionStatus: {
        model: 'status'
      },
      approvalDate: {
        type: 'datetime'
      },
      statusName: {
        type: 'string'
      },
      completionStatusName: {
        type: 'string'
      },
      iconClass: {
        type: 'string'
      },
      rowClass: {
        type: 'string'
      },
      client: {
        model: 'client'
      },
      client_displayName: {
        type: 'string'
      },
      physician: {
        model: 'physician'
      },
      physician_displayName: {
        type: 'string'
      },
      toJSON: ServiceModel.attributes.toJSON
    }
  });

})();

