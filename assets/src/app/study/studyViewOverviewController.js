(function() {
  'use strict';
  angular
    .module('dados.study', [
      'ngform-builder',
      'hateoas.controls',
      'dados.common.directives.simpletable'
    ])
    .controller('StudyOverviewController', StudyOverviewController);
  
  StudyOverviewController.$inject = ['$resource', '$location', 'API'];
  
  function StudyOverviewController($resource, $location, API) {
    var vm = this;

    // bindable members
    vm.allow = [];
    vm.template = {};
    vm.resource = [];
    vm.info = {};
    vm.enrollment = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.follow = followLink;
    vm.generateReport = generateReport;   

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      var ClinicalForm = $resource(API.url() + '/form?form_name=clinical_tracking');

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
      });

      ClinicalForm.get(function (data) {
        vm.clinicalForm = angular.copy(_.first(data.items));
      });
    }

    function parseData(robj) {
      return _.map(_.keys(robj), function (k) {
        var resp = { name: 'Study ' + _.camelCase(k) };
        if (_.isArray(robj[k])) {
          resp.value = _.pluck(robj[k], 'username');
        } else {
          resp.value = robj[k];
        }        
        return resp;
      });
    }

    function followLink(link) {
      if (link) {
        if (link.rel) {
          var index = link.href.indexOf(API.prefix) + API.prefix.length;
          $location.path(link.href.substring(index));
        }
      }
    }

    function generateReport() {
      alert('Generating report');
    }
  }
})();