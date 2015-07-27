-- View: collectioncentreoverview

-- DROP VIEW collectioncentreoverview;

CREATE OR REPLACE VIEW collectioncentreoverview AS
 SELECT userenrollment."collectionCentre" AS id,
    "user".username,
    COALESCE(aggregatecoords.coordinators_count, 0) AS coordinators_count,
    COALESCE(aggregatesubs.subjects_count, 0) AS subjects_count,
    study.name AS study,
    collectioncentre.name,
    concat_ws(' '::text, "user".prefix, "user".firstname, "user".lastname) AS contact,
    collectioncentre."createdAt",
    collectioncentre."updatedAt"
   FROM "user"
     LEFT JOIN userenrollment ON "user".id = userenrollment."user"
     LEFT JOIN subject ON subject."user" = "user".id
     LEFT JOIN collectioncentre ON userenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN study ON study.id = collectioncentre.study
     LEFT JOIN subjectenrollment ON subjectenrollment."collectionCentre" = collectioncentre.id
     LEFT JOIN ( SELECT count(1) AS coordinators_count,
            userenrollment_1."collectionCentre"
           FROM userenrollment userenrollment_1
          WHERE userenrollment_1."expiredAt" IS NULL
          GROUP BY userenrollment_1."collectionCentre") aggregatecoords ON aggregatecoords."collectionCentre" = userenrollment."collectionCentre"
     LEFT JOIN ( SELECT count(1) AS subjects_count,
            subjectenrollment_1."collectionCentre"
           FROM subjectenrollment subjectenrollment_1
          WHERE subjectenrollment_1."expiredAt" IS NULL
          GROUP BY subjectenrollment_1."collectionCentre") aggregatesubs ON aggregatesubs."collectionCentre" = subjectenrollment."collectionCentre"
  WHERE "user"."expiredAt" IS NULL AND subject."expiredAt" IS NULL AND userenrollment.id IS NOT NULL;
ALTER TABLE collectioncentreoverview
OWNER TO postgres;
