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
    stafftype."displayName" AS "staffType_name",
    referral.site,
    site."displayName" AS "site_name",
    status.id AS status,
    status.name AS "statusName",
    program.payor,
    payor."displayName" AS "payor_displayName",
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
    address.id AS "client_address",
    address.address1 AS client_address1,
    address.address2 AS client_address2,
    city.name AS "client_cityName",
    address.city AS client_city,
    address.province AS client_province,
    address."postalCode" AS "client_postalCode",
    address.country AS client_country,
    address.latitude AS client_latitude,
    address.longitude AS client_longitude,
    person."homePhone" AS "client_homePhone",
    person."daytimePhone" AS "client_daytimePhone",
    person."familyDoctor" AS "client_familyDoctor",
    person.language AS client_language,
    person."requiresInterpreter" AS "client_interpreter",
    "claimNumber",
    "policyNumber",
    referral.owner,
    referral."createdBy",
    referral."createdAt",
    referral."updatedAt",
    referral."referralComments"
FROM altum.referral
  LEFT JOIN altum.client ON referral.client = client.id
  LEFT JOIN altum.person ON client.person = person.id
  LEFT JOIN altum.address ON person.address = address.id
  LEFT JOIN altum.city ON address.city = city.id
  LEFT JOIN altum.status ON referral.status = status.id
  LEFT JOIN altum.physician ON referral.physician = physician.id
  LEFT JOIN altum.staff ON referral.staff = staff.id
  LEFT JOIN altum.stafftype ON staff."staffType" = stafftype.id
  LEFT JOIN altum.site ON referral.site = site.id
  LEFT JOIN altum.program ON referral.program = program.id
  LEFT JOIN altum.payor ON program.payor = payor.id;
ALTER TABLE altum.referraldetail
OWNER TO postgres;
