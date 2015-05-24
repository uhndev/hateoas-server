(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.field.controller', ['isteven-multi-select'])
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope', '$http', '$timeout'];

  function FieldController($scope, $http, $timeout) {

    // bindable variables
    /** START OF MULTI/SINGLESELECT VARS */
    $scope.doneStatus = 'Confirm Selection';
    $scope.field.field_buffer = $scope.field.field_buffer || [];
    $scope.multiInput = []; // output will be field.field_value
    $scope.multiOutput = [];
    /** END OF MULTI/SINGLESELECT VARS */

    // bindable methods
    /** START OF MULTI/SINGLESELECT FUNCTIONS */
    $scope.selectItem = selectItem;
    $scope.cancelItem = cancelItem;
    $scope.done = done;
    $scope.fetchCollection = fetchCollection;
    /** END OF MULTI/SINGLESELECT FUNCTIONS */
    $scope.clearExpr = clearExpr;
    $scope.validateText = validateText;
    $scope.validateNumber = validateNumber;

    init();

    ///////////////////////////////////////////////////////////////////////////
    
    function init() {
      // if ($scope.field.field_userURL && $scope.field.field_value) {
      //   if ($scope.field.field_hasItems) {
      //     var copy = $scope.field.field_value;
      //     $scope.field.field_value = [];
      //     _.each(copy, function (item) {
      //       if (item.id && item.username || item.name) {
      //         $scope.field.field_buffer.push({
      //           key: item.username || item.name,
      //           val: item.id
      //         });
      //       }
      //     });  
      //   }
      //   if ($scope.field.field_hasItem) {
      //     $scope.valuesSelected = true;
      //     $http.get($scope.field.field_userURL + '/' + $scope.field.field_value)
      //       .then(function(resp) {
      //         $scope.field.field_view = {
      //           key: resp.data.items.name,
      //           val: resp.data.items.id
      //         };
      //       })
      //       .catch(function (err) {
      //         $scope.field.field_userURL = '';
      //         $scope.field.field_value = '';
      //       });
      //   }    
      // }
    }
        
    function selectItem(item) {
      if ($scope.field.field_hasItems) {
        if (!_.some($scope.field.field_buffer, {'val': item.id})) {
          $scope.field.field_buffer.push({
            key: item.username || item.name,
            val: item.id
          });
        }
        $scope.field.field_value = [];  
      }

      if ($scope.field.field_hasItem) {
        $scope.field.field_view = { key: item.name || item.username, val: item.id };
        $scope.valuesSelected = !$scope.valuesSelected;
      }    
    }

    function cancelItem() {
      $scope.field.field_view = {};
      $scope.field.field_value = '';
      $scope.valuesSelected = false;
    }

    function done() {
      $scope.doneStatus = ($scope.valuesSelected) ? 'Confirm Selection' : 'Cancel';
      if (!$scope.valuesSelected) {
        $scope.field.field_value = _.pluck($scope.field.field_buffer, 'val');  
      } else {
        $scope.field.field_value = [];
      }    
      $scope.valuesSelected = !$scope.valuesSelected;
    }

    function fetchCollection(field) {   
      return $http.get(field.field_userURL).then(function(response){
        return response.data.items;
      });
    }

    var timeoutPromise;
    $scope.$watch("field.field_userURL", function (newVal) {
      if (newVal) {
        $timeout.cancel(timeoutPromise);
        timeoutPromise = $timeout(function() {
          $http.get($scope.field.field_userURL).then(function(response){
            angular.copy(response.data.items, $scope.multiInput);

            // set selected values if loading form
            if ($scope.field.field_userURL && $scope.field.field_value) {
              if ($scope.field.field_hasItems) {
                _.each($scope.field.field_value, function (value) {
                  _.each($scope.multiInput, function(item) {
                    if (item.id == value.id) {
                      item.ticked = true;
                    }
                  });
                });
              }
            }
          });
         }, 500);
      }      
    });



    $scope.$watch("multiOutput", function (newVal, oldVal) {
      if (newVal !== oldVal && !$scope.field.field_value) {
        angular.copy(_.pluck($scope.multiOutput, 'id'), $scope.field.field_value);
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
