-- View: altum.referralediparentmapping

-- DROP VIEW altum.referralediparentmapping;

CREATE OR REPLACE VIEW altum.referralediparentmapping AS
 SELECT referral.id,
    referral."createdAt",
    referral."updatedAt"
   FROM altum.referral;

ALTER TABLE altum.referralediparentmapping
  OWNER TO postgres;

