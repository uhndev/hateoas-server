-- Database Migration Script between dev branch @d99c533f517 and prod @f99da8e5749
-- Created June 5th 2016

BEGIN;

-- Add serviceVariation, hasTelemedicine column to AltumService
alter table altum.altumservice
add column "serviceVariation" integer,
add column "hasTelemedicine" boolean default false;

-- Add repeatable boolean flag to ProgramService
alter table altum.programservice
add column "repeatable" boolean default false;

-- Add additional statuses and variations to Service
alter table altum.service
add column "currentCompletion" integer,
add column "currentBillingStatus" integer,
add column "telemedicine" boolean default false,
add column "billingGroup" integer,
add column "billingGroupItemLabel" text,
add column "itemCount" integer,
add column "numberDetail" integer,
add column "numberDetailName" text,
add column "textDetail" text,
add column "textDetailName" text,
add column "dateDetail" date,
add column "dateDetailName" text,
add column "physicianDetail" integer,
add column "physicianDetailName" text,
add column "staffDetail" integer,
add column "staffDetailName" text,
add column "followupPhysicianDetail" integer,
add column "followupTimeframeDetail" integer,
add column "timeframeDetail" integer,
add column "timeframeDetailName" text,
add column "measureDetail" json,
add column "measureDetailName" text;

-- Add additional rules, overrideForm to Status
alter table altum.status
add column "rules" JSON,
add column "overrideForm" integer;

-- Add in new statuses for completion and billing status
update altum.status set "rules" = '{"requires":{"approval":["externalID"]}}'::JSON where name = 'Approved';
insert into altum.status ("createdBy", "owner", "createdAt", "updatedAt", "displayName", "name", "category", "iconClass", "rowClass", "requiresConfirmation", "rules") values
(1, 1, NOW(), NOW(), 'Incomplete', 'Incomplete', 'completion', 'fa-exclamation-circle', 'warning', FALSE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'No Show', 'No Show', 'completion', 'fa-question-circle', 'info', FALSE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'Cancellation', 'Cancellation', 'completion', 'fa-ban', 'danger', TRUE, '{"requires":{"completion":["cancellationDate"]}}'::JSON),
(1, 1, NOW(), NOW(), 'Completed', 'Completed', 'completion', 'fa-check-circle', 'success', TRUE, '{"requires":{"completion":["completionDate"]}}'::JSON),
(1, 1, NOW(), NOW(), 'Service Complete/Pre-Paid', 'Service Complete/Pre-Paid', 'billing', 'fa-check-circle', 'info', TRUE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'Suspended', 'Suspended', 'billing', 'fa-exclamation-circle', 'warning', FALSE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'Ready To Send To Payor', 'Ready To Send To Payor', 'billing', 'fa-share', 'info', FALSE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'Issued To Payor', 'Issued To Payor', 'billing', 'fa-reply', 'info', FALSE, '{"requires":{}}'::JSON),
(1, 1, NOW(), NOW(), 'Paid', 'Paid', 'billing', 'fa-check-circle', 'success', TRUE, '{"requires":{"billing":["paidDate"]}}'::JSON),
(1, 1, NOW(), NOW(), 'Payor Denied', 'Payor Denied', 'billing', 'fa-ban', 'danger', TRUE, '{"requires":{"billing":["deniedDate"]}}'::JSON),
(1, 1, NOW(), NOW(), 'Rejected', 'Rejected', 'billing', 'fa-times', 'danger', TRUE, '{"requires":{"billing":["rejectedDate"]}}'::JSON);

