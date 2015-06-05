(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas.controller', [
    'ngTable',
    'dados.common.directives.hateoas.utils',
    'dados.common.services.sails'
  ])
  .controller('HateoasController', HateoasController);

  HateoasController.$inject = [
    '$scope', '$resource', '$location', 'AuthService',
    'API', 'ngTableParams', 'sailsNgTable', 'HateoasUtils'
  ];
      
  function HateoasController($scope, $resource, $location, AuthService, 
                              API, TableParams, SailsNgTable, Utils) {

    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.filters = {};
    vm.allow = '';
    vm.template = {};
    vm.resource = {};

    // bindable methods
    vm.follow = follow;
    vm.select = select;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var currStudy = _.getStudyFromUrl($location.path());

      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
        counts: [],
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.query);

          Resource.get(api, function(data, headers) {
            vm.selected = null;
            vm.allow = headers('allow');
            vm.template = data.template;
            vm.resource = angular.copy(data);
            params.total(data.total);
            $defer.resolve(data.items);

            // initialize submenu
            if (currStudy && _.has(data, 'links') && data.links.length > 0) {
              // from workflowstate and current url study
              // replace wildcards in href with study name
              _.map(data.links, function(link) {
                if (link.rel === 'overview' && link.prompt === '*') {
                   link.prompt = currStudy;
                }  
                if (_.contains(link.href, '*')) {
                  link.href = link.href.replace(/\*/g, currStudy);  
                }  
                return link;
              });
              var submenu = {
                links: AuthService.getRoleLinks(data.links)
              };
              angular.copy(submenu, $scope.dados.submenu);
            }
          });
        }
      });
    }
    

    function follow(link) {
      if (link) {
        if (link.rel) {
          $location.path(_.convertRestUrl(link.href, API.prefix));
        }
      }
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
      if (_.has(vm.selected, 'links')) {
        var submenu = {
          href: vm.selected.slug,
          name: vm.selected.name,
          links: AuthService.getRoleLinks(vm.selected.links)
        };
        angular.copy(submenu, $scope.dados.submenu);
      } 
    }

    // watchers
    $scope.$watchCollection('hateoas.query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        // Page changes will trigger a reload. To reduce the calls to
        // the server, force a reload only when the user is already on
        // page 1.
        if ($scope.tableParams.page() !== 1) {
          $scope.tableParams.page(1);
        } else {
          $scope.tableParams.reload();
        }
      }
    });

    $scope.$on('hateoas.client.refresh', function(e) {
      $scope.tableParams.reload();
    });
  }

})();
