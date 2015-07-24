-- View: collectioncentreoverview

-- DROP VIEW collectioncentreoverview;

CREATE OR REPLACE VIEW collectioncentreoverview AS
SELECT
	collectioncentre.id,
	(SELECT ARRAY(SELECT userenrollment.id
	 FROM userenrollment
	 WHERE userenrollment."collectionCentre" = collectioncentre.id
	 AND userenrollment."expiredAt" IS NULL)) AS "userEnrollments",
	(SELECT COUNT(*)
	 FROM userenrollment
	 WHERE userenrollment."collectionCentre" = collectioncentre.id
	 AND userenrollment."expiredAt" IS NULL) AS "coordinators_count",
	(SELECT COUNT(*)
	 FROM subjectenrollment
	 WHERE subjectenrollment."collectionCentre" = collectioncentre.id
	 AND subjectenrollment."expiredAt" IS NULL) AS "subjects_count",
	study.name AS study,
	collectioncentre.name,
	concat_ws(' ', "user".prefix, "user".firstname, "user".lastname) AS contact,
	collectioncentre."createdAt",
	collectioncentre."updatedAt"
FROM collectioncentre
	LEFT JOIN study ON collectioncentre.study = study.id
	LEFT JOIN "user" ON collectioncentre.contact = "user".id
WHERE
	collectioncentre."expiredAt" IS NULL;

ALTER TABLE collectioncentreoverview
OWNER TO postgres;
