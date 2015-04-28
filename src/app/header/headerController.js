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
  ['$rootScope', '$scope', '$state', '$location', 'AuthService', 'TABVIEW',
  /**
   * [HeaderCtrl - controller for managing header items]
   * @param {[type]} $scope
   */
  function ($rootScope, $scope, $state, $location, AuthService, TABVIEW) {
    $scope.AuthService = AuthService;
    $scope.navigation = TABVIEW.SUBJECT;

    function updateActive() {
      var href = $location.path();
      _.each($scope.navigation, function(link) {
        link.isActive = 
          (href.toLowerCase() === link.href.toLowerCase());
      });
    }

    $scope.$on('events.unauthorized', function() {
      $location.url('/login');
    });

    $scope.$on('events.authorized', function() {
      $scope.navigation = TABVIEW.ADMIN;
    });

    $scope.$on('$locationChangeSuccess', updateActive);
    updateActive();
  }
]);
