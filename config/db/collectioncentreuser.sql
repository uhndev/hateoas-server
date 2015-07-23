-- View: collectioncentreuser

-- DROP VIEW collectioncentreuser;

CREATE OR REPLACE VIEW collectioncentreuser AS
 SELECT "user".id,
    collectioncentre.id AS "collectionCentreId",
    "user".username,
    "user".email,
    "user".prefix,
    "user".firstname,
    "user".lastname,
    "user".gender,
    "user".dob,
    "user"."expiredAt",
    userenrollment.id AS "userenrollmendId",
    userenrollment."centreAccess",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE collectioncentreuser
  OWNER TO postgres;
