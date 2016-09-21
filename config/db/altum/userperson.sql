-- View: userperson
-- returns a study's list of enrolled users; used in User.findByStudyName

-- DROP VIEW altum.userperson;

CREATE OR REPLACE VIEW altum.userperson AS
  SELECT "user".id,
    "user"."displayName" AS "displayName",
    "user".username,
    "user".email,
    "user"."userType",
    "user".group,
    "user".person,
    person.prefix,
    person."firstName",
    person."lastName",
    person.gender,
    person."dateOfBirth",
    "user"."owner",
    "user"."createdBy",
    "user"."createdAt",
    "user"."updatedAt"
   FROM "user"
     LEFT JOIN altum.person ON "user".person = person.id
  WHERE "user"."expiredAt" IS NULL;

ALTER TABLE altum.userperson
  OWNER TO postgres;
