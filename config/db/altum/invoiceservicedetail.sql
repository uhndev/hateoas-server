-- View: invoiceservicedetail
-- returns invoice, referral, altumservice, programservice, program, site, physician, and client info

-- DROP VIEW altum.invoiceservicedetail;

CREATE OR REPLACE VIEW altum.invoiceservicedetail AS
  SELECT
      service.id,
      invoice.id AS "invoice",
      invoice.number AS "invoiceNumber",
      altumservice."displayName",
      service.referral,
      referral.client,
      client."displayName" AS "client_displayName",
      altumservice.id AS "altumService",
      altumservice.name AS "altumServiceName",
      altumservice.visitable,
      programservice.id AS "programService",
      programservice.name AS "programServiceName",
      programservice.program,
      programservice.code,
      service."payorPrice",
      program.name AS "programName",
      program.payor,
      payor.name AS "payorName",
      service.site,
      site.name AS "siteName",
      service."serviceDate",
      service."visitService",
      service."approvalNeeded",
      approval.id AS "currentApproval",
      approval.status AS "currentStatus",
      status.visitable AS "approvalVisitable",
      completion.id AS "currentCompletion",
      completion."completionDate",
      completion."additionalData" ->> 'timeIn'::text AS "currentCompletionTimeIn",
      completion."additionalData" ->> 'timeOut'::text AS "currentCompletionTimeOut",
      completion.status AS "currentCompletionStatus",
      completion_status.visitable AS "completionVisitable",
      completion.physician AS "currentCompletionPhysician",
      completion_physician."displayName" AS "currentCompletionPhysicianName",
      completion.staff AS "currentCompletionStaff",
      completion_staff."displayName" AS "currentCompletionStaffName",
      billingstatus.id AS "currentBillingStatus",
      billingstatus.status AS "currentBillingStatusStatus",
      billing_status.visitable AS "billingStatusVisitable",
      reportstatus.id AS "currentReportStatus",
      reportstatus.status AS "currentReportStatusStatus",
      report_status.visitable AS "reportStatusVisitable",
      service."billingGroup",
      billinggroup."billingGroupName",
      service."billingGroupItemLabel",
      service."itemCount",
      billinggroup."totalItems",
      concat_ws('/'::text, service."itemCount", billinggroup."totalItems") AS "billingCount",
      approval."createdAt" AS "approvalDate",
      status.name AS "statusName",
      completion_status.name AS "completionStatusName",
      billing_status.name AS "billingStatusName",
      report_status.name AS "reportStatusName",
      status."iconClass",
      status."rowClass",
      service.physician,
      physician."displayName" AS "physician_displayName",
      service.owner,
      service."createdAt",
      service."createdBy",
      service."deletedBy",
      service."updatedAt"
     FROM altum.invoiceservice
       LEFT JOIN altum.invoice ON invoice.id = invoiceservice.invoice
       LEFT JOIN altum.service ON service.id = invoiceservice.service
       LEFT JOIN altum.altumservice ON service."altumService" = altumservice.id
       LEFT JOIN altum.programservice ON service."programService" = programservice.id
       LEFT JOIN altum.program ON program.id = programservice.program
       LEFT JOIN altum.payor ON payor.id = program.payor
       LEFT JOIN altum.site ON site.id = service.site
       LEFT JOIN altum.referral ON service.referral = referral.id
       LEFT JOIN altum.approval ON service."currentApproval" = approval.id
       LEFT JOIN altum.status ON approval.status = status.id
       LEFT JOIN altum.completion ON service."currentCompletion" = completion.id
       LEFT JOIN altum.physician completion_physician ON completion.physician = completion_physician.id
       LEFT JOIN altum.staff completion_staff ON completion.staff = completion_staff.id
       LEFT JOIN altum.status completion_status ON completion.status = completion_status.id
       LEFT JOIN altum.billingstatus ON service."currentBillingStatus" = billingstatus.id
       LEFT JOIN altum.status billing_status ON billingstatus.status = billing_status.id
       LEFT JOIN altum.reportstatus ON service."currentReportStatus" = reportstatus.id
       LEFT JOIN altum.status report_status ON reportstatus.status = report_status.id
       LEFT JOIN altum.billinggroup ON service."billingGroup" = billinggroup.id
       LEFT JOIN altum.client ON referral.client = client.id
       LEFT JOIN altum.physician ON service.physician = physician.id
     WHERE invoiceservice."expiredAt" IS NULL AND invoice."expiredAt" IS NULL;
ALTER TABLE altum.invoiceservicedetail
OWNER TO postgres;
