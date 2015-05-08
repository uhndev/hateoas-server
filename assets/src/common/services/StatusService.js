angular.module('dados.common.services.status', [])
  .service('StatusService', ['$rootScope', function($rootScope) {
    'use strict';

    this.authenticated = function(user) {
    	$rootScope.$broadcast('status.authenticated', user);
    };

    this.update = function(message) {
      $rootScope.$broadcast('status.update', message);
    };
  }]);
