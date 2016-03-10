-- View: referraldetail
-- returns referral, program, client, site, physician data

-- DROP VIEW referraldetail;

CREATE OR REPLACE VIEW altum.referraldetail AS
 SELECT
    referral.id,
    client."displayName" AS "displayName",
    referral.program,
    program.name AS "program_name",
    referral.physician,
    physician."displayName" AS "physician_name",
    referral.staff,
    staff."displayName" AS "staff_name",
    referral.site,
    site."displayName" AS "site_name",
    status.id AS status,
    status.name AS "statusName",
    referral."referralDate",
    referral."clinicDate",
    referral."accidentDate",
    referral."receiveDate",
    referral."sentDate",
    referral."dischargeDate",
    referral."recommendationsMade",
    referral.client,
    client."MRN" AS client_mrn,
    client."displayName" AS "client_displayName",
    person."firstName" AS "client_firstName",
    person."lastName" AS "client_lastName",
    person.prefix AS client_prefix,
    person.gender AS client_gender,
    person."dateOfBirth" AS "client_dateOfBirth",
    address.address1 AS client_address1,
    address.address2 AS client_address2,
    address.city AS client_city,
    address.province AS client_province,
    address."postalCode" AS "client_postalCode",
    address.country AS client_country,
    address.latitude AS client_latitude,
    address.longitude AS client_longitude,
    person."homePhone" AS "client_homePhone",
    person."workPhone" AS "client_workPhone",
    person."familyDoctor" AS "client_familyDoctor",
    person.language AS client_language,
    claim.id AS claim,
    claim."claimNum" AS "claim_claimNum",
    claim."policyNum" AS "claim_policyNum",
    referral.owner,
    referral."createdBy",
    referral."createdAt",
    referral."updatedAt"
FROM altum.referral
  LEFT JOIN altum.claim ON referral.claim = claim.id
  LEFT JOIN altum.client ON referral.client = client.id
  LEFT JOIN altum.person ON client.person = person.id
  LEFT JOIN altum.address ON person.address = address.id
  LEFT JOIN altum.status ON referral.status = status.id
  LEFT JOIN altum.physician ON referral.physician = physician.id
  LEFT JOIN altum.staff ON referral.staff = staff.id
  LEFT JOIN altum.site ON referral.site = site.id
  LEFT JOIN altum.program ON referral.program = program.id;
ALTER TABLE altum.referraldetail
OWNER TO postgres;
