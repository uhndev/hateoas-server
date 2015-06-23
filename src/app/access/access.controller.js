(function() {
  'use strict';
  angular
    .module('dados.access', [
      'toastr',
      'dados.access.service', 
      'dados.user.service'
    ])
    .controller('AccessController', AccessController);
  
  AccessController.$inject = ['toastr', 'GroupService', 'ModelService', 'UserService', 'UserRoles'];

  function AccessController(toastr, Group, Model, User, UserRoles) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.selected = null;

    vm.actions = ['create', 'read', 'update', 'delete'];
    vm.groups = [];
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
      // load groups
      Group.get(function (data) {
        console.log('load data:');
        console.log(data);
        vm.groups = data.items;
        // load models
        Model.get(function (data) {
          vm.models = _.pluck(data.items, 'name');
          vm.models.push('UserOwner');
          _.each(vm.actions, function (action) {
            _.each(vm.models, function (model) {
              vm.masterRoles.push(action + model);
            });          
          });

          // load users
          User.get(function(data, headers) {
            vm.allow = headers('allow');
            vm.template = data.template;
            vm.resource = angular.copy(data);
          });
        });        
      });      
    }

    function loadUser(item) {
      if (!_.isUndefined(_.find(item.roles, { name: 'admin' }))) {
        vm.access = vm.masterRoles;
      } else {
        vm.access = _.pluck(item.roles, 'name');  
      }      
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
      var role = action.toString() + model.toString();
      return _.contains(vm.access, role);
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

    function updateRole(item) {
      var user = new UserRoles({
        'updateGroup': vm.selected.group
      });
      user.$update({ id: vm.selected.id })
      .then(function(user) {
        init();
        clearUser();
        toastr.success('Updated user group!', 'Access');
      });
    }

    function saveChanges() {
      var user = new UserRoles({
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