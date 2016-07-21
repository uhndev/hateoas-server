-- Database Migration Script between dev branch and prod
-- Created July 20th 2016

BEGIN;

alter table altum.employee add column "referral" integer;

COMMIT;
