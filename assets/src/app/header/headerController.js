/**
 * Module for controlling the header on each page;
 */

angular.module('dados.header', [
  'dados.header.constants',
  'dados.auth.service'
])

.controller('HeaderCtrl', 
  ['$scope', '$state', '$location', 'AuthService', 'TABVIEW',
  /**
   * [HeaderCtrl - controller for managing header items]
   * @param {[type]} $scope
   */
  function ($scope, $state, $location, AuthService, TABVIEW) {
    $scope.AuthService = AuthService;
    // $scope.navigation = TABVIEW.SUBJECT;

    function updateHeader() {
      if (AuthService.currentRole) {
        var view = AuthService.currentRole.toString().toUpperCase();
        if (TABVIEW[view] !== $scope.navigation) {
          angular.copy(TABVIEW[view], $scope.navigation);
        }
      }
    }

    function updateActive() {
      updateHeader();
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
      $scope.navigation = TABVIEW.SUBJECT;
    });

    $scope.$on('$locationChangeSuccess', updateActive);
    updateActive();
  }
]);
