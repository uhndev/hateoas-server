(function() {
	'use strict';
	angular.module('hateoas.itemcontroller', [
		'ngTable', 
		'hateoas',
		'hateoas.utils',
		'dados.common.services.sails'
	])
	.controller('HateoasItemController', HateoasItemController);

	HateoasItemController.$inject = [
		'$scope', '$resource', '$location', 'API', 'ngTableParams', 'sailsNgTable', 'HateoasUtils'
	];

  function HateoasItemController ($scope, $resource, $location, API, TableParams, SailsNgTable, Utils) {
    $scope.url = API.url() + $location.path();

    var Resource = $resource($scope.url);

    $scope.follow = function(link) {
      if (link) {
        if (link.rel) {
          var index = link.href.indexOf(API.prefix) + API.prefix.length;
          $location.path(link.href.substring(index));
        }
      }
    };

    $scope.select = function(item) {
      $scope.selected = ($scope.selected === item ? null : item);
    };

    $scope.$on('hateoas.client.refresh', function(e) {
      $scope.tableParams.reload();
    });

    var TABLE_SETTINGS = {
      page: 1,
      count: 10,
      filter: $scope.filters
    };

    $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
      counts: [],
      getData: function($defer, params) {
        var api = SailsNgTable.parse(params, $scope.query);

        Resource.get(api, function(data, headers) {
          $scope.selected = null;
          $scope.allow = headers('allow');
          $scope.template = data.template;
          $scope.resource = angular.copy(data);
          params.total(data.total);
          $defer.resolve(data.items);
        });
      }
    });
  }

})();