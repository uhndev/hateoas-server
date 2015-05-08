angular.module('dados.error', [
	'sails.io',
	'dados.error.controller'
])

.directive('dadosError', function() {
	return {
		restrict: 'A',
		controller: 'ErrorController',
		controllerAs: 'error'
	};
});