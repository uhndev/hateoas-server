-- View: referraldetail
-- returns referral, program, client, site, physician data

-- DROP VIEW referraldetail;

CREATE OR REPLACE VIEW referraldetail AS
 SELECT
    referral.id,
    client."displayName" AS "displayName",
    referral.program,
    program.name AS "program_name",
    referral.physician,
    physician."displayName" AS "physician_name",
    referral.site,
    site."displayName" AS "site_name",
    status.name AS status,
    referral."referralDate",
    referral."accidentDate",
    referral."receiveDate",
    referral."sentDate",
    referral."dischargeDate",
    referral."recommendationsMade",
    referral.client,
    client."MRN" AS client_mrn,
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
    claim."claimNum" AS "claim_claimNum",
    claim."policyNum" AS "claim_policyNum",
    referral.owner,
    referral."createdBy",
    referral."createdAt",
    referral."updatedAt"
FROM referral
  LEFT JOIN claim ON referral.claim = claim.id
  LEFT JOIN client ON referral.client = client.id
  LEFT JOIN person ON client.person = person.id
  LEFT JOIN address ON address.person = person.id
  LEFT JOIN status ON referral.status = status.id
  LEFT JOIN physician ON referral.physician = physician.id
  LEFT JOIN site ON referral.site = site.id
  LEFT JOIN program ON referral.program = program.id;
ALTER TABLE referraldetail
OWNER TO postgres;
