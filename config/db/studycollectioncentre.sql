-- View: studycollectioncentre

-- DROP VIEW studycollectioncentre;

CREATE OR REPLACE VIEW studycollectioncentre AS
 SELECT collectioncentre.id,
    userenrollment.id AS "userenrollmentId",
    study.name AS study,
    collectioncentre.name,
    collectioncentre.contact,
    concat_ws(' '::text, "user".prefix, "user".firstname, "user".lastname) AS "contactName",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE studycollectioncentre
  OWNER TO postgres;
