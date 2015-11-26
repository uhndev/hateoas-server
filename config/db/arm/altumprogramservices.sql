CREATE OR REPLACE VIEW altumprogramservices AS
select payor.id as payor_id,
company.name as payor_name,
altumservice.name as "altumService_name",
altumservice.id as "altumService_id",
programservice.id as "programService_id",
programservice.name as "programService_name",
programservice.id as program_id,
program.name as program_name

from payor

left join company on payor.company=company.id
left join programservice on programservice.payor=payor.id
left join altumservice on programservice."altumService"=altumservice.id
left join program on programservice.program=program.id;
