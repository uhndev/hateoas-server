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
      displayName: {
        type: 'string'
      },
      referral: {
        model: 'referral'
      },
      client: {
        model: 'client'
      },
      client_displayName: {
        type: 'string'
      },
      altumService: {
        model: 'altumservice'
      },
      altumServiceName: {
        type: 'string'
      },
      visitable: {
        type: 'boolean'
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
      code: {
        type: 'string'
      },
      price: {
        type: 'integer'
      },
      programName: {
        type: 'string'
      },
      payor: {
        model: 'payor'
      },
      payorName: {
        type: 'string'
      },
      site: {
        model: 'site'
      },
      siteName: {
        type: 'string'
      },
      workStatus: {
        model: 'workstatus'
      },
      workStatusName: {
        type: 'string'
      },
      prognosis: {
        model: 'prognosis'
      },
      prognosisName: {
        type: 'string'
      },
      prognosisTimeframe: {
        model: 'timeframe'
      },
      prognosisTimeframeName: {
        type: 'string'
      },
      serviceDate: {
        type: 'datetime'
      },
      visitService: {
        model: 'service'
      },
      visitServiceName: {
        type: 'string'
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
      currentBillingStatus: {
        model: 'billingstatus'
      },
      currentBillingStatusStatus: {
        model: 'status'
      },
      billingGroup: {
        model: 'billinggroup'
      },
      billingGroupName: {
        type: 'string'
      },
      billingGroupItemLabel: {
        type: 'string'
      },
      itemCount: {
        type: 'integer'
      },
      totalItems: {
        type: 'integer'
      },
      billingCount: {
        type: 'string'
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
      billingStatusName: {
        type: 'string'
      },
      iconClass: {
        type: 'string'
      },
      rowClass: {
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

