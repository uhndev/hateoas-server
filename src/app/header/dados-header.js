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
	var headerController = function($location, $state, $scope, AuthService, TABVIEW) {
		var vm = this;

    vm.AuthService = AuthService;
    // vm.navigation = TABVIEW.SUBJECT;

    function updateHeader() {
      if (AuthService.currentRole) {
        var view = AuthService.currentRole.toString().toUpperCase();
        if (TABVIEW[view] !== vm.navigation) {
          angular.copy(TABVIEW[view], vm.navigation);
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

    $scope.$on('events.unauthorized', function() {
      $location.url('/login');
    });

    $scope.$on('events.authorized', function() {
      vm.navigation = TABVIEW.SUBJECT;
    });

    $scope.$on('$locationChangeSuccess', updateActive);
    updateActive();
	};

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'header/dados-header.tpl.html',
		controller: ['$location', '$state', '$scope', 'AuthService', 'TABVIEW', headerController],
		controllerAs: 'header'
	};
});