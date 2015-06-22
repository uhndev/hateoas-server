(function() {
	'use strict';
	angular
		.module('dados.group.constants', ['dados.constants'])
		.service('GROUP_API', Group);
		Group.$inject = ['API'];
		function Group(API) {
			return { url: API.url() + '/group/:id' };
		}
})();