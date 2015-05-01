/**
 * Module for controlling the header on each page;
 */

angular.module('dados.header', [
  'dados.header.constants',
  'dados.auth.service'
])

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

    $scope.status = {
      isopen: false
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };    

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
