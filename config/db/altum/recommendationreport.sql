-- View: altum.recommendationreport

-- DROP VIEW altum.recommendationreport;

CREATE OR REPLACE VIEW altum.recommendationreport AS
 SELECT client."displayName" AS "Client Name",
    client."MRN",
    referral."claimNumber",
    service."displayName" AS service,
    "user"."displayName" AS "User",
    referral."referralDate",
    servicesite."displayName" AS "Reccommended Service Site",
    referralsite.name AS "Referral Site",
    program."displayName" AS "Program",
    physician."displayName" AS "MD",
    staff."displayName" AS "Clinician",
    city."displayName" AS "City",
    payor."displayName" AS "Provider",
    status."displayName" AS "Status"
   FROM altum.service
     LEFT JOIN altum.physician ON service.physician = physician.id
     LEFT JOIN altum.service_staff__staff_services ON service.id = service_staff__staff_services.service_staff
     LEFT JOIN altum.staff ON staff.id = service_staff__staff_services.staff_services
     LEFT JOIN "user" ON service.owner = "user".id
     LEFT JOIN altum.referral ON service.referral = referral.id
     LEFT JOIN altum.client ON referral.client = client.id
     LEFT JOIN altum.site servicesite ON service.site = servicesite.id AND service.id = servicesite.id
     LEFT JOIN altum.site referralsite ON referral.site = referralsite.id
     LEFT JOIN altum.programservice ON service."programService" = programservice.id
     LEFT JOIN altum.program ON programservice.program = program.id
     LEFT JOIN altum.person ON client.person = person.id
     LEFT JOIN altum.address ON person.address = address.id
     LEFT JOIN altum.city ON address.city = city.id
     LEFT JOIN altum.payor ON programservice.payor = payor.id
     LEFT JOIN altum.approval ON service.id = approval.service
     LEFT JOIN altum.status ON approval.status = status.id;

ALTER TABLE altum.recommendationreport
  OWNER TO postgres;
