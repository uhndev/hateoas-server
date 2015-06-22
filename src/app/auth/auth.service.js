(function() {
  'use strict';
  
  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ipCookie',
      'ngResource',
      'dados.auth.constants',
      'dados.header.constants'
    ])
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', '$rootScope', '$location', 'SUBVIEW',
    '$resource', '$cookieStore', 'ipCookie'
  ]; 

  function AuthService(Auth, $rootScope, $location, SUBVIEW,
                      $resource, $cookieStore, ipCookie) {
    
    var LoginAuth = $resource(Auth.LOGIN_API);
    var self = this;

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
      delete this.tabview;
      delete this.subview;
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    this.setAuthenticated = function() {
      this.currentUser = ipCookie('user');
      this.currentRole = ipCookie('user').group;
      this.tabview = ipCookie('user').tabview;
      this.subview = ipCookie('user').subview;
      $rootScope.$broadcast("events.authorized");
    };

    this.getRoleLinks = function(links) {
      return _.filter(links, function(link) {
        return _.contains(self.subview, link.rel);
      });
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