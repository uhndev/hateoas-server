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
    vm.masterRoles = [];
    vm.access = [];
    
    // bindable methods
    vm.select = select;
    vm.isRoleSet = isRoleSet;
    vm.addToAccess = addToAccess;
    vm.removeAccess = removeAccess;
    vm.updateRole = updateRole;
    vm.saveChanges = saveChanges;

    init();
    
    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */
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

    function loadUser(item) {
      vm.adminSelected = _.first(item.roles).name === 'admin';
      vm.access = _.pluck(item.roles, 'name');
    }

    function clearUser() {
      vm.access = [];
      vm.selected = null;
    }

    /**
     * Public Bindable Methods
     */
    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
      if (vm.selected) {
        loadUser(vm.selected);
      } else {
        clearUser();
      }      
    }

    function isRoleSet(action, model) {
      if (vm.adminSelected) {
        return true;
      } else {
        var role = action.toString() + model.toString();
        return _.contains(vm.access, role);
      }
    }

    function addToAccess(action, model) {
      var findRole = action.toString() + model.toString();
      if (_.contains(vm.access, findRole)) {
        vm.access = _.without(vm.access, findRole);
      } else {
        vm.access.push(findRole);
      }
    }

    function removeAccess(permission) {
      vm.access = _.without(vm.access, permission);
    }

    function updateRole() {
      var user = new User({
        'updateRole': vm.selected.role
      });
      user.$update({ id: vm.selected.id })
      .then(function(user) {
        init();
        clearUser();
        toastr.success('Updated user role!', 'Access');
      });      
    }

    function saveChanges() {
      var user = new User({
        'roles': vm.access
      });
      user.$update({ id: vm.selected.id })
      .then(function(user) {
        init();
        toastr.success('Updated user access!', 'Access');
      });
    }
  }

})();