(function () {
    'use strict';
    angular.module('AHS.client', ['ngAnimate',
        'ui.router',
        'ngCookies',
        'ngSanitize',
        'trNgGrid',
        'ui.bootstrap',
        'LocalStorageModule',
        'AHS.client.service',
        'AHS.client.controller'
        ])
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('app.client', {
                    url: '/client',
                    data: {pageTitle: 'Clients'},
                    views: {
                        'main': {
                            templateUrl: 'client/index.tpl.html',
                            controller: 'clientController'
                        }
                    }
                })
                .state('app.newClient', {
                    abstract: true,
                    url: '/newClient',
                    data: {pageTitle: 'Add Client'},
                    views: {
                        'main': {
                            templateUrl: 'app/components/Client/newClient.html',
                            controller: 'clientController'
                        }
                    }
                })
                .state('app.newClient.client', {
                    url: '',
                    templateUrl: 'app/components/Client/newClient.client.html'
                })

                .state('app.newClient.Demo', {
                    url: '/newClient.Demo',
                    templateUrl: 'app/components/Client/newClient.demo.html'
                })

                .state('app.editClient', {
                    abstract: true,
                    url: '/editClient/:mrn',
                    data: {pageTitle: 'Edit Client'},
                    resolve: {
                        client: function (clientApiservice, $stateParams) {
                            return clientApiservice.getClientByMrn($stateParams.mrn).then(function (response) {
                                return response.data.clients[0];
                            });
                        }

                    },
                    views: {
                        'main': {
                            templateUrl: 'app/components/Client/editClient.html',
                            controller: 'clientEditController'
                        }
                    }
                })

                .state('app.editClient.client', {
                    url: '',
                    templateUrl: 'app/components/Client/editClient.client.html'
                })

                .state('app.editClient.Demo', {
                    url: '/editClient.Demo',
                    templateUrl: 'app/components/Client/editClient.demo.html'
                })

                .state('app.clientDetails', {
                    url: '/clientDetails/:mrn',
                    data: {pageTitle: 'Client Details'},
                    views: {
                        'main': {
                            templateUrl: 'app/components/Client/ClientDetails/Index.html',
                            controller: 'clientController'
                        }
                    }
                })
                .state('app.clientDetails.Referrals', {
                    url: '/client.referrals/',
                    templateUrl: 'app/components/Client/ClientDetails/Referrals.html'
                });

        }]);
})();



