/**
 * Data service for handling all Assessmententication data
 */
(function() {
  'use strict';

  angular
    .module('dados.arm.program.service',
      [
          'dados.program.constants',
          'dados.common.services.resource'
      ])
      .service('ProgramService', ProgramService);

  ProgramService.$inject = ['ResourceFactory','PROGRAM_API'];

  function ProgramService(ResourceFactory,PROGRAM_API) {
    return ResourceFactory.create(PROGRAM_API.url);
  }
})();
