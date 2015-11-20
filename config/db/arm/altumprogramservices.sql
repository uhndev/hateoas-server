CREATE OR REPLACE VIEW altumpayorservices AS
select payor.id as payor_id,
company.name as payor_name,
altumservice.name as "altumService_name",
altumservice.id as "altumService_id",
payorservice.id as "payorService_id",
payorservice.name as "payorService_name",
program.id as program_id,
program.name as program_name

from payor

left join company on payor.company=company.id
left join payorservice on payorservice.payor=payor.id
left join altumservice on payorservice."altumService"=altumservice.id
left join program on altumservice.program=program.id;
