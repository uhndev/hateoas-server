(function() {
	'use strict';

	angular
		.module('dados.user.service', ['ngResource', 'dados.user.constants'])
		.service('UserService', UserService);

	UserService.$inject = ['$resource', 'USER_API'];

	function UserService($resource, USER_API) {

		return {
			base: function() {
				return $resource(USER_API.url, {}, {
					'update': { method: 'PUT' }
				});
			},

			access: function() {
				return $resource(USER_API.url + '/access', {}, {
					'update': { method: 'PUT' }
				});				
			},

			roles: function() {
				return $resource(USER_API.url + '/roles', {}, {
					'update': { method: 'PUT' }
				});				
			}			
		};
	}
})();