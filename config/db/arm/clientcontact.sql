
CREATE OR REPLACE VIEW clientcontact AS
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
	address."city",
	address."province",
	address."postalCode",
	address."region",
	address."company",
	address."country",
	client."owner",
	client."createdBy",
	client."createdAt",
	client."updatedAt"
FROM
	(
		client
		LEFT JOIN person ON
			(client.person = person.ID)
		LEFT JOIN address on (person.id = address.person)

	);

