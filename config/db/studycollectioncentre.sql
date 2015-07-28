-- View: studycollectioncentre

-- DROP VIEW studycollectioncentre;

CREATE OR REPLACE VIEW studycollectioncentre AS
 SELECT collectioncentre.id,
    userenrollment.id AS "userenrollmentId",
    collectioncentre.study,
    study.name AS "studyName",
    collectioncentre.name,
    collectioncentre.contact,
    concat_ws(' '::text, "user".prefix, "user".firstname, "user".lastname) AS "contactName",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM collectioncentre
	LEFT JOIN userenrollment ON userenrollment."collectionCentre" = collectioncentre.id
	LEFT JOIN "user" ON "user".id = collectioncentre.contact
	LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL AND collectioncentre."expiredAt" IS NULL;

ALTER TABLE studycollectioncentre
  OWNER TO postgres;
