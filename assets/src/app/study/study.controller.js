(function() {
  'use strict';
  angular
    .module('dados.study.controller', [
      'dados.common.directives.selectLoader',
      'dados.common.directives.simpleTable',
      'dados.common.directives.formBuilder.directives.form'
    ])
    .constant('FORM_NAME', 'survey_tracking')
    .controller('StudyOverviewController', StudyOverviewController);
  
  StudyOverviewController.$inject = [
    '$scope', '$resource', '$location', 
    'StudyService', 'toastr', 'API', 'FORM_NAME'
  ];
  
  function StudyOverviewController($scope, $resource, $location, Study, toastr, API, FORM_NAME) {
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
    vm.addCentre = addCentre;
    vm.cancelAdd = cancelAdd;
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
          rows: {
            'name': { title: 'Name', type: 'text' },
            'reb': { title: 'REB', type: 'text' },
            'users': { title: 'Users', type: 'users' }
          },
          tableData: _.objToPair(robj)
        };

        vm.collectionCentres = {
          subjects_total: _.sum(_.pluck(data.items.centreSummary, 'subjects_count')),
          coordinators_total: _.sum(_.pluck(data.items.centreSummary, 'coordinators_count')),
          tableData: data.items.centreSummary || [],
          columns: [
            { title: 'Collection Centres', field: 'name', type: 'text' },
            { title: 'Contact', field: 'contact', type: 'multi' },
            { title: 'Coordinators/Interviewers', field: 'coordinators_count', type: 'number'},
            { title: 'Subjects Enrolled', field: 'subjects_count', type: 'number'}
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

    function parseData(obj) {
      return _.map(_.keys(obj), function (k) {
        var val = obj[k];
        if (_.all(obj[k], function(o) { return _.has(o, 'id'); })) {
          val = _.pluck(obj[k], 'id');
        }
        return { 
          name: k,
          value: val
        };
      });
    }

    function generateReport() {
      alert('Generating report');
    }

    function addCentre() {
      vm.collectionCentres.tableData.push({name:'', contact:[]});
      vm.addingNew = true;
    }

    function cancelAdd() {
      if (vm.addingNew) {
        vm.collectionCentres.tableData.pop();
        vm.addingNew = false;
      }      
    }

    function saveChanges() {
      angular.copy(vm.collectionCentres, vm.savedData);
      var study = new Study({ 'collectionCentres': vm.collectionCentres.tableData });
      vm.addingNew = false;
      study.$update({ id: vm.resource.items.id }).then(function (data) {
        toastr.success('Updated collection centres successfully!', 'Collection Centre');
      }).catch(function (err) {
        toastr.error(err, 'Collection Centre');
      });
    }

    function revertChanges() {
      angular.copy(vm.savedData, vm.collectionCentres);
      vm.addingNew = false;
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();