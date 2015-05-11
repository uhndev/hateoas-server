(function(){
	'use strict';

	angular.module('dados.common.services.status', [])
  .service('StatusService', StatusService);

  StatusService.$inject = ['$rootScope'];

  function StatusService($rootScope) {

    this.authenticated = function(user) {
    	$rootScope.$broadcast('status.authenticated', user);
    };

    this.update = function(message) {
      $rootScope.$broadcast('status.update', message);
    };
  }

})();

