-- View: schedulesessions

-- DROP VIEW schedulesessions;

CREATE OR REPLACE VIEW schedulesessions AS
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
    session."surveyVersion",
    session."formOrder",
    ( SELECT ARRAY( SELECT formsessions.formversion_sessions
                   FROM formversion_sessions__session_formversions formsessions
                  WHERE formsessions."session_formVersions" = session.id AND session."expiredAt" IS NULL) AS "array") AS "formVersions",
    subjectschedule.owner,
    subjectschedule."createdBy",
    subjectschedule."createdAt",
    subjectschedule."updatedAt"
   FROM subjectschedule
     LEFT JOIN session ON session.id = subjectschedule.session
  WHERE subjectschedule."expiredAt" IS NULL AND session."expiredAt" IS NULL;

ALTER TABLE schedulesessions
  OWNER TO postgres;
