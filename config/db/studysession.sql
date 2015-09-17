-- View: studysurvey

-- DROP VIEW studysurvey;

CREATE OR REPLACE VIEW studysession AS
 SELECT session.id,
    session.type,
    session.name,
    session.timepoint,
    session."availableFrom" AS "availableFrom",
    session."availableTo" AS "availableTo",
    session.survey,
    session."surveyVersion",
    ( SELECT ARRAY( SELECT formsessions.formversion_sessions
                   FROM formversion_sessions__session_formversions formsessions
                  WHERE formsessions."session_formVersions" = session.id AND session."expiredAt" IS NULL) AS "array") AS "formVersions",
    survey.name AS "surveyName",
    survey."completedBy",
    survey.study,
    study.name AS "studyName",
    survey.owner,
    survey."createdBy",
    survey."createdAt",
    survey."updatedAt"
   FROM survey
     LEFT JOIN session ON survey.id = session.survey
     LEFT JOIN study ON survey.study = study.id
  WHERE survey."expiredAt" IS NULL AND session."expiredAt" IS NULL;

ALTER TABLE studysession
  OWNER TO postgres;
