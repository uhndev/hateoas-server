(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.field.controller', ['isteven-multi-select'])
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope', '$http', '$timeout'];

  function FieldController($scope, $http, $timeout) {

    // bindable variables
    $scope.multiInput = [];
    $scope.multiOutput = [];

    // bindable methods
    $scope.setValues = setValues;
    $scope.clearExpr = clearExpr;
    $scope.validateText = validateText;
    $scope.validateNumber = validateNumber;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if ($scope.field.field_userURL) {
        fetchData();
      }
    }

    function setValues() {
      if ($scope.field.field_hasItems) {
        $scope.field.field_value = _.pluck($scope.multiOutput, 'id');
      } 
      else if ($scope.field.field_hasItem) {
        $scope.field.field_value = _.first(_.pluck($scope.multiOutput, 'id'));
      }
    }

    function fetchData() {
      $http.get($scope.field.field_userURL).then(function(response){
        angular.copy(response.data.items, $scope.multiInput);
        // set selected values if loading form
        if ($scope.field.field_value) {
          _.each($scope.multiInput, function(item) {
            if (_.isArray($scope.field.field_value)) {
              _.each($scope.field.field_value, function (value) {
                if (item.id === value.id) {
                  item.ticked = true;
                }
              });
            } else {
              if ($scope.field.field_value === item.id) {
                item.ticked = true;
              }
            }
          });
        }
      });
    }

    var timeoutPromise;
    $scope.$watch("field.field_userURL", function (newVal) {
      if (newVal) {
        $timeout.cancel(timeoutPromise);
        timeoutPromise = $timeout(function() {
          fetchData();
        }, 1500);
      }      
    });

    function clearExpr(field) {
      field.field_min = '';
      field.field_max = '';
      field.field_validation.expression = '';
    }

    function validateText(value, field) {
      var expr = field.field_validation.expression;
      var res = true;
      if (value && value.length >= 0) {
        switch (field.field_validation.rule) {
          case 'none':         $scope.showValidateError = false; return true;
          case 'contains':     res = value.indexOf(expr) > -1; break;
          case 'not_contains': res = value.indexOf(expr) <= -1; break;
          case 'min_length':   res = value.length >= expr; break;
          case 'max_length':   res = value.length <= expr; break;
          case 'between':      res = value.length >= expr.min && value.length <= expr.max; break;
          default: break;
        }                
      }
      $scope.showValidateError = !res;
      return res;
    }

    function validateNumber(value, field) {
      var expr = field.field_validation.expression;
      var res = true;
      if (value) {
        switch (field.field_validation.rule) {
          case 'none':        $scope.showValidateError = false; return true;
          case 'gt':          res = value > expr; break;
          case 'geq':         res = value >= expr; break;
          case 'lt':          res = value < expr; break;
          case 'leq':         res = value <= expr; break;
          case 'eq':          res = value == expr; break;
          case 'neq':         res = value != expr; break;
          case 'between':     res = value >= expr.min && value <= expr.max; break;
          case 'not_between': res = value < expr.min || value > expr.max; break;
          default: break;
        }
      }
      $scope.showValidateError = !res;
      return res;
    }
  }

})();
