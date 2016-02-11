-- View: servicedetail
-- returns referral, altumservice, programservice, program, site, physician, and client info

-- DROP VIEW servicedetail;

CREATE OR REPLACE VIEW altum.servicedetail AS
  SELECT
    service.id,
    altumService."displayName" AS "displayName",
    service.referral,
    altumService.id AS "altumService",
    altumService.name AS "altumServiceName",
    programService.id AS "programService",
    programService.name AS "programServiceName",
    programService.program,
    program.name AS "programName",
    service.site,
    site.name AS "siteName",
    workstatus.name AS "workStatus",
    prognosis.name AS "prognosis",
    timeframe.name AS "prognosisTimeframe",
    service."serviceDate",
    servicetype.name AS "serviceType",
    service."approvalNeeded",
    referral.client,
    approval.id AS "currentApproval",
    approval.status AS "currentStatus",
    status.name AS "statusName",
    status."iconClass",
    status."rowClass",
    client."displayName" AS "client_displayName",
    service.physician,
    physician."displayName" AS "physician_displayName",
    service.clinician,
    clinician."displayName" AS "clinician_displayName",
    service.owner,
    service."createdAt",
    service."createdBy",
    service."deletedBy",
    service."updatedAt"
  FROM altum.service
    LEFT JOIN altum.altumservice ON service."altumService" = altumservice.id
    LEFT JOIN altum.programservice ON service."programService" = programservice.id
    LEFT JOIN altum.program ON program.id = programservice.program
    LEFT JOIN altum.site ON site.id = service.site
    LEFT JOIN altum.referral ON service.referral = referral.id
    LEFT JOIN altum.approval ON service."currentApproval" = approval.id
    LEFT JOIN altum.status ON approval.status = status.id
    LEFT JOIN altum.client ON referral.client = client.id
    LEFT JOIN altum.physician ON service.physician = physician.id
    LEFT JOIN altum.clinician ON service.clinician = clinician.id
    LEFT JOIN altum.workstatus ON service."workStatus" = workstatus.id
    LEFT JOIN altum.prognosis ON service.prognosis = prognosis.id
    LEFT JOIN altum.timeframe ON service."prognosisTimeframe" = timeframe.id
    LEFT JOIN altum.servicetype ON service."serviceType" = servicetype.id;
ALTER TABLE altum.referraldetail
OWNER TO postgres;
