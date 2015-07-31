-- View: studysubject
-- returns a study's list of enrolled subjects; used in SubjectEnrollment.findByStudyName

-- DROP VIEW studysubject;

CREATE OR REPLACE VIEW studysubject AS
  SELECT subjectenrollment.id,
    subject.id AS "subjectId",
    "user".id AS "userId",
    subjectenrollment."collectionCentre",
    subjectenrollment."subjectNumber",
    study.name AS "studyName",
    collectioncentre.name AS "collectionCentreName",
    subjectenrollment."studyMapping",
    subjectenrollment.doe,
    subjectenrollment."createdAt",
    subjectenrollment."updatedAt"
  FROM subjectenrollment
    LEFT JOIN subject ON subject.id = subjectenrollment.subject
    LEFT JOIN "user" ON subject.user = "user".id
    LEFT JOIN collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
    LEFT JOIN study ON collectioncentre.study = study.id
  WHERE subjectenrollment."expiredAt" IS NULL;

ALTER TABLE studysubject
  OWNER TO postgres;
