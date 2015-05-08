angular.module( 'dados.formbuilder.controller', [
  'ngResource',
  'ngform-builder'
])

.controller('FormBuilderController',
  ['$location', '$timeout', '$resource', 'StatusService',
  function ($location, $timeout, $resource, StatusService) {
    'use strict';

    var vm = this;
    var api = 'http://localhost:1337/api/form/:id';
    var Resource = $resource(api, {}, {'update': { method: 'PUT' }});
    vm.form = {};

    var pushError = function(err) {
      StatusService.update({msg: err, type: 'danger'});
    };

    var query = $location.search();
    // if formURL to load contains a form ID, load it
    if (_.has(query, 'id')) {
      Resource.get(_.pick(query, 'id')).$promise.then(function (form) {
        angular.copy(form.items, vm.form);
        StatusService.update({msg: 'Loaded form '+vm.form.form_name+' successfully!', type: 'info'});
      }, function (err) {
        StatusService.update({msg: 'Unable to load form! ' + err, type: 'danger'});
      });
    }

    vm.saveForm = function() {
      var resource = new Resource(vm.form);
      // if current form object has an href attribute, we update
      if (_.has(vm.form, 'href')) {
        resource.$update( {id:vm.form.id} ).then(function (data) {
          StatusService.update({msg: 'Updated form '+vm.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);        
      } 
      // otherwise, we create a new form
      else {
        resource.$save().then(function (data) {
          StatusService.update({msg: 'Saved form '+vm.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);
      }    
    };
  }
]);