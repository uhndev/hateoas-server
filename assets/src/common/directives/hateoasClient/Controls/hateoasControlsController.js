(function() {
  'use strict';
  angular.module('hateoas.controls.controller', [
    'hateoas.modal.controller',
    'hateoas.controls.service',
    'hateoas.utils',
    'dados.common.directives.formBuilder.directives.form'
  ])
  .controller('HateoasControlsController', HateoasControlsController);

  HateoasControlsController.$inject = [
    '$scope', '$modal', '$location', 
    'API', 'SLUG_ROUTES', 'HateoasUtils', 'StatusService'
  ];
 
  /**
   * Controller for the directive
   */
  function HateoasControlsController($scope, $modal, $location, 
                                      API, SLUG_ROUTES, HateoasUtils, StatusService) {
    // By default, the HateoasService is used. However, the service can be
    // overridden by declaring the service in the directive.
    var Service = HateoasUtils.getService('ControlsService');

    /**
     * Private: archive
     * Archives an item on the API.
     * @param   item - item to archive
     * @returns $promise
     */
    function archive(item) {
      Service.archive(item);
    }

    /**
     * Private: edit
     * Launches a form to edit or create an item. Uses form-builder to draw the
     * form.
     * @param   item - item to create/update
     * @returns null
     */
    function open(method) {
      var modalScope = $scope.$new(true);
      modalScope.item = (method === 'post' ? 
          {} : angular.copy($scope.item));
      modalScope.template = $scope.template;

      var instance = $modal.open({
        templateUrl: 'directives/hateoasClient/Modal/hateoasModal.tpl.html',
        controller: 'HateoasModalController',
        size: 'lg',
        scope: modalScope
      });

      instance.result.then(function(item) {
        var newItem = _.merge(modalScope.item, item);
        var api = newItem.href || $scope.href;
        //TODO: Handle errors!
        Service.commit(api, newItem).then(function(data) {
          StatusService.update({
            type: 'success',
            msg: 'Item successfully updated!'
          });
        }, function (err) {
          StatusService.update({
            type: 'error',
            msg: err.data.raw.err
          });            
        }).then(function() {
          $scope.$emit('hateoas.client.refresh');
          modalScope.$destroy();
        });
      });
    }

    /**
     * Private: defaultLauncher
     * The default button handler
     */
    $scope.launch = function defaultLauncher(button) {
      if (button.method === 'get') {
        if ($scope.item.rel) {
          var link = (_.include(SLUG_ROUTES, $scope.item.rel)) ? $scope.item.slug : $scope.item.href;
          var index = link.indexOf(API.prefix) + API.prefix.length;
          $location.path(link.substring(index));
        }
      }
      else if (button.method === 'delete') {
        archive($scope.item);
      } else {
        open(button.method);
      }
    };

  }
})();