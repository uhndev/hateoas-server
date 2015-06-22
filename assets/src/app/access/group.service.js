(function() {
	'use strict';

	angular
		.module('dados.group.service', ['ngResource', 'dados.group.constants'])
		.service('GroupService', GroupService);

	GroupService.$inject = ['$resource', 'GROUP_API'];

	function GroupService($resource, GROUP_API) {
		return $resource(GROUP_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();