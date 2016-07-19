-- View: altum.referralparentmapping

-- DROP VIEW altum.referralparentmapping;

CREATE OR REPLACE VIEW altum.referralparentmapping AS
 SELECT referral.id,
    referral."createdAt",
    referral."updatedAt"
   FROM altum.referral;

ALTER TABLE altum.referralparentmapping
  OWNER TO postgres;

