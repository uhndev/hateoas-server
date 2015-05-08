angular.module('dados.error', [
	'ngSails',
	'dados.error.controller'
])

.directive('dadosError', function() {
	return {
		restrict: 'A',
		controller: 'ErrorController',
		controllerAs: 'error'
	};
});