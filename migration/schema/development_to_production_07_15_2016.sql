-- Database Migration Script between dev branch and prod
-- Created July 15th 2016

BEGIN;

-- Update User table with Staff people
update "user" set person = subquery.staffperson from (select
	staff.id,
	staff.person staffperson,
	"user".id "userID",
	person."displayName",
	person."firstName",
	person."lastName",
	"user".firstname,
	"user".lastname,
	"user".person
from altum.staff
	left join altum.person on person.id = staff.person
	left join "user" on
		"user".firstname like person."firstName" and
		"user".lastname like person."lastName") as subquery
where "user".id = subquery."userID" and
	"user".firstname like subquery."firstName" and
	"user".lastname like subquery."lastName";

-- Update User table with Physician people
update "user" set person = subquery."personID" from (select
	physician.id,
	person.id "personID",
	"user".id "userID",
	person."displayName",
	person."firstName",
	person."lastName",
	"user"."displayName",
	"user".firstname,
	"user".lastname,
	"user".person
from altum.physician
	left join altum.person on person.id = physician.person
	left join "user" on
		"user".firstname like person."firstName" and
		"user".lastname like person."lastName") as subquery
where "user".id = subquery."userID";

-- Create Persons for Users who don't have Person and update User table with newly created Persons in
insert into altum.person ("displayName", "firstName", "lastName", "prefix", "gender", "dateOfBirth")
select "displayName", firstname, lastname, prefix, gender, dob from "user" where person is null;

update "user" set person = subquery.id from (select id, "firstName", "lastName" from altum.person) as subquery
where subquery."firstName" = "user".firstname and
	subquery."lastName" = "user".lastname and
	"user".person is null;

-- Remove columns from User table
DO $$DECLARE r record;
BEGIN
  FOR r IN SELECT schemaname, viewname
    FROM pg_catalog.pg_views
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY schemaname, viewname
  LOOP
    EXECUTE 'DROP VIEW IF EXISTS ' || r.schemaname || '.' || r.viewname || ';';
  END LOOP;
END$$;
alter table "user" drop prefix, drop firstname, drop lastname, drop gender, drop dob;

COMMIT;
