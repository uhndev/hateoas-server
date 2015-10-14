(function () {
  'use strict';

  angular
    .module('AHS.client.service', [
      'AHS.client.constants',
      'AHS.common.services.resource'
    ])
    .service('ClientService', ClientService);

  ClientService.$inject = ['ResourceFactory', 'CLIENT_API'];

  function ClientService(ResourceFactory, CLIENT_API) {
    return ResourceFactory.create(CLIENT_API.url);
  }
})();
