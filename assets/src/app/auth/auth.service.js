(function() {
  'use strict';
  
  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ipCookie',
      'ngResource',
      'dados.auth.constants'
    ])
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', '$rootScope', '$location',
    '$resource', '$cookieStore', 'ipCookie'
  ]; 

  function AuthService(Auth, $rootScope, $location,
                      $resource, $cookieStore, ipCookie) {
    
    var LoginAuth = $resource(Auth.LOGIN_API);

    this.isAuthenticated = function() {
      var auth = Boolean(ipCookie('user'));
      if (!auth) {
        this.setUnauthenticated();
      } else {
        this.setAuthenticated();
      }
      return auth;
    };

    this.setUnauthenticated = function() {
      ipCookie.remove('user');
      delete this.currentUser;
      delete this.currentRole;      
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    this.setAuthenticated = function() {
      this.currentUser = ipCookie('user');
      this.currentRole = ipCookie('user').role;
      $rootScope.$broadcast("events.authorized");
    };

    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    this.logout = function(data, onSuccess, onError) {      
      this.setUnauthenticated();
      // $cookieStore.remove('user');
      return $resource(Auth.LOGOUT_API).query();
    };
  }  
})();