(function() {
	'use strict';

	angular
		.module('dados.access.service', [
      'dados.access.constants',
      'dados.common.services.resource'
    ])
    .service('RoleService', RoleService)
		.service('GroupService', GroupService)
		.service('ModelService', ModelService);

  RoleService.$inject = ['ResourceFactory', 'ROLE_API'];
	GroupService.$inject = ['ResourceFactory', 'GROUP_API'];
	ModelService.$inject = ['ResourceFactory', 'MODEL_API'];

  function RoleService(ResourceFactory, ROLE_API) {
    return ResourceFactory.create(ROLE_API.url);
  }

	function GroupService(ResourceFactory, GROUP_API) {
		return ResourceFactory.create(GROUP_API.url);
	}

	function ModelService(ResourceFactory, MODEL_API) {
		return ResourceFactory.create(MODEL_API.url);
	}
})();
