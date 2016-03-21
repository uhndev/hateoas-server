-- View: studysubject
-- returns a study's list of enrolled subjects; used in SubjectEnrollment.findByStudyName

-- DROP VIEW studysubject;

CREATE OR REPLACE VIEW dados.studysubject AS
  SELECT subjectenrollment.id,
    subject.id AS "subject",
    "user".id AS "user",
    "user"."displayName" AS "displayName",
    subjectenrollment."collectionCentre",
    subjectenrollment."subjectNumber",
    study.id AS "study",
    study.name AS "studyName",
    collectioncentre.name AS "collectionCentreName",
    study.attributes AS "studyAttributes",
    ( SELECT ARRAY( SELECT DISTINCT providers.provider_subjects
                       FROM dados.provider_subjects__subjectenrollment_providers "providers"
                      WHERE providers."subjectenrollment_providers" = subjectenrollment.id AND subjectenrollment."expiredAt" IS NULL) AS "array") AS "providers",
    subjectenrollment."studyMapping",
    subjectenrollment.status,
    subjectenrollment.doe,
    subjectenrollment."owner",
    subjectenrollment."createdBy",
    subjectenrollment."createdAt",
    subjectenrollment."updatedAt"
  FROM dados.subjectenrollment
    LEFT JOIN dados.subject ON subject.id = subjectenrollment.subject
    LEFT JOIN "user" ON subject.user = "user".id
    LEFT JOIN dados.collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
    LEFT JOIN dados.study ON collectioncentre.study = study.id
  WHERE subjectenrollment."expiredAt" IS NULL;

ALTER TABLE dados.studysubject
  OWNER TO postgres;
