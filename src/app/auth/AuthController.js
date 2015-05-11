/**
 * Module for handling authentication of users
 */

(function() {
  'use strict';
  angular.module('dados.auth', [
    'ui.router',
    'ngCookies',
    'ipCookie',
    'dados.auth.service'
  ])
  .config(function config( $stateProvider ) {
    $stateProvider
      .state( 'login', {
        url: '/login',
        controller: AuthController,
        controllerAs: 'auth',
        templateUrl: 'auth/login.tpl.html',
        data: { pageTitle: 'Login' }
      });
  });

  AuthController.$inject = ['$location', '$state', '$cookieStore', 'ipCookie', 'AuthService', 'StatusService'];

  function AuthController($location, $state, $cookieStore, ipCookie, AuthService, StatusService) {
    var vm = this;
    vm.error = '';
    
    // check if already logged in
    if (AuthService.isAuthenticated()) {
      $location.url('/');
    }

    var success = function(user) {
      if (user) {
        var now = new Date();
        ipCookie('user', user, {
          expires: new Date(now.getTime() + 900000)
        });
        AuthService.setAuthenticated();
        StatusService.authenticated(user);
        // wait until stable angular 1.3 for cookie expiration support
        // $cookieStore.put('user', user, {
        //   expires: new Date(now.getTime() + 900000)
        // });
        $location.url('/study');
        $state.go('hateoas');
      }
    };

    var error = function(err) {
      vm.error = err;
    };

    vm.login = function() {
      AuthService.login(vm.credentials, success, error);
    };

    vm.register = function(isValid) {
      if (isValid) {
        AuthService.register(vm.credentials, success, error);
      }
    };
  } 
})();

