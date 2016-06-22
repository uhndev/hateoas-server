-- View: servicedetail
-- returns referral, altumservice, programservice, program, site, physician, and client info

-- DROP VIEW servicedetail;

CREATE OR REPLACE VIEW altum.servicedetail AS
  SELECT
    service.id,
    altumService."displayName",
    service.referral,
    referral.client,
    client."displayName" AS "client_displayName",
    altumservice.id AS "altumService",
    altumservice.name AS "altumServiceName",
    altumservice.visitable,
    programservice.id AS "programService",
    programservice.name AS "programServiceName",
    programservice.program,
    programservice.code AS "code",
    programservice.price AS "price",
    program.name AS "programName",
    program.payor AS "payor",
    payor.name AS "payorName",
    service.site,
    site.name AS "siteName",
    service."workStatus" AS "workStatus",
    workstatus.name AS "workStatusName",
    service.prognosis AS "prognosis",
    prognosis.name AS "prognosisName",
    service."prognosisTimeframe" AS "prognosisTimeframe",
    timeframe.name AS "prognosisTimeframeName",
    service."serviceDate",
    service."visitService",
    visitservice."displayName" AS "visitServiceName",
    service."approvalNeeded",
    approval.id AS "currentApproval",
    approval.status AS "currentStatus",
    completion.id AS "currentCompletion",
    completion.status AS "currentCompletionStatus",
    completion.physician AS "currentCompletionPhysician",
    completion_physician."displayName" AS "currentCompletionPhysicianName",
    completion.staff AS "currentCompletionStaff",
    completion_staff."displayName" AS "currentCompletionStaffName",
    billingstatus.id AS "currentBillingStatus",
    billingstatus.status AS "currentBillingStatusStatus",
    reportstatus.id AS "currentReportStatus",
    reportstatus.status AS "currentReportStatusStatus",
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
    service."numberDetailName",
    service."numberDetail",
    service."textDetailName",
    service."textDetail",
    service."dateDetailName",
    service."dateDetail",
    service."physicianDetailName",
    service."physicianDetail",
    service."staffDetailName",
    service."staffDetail",
    service."timeframeDetailName",
    service."timeframeDetail",
    service."measureDetailName",
    service."measureDetail",
    service.owner,
    service."createdAt",
    service."createdBy",
    service."deletedBy",
    service."updatedAt"
  FROM altum.service
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
    LEFT OUTER JOIN altum.billinggroup ON service."billingGroup" = billinggroup.id
    LEFT JOIN altum.service visitservice ON service."visitService" = visitservice.id
    LEFT JOIN altum.client ON referral.client = client.id
    LEFT JOIN altum.physician ON service.physician = physician.id
    LEFT JOIN altum.workstatus ON service."workStatus" = workstatus.id
    LEFT JOIN altum.prognosis ON service.prognosis = prognosis.id
    LEFT JOIN altum.timeframe ON service."prognosisTimeframe" = timeframe.id;
ALTER TABLE altum.referraldetail
OWNER TO postgres;
