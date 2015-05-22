(function() {
  'use strict';
  angular.module('hateoas', [
    'hateoas.view',
    'hateoas.controls',
    'hateoas.utils',
    'hateoas.controller'
  ])
  .constant('API', { 
    protocol: 'http',
    host : 'localhost',
    port: '1337',
    prefix: '/api',
    url: function getUrl() {
      return this.protocol + "://" + 
        this.host + ":" + this.port + this.prefix;
    }
  })
  .constant('SLUG_ROUTES', ['study']);

})();
