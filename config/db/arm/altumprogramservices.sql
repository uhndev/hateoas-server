-- View: altumprogramservices
-- returns payor, company, altum/program service data

-- DROP VIEW altumprogramservices;
CREATE OR REPLACE VIEW altumprogramservices AS
  SELECT
    payor.id AS payor_id,
    company.name AS payor_name,
    altumservice.name AS "altumService_name",
    altumservice.id AS "altumService_id",
    programservice.id AS "programService_id",
    programservice.name AS "programService_name",
    programservice.id AS program_id,
    program.name AS program_name
  FROM payor
    LEFT JOIN company ON payor.company = company.id
    LEFT JOIN programservice ON programservice.payor = payor.id
    LEFT JOIN altumservice ON programservice."altumService" = altumservice.id
    LEFT JOIN program ON programservice.program = program.id;
ALTER TABLE altumprogramservices
OWNER TO postgres;
