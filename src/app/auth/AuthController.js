/**
 * Module for handling authentication of users
 */

angular.module( 'dados.auth', [
  'ui.router',
  'ngCookies',
  'ipCookie',
  'ngSails',
  'dados.auth.service'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state( 'login', {
      url: '/login',
      controller: 'AuthController',
      templateUrl: 'auth/login.tpl.html',
      data: { pageTitle: 'Login' }
    });
})
.controller('AuthController', ['$scope', '$sails', '$location', '$state', '$cookieStore', 'ipCookie', 'AuthService',
  function ($scope, $sails, $location, $state, $cookieStore, ipCookie, AuthService) {
    $scope.error = '';
    
    // check if already logged in
    if (AuthService.isAuthorized()) {
      $location.url('/');
    }

    var success = function(user) {
      if (user) {
        var now = new Date();
        ipCookie('user', user, {
          expires: new Date(now.getTime() + 900000)
        });
        // wait until stable angular 1.3 for cookie expiration support
        // $cookieStore.put('user', user, {
        //   expires: new Date(now.getTime() + 900000)
        // });
        $location.url('/study');
        $state.go('hateoas');
      }
    };

    var error = function(err) {
      $scope.error = err;
    };

    $scope.login = function() {
      AuthService.login($scope.credentials, success, error);
    };

    $scope.register = function(isValid) {
      if (isValid) {
        AuthService.register($scope.credentials, success, error);
      }
    };
  } 
]);
