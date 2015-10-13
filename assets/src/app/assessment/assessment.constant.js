(function () {
    'use strict';
    angular
        .module('dados.assessment.constants', ['dados.constants'])
        .service('ASSESSMENT_API', Assessment)
        .service('REFERRAL_API', Referral)
        .service('REFERRALDETAIL_API', ReferralDetail)
        .service('ADDRESS_API', Address)
        .service('PHYSICIAN_API', Address)
        .service('SITE_API', Site);

    Assessment.$inject = ['API'];
    Address.$inject = ['API'];
    Referral.$inject = ['API'];
    Site.$inject = ['API'];
    Physician.$inject = ['API'];

    function Assessment(API) {
        return {url: API.url() + '/assessment/:id'};
    }

    function Referral(API) {
        return {url: API.url() + '/referral/:id'};
    }

    function ReferralDetail(API) {
        return {url: API.url() + '/referraldetail/:id'};
    }

    function Site(API) {
        return {url: API.url() + '/site/:id'};
    }

  function Address(API) {
    return {url: API.url() + '/address/:id'};
  }
  function Physician(API) {
    return {url: API.url() + '/physician/:id'};
  }
})();
