(function() {
  'use strict';
  angular
    .module('dados.user', [
      'dados.user.service',
      'dados.common.directives.simpleTable',
      'dados.common.directives.listEditor'
    ])
    .controller('UserOverviewController', UserOverviewController);
  
  UserOverviewController.$inject = [
    '$scope', '$resource', '$location', 'UserService', 'toastr', 'API'
  ];
  
  function UserOverviewController($scope, $resource, $location, UserAccess, toastr, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.title = '';
    vm.template = {};
    vm.resource = {};
    vm.userInfo = {};
    vm.centreAccess = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.addCentre = addCentre;
    vm.cancelAdd = cancelAdd;
    vm.saveChanges = saveChanges;
    vm.revertChanges = revertChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'username', 'email', 'prefix', 'firstname', 'lastname');
        
        vm.title = _.camelCase(data.items.username);
        if (data.items.prefix && data.items.firstname && data.items.lastname) {
          vm.title = [data.items.prefix, data.items.firstname, data.items.lastname].join(' ');
        }
        
        vm.userInfo = {
          columns: [ 'Name', 'Value' ],
          rows: {
            'username': { title: 'Username', type: 'text' },
            'email': { title: 'Email', type: 'text' },
            'prefix': { title: 'Prefix', type: 'text' },
            'firstname': { title: 'Firstname', type: 'text' },
            'lastname': { title: 'Lastname', type: 'text' }
          },
          tableData: _.objToPair(robj)
        };

        vm.centreAccess = {
          tableData: data.items.centreAccess || [],
          columns: [
            { title: 'Study', field: 'study', type: 'single' },
            { title: 'Role', field: 'role', type: 'single' },
            { title: 'Collection Centre', field: 'collectionCentre', type: 'single' }
          ]
        };      
      });
    }

    function addCentre() {
      vm.centreAccess.tableData.push({study: '', role:'', collectionCentre: ''});
      vm.addingNew = true;
    }

    function cancelAdd() {
      if (vm.addingNew) {
        vm.centreAccess.tableData.pop();
        vm.addingNew = false;
      }      
    }

    function saveChanges() {
      angular.copy(vm.centreAccess, vm.savedData);
      var access = new UserAccess({ 'collectionCentres': vm.centreAccess.tableData });
      vm.addingNew = false;
      access.$update({ id: vm.resource.items.id }).then(function (data) {
        toastr.success('Updated collection centre permissions successfully!', 'Collection Centre');
      }).catch(function (err) {
        toastr.error(err, 'Collection Centre');
      });
    }

    function revertChanges() {
      angular.copy(vm.savedData, vm.centreAccess);
      vm.addingNew = false;
    }    

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();