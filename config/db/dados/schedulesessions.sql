-- View: schedulesessions

-- DROP VIEW schedulesessions;

CREATE OR REPLACE VIEW dados.schedulesessions AS
 SELECT subjectschedule.id,
    subjectschedule."availableFrom",
    subjectschedule."availableTo",
    subjectschedule."subjectEnrollment",
    subjectschedule.status,
    subjectschedule.session,
    session.name,
    session.timepoint,
    session.type,
    session.survey,
    survey.name AS "surveyName",
    session."surveyVersion",
    session."formOrder",
    ( SELECT ARRAY( SELECT formsessions.formversion_sessions
                   FROM dados.formversion_sessions__session_formversions formsessions
                  WHERE formsessions."session_formVersions" = session.id AND session."expiredAt" IS NULL) AS "array") AS "formVersions",
    subjectschedule.owner,
    subjectschedule."createdBy",
    subjectschedule."createdAt",
    subjectschedule."updatedAt"
   FROM dados.subjectschedule
     LEFT JOIN dados.session ON session.id = subjectschedule.session
     LEFT JOIN dados.survey ON session.survey = survey.id
  WHERE subjectschedule."expiredAt" IS NULL AND session."expiredAt" IS NULL AND survey."expiredAt" IS NULL;

ALTER TABLE dados.schedulesessions
  OWNER TO postgres;
