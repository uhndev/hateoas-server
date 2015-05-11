(function() {
	'use strict';	
	angular.module('dados.header', [
		'dados.header.constants',
		'dados.auth.service'
	])
	.directive('dadosHeader', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'header/dados-header.tpl.html',
			controller: HeaderController,
			controllerAs: 'header'
		};
	});	

	HeaderController.$inject = ['$location', '$state', '$rootScope', 'AuthService', 'TABVIEW'];

	function HeaderController($location, $state, $rootScope, AuthService, TABVIEW) {
		
		var vm = this;
		vm.AuthService = AuthService;
		vm.isVisible = AuthService.isAuthenticated();

		if (AuthService.isAuthenticated()) {
			updateHeader();
		}

		function updateHeader() {
			if (AuthService.currentRole) {
				var view = AuthService.currentRole.toString().toUpperCase();
				if (TABVIEW[view] !== vm.navigation) {
					vm.navigation = TABVIEW[view];
				}        
			}
		}

		function updateActive() {
			updateHeader();
			var href = $location.path();
			_.each(vm.navigation, function(link) {
				link.isActive = 
					(href.toLowerCase() === link.href.toLowerCase());
			});
		}

		vm.logout = function() {
			vm.isVisible = false;
			vm.navigation = [];
			AuthService.logout();
		};

		$rootScope.$on('events.unauthorized', function() {
			vm.isVisible = false;
			vm.navigation = [];
		});

		$rootScope.$on('events.authorized', function() {
			vm.isVisible = true;
			updateHeader();
		});

		$rootScope.$on('$locationChangeSuccess', updateActive);
		updateActive();
	}
})();