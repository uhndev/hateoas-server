 var startFhir = require('fhir.js');

  module.exports = {
    // Execute the search
    search: function (options) {
     return startFhir(sails.config.fhir).search(options);
    }
  };
