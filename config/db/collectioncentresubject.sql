-- View: collectioncentresubject
-- returns a collection centre's list of enrolled subjects; used in CollectionCentreController.findOne

-- DROP VIEW collectioncentresubject;

CREATE OR REPLACE VIEW collectioncentresubject AS
 SELECT subject.id,
    subject."user" AS "userId",
    collectioncentre.id AS "collectionCentreId",
    subjectenrollment."subjectNumber",
    subjectenrollment.id AS "subjectenrollmentId",
    subjectenrollment."studyMapping",
    subjectenrollment.status,
    subjectenrollment.doe,
    subjectenrollment."createdAt",
    subjectenrollment."updatedAt"
   FROM subjectenrollment
     LEFT JOIN subject ON subject.id = subjectenrollment.subject
     LEFT JOIN collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON study.id = collectioncentre.study
  WHERE subjectenrollment."expiredAt" IS NULL;

ALTER TABLE collectioncentresubject
  OWNER TO postgres;
