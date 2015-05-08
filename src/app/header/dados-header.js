angular.module('dados.header', ['dados.auth.service'])

.constant("TABVIEW", {
  "SUBJECT": [
    { prompt: 'My Studies', href: '/study', icon: 'fa-group' },
    { prompt: 'My Profile', href: '/user', icon: 'fa-user' }
  ],
  "COORDINATOR": [
    { prompt: 'Studies', href: '/study', icon: 'fa-group' },
		{ prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
    { prompt: 'User Manager', href: '/user', icon: 'fa-user' }
  ],
  "ADMIN": [
    { prompt: 'Studies', href: '/study', icon: 'fa-group' },
		{ prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
		{ prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },
    { prompt: 'User Manager', href: '/user', icon: 'fa-user' }
  ]
})

.directive('dadosHeader', function() {
	var headerController = function($location, $state, $rootScope, AuthService, TABVIEW) {
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
	};

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'header/dados-header.tpl.html',
		controller: ['$location', '$state', '$rootScope', 'AuthService', 'TABVIEW', headerController],
		controllerAs: 'header'
	};
});