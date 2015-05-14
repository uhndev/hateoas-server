(function() {
  'use strict';
  angular
    .module('dados.common.directives.simpletable', [])
    .directive('simpleTable', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          tabledata: '='
        },
        template: '<table class="table table-hover">'+
          '<thead>'+
            '<tr>'+
              '<th ng-repeat="col in tabledata.columns">{{col}}</th>'+
            '</tr>'+
          '</thead>'+
          '<tbody>'+
            '<tr ng-repeat="item in tabledata.data">'+
              '<td>{{item.name}}</td>'+
              '<td>{{item.value}}</td>'+
            '</tr>'+
          '</tbody>'+
        '</table>'
      };
    });
})();