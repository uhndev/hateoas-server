/**
 * Directive for form-builder itself:
 * Takes a JSON form and bidirectionally binds it with form-builder and form-directive
 * 
 * usage: <form-builder form="scopeForm"></form-builder>
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.builder', [])
    .directive('formBuilder', formBuilder);

  function formBuilder() {
    return {
      restrict: 'E',
      scope: {
        form: '='
      },
      templateUrl: 'directives/formBuilder/partials/create.tpl.html',
      controller: 'CreateController',
      link: {
        pre: function preLink(scope, element, attr) {
          var unregister = scope.$watch('form', function (newval, oldval) {
            if (newval.length > 0) {
              unregister();
            }
          }, true);
        }
      }
    };
  }

})();