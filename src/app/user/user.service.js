(function() {
	'use strict';

	angular
		.module('dados.user.service', ['ngResource', 'dados.user.constants'])
		.service('UserService', UserService)
		.service('UserAccess', UserAccess)
		.service('UserRoles', UserRoles);

	UserService.$inject = ['$resource', 'USER_API'];
	UserAccess.$inject = ['$resource', 'USER_API'];
	UserRoles.$inject = ['$resource', 'USER_API'];

	function UserService($resource, USER_API) {
		return $resource(USER_API.url, {}, {
			'update': { method: 'PUT' }
		});
	}

	function UserAccess($resource, USER_API) {
		return $resource(USER_API.url + '/access', {}, {
			'update': { method: 'PUT' }
		});
	}

	function UserRoles($resource, USER_API) {
		return $resource(USER_API.url + '/roles', {}, {
			'update': { method: 'PUT' }
		});
	}
	
})();