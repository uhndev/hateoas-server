(function() {
  'use strict';
  angular
    .module('dados.access', ['dados.user.service'])
    .controller('AccessController', AccessController);
  
  AccessController.$inject = ['$resource', 'UserService', 'API'];

  function AccessController($resource, User, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.selected = null;
    vm.adminSelected = false;

    vm.actions = ['create', 'read', 'update', 'delete'];
    vm.models = [];
    vm.userRoles = [];
    vm.masterRoles = [];
    vm.roleNames = [];
    vm.access = [];
    
    // bindable methods
    vm.select = select;
    vm.isRoleSet = isRoleSet;
    vm.addToAccess = addToAccess;
    vm.saveChanges = saveChanges;

    init();
    
    ///////////////////////////////////////////////////////////////////////////

    function init() {
      $resource(API.url() + '/model').get(function (data) {
        vm.models = _.pluck(data.items, 'name');
        $resource(API.url() + '/role').get(function (data) {
          vm.masterRoles = data.items;
          User.get(function(data, headers) {
            vm.allow = headers('allow');
            vm.template = data.template;
            vm.resource = angular.copy(data);
          });  
        });        
      });      
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
      if (vm.selected) {
        vm.adminSelected = _.first(vm.selected.roles).name === 'admin';
        vm.userRoles = vm.selected.roles;
        vm.roleNames = _.pluck(vm.selected.roles, 'name');

        vm.access = [];
        _.each(vm.selected.roles, function (role) {
          vm.access.push(role.id);
        });  
      } else {
        vm.userRoles = [];
        vm.roleNames = [];
        vm.access = [];
      }      
    }

    function isRoleSet(action, model) {
      if (vm.adminSelected) {
        return true;
      } else {
        var role = action.toString() + model.toString();
        return _.contains(vm.roleNames, role);
      }
    }

    function addToAccess(action, model) {
      var findRole = action.toString() + model.toString();
      var foundRole = _.find(vm.masterRoles, { name: findRole });
      if (foundRole) {
        if (_.contains(vm.access, foundRole.id)) {
          vm.access = _.without(vm.access, foundRole.id);
        } else {
          vm.access.push(foundRole.id);    
        }        
      }      
    }

    function saveChanges() {

    }
  }

})();