(function() {
  'use strict';
  angular
    .module('dados.study', [
      'ngform-builder',
      'hateoas.controls',
      'dados.common.directives.simpletable'
    ])
    .constant('FORM_NAME', 'survey_tracking')
    .controller('StudyOverviewController', StudyOverviewController);
  
  StudyOverviewController.$inject = ['$scope', '$resource', '$location', 'API', 'FORM_NAME'];
  
  function StudyOverviewController($scope, $resource, $location, API, FORM_NAME) {
    var vm = this;

    // bindable variables
    vm.allow = [];
    vm.template = {};
    vm.resource = [];
    vm.info = {};
    vm.enrollment = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.generateReport = generateReport;

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
        vm.info = {
          columns: ['Name', 'Value'],
          data: parseData(robj)
        };
        vm.enrollment = {
          columns: ['Collection Centre', 'Enrolled'],
          data: [
            {name: 'PMH', value:62},
            {name: 'TGH', value:15},
            {name: 'TWH', value:1}
          ]
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
  }
})();