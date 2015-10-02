CREATE OR REPLACE VIEW referraldetail AS
 SELECT referral.client,
    referral.program,
    referral.physician,
    status.name as status,
    referral.id,
    referral."referralDate",
    referral."createdAt",
    referral."updatedAt",
    contact."firstName" as "client_firstName",
    client."MRN" as client_mrn,
    contact."lastName" as "client_lastName",
    contact.prefix as client_prefix,
    contact.gender as client_gender,
    contact."dateOfBirth" as "client_dateOfBirth",
    address.address1 as client_address1,
    address.address2 as client_address2,
    address.city as client_city,
    address.province as client_province,
    address."postalCode" as "client_postalCode",
    address.country as client_country,
    address.latitude as client_latitude,
    address.longitude as client_longitude,
    contact."homePhone" as "client_homePhone",
    contact."workPhone" as "client_workPhone",
    contact."familyDoctor" as "client_familyDoctor",
    contact.language as client_language,
    claim."claimNum" as "claim_claimNum",
    claim."policyNum" as "claim_policyNum",
    referral.owner,
    referral."createdBy"

   FROM referral
        left join claim on referral.claim=claim.id
        left join client on referral.client=client.id
        left join contact on client.contact=contact.id
        left join address on contact.address=address.id
        left join status on referral.status=status.id;
