-- Database Migration Script between dev branch and prod
-- Created July 1st 2016

BEGIN;

-- Alter date to timestamp on Completion table
alter table altum.completion alter column "completionDate" type timestamp with time zone using "completionDate"::timestamp with time zone;

-- Alter dates to timestamps on BillingStatus table
alter table altum.billingstatus alter column "paidDate" type timestamp with time zone using "paidDate"::timestamp with time zone;
alter table altum.billingstatus alter column "deniedDate" type timestamp with time zone using "deniedDate"::timestamp with time zone;
alter table altum.billingstatus alter column "rejectedDate" type timestamp with time zone using "rejectedDate"::timestamp with time zone;

COMMIT;
