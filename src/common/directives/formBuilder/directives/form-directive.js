/**
 * Directive for rendering forms - can be viewed as single question carousel
 * or full page form.  Accepts two callback functions to be used for form
 * submission and cancellation.
 *
 * usage: <form-directive form="scopeForm" onSubmit="submitFn()" onCancel="cancelFn()"></form-directive>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.form', [])
    .directive('dynamicName', dynamicName)
    .directive('formDirective', formDirective);

  dynamicName.$inject = ['$compile', '$parse'];
  formDirective.$inject = ['$http', '$compile', '$templateCache'];

  // allows for dynamic form and input names in forms
  function dynamicName($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-name'))(scope);
        elem.removeAttr('dynamic-name');
        elem.attr('name', name);
        $compile(elem)(scope);
      }
    };
  }

  function formDirective($http, $compile, $templateCache) {

    var linker = function(scope, element, attrs, ngModel) {    
      // GET template content from path
      var templateUrl = 'directives/formBuilder/partials/directive-templates/form/form.tpl.html';
      $http.get(templateUrl, {cache:$templateCache}).success(function(data) {
        element.html(data);
        $compile(element.contents())(scope);
      });

      // default to list view if form type is system
      var unreg = scope.$watch('form', function(val, old) {
        if (!_.isEmpty(val)) {
          scope.formPreview = (scope.form.form_type == 'system');
          unreg();
        }
      }, true);
    };

    return {
      restrict: 'E',
      link: linker,
      scope: {
        form:'=',
        onSubmit:'&',
        onCancel:'&'
      },
      controller: function($scope){
      },
    };
  }

})();