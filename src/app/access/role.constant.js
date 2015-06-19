(function() {
	'use strict';
	angular
		.module('dados.role.constants', ['dados.constants'])
		.service('ROLE_API', Role);
		Role.$inject = ['API'];
		function Role(API) {
			return { url: API.url() + '/role/:id' };
		}
})();