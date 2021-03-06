-- View: formversionsessions
-- returns a list of formversions with associated sessions

-- DROP VIEW formversionsessions;

CREATE OR REPLACE VIEW dados.formversionsessions AS
 SELECT formsessions.formversion_sessions AS id,
    formversion.name,
    session.id AS session,
    session.survey,
    session."surveyVersion",
    session.name AS "sessionName",
    session.timepoint,
    session."availableFrom",
    session."availableTo",
    session.type,
    session."formOrder",
    session."owner",
    session."createdBy",
    session."createdAt",
    session."updatedAt"
   FROM dados.formversion_sessions__session_formversions formsessions
     LEFT JOIN dados.session ON session.id = formsessions."session_formVersions"
     LEFT JOIN dados.formversion ON formversion.id = formsessions.formversion_sessions
  WHERE formversion."expiredAt" IS NULL AND session."expiredAt" IS NULL;

ALTER TABLE dados.formversionsessions
  OWNER TO postgres;