-- Create ServiceVariation Table
CREATE TABLE altum.servicevariation
(
  "deletedBy" integer,
  "displayName" text,
  id serial NOT NULL,
  name text,
  variations json,
  "createdBy" integer,
  owner integer,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  CONSTRAINT servicevariation_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE altum.servicevariation OWNER TO postgres;
CREATE INDEX "servicevariation_createdBy" ON altum.servicevariation USING btree ("createdBy");
CREATE INDEX servicevariation_id ON altum.servicevariation USING btree (id);
CREATE INDEX servicevariation_owner ON altum.servicevariation USING btree (owner);

-- Create BillingGroup Table
CREATE TABLE altum.billinggroup
(
  "deletedBy" integer,
  "displayName" text,
  id serial NOT NULL,
  name text,
  "billingGroupName" text,
  "templateService" integer,
  "totalItems" integer,
  "createdBy" integer,
  owner integer,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  CONSTRAINT billinggroup_pkey PRIMARY KEY (id)
)
WITH (OIDS=FALSE);
ALTER TABLE altum.billinggroup OWNER TO postgres;
CREATE INDEX "billinggroup_createdBy" ON altum.billinggroup USING btree ("createdBy");
CREATE INDEX billinggroup_id ON altum.billinggroup USING btree (id);
CREATE INDEX billinggroup_owner ON altum.billinggroup USING btree (owner);

-- Create BillingStatus Table
CREATE TABLE altum.billingstatus
(
  "deletedBy" integer,
  "displayName" text,
  id serial NOT NULL,
  approver integer,
  status integer,
  "paidDate" date,
  "deniedDate" date,
  "rejectedDate" date,
  service integer,
  "createdBy" integer,
  owner integer,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  CONSTRAINT billingstatus_pkey PRIMARY KEY (id)
)
WITH (OIDS=FALSE);
ALTER TABLE altum.billingstatus OWNER TO postgres;
CREATE INDEX "billingstatus_createdBy" ON altum.billingstatus USING btree ("createdBy");
CREATE INDEX billingstatus_id ON altum.billingstatus USING btree (id);
CREATE INDEX billingstatus_owner ON altum.billingstatus USING btree (owner);

-- Create Completion Table
CREATE TABLE altum.completion
(
  "deletedBy" integer,
  "displayName" text,
  id serial NOT NULL,
  approver integer,
  status integer,
  "cancellationDate" date,
  "completionDate" date,
  service integer,
  "createdBy" integer,
  owner integer,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  CONSTRAINT completion_pkey PRIMARY KEY (id)
)
WITH (OIDS=FALSE);
ALTER TABLE altum.completion OWNER TO postgres;
CREATE INDEX "completion_createdBy" ON altum.completion USING btree ("createdBy");
CREATE INDEX completion_id ON altum.completion USING btree (id);
CREATE INDEX completion_owner ON altum.completion USING btree (owner);

-- Add in starting completion statuses for previous services
insert into altum.completion ("createdBy", "owner", "createdAt", "updatedAt", "displayName", "status", "service")
select 1, 1, NOW(), NOW(), 'Incomplete', (select status.id from altum.status where name = 'Incomplete'), service.id from altum.service;
update altum.service set "currentCompletion" = curr_completion.id from (select * from altum.completion) curr_completion where service.id = curr_completion.service;

-- Add in starting billing statuses for previous services
insert into altum.billingstatus ("createdBy", "owner", "createdAt", "updatedAt", "displayName", "status", "service")
select 1, 1, NOW(), NOW(), 'Suspended', (select status.id from altum.status where name = 'Suspended'), service.id from altum.service;
update altum.service set "currentBillingStatus" = curr_billingstatus.id from (select * from altum.billingstatus) curr_billingstatus where service.id = curr_billingstatus.service;

-- Create BillingGroups for previous services
insert into altum.billinggroup ("createdBy", "owner", "createdAt", "updatedAt", "displayName", "billingGroupName", "name", "templateService", "totalItems")
select 1, 1, NOW(), NOW(), service."displayName", service."displayName", service."displayName" || ' Billing Group', service.id, 1 from altum.service;
update altum.service set "billingGroup" = bg.id, "itemCount" = 1, "billingGroupItemLabel" = bg.name || ' 1' from (select * from altum.billinggroup) bg where service.id = bg."templateService";

COMMIT;