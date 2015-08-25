-- View: collectioncentreoverview
-- returns collection centre enrollment summaries for users and subjects
-- grouped by username; used in StudyController.findOne.

-- DROP VIEW collectioncentreoverview;

CREATE OR REPLACE VIEW collectioncentreoverview AS
  SELECT
    userenrollment."collectionCentre" AS id,
    "user".username,
    COALESCE(aggregatecoords.coordinators_count, 0::bigint) AS coordinators_count,
    COALESCE(aggregatesubs.subjects_count, 0::bigint) AS subjects_count,
    study.name AS study,
    collectioncentre.name,
    "user".id AS contact,
    concat_ws(' '::text, "user".prefix, "user".firstname, "user".lastname) AS "contactName",
    collectioncentre."owner",
    collectioncentre."createdBy",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
  FROM "user"
     LEFT JOIN userenrollment ON "user".id = userenrollment."user"
     LEFT JOIN subject ON subject."user" = "user".id
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON study.id = collectioncentre.study
     LEFT JOIN subjectenrollment ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN ( SELECT count(1) AS coordinators_count,
          userenrollment."collectionCentre"
          FROM userenrollment
          WHERE userenrollment."expiredAt" IS NULL
          GROUP BY userenrollment."collectionCentre") aggregatecoords ON
                   aggregatecoords."collectionCentre" = userenrollment."collectionCentre"
     LEFT JOIN ( SELECT count(1) AS subjects_count,
          subjectenrollment."collectionCentre"
          FROM subjectenrollment
          WHERE subjectenrollment."expiredAt" IS NULL
          GROUP BY subjectenrollment."collectionCentre") aggregatesubs ON
                   aggregatesubs."collectionCentre" = subjectenrollment."collectionCentre"
  WHERE "user"."expiredAt" IS NULL AND
        subject."expiredAt" IS NULL AND
        collectioncentre."expiredAt" IS NULL AND
        userenrollment.id IS NOT NULL;
ALTER TABLE collectioncentreoverview
OWNER TO postgres;
