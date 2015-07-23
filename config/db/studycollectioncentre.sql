-- View: studycollectioncentre

-- DROP VIEW studycollectioncentre;

CREATE OR REPLACE VIEW studycollectioncentre AS
 SELECT collectioncentre.id,
    userenrollment.id AS "userenrollmentId",
    userenrollment."user",
    study.name AS "studyName",
    collectioncentre.name AS "collectionCentreName",
    collectioncentre.study,
    collectioncentre.contact,
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM userenrollment
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE studycollectioncentre
  OWNER TO postgres;
