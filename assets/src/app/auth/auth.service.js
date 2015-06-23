(function() {
  'use strict';
  
  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ngResource',
      'dados.auth.constants',
      'dados.header.constants'
    ])
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', '$rootScope', '$location', '$resource', '$cookieStore', 'TABVIEW', 'SUBVIEW'
  ]; 

  function AuthService(Auth, $rootScope, $location, $resource, $cookieStore, TABVIEW, SUBVIEW) {
    
    var LoginAuth = $resource(Auth.LOGIN_API);
    var self = this;

    this.isAuthenticated = function() {
      var auth = Boolean($cookieStore.get('user'));
      if (!auth) {
        this.setUnauthenticated();
      } else {
        this.setAuthenticated();
      }
      return auth;
    };

    this.setUnauthenticated = function() {
      $cookieStore.remove('user');
      delete this.currentUser;
      delete this.currentRole;      
      delete this.tabview;
      delete this.subview;
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    this.setAuthenticated = function() {
      this.currentUser = $cookieStore.get('user');
      this.currentRole = $cookieStore.get('user').group;
      var view = this.currentRole.toString().toUpperCase();
      this.tabview = $cookieStore.get('user').tabview || TABVIEW[view];
      this.subview = $cookieStore.get('user').subview || SUBVIEW[view];
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
      $cookieStore.remove('user');
      return $resource(Auth.LOGOUT_API).query();
    };
  }  
})();