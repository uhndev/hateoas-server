(function() {
  'use strict';
  angular
    .module('dados.access', ['dados.role.service', 'dados.user.service'])
    .controller('AccessController', AccessController);
  
  AccessController.$inject = ['$resource', 'toastr', 'RoleService', 'UserService', 'API'];

  function AccessController($resource, toastr, Role, User, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.selected = null;
    vm.adminSelected = false;

    vm.actions = ['create', 'read', 'update', 'delete'];
    vm.roles = ['admin', 'coordinator', 'physician', 'interviewer'];
    vm.models = [];
    vm.userRoles = [];
    vm.masterRoles = [];
    vm.access = {};
    
    // bindable methods
    vm.select = select;
    vm.isRoleSet = isRoleSet;
    vm.addToAccess = addToAccess;
    vm.updateRole = updateRole;
    vm.saveChanges = saveChanges;

    init();
    
    ///////////////////////////////////////////////////////////////////////////

    function init() {
      $resource(API.url() + '/model').get(function (data) {
        vm.models = _.pluck(data.items, 'name');
        vm.models.push('UserOwner');
        _.each(vm.actions, function (action) {
          _.each(vm.models, function (model) {
            vm.masterRoles.push(action + model);
          });          
        });

        User.get(function(data, headers) {
          vm.allow = headers('allow');
          vm.template = data.template;
          vm.resource = angular.copy(data);
        });
      });      
    }

    function clear() {
      vm.userRoles = [];
      vm.roleNames = [];
      vm.access = [];
      vm.selected = null;
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
      if (vm.selected) {
        vm.adminSelected = _.first(vm.selected.roles).name === 'admin';
        vm.userRoles = vm.selected.roles;
        vm.access = _.zipObject(_.pluck(vm.selected.roles, 'name'), _.pluck(vm.selected.roles, 'id'));
      } else {
        clear();
      }      
    }

    function isRoleSet(action, model) {
      if (vm.adminSelected) {
        return true;
      } else {
        var role = action.toString() + model.toString();
        return _.has(vm.access, role);
      }
    }

    function addToAccess(action, model) {
      var findRole = action.toString() + model.toString();
      var RoleName = $resource(API.url() + '/role?name=' + findRole);
      RoleName.get(function (role) {
        var foundRole = _.first(role.items);
        if (foundRole) {
          if (_.has(vm.access, findRole)) {
            delete vm.access[findRole];
          } else {
            vm.access[findRole] = foundRole.id;
          }        
        }      
      });
    }

    function updateRole() {
      var user = new User({
        'updateRole': vm.selected.role
      });
      user.$update({ id: vm.selected.id })
      .then(function() {
        toastr.success('Updated user role!', 'Access');
      });      
    }

    function saveChanges() {
      var user = new User({
        'roles': _.values(vm.access)
      });
      user.$update({ id: vm.selected.id })
      .then(function() {
        toastr.success('Updated user access!', 'Access');
      });
    }
  }

})();