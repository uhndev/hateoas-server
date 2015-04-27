/**
 * Module for controlling the header on each page;
 */

angular.module('dados.header', [
  'dados.auth.service'
])

.constant("TABVIEW", {
  "SUBJECT": [
    { prompt: 'My Studies', href: '/study', icon: 'fa-group' },
    { prompt: 'My Profile', href: '/user', icon: 'fa-user' }
  ],
  "COORDINATOR": [
    { prompt: 'Studies', href: '/study', icon: 'fa-group' },
    { prompt: 'Form', href: '/form', icon: 'fa-file-o' },
    { prompt: 'Answers', href: '/answerset', icon: 'fa-archive' },
    { prompt: 'People', href: '/person', icon: 'fa-male' },
    { prompt: 'User Manager', href: '/user', icon: 'fa-user' }
  ],
  "ADMIN": [
    { prompt: 'Studies', href: '/study', icon: 'fa-group' },
    { prompt: 'Form', href: '/form', icon: 'fa-file-o' },
    { prompt: 'Answers', href: '/answerset', icon: 'fa-archive' },
    { prompt: 'People', href: '/person', icon: 'fa-male' },
    { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
    { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
    { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' }
  ]
})

.controller('HeaderCtrl', 
  ['$scope', '$state', '$location', 'AuthService', 'TABVIEW',
  /**
   * [HeaderCtrl - controller for managing header items]
   * @param {[type]} $scope
   */
  function ($scope, $state, $location, AuthService, TABVIEW) {
    $scope.AuthService = AuthService;
    $scope.navigation = TABVIEW.ADMIN;

    if (!AuthService.isAuthorized()) {
      $location.url('/login');
    } else {
      console.log(AuthService.currentUser);
      console.log(AuthService.currentRoles);
      $scope.navigation = TABVIEW.ADMIN;
    }

    function updateActive() {
      var href = $location.path();
      _.each($scope.navigation, function(link) {
        link.isActive = 
          (href.toLowerCase() === link.href.toLowerCase());
      });
    }

    $scope.$on('$locationChangeSuccess', updateActive);
    updateActive();
  }
]);
