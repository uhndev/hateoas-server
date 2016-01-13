
CREATE OR REPLACE VIEW clientcontact AS
SELECT
	client.id,
	client."MRN",
	client."createdAt",
	client."updatedAt",
	client."owner",
	client."createdBy",
	person."language",
	person."requiresInterpreter",
	person."salutation",
	person."firstName",
	person."middleName",
	person."lastName",
	person."gender",
	person."dateOfBirth",
	address."address1",
	address."address2",
	address."city",
	address."province",
	address."postalCode",
	address."region",
	address."company",
	address."country",
	person."homePhone",
	person."workPhone",
	person."fax",
	person."otherPhone",
	person."homeEmail",
	person."workEmail",
	person."displayName"

FROM
	(
		client
		LEFT JOIN person ON
			(client.person = person.ID)
		LEFT JOIN address on (person.id = address.person)

	);

