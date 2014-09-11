/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */
module.exports = function sendOK (data, options) {
  var Q = require('q');
  var url = require('url');

  // Get access to `req`, `res`, & `sails`
  var res = this.res;
  var req = this.req;

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');
  sails.log.silly('Requested URL: ' + req.path);

  function sendData ( req, res, data ) {
    // Set status code
    res.status(200);
    return res.jsonx(data);

//    // If appropriate, serve data as JSON(P)
//    if (req.wantsJSON) {
//      return res.jsonx(data);
//    }
//  
//    // If second argument is a string, we take that to mean it refers to a view.
//    // If it was omitted, use an empty object (`{}`)
//    options = (typeof options === 'string')
//      ? { view: options } 
//      : options || {};
//  
//    // If a view was provided in options, serve it.
//    // Otherwise try to guess an appropriate view, or if that doesn't
//    // work, just send JSON.
//    if (options.view) {
//      return res.view(options.view, { data: data });
//    }
//  
//    // If no second argument provided, try to serve the implied view,
//    // but fall back to sending JSON(P) if no view can be inferred.
//    else return res.guessView({ data: data }, 
//      function couldNotGuessView () {
//        return res.jsonx(data);
//      });
  }

  /**
   * Private method that fetches the result count for the current query.
   */
  function fetchResultCount(query, modelName) {
    var models = sails.models;
    if (_.has(models, modelName)) {
      var model = models[modelName];
      if (query.where) {
        return model.count(JSON.parse(query.where));
      } 
      return model.count(query);
    }
    return Q.when(0);
  }

  function sanitize(data) {
    var entityMap = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;'
    };

    var sanitized = JSON.stringify(data).replace(/[&<>]/g, 
      function(key) {
        return entityMap[key];
      });
    return JSON.parse(sanitized);
  }

  HateoasService.create(req, res, data)
   .then(function(hateoasResponse) {
     var address = url.parse(Utils.Path.getFullUrl(req));
     var modelName = req.options.model || req.options.controller;
     var query = Utils.Path.getWhere(req.query);
     return [hateoasResponse, fetchResultCount(query, modelName)];
   })
   .spread(function(hateoasResponse, count) {
     hateoasResponse.total = count;
     res.set({
       'Access-Control-Expose-Headers': 'allow,content-type',
       'content-type': 'application/collection+json; charset=utf-8',
       'allow': 'GET,POST,PUT,DELETE'
     });
     hateoasResponse.items = hateoasResponse.items;
     sendData(req, res, hateoasResponse);
   })
   .fail(function(err) {
     res.status(500);
     var error = {
       type: 'danger',
       message: 'HATEOAS response failure'
     };
     return res.jsonx(error);
   });

};
