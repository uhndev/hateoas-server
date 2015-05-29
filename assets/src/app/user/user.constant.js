(function() {
	'use strict';
	angular
		.module('dados.user.constants', ['dados.constants'])
		.service('USER_API', User);
		User.$inject = ['API'];
		function User(API) {
			return { url: API.url() + '/user/:id' };
		}
})();