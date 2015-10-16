-- View: studysubject
-- returns a study's list of enrolled subjects; used in SubjectEnrollment.findByStudyName

-- DROP VIEW studysubject;

CREATE OR REPLACE VIEW studysubject AS
  SELECT subjectenrollment.id,
    subject.id AS "subject",
    "user".id AS "user",
    subjectenrollment."collectionCentre",
    subjectenrollment."subjectNumber",
    study.id AS "study",
    study.name AS "studyName",
    collectioncentre.name AS "collectionCentreName",
    study.attributes AS "studyAttributes",
    subjectenrollment."studyMapping",
    subjectenrollment.status,
    subjectenrollment.doe,
    subjectenrollment."owner",
    subjectenrollment."createdBy",
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
