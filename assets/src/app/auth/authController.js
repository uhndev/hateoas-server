/**
 * Module for handling authentication of users
 */

angular.module( 'dados.auth', [
  'ui.bootstrap',
  'ui.router',
  'ngCookies',
  'ipCookie',
  'dados.auth.service'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state( 'login', {
      url: '/login',
      controller: 'AuthController as auth',
      templateUrl: 'auth/login.tpl.html',
      data: { pageTitle: 'Login' }
    })
    .state( 'register', {
      url: '/register',
      controller: 'AuthController as auth',
      templateUrl: 'auth/register.tpl.html',
      data: { pageTitle: 'Register' }
    });
})
.controller('AuthController', ['$location', '$state', '$cookieStore', 'ipCookie', 'AuthService',
  function ($location, $state, $cookieStore, ipCookie, AuthService) {
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
      this.error = err;
    };

    this.login = function() {
      AuthService.login(this.credentials, success, error);
    };

    this.register = function(isValid) {
      if (isValid) {
        AuthService.register(this.credentials, success, error);
      }
    };
  } 
]);
