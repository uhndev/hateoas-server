-- Database Migration Script between dev branch and prod
-- Updated Aug 25th 2016

BEGIN;

  alter table altum.invoice add column "number" text;
  alter table altum.invoice add column "referral" integer;
  alter table altum.invoice add column "status" text default 'Pending';

  alter table altum.referral add column "readyToProcess" boolean default FALSE;

COMMIT;
