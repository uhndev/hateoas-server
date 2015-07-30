-- View: studyuser
-- returns a study's list of enrolled users; used in User.findByStudyName

-- DROP VIEW studyuser;

CREATE OR REPLACE VIEW studyuser AS
 SELECT "user".id,
    userenrollment.id AS "enrollmentId",
    "user".username,
    "user".email,
    "user".prefix,
    "user".firstname,
    "user".lastname,
    "user".gender,
    "user".dob,
    study.name AS "studyName",
    userenrollment."collectionCentre",
    userenrollment."centreAccess",
    userenrollment."createdAt",
    userenrollment."updatedAt"
   FROM userenrollment
     LEFT JOIN "user" ON "user".id = userenrollment."user"
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON collectioncentre.study = study.id
  WHERE userenrollment."expiredAt" IS NULL;

ALTER TABLE studyuser
  OWNER TO postgres;
