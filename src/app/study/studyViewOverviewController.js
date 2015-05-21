(function() {
  'use strict';
  angular
    .module('dados.study', [
      'ngform-builder',
      'hateoas',
      'hateoas.controls',
      'dados.common.directives.simpletable',
      'dados.common.directives.list-editor'
    ])
    .constant('FORM_NAME', 'survey_tracking')
    .controller('StudyOverviewController', StudyOverviewController);
  
  StudyOverviewController.$inject = ['$scope', '$rootScope', '$resource', '$location', 'API', 'FORM_NAME'];
  
  function StudyOverviewController($scope, $rootScope, $resource, $location, API, FORM_NAME) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.studyInfo = {};
    vm.collectionCentres = {};
    vm.savedData = {};
    vm.url = API.url() + $location.path();    

    // bindable methods
    vm.generateReport = generateReport;
    vm.saveChanges = saveChanges;
    vm.revertChanges = revertChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      var SurveyForm = $resource(API.url() + '/form?form_name=' + FORM_NAME);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'name', 'reb', 'users');
        
        vm.studyInfo = {
          columns: [ 'Name', 'Value' ],
          tableData: parseData(robj)
        };

        vm.collectionCentres = {
          tableData: data.items.collectionCentres || [],
          columns: [
            { title: 'Collection Centres', field: 'name', type: 'text' },
            { title: 'Contact', field: 'contact', type: 'text'}
          ]
        };
        
        vm.savedData = {
          forceReload: false,
          data: angular.copy(vm.collectionCentres)
        };

        // initialize submenu
        if (_.has(data.items, 'links')) {
          var submenu = {
            href: data.items.slug,
            name: data.items.name,
            links: data.items.links
          };
          angular.copy(submenu, $scope.dados.submenu);
        }
      });

      SurveyForm.get(function (data) {
        vm.clinicalForm = angular.copy(_.first(data.items));
      });
    }

    function parseData(robj) {
      return _.map(_.keys(robj), function (k) {
        var resp = { name: 'Study ' + _.camelCase(k) };
        if (_.isArray(robj[k])) {
          resp.value = _.pluck(robj[k], 'username').join(', ');
        } else {
          resp.value = robj[k];
        }        
        return resp;
      });
    }

    function generateReport() {
      alert('Generating report');
    }

    function saveChanges() {
      angular.copy(vm.collectionCentres, vm.savedData.data);
      console.log(angular.copy(vm.collectionCentres));
    }

    function revertChanges() {
      angular.copy(vm.savedData.data, vm.collectionCentres);
      vm.savedData.forceReload = !vm.savedData.forceReload;
    }

    $scope.$on('hateoas.client.refresh', function(e) {
      init();
    });
  }
})();