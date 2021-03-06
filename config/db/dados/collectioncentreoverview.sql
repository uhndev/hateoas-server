-- View: collectioncentreoverview
-- returns collection centre enrollment summaries for users and subjects
-- grouped by username; used in StudyController.findOne.

-- DROP VIEW collectioncentreoverview;

CREATE OR REPLACE VIEW dados.collectioncentreoverview AS
  SELECT
    userenrollment."collectionCentre" AS id,
    "user".username,
    COALESCE(aggregatecoords.coordinators_count, 0::bigint) AS coordinators_count,
    COALESCE(aggregatesubs.subjects_count, 0::bigint) AS subjects_count,
    study.id AS study,
    study.name AS "studyName",
    collectioncentre.name,
    "user".id AS contact,
    concat_ws(' '::text, person.prefix, person."firstName", person."lastName") AS "contactName",
    collectioncentre."owner",
    collectioncentre."createdBy",
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
  FROM "user"
     LEFT JOIN dados.userenrollment ON "user".id = userenrollment."user"
     LEFT JOIN dados.subject ON subject."user" = "user".id
     LEFT JOIN dados.collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN "user" "contactUser" ON collectioncentre.contact = "contactUser".id
     LEFT JOIN altum.person ON "contactUser".person = person.id
     LEFT JOIN dados.study ON study.id = collectioncentre.study
     LEFT JOIN dados.subjectenrollment ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN ( SELECT count(1) AS coordinators_count,
          userenrollment."collectionCentre"
          FROM dados.userenrollment
          WHERE userenrollment."expiredAt" IS NULL
          GROUP BY userenrollment."collectionCentre") aggregatecoords ON
                   aggregatecoords."collectionCentre" = userenrollment."collectionCentre"
     LEFT JOIN ( SELECT count(1) AS subjects_count,
          subjectenrollment."collectionCentre"
          FROM dados.subjectenrollment
          WHERE subjectenrollment."expiredAt" IS NULL
          GROUP BY subjectenrollment."collectionCentre") aggregatesubs ON
                   aggregatesubs."collectionCentre" = subjectenrollment."collectionCentre"
  WHERE "user"."expiredAt" IS NULL AND
        subject."expiredAt" IS NULL AND
        collectioncentre."expiredAt" IS NULL AND
        userenrollment."expiredAt" IS NULL AND
        userenrollment.id IS NOT NULL;
ALTER TABLE dados.collectioncentreoverview
OWNER TO postgres;
