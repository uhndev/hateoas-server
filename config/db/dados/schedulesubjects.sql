-- View: schedulesubjects

-- DROP VIEW schedulesubjects;

CREATE OR REPLACE VIEW schedulesubjects AS
 SELECT subjectschedule.id,
    subject.id AS subject,
    "user".id AS "user",
    subjectenrollment."collectionCentre",
    subjectenrollment."subjectNumber",
    study.id AS study,
    study.name AS "studyName",
    collectioncentre.name AS "collectionCentreName",
    subjectenrollment."studyMapping",
    subjectenrollment.status AS "enrollmentStatus",
    subjectenrollment.doe,
    subjectschedule."availableFrom",
    subjectschedule."availableTo",
    subjectschedule."subjectEnrollment",
    subjectschedule.status AS "scheduleStatus",
    subjectschedule.session,
    session.name,
    session.timepoint,
    session.type,
    session.survey,
    survey.name AS "surveyName",
    session."surveyVersion",
    subjectschedule.owner,
    subjectschedule."createdBy",
    subjectschedule."createdAt",
    subjectschedule."updatedAt"
   FROM subjectschedule
     LEFT JOIN session ON session.id = subjectschedule.session
     LEFT JOIN survey ON session.survey = survey.id
     LEFT JOIN subjectenrollment ON subjectschedule."subjectEnrollment" = subjectenrollment.id
     LEFT JOIN subject ON subject.id = subjectenrollment.subject
     LEFT JOIN "user" ON subject."user" = "user".id
     LEFT JOIN collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE subjectschedule."expiredAt" IS NULL AND session."expiredAt" IS NULL AND survey."expiredAt" IS NULL AND subjectenrollment."expiredAt" IS NULL;

ALTER TABLE schedulesubjects
  OWNER TO postgres;
