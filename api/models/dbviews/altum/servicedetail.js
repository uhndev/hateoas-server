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
        type: 'integer'
      },
      client: {
        type: 'integer'
      },
      client_displayName: {
        type: 'string'
      },
      altumService: {
        type: 'integer'
      },
      altumServiceName: {
        type: 'string'
      },
      visitable: {
        type: 'boolean'
      },
      programService: {
        type: 'integer'
      },
      programServiceName: {
        type: 'string'
      },
      program: {
        type: 'integer'
      },
      code: {
        type: 'string'
      },
      payorPrice: {
        type: 'float'
      },
      programName: {
        type: 'string'
      },
      payor: {
        type: 'integer'
      },
      payorName: {
        type: 'string'
      },
      site: {
        type: 'integer'
      },
      siteName: {
        type: 'string'
      },
      workStatus: {
        type: 'integer'
      },
      workStatusName: {
        type: 'string'
      },
      prognosis: {
        type: 'integer'
      },
      prognosisName: {
        type: 'string'
      },
      prognosisTimeframe: {
        type: 'integer'
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
        type: 'integer'
      },
      currentCompletion: {
        model: 'completion'
      },
      currentCompletionStatus: {
        type: 'integer'
      },
      currentCompletionPhysician: {
        type: 'integer'
      },
      currentCompletionPhysicianName: {
        type: 'string'
      },
      currentCompletionStaff: {
        type: 'integer'
      },
      currentCompletionStaffName: {
        type: 'string'
      },
      currentBillingStatus: {
        model: 'billingstatus'
      },
      currentBillingStatusStatus: {
        type: 'integer'
      },
      currentReportStatus: {
        model: 'reportstatus'
      },
      currentReportStatusStatus: {
        type: 'integer'
      },
      billingGroup: {
        type: 'integer'
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
      reportStatusName: {
        type: 'string'
      },
      iconClass: {
        type: 'string'
      },
      rowClass: {
        type: 'string'
      },
      physician: {
        type: 'integer'
      },
      physician_displayName: {
        type: 'string'
      },
      numberDetailName: {
        type: 'string'
      },
      numberDetail: {
        type: 'integer'
      },
      textDetailName: {
        type: 'string'
      },
      textDetail: {
        type: 'string'
      },
      dateDetailName: {
        type: 'string'
      },
      dateDetail: {
        type: 'date'
      },
      physicianDetailName: {
        type: 'string'
      },
      physicianDetail: {
        type: 'integer'
      },
      staffDetailName: {
        type: 'string'
      },
      staffDetail: {
        type: 'integer'
      },
      timeframeDetailName: {
        type: 'string'
      },
      timeframeDetail: {
        type: 'integer'
      },
      measureDetailName: {
        type: 'string'
      },
      measureDetail: {
        type: 'json'
      },
      toJSON: ServiceModel.attributes.toJSON
    }
  });

})();

