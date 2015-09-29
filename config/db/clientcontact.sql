
CREATE OR REPLACE VIEW clientcontact AS
SELECT
	client.id,
	emergencyContacts."firstName" as "emergencyFirstName",
	emergencyContacts."lastName" as "emergencyLastName",
	emergencyContact.relationship as "emergencyRelationship",
	emergencyContacts."homePhone" as "emergencyHomePhone",
	emergencyContacts."workPhone" as "emergencyWorkPhone",
	emergencyContacts."cellPhone" as "emergencyCellPhone",
	client."MRN",
	contact.LANGUAGE,
	contact."requiresInterpreter",
	contact.occupation,
	contact."occupationType",
	contact."occupationSector",
	contact."familyDoctor",
	contact."createdAt",
	contact."updatedAt",
	contact."createdBy",
	contact."owner",
	contact."salutation",
	contact."firstName",
	contact."middleName",
	contact."lastName",
	contact."gender",
	contact."dateOfBirth",
	contactAddress."address1",
	contactAddress."address2",
	contactAddress."city",
	contactAddress."province",
	contactAddress."postalCode",
	contactAddress."region",
	contactAddress."country",
	contact."company",
	contact."title",
	contact."homePhone",
	contact."workPhone",
	contact."fax",
	contact."otherPhone",
	contact."homeEmail",
	contact."workEmail",
	contact."contactComments"

FROM client
	LEFT JOIN contact ON client.contact = contact. ID
	left join emergencyContact on emergencyContact.contact=contact.id
	left join contact emergencyContacts on emergencyContact."emergencyContact"=emergencyContacts.id
	left join address contactAddress on contact.address=contactAddress.id

