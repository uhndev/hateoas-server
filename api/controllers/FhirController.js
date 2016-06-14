/**
 * FhirController
 *
 * @description :: Server-side logic for managing fhirs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

  /**
   * `FhirController.init()`
   */
  init: function (req, res) {

    var params = req.query;

    new Promise(function() {
      _.forOwn(params, function(value, key) {
        if (params.hasOwnProperty(key)) {
          var value = params[key];
          if(value.match(/{(.*?)}/)){
            params[key] = JSON.parse(value);
          }
        }
      });
    }).then(FhirService.search(params)
        .then(function (resp) {
          var bundle = resp.data;

         // object response to dados-client
          return res.json({data:bundle.entry});

        })
        .catch(function (resp) {
          //Error responses
          if (resp.status) {
            res.badRequest(resp.status);
          }
          //Errors
          if (resp.message) {
            res.badRequest(resp.message);
          }
        })
    );
  },


  /**
   * `FhirController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  }
};

