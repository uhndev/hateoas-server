-- View: collectioncentresubject
-- returns a collection centre's list of enrolled subjects; used in CollectionCentreController.findOne

-- DROP VIEW collectioncentresubject;

CREATE OR REPLACE VIEW collectioncentresubject AS
 SELECT subject.id,
    subject."user" AS "user",
    collectioncentre.id AS "collectionCentre",
    subjectenrollment."subjectNumber",
    subjectenrollment.id AS "subjectenrollment",
    subjectenrollment."studyMapping",
    subjectenrollment.status,
    subjectenrollment.doe,
    subjectenrollment."owner",
    subjectenrollment."createdBy",
    subjectenrollment."createdAt",
    subjectenrollment."updatedAt"
   FROM subjectenrollment
     LEFT JOIN subject ON subject.id = subjectenrollment.subject
     LEFT JOIN collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON study.id = collectioncentre.study
  WHERE subjectenrollment."expiredAt" IS NULL;

ALTER TABLE collectioncentresubject
  OWNER TO postgres;
