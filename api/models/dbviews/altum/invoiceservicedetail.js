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
      invoice: {
        type: 'integer'
      },
      invoiceNumber: {
        type: 'string'
      },
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
        type: 'integer'
      },
      approvalVisitable: {
        type: 'boolean'
      },
      currentCompletion: {
        model: 'completion'
      },
      completionDate: {
        type: 'date'
      },
      currentCompletionTimeIn: {
        type: 'datetime'
      },
      currentCompletionTimeOut: {
        type: 'datetime'
      },
      currentCompletionStatus: {
        type: 'integer'
      },
      completionVisitable: {
        type: 'boolean'
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
      billingStatusVisitable: {
        type: 'boolean'
      },
      currentReportStatus: {
        model: 'reportstatus'
      },
      currentReportStatusStatus: {
        type: 'integer'
      },
      reportStatusVisitable: {
        type: 'boolean'
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
      toJSON: ServiceModel.attributes.toJSON
    }
  });

})();

