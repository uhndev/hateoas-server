-- View: studyuser
-- returns a study's list of enrolled users; used in User.findByStudyName

-- DROP VIEW studyuser;

CREATE OR REPLACE VIEW dados.studyuser AS
  SELECT "user".id,
    userenrollment.id AS "userenrollment",
    (SELECT ARRAY(SELECT userenrollment.id
     FROM dados.userenrollment
     WHERE userenrollment."collectionCentre" = collectioncentre.id
     AND userenrollment."expiredAt" IS NULL)) AS "userEnrollments",
    "user"."displayName" AS "displayName",
    "user".username,
    "user".email,
    person.prefix,
    person."firstName",
    person."lastName",
    person.gender,
    person."dateOfBirth",
    study.id AS study,
    study.name AS "studyName",
    userenrollment."collectionCentre",
    collectioncentre.name AS "collectionCentreName",
    userenrollment."centreAccess",
    userenrollment."owner",
    userenrollment."createdBy",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM dados.userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN altum.person ON "user".person = person.id
     LEFT JOIN dados.collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN dados.study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE dados.studyuser
  OWNER TO postgres;
