angular.module( 'dados', [
	'templates-app',
	'templates-common',
  'status',
	'dados.auth',
	'dados.header',
  'dados.workflow',
  'dados.formbuilder',
	'dados.error',
    'dados.filters.formatter',
    'dados.filters.type',
   'hateoas',
    'hateoas.queryBuilder',
  'config.interceptors',
  'ui.router',
	'dados.common.services.csrf'
])
// Configure all Providers
.config( function myAppConfig ($httpProvider, $stateProvider) { 
  $httpProvider.interceptors.push('httpRequestInterceptor');
  $stateProvider.state('hateoas', {
    template: '<div class="container" hateoas-client></div>'
  });
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $state, $location ) {
  if (_.isEmpty($location.path())) {
    $location.path('/study');
  } else {
    $state.go('hateoas');
  }

  $scope.$on('$locationChangeSuccess', function(e, current, prev) {
    $scope.pageTitle = _.titleCase($location.path()
                                     .replace(/\//g, ' ')
                                     .toLowerCase()
                                     .trim());
  });
  
});
