(function() {
  'use strict';
  angular.module('config.interceptors', ['dados.auth.service'])
  .factory('httpRequestInterceptor', httpRequestInterceptor);

  httpRequestInterceptor.$inject = ['$q', '$location'];

  function httpRequestInterceptor($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 403) {
          $location.path('/login');
          return $q.reject(rejection);
        }

        if (rejection.status >= 400 && rejection.status <= 402) {
          return $q.reject(rejection);
        }

        if (rejection.status >= 404 && rejection.status < 500) {
          $location.path('/400');
          return $q.reject(rejection);
        }

        if (rejection.status > 500) {
          $location.path('/500');
          return $q.reject(rejection);
        }
      }
    };
  }

})();