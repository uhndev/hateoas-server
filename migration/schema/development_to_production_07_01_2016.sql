-- Database Migration Script between dev branch and prod
-- Created July 1st 2016

BEGIN;

alter table altum.referral add column "referralComments" text;
alter table altum.notetype rename "backGroundColor" to "backgroundColour"

COMMIT;
