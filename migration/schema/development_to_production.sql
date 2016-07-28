-- Database Migration Script between dev branch and prod
-- Created July 20th 2016

BEGIN;

-- Table: altum.employee_referrals__referral_referralcontacts

-- DROP TABLE altum.employee_referrals__referral_referralcontacts;

CREATE TABLE altum.employee_referrals__referral_referralcontacts
(
  id serial NOT NULL,
  employee_referrals integer,
  "referral_referralContacts" integer,
  CONSTRAINT employee_referrals__referral_referralcontacts_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE altum.employee_referrals__referral_referralcontacts
  OWNER TO postgres;

ALTER TABLE altum.employee drop COLUMN referral;
COMMIT;
