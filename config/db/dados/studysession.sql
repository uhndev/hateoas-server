-- View: studysurvey

-- DROP VIEW studysurvey;

CREATE OR REPLACE VIEW dados.studysession AS
 SELECT session.id,
    session.type,
    session.name,
    session.timepoint,
    session."availableFrom" AS "availableFrom",
    session."availableTo" AS "availableTo",
    session.survey,
    session."surveyVersion",
    session."formOrder",
    ( SELECT ARRAY( SELECT formsessions.formversion_sessions
                   FROM dados.formversion_sessions__session_formversions formsessions
                  WHERE formsessions."session_formVersions" = session.id AND session."expiredAt" IS NULL) AS "array") AS "formVersions",
    survey.name AS "surveyName",
    survey."completedBy",
    survey.study,
    study.name AS "studyName",
    survey.owner,
    survey."createdBy",
    survey."createdAt",
    survey."updatedAt"
   FROM dados.survey
     LEFT JOIN dados.session ON survey.id = session.survey
     LEFT JOIN dados.study ON survey.study = study.id
  WHERE survey."expiredAt" IS NULL AND session."expiredAt" IS NULL;

ALTER TABLE dados.studysession
  OWNER TO postgres;
