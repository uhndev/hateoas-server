CREATE OR REPLACE VIEW services AS
select
service.id,
service.approved,
clientPerson."firstName" as "client_firstName",
clientPerson."lastName" as "client_lastName",
physicianPerson."firstName" as "physician_firstName",
physicianPerson."lastName" as "physician_lastName",
physicianPerson.title as "physician_title",
programService.name as "programService_name",
altumService.name as "altumService_name",
service.owner,
service."createdAt",
service."createdBy",
service."deletedBy",
service."updatedAt"

from service

left join programService on service."programService" = programservice.id
left join altumService on programService."altumService" = altumService.id
left join referral on service.referral = referral.id
left join client on referral.client=client.id
left join person clientPerson on client.person=clientPerson.id
left join physician on referral.physician=physician.id
left join person physicianPerson on physician.person=physicianPerson.id;
