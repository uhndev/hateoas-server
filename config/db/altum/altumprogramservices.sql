-- View: altumprogramservices
-- returns payor, company, altum/program service data

-- DROP VIEW altum.altumprogramservices;
CREATE OR REPLACE VIEW altum.altumprogramservices AS
 SELECT altumservice.id,
    altumservice.name AS "altumServiceName",
    altumservice."serviceCategory",
    altumservice."serviceVariation",
    altumservice."hasTelemedicine",
    servicecategory.name AS "serviceCategoryName",
    programservice.id AS "programService",
    programservice."displayName" AS "programServiceName",
    programservice.code AS "programServiceCode",
    programservice.price AS "programServicePrice",
    programservice.program AS program,
    programService."repeatable",
    programservice."approvalNeeded",
    programservice."approvalRequired",
    programservice."reportRequired",
    program.name AS "programName",
    altumservice.owner,
    altumservice."createdBy",
    altumservice."createdAt",
    altumservice."updatedAt"
   FROM altum.altumservice_programservices__programservice_ahservices altum_program_services
     LEFT JOIN altum.altumservice ON altumservice.id = altum_program_services."altumservice_programServices"
     LEFT JOIN altum.servicecategory ON servicecategory.id = altumservice."serviceCategory"
     LEFT JOIN altum.programservice ON programservice.id = altum_program_services."programservice_AHServices"
     LEFT JOIN altum.servicevariation ON servicevariation.id = altumservice."serviceVariation"
     LEFT JOIN altum.program ON programservice.program = program.id
   WHERE altumservice.available = TRUE;

ALTER TABLE altum.altumprogramservices
  OWNER TO postgres;

