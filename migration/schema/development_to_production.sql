-- Database Migration Script between dev branch and prod
-- Updated Aug 25th 2016

BEGIN;

  alter table altum.invoice add column "number" text;
  alter table altum.invoice add column "referral" integer;
  alter table altum.invoice add column "comments" text;
  alter table altum.invoice add column "status" text default 'Pending';

  alter table altum.referral add column "readyToProcess" boolean default FALSE;

  alter table altum.invoice add column "expiredAt" timestamp with time zone;
  alter table altum.invoiceservice add column "expiredAt" timestamp with time zone;

  ALTER TABLE altum.program ADD COLUMN "costCenter" text;

  alter table altum.statusform add column "altumservice" integer;

COMMIT;
