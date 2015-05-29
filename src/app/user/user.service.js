(function() {
	'use strict';

	angular
		.module('dados.user.service', ['ngResource', 'dados.user.constants'])
		.service('UserService', UserService);

	UserService.$inject = ['$resource', 'USER_API'];

	function UserService($resource, USER_API) {
		return $resource(USER_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();