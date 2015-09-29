/**
 * Data service for handling all Assessmententication data
 */
(function() {
  'use strict';

  angular
    .module('dados.arm.assessment.service',
      [
          'dados.assessment.constants',
          'dados.common.services.resource'
      ])
      .service('AssessmentService', AssessmentService)
      .service('ReferralService', ReferralService)
      .service('ReferralDetailService', ReferralDetailService)
      .service('SiteService', SiteService);

  AssessmentService.$inject = ['ResourceFactory','ASSESSMENT_API'];
  ReferralService.$inject = ['ResourceFactory','REFERRAL_API'];
  ReferralDetailService.$inject = ['ResourceFactory','REFERRALDETAIL_API'];
  SiteService.$inject = ['ResourceFactory','SITE_API'];

  function AssessmentService(ResourceFactory,ASSESSMENT_API) {
    return ResourceFactory.create(ASSESSMENT_API.url);
  }
  function ReferralService(ResourceFactory,REFERRAL_API) {
    return ResourceFactory.create(REFERRAL_API.url);
  }
  function ReferralDetailService(ResourceFactory,REFERRALDETAIL_API) {
    return ResourceFactory.create(REFERRALDETAIL_API.url);
  }
  function SiteService(ResourceFactory,SITE_API) {
    return ResourceFactory.create(SITE_API.url);
  }
})();