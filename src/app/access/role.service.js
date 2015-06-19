(function() {
	'use strict';

	angular
		.module('dados.role.service', ['ngResource', 'dados.role.constants'])
		.service('RoleService', RoleService);

	RoleService.$inject = ['$resource', 'ROLE_API'];

	function RoleService($resource, ROLE_API) {
		return $resource(ROLE_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();