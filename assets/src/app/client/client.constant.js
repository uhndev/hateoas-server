/**
 * Created by calvinsu on 15-09-15.
 */
(function () {
  'use strict';
  angular
    .module('AHS.client.constants', ['dados.constants'])
    .service('CLIENT_API', Client);
  Client.$inject = ['API'];
  function Client(API) {
    return {url: API.url() + '/client/:id'};
  }
})();
