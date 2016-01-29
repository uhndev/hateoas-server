-- View: altumprogramservices
-- returns payor, company, altum/program service data

-- DROP VIEW altumprogramservices;
CREATE OR REPLACE VIEW altumprogramservices AS
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
   FROM altumservice_programservices__programservice_ahservices altum_program_services
     LEFT JOIN altumservice ON altumservice.id = altum_program_services."altumservice_programServices"
     LEFT JOIN servicecategory ON servicecategory.id = altumservice."serviceCategory"
     LEFT JOIN programservice ON programservice.id = altum_program_services."programservice_AHServices"
     LEFT JOIN program ON programservice.program = program.id;

ALTER TABLE altumprogramservices
  OWNER TO postgres;
