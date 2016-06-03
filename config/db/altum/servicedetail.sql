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
    service."approvalNeeded",
    approval.id AS "currentApproval",
    approval.status AS "currentStatus",
    completion.id AS "currentCompletion",
    completion.status AS "currentCompletionStatus",
    billingstatus.id AS "currentBillingStatus",
    billingstatus.status AS "currentBillingStatusStatus",
    approval."createdAt" AS "approvalDate",
    status.name AS "statusName",
    completion_status.name AS "completionStatusName",
    billing_status.name AS "billingStatusName",
    status."iconClass",
    status."rowClass",
    service.physician,
    physician."displayName" AS "physician_displayName",
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
    LEFT JOIN altum.status completion_status ON completion.status = completion_status.id
    LEFT JOIN altum.billingstatus ON service."currentBillingStatus" = billingstatus.id
    LEFT JOIN altum.status billing_status ON billingstatus.status = billing_status.id
    LEFT JOIN altum.client ON referral.client = client.id
    LEFT JOIN altum.physician ON service.physician = physician.id
    LEFT JOIN altum.workstatus ON service."workStatus" = workstatus.id
    LEFT JOIN altum.prognosis ON service.prognosis = prognosis.id
    LEFT JOIN altum.timeframe ON service."prognosisTimeframe" = timeframe.id;
ALTER TABLE altum.referraldetail
OWNER TO postgres;
