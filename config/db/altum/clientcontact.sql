-- View: clientcontact
-- returns client and person data

-- DROP VIEW altum.clientcontact;
CREATE OR REPLACE VIEW altum.clientcontact AS
  SELECT
    client.id,
    client."MRN",
    person.ID AS "personId",
    client."displayName",
    person."firstName",
    person."middleName",
    person."lastName",
    person."gender",
    person."dateOfBirth",
    person."homePhone",
    person."daytimePhone",
    person."fax",
    person."otherPhone",
    person."homeEmail",
    person."language",
    person."requiresInterpreter",
    person."familyDoctor",
    person."primaryEmergencyContact",
    person."personComments",
    address.id AS "address",
    address."address1",
    address."address2",
    city.id AS cityId,
    city.name AS "city",
    address."province",
    address."postalCode",
    address."region",
    address."country",
    address.latitude,
    address.longitude,
    client."owner",
    client."createdBy",
    client."createdAt",
    client."updatedAt"
  FROM altum.client
    LEFT JOIN altum.person ON (client.person = person.ID)
    LEFT JOIN altum.address ON (person.address = address.id)
    LEFT JOIN altum.city ON (address.city = city.id);
ALTER TABLE altum.clientcontact
OWNER TO postgres;
