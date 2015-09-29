-- View: collectioncentreuser
-- returns a collection centre's list of enrolled users; used in CollectionCentreController.findOne

-- DROP VIEW collectioncentreuser;

CREATE OR REPLACE VIEW collectioncentreuser AS
 SELECT "user".id,
    collectioncentre.id AS "collectionCentre",
    "user".username,
    "user".email,
    "user".prefix,
    "user".firstname,
    "user".lastname,
    "user".gender,
    "user".dob,
    userenrollment.id AS "userenrollment",
    userenrollment."centreAccess",
    userenrollment."owner",
    userenrollment."createdBy",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE collectioncentreuser
  OWNER TO postgres;
