-- Database Migration Script between dev branch and prod
-- Created July 20th 2016

BEGIN;

  alter table "user" add column "expiredPassword" boolean default true;

  CREATE TABLE altum.labeltype
  (
    "deletedBy" integer,
    "displayName" text,
    id serial NOT NULL,
    name text,
    "ZPL" text,
    "createdBy" integer,
    owner integer,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    CONSTRAINT labeltype_pkey PRIMARY KEY (id)
  )
  WITH (OIDS=FALSE);
  ALTER TABLE altum.labeltype OWNER TO postgres;
  CREATE INDEX "labeltype_createdBy" ON altum.labeltype USING btree ("createdBy");
  CREATE INDEX labeltype_id ON altum.labeltype USING btree (id);
  CREATE INDEX labeltype_owner ON altum.labeltype USING btree (owner);

  update altum.status set category = 'billingstatus' where category = 'billing';
  update altum.status set category = 'reportstatus' where category = 'report';

  -- update altum.status rules to new categories
  -- update any service presets

COMMIT;
