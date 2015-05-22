(function() {
  'use strict';
  angular.module( 'dados.formbuilder.controller', [
    'ngResource',
    'dados.common.directives.formBuilder'
  ])
  .constant('FORM_API', 'http://localhost:1337/api/form/:id')
  .controller('FormBuilderController', FormBuilderController);
  
  FormBuilderController.$inject = ['$location', '$timeout', '$resource', 'StatusService', 'FORM_API'];

  function FormBuilderController($location, $timeout, $resource, Status, FORM_API) {
    var vm = this;
    var Resource;
    
    // bindable variables
    vm.form = {};
    // bindable methods
    vm.saveForm = saveForm;

    init();
    
    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var query = $location.search();
      Resource = $resource(FORM_API, {}, {'update': { method: 'PUT' }});
      // if formURL to load contains a form ID, load it
      if (_.has(query, 'id')) {
        Resource.get(_.pick(query, 'id')).$promise.then(function (form) {
          angular.copy(form.items, vm.form);
          Status.update({msg: 'Loaded form '+vm.form.form_name+' successfully!', type: 'info'});
        }, function (err) {
          Status.update({msg: 'Unable to load form! ' + err, type: 'danger'});
        });
      }
    }

    function pushError(err) {
      Status.update({msg: err, type: 'danger'});
    }

    function saveForm() {
      var resource = new Resource(vm.form);
      // if current form object has an href attribute, we update
      if (_.has(vm.form, 'href')) {
        resource.$update( {id:vm.form.id} ).then(function (data) {
          Status.update({msg: 'Updated form '+vm.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);        
      } 
      // otherwise, we create a new form
      else {
        resource.$save().then(function (data) {
          Status.update({msg: 'Saved form '+vm.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);
      }    
    }
  }

})();