-- View: altumprogramservices
-- returns payor, company, altum/program service data

-- DROP VIEW altumprogramservices;
CREATE OR REPLACE VIEW altum.altumprogramservices AS
 SELECT altumservice.id,
    altumservice.name AS "altumServiceName",
    altumservice."serviceCategory",
    servicecategory.name AS "serviceCategoryName",
    programservice.id AS "programService",
    programservice.name AS "programServiceName",
    programservice.program AS program,
    program.name AS "programName",
    altumservice.owner,
    altumservice."createdBy",
    altumservice."createdAt",
    altumservice."updatedAt"
   FROM altum.altumservice_programservices__programservice_ahservices altum_program_services
     LEFT JOIN altum.altumservice ON altumservice.id = altum_program_services."altumservice_programServices"
     LEFT JOIN altum.servicecategory ON servicecategory.id = altumservice."serviceCategory"
     LEFT JOIN altum.programservice ON programservice.id = altum_program_services."programservice_AHServices"
     LEFT JOIN altum.program ON programservice.program = program.id;

ALTER TABLE altum.altumprogramservices
  OWNER TO postgres;
