-- View: services
-- returns service, client, physician and program data

-- DROP VIEW services;

CREATE OR REPLACE VIEW services AS
  SELECT
    service.id,
    service.approved,
    clientPerson."firstName" AS "client_firstName",
    clientPerson."lastName" AS "client_lastName",
    physicianPerson."firstName" AS "physician_firstName",
    physicianPerson."lastName" AS "physician_lastName",
    physicianPerson.title AS "physician_title",
    programService.name AS "programService_name",
    altumService.name AS "altumService_name",
    service.owner,
    service."createdAt",
    service."createdBy",
    service."deletedBy",
    service."updatedAt"
  FROM service
    LEFT JOIN programService ON service."programService" = programservice.id
    LEFT JOIN altumService ON programService."altumService" = altumService.id
    LEFT JOIN referral ON service.referral = referral.id
    LEFT JOIN client ON referral.client = client.id
    LEFT JOIN person clientPerson ON client.person = clientPerson.id
    LEFT JOIN physician ON referral.physician = physician.id
    LEFT JOIN person physicianPerson ON physician.person = physicianPerson.id;
ALTER TABLE services
OWNER TO postgres;
