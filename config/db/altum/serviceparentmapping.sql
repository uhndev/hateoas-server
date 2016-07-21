-- View: altum.serviceparentmapping

-- DROP VIEW altum.serviceparentmapping;

CREATE OR REPLACE VIEW altum.serviceparentmapping AS
 SELECT service.id,
    service."updatedAt",
    service."createdAt"
   FROM altum.service;

ALTER TABLE altum.serviceparentmapping
  OWNER TO postgres;
