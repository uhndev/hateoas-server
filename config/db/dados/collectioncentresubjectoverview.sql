-- View: collectioncentresubjectoverview
-- returns collection centre enrollment summaries for users and subjects
-- grouped by username; used in StudyController.findOne.

-- DROP VIEW collectioncentresubjectoverview;

CREATE OR REPLACE VIEW collectioncentresubjectoverview AS
 SELECT subjectenrollment."collectionCentre" AS id,
    subjectuser.username,
    COALESCE(aggregatecoords.coordinators_count, 0::bigint) AS coordinators_count,
    COALESCE(aggregatesubs.subjects_count, 0::bigint) AS subjects_count,
    study.name AS study,
    collectioncentre.name,
    collectioncentre.contact,
    concat_ws(' '::text, collectioncentreuser.prefix, collectioncentreuser.firstname, collectioncentreuser.lastname) AS "contactName",
    collectioncentre.owner,
    collectioncentre."createdBy",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM dados.subject
     LEFT JOIN "user" subjectuser ON subject."user" = subjectuser.id
     LEFT JOIN dados.subjectenrollment ON subject.id = subjectenrollment.subject
     LEFT JOIN dados.collectioncentre ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN "user" collectioncentreuser ON collectioncentre.contact = collectioncentreuser.id
     LEFT JOIN dados.userenrollment ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN dados.study ON study.id = collectioncentre.study
     LEFT JOIN ( SELECT count(1) AS coordinators_count,
            userenrollment_1."collectionCentre"
           FROM dados.userenrollment userenrollment_1
          WHERE userenrollment_1."expiredAt" IS NULL
          GROUP BY userenrollment_1."collectionCentre") aggregatecoords ON aggregatecoords."collectionCentre" = userenrollment."collectionCentre"
     LEFT JOIN ( SELECT count(1) AS subjects_count,
            subjectenrollment_1."collectionCentre"
           FROM dados.subjectenrollment subjectenrollment_1
          WHERE subjectenrollment_1."expiredAt" IS NULL
          GROUP BY subjectenrollment_1."collectionCentre") aggregatesubs ON aggregatesubs."collectionCentre" = subjectenrollment."collectionCentre"
  WHERE collectioncentreuser."expiredAt" IS NULL AND subjectuser."expiredAt" IS NULL AND subject."expiredAt" IS NULL AND collectioncentre."expiredAt" IS NULL AND subjectenrollment."expiredAt" IS NULL AND subjectenrollment.id IS NOT NULL;

ALTER TABLE collectioncentresubjectoverview
  OWNER TO postgres;
