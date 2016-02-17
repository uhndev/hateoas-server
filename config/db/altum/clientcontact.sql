-- View: clientcontact
-- returns client and person data

-- DROP VIEW clientcontact;
CREATE OR REPLACE VIEW altum.clientcontact AS
  SELECT
    client.id,
    client."MRN",
    person."displayName",
    person."firstName",
    person."middleName",
    person."lastName",
    person."gender",
    person."dateOfBirth",
    person."homePhone",
    person."workPhone",
    person."fax",
    person."otherPhone",
    person."homeEmail",
    person."workEmail",
    person."language",
    person."requiresInterpreter",
    address."address1",
    address."address2",
    city.name AS "city",
    address."province",
    address."postalCode",
    address."region",
    address."company",
    address."country",
    address.latitude,
    address.longitude,
    client."owner",
    client."createdBy",
    client."createdAt",
    client."updatedAt"
  FROM altum.client
    LEFT JOIN altum.person ON (client.person = person.ID)
    LEFT JOIN altum.address on (person.id = address.person)
    LEFT JOIN altum.city on (address.city = city.id);
ALTER TABLE altum.clientcontact
OWNER TO postgres;
