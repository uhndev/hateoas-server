CREATE OR REPLACE VIEW referraldetail AS
 SELECT referral.client,
    referral.program,
    referral.physician,
    status.name as status,
    referral.id,
    referral."referralDate",
    referral."createdAt",
    referral."updatedAt",
    person."firstName" as "client_firstName",
    client."MRN" as client_mrn,
    person."lastName" as "client_lastName",
    person.prefix as client_prefix,
    person.gender as client_gender,
    person."dateOfBirth" as "client_dateOfBirth",
    address.address1 as client_address1,
    address.address2 as client_address2,
    address.city as client_city,
    address.province as client_province,
    address."postalCode" as "client_postalCode",
    address.country as client_country,
    address.latitude as client_latitude,
    address.longitude as client_longitude,
    person."homePhone" as "client_homePhone",
    person."workPhone" as "client_workPhone",
    person."familyDoctor" as "client_familyDoctor",
    person.language as client_language,
    claim."claimNum" as "claim_claimNum",
    claim."policyNum" as "claim_policyNum",
    referral.owner,
    physician.name as "physician_name",
    referral."createdBy"

   FROM referral
        left join claim on referral.claim=claim.id
        left join client on referral.client=client.id
        left join person on client.person=person.id
        left join address on address.person=person.id
        left join status on referral.status=status.id
        left join physician on referral.physician=physician.id;
