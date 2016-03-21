-- View: studycollectioncentre
-- returns a study's list of collection centres; used in CollectionCentre.findByStudyName

-- DROP VIEW studycollectioncentre;

CREATE OR REPLACE VIEW dados.studycollectioncentre AS
 SELECT collectioncentre.id,
    userenrollment.id AS "userenrollment",
    collectioncentre.study,
    study.name AS "studyName",
    collectioncentre.name,
    collectioncentre.contact,
    concat_ws(' '::text, "user".prefix, "user".firstname, "user".lastname) AS "contactName",
    collectioncentre."owner",
    collectioncentre."createdBy",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM dados.collectioncentre
	LEFT JOIN dados.userenrollment ON userenrollment."collectionCentre" = collectioncentre.id
	LEFT JOIN "user" ON "user".id = collectioncentre.contact
	LEFT JOIN dados.study ON collectioncentre.study = study.id
  WHERE collectioncentre."expiredAt" IS NULL;

ALTER TABLE dados.studycollectioncentre
  OWNER TO postgres;
