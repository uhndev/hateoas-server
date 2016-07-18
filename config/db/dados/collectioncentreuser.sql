-- View: collectioncentreuser
-- returns a collection centre's list of enrolled users; used in CollectionCentreController.findOne

-- DROP VIEW collectioncentreuser;

CREATE OR REPLACE VIEW dados.collectioncentreuser AS
 SELECT "user".id,
    collectioncentre.id AS "collectionCentre",
    "user".username,
    "user".email,
    person.prefix,
    person."firstName",
    person."lastName",
    person.gender,
    person."dateOfBirth",
    userenrollment.id AS "userenrollment",
    userenrollment."centreAccess",
    userenrollment."owner",
    userenrollment."createdBy",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM dados.userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN altum.person on "user".person = person.id
     LEFT JOIN dados.collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN dados.study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE dados.collectioncentreuser
  OWNER TO postgres;
