(function() {
  'use strict';

  angular.module('dados', [
  	'templates-app',
  	'templates-common',  
    'ui.router',
    'config.interceptors',
  	'dados.auth',
    'dados.study',
  	'dados.status',
    'dados.header',
    'dados.workflow',
    'dados.formbuilder',
  	'dados.error',
    'dados.filters.formatter',
    'dados.filters.type',
    'dados.common.services.csrf',
    'dados.common.services.status',
    'hateoas',
    'hateoas.queryBuilder'
  ])
  // Configure all Providers
  .config( function DadosConfig ($httpProvider, $stateProvider) { 
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $stateProvider.state('hateoas', {
      template: '<div class="container" hateoas-client></div>'
    });
  })
  .controller('DadosController', DadosController);

  DadosController.$inject = ['$scope', '$state', '$location'];
  
  function DadosController($scope, $state, $location) {

    var vm = this;
    vm.submenu = {};

    if (_.isEmpty($location.path())) {
      $location.path('/study');
    } else {
      $state.go('hateoas');  
    }    

    $scope.$on('$locationChangeSuccess', function(e, current, prev) {
      var prevBaseUrl = _.parseUrl($location, prev)[0];
      var currBaseUrl = _.first(_.pathnameToArray($location.path()));

      if (prevBaseUrl !== currBaseUrl) {
        vm.submenu = {};
      }

      $scope.pageTitle = _.titleCase($location.path()
                                       .replace(/\//g, ' ')
                                       .toLowerCase()
                                       .trim());     
    }); 
  }

})();
