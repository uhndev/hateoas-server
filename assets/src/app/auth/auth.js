/**
 * Module for handling authentication of users
 */

angular.module( 'dados.auth', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'dados.auth.service'
])
.config(function config( $stateProvider ) {
$stateProvider
    .state( 'login', {
        url: '/login',
        controller: 'AuthController',
        templateUrl: 'auth/login.tpl.html',
        data: { pageTitle: 'Login' }
    })
    .state( 'register', {
        url: '/register',
        controller: 'AuthController',
        templateUrl: 'auth/register.tpl.html',
        data: { pageTitle: 'Register' }
    });
})
.controller('AuthController', ['$scope', '$window', '$location', '$state', '$cookieStore', 'AuthService',
    function ($scope, $window, $location, $state, $cookieStore, AuthService) {
        // check if already logged in
        if (AuthService.isAuthorized()) {
            $location.url('/');
        }

        var success = function(user) {
			if (user) {
                var now = new Date();
                $cookieStore.put('user', user, {
                    expires: new Date(now.getTime() + 900000)
                });
				$location.url('/study');
				$state.go('hateoas');
			}
		};
        var error = function(err) { 
			$scope.error = err;
		};

        $scope.login = function() {
            AuthService.login($scope.credentials, success, error);
        };

        $scope.register = function(isValid) {
            if (isValid) {
                AuthService.register($scope.credentials, success, error);
            }
        };
    } 
]);
