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

  ALTER TABLE altum.invoice DROP COLUMN "number";
  ALTER TABLE altum.invoice ADD COLUMN "number" integer;
  UPDATE altum.invoice SET "number" = 0 WHERE "number" IS NULL;
  ALTER TABLE altum.invoice ALTER COLUMN "number" SET NOT NULL;
  CREATE SEQUENCE altum.invoice_number_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
  ALTER TABLE altum.invoice_number_seq OWNER TO postgres;
  ALTER TABLE altum.invoice ALTER COLUMN "number" SET DEFAULT nextval('altum.invoice_number_seq'::regclass);

COMMIT;
