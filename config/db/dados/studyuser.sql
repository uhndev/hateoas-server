-- View: studyuser
-- returns a study's list of enrolled users; used in User.findByStudyName

-- DROP VIEW studyuser;

CREATE OR REPLACE VIEW studyuser AS
  SELECT "user".id,
    userenrollment.id AS "userenrollment",
    (SELECT ARRAY(SELECT userenrollment.id
     FROM userenrollment
     WHERE userenrollment."collectionCentre" = collectioncentre.id
     AND userenrollment."expiredAt" IS NULL)) AS "userEnrollments",
    "user"."displayName" AS "displayName",
    "user".username,
    "user".email,
    "user".prefix,
    "user".firstname,
    "user".lastname,
    "user".gender,
    "user".dob,
    study.id AS study,
    study.name AS "studyName",
    userenrollment."collectionCentre",
    collectioncentre.name AS "collectionCentreName",
    userenrollment."centreAccess",
    userenrollment."owner",
    userenrollment."createdBy",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE studyuser
  OWNER TO postgres;
