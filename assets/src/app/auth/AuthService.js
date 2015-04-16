angular.module('dados.auth.service', ['ngResource', 'ngCookies'])
       .constant('LOGIN_API', 'http://localhost:1337/auth/local')
       .constant('REGISTER_API', 'http://localhost:1337/auth/local/register')
       .constant('LOGOUT_API', 'http://localhost:1337/logout')
       .service('AuthService', ['LOGIN_API', 'REGISTER_API', 'LOGOUT_API', '$resource', '$cookies',
  function AuthService(loginURL, registerURL, logoutURL, $resource, $cookies) {
    'use strict';
    
    var LoginAuth    = $resource(loginURL);
    var RegisterAuth = $resource(registerURL);

    this.isAuthorized = function(onSuccess) {
      return Boolean($cookies.get('user'));
    };

    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    this.register = function(data, onSuccess, onError) {
      var state = new RegisterAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    this.logout = function(data, onSuccess, onError) {
      $cookies.remove('user');
      return $resource(logoutURL).query();
    };
  }
]);