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
  }

  /**
   * Private method that fetches the result count for the current query.
   */
  function fetchResultCount(query, modelName) {
    var models = sails.models;
    if (_.has(models, modelName)) {
      var model = models[modelName];
      return Group.findOne({ name: 'subject' }).then(function (group) {
        var promise;
        if (query.where) {
          promise = model.count(JSON.parse(query.where));
        } else {
          promise = model.count();
        }

        if (_.has(model.attributes, 'expiredAt')) {
          promise.where({ expiredAt: null });
        }

        // we do not want to include subjects' users in our total count
        if (model.identity === 'user') {
          promise.where({ group: { '<=': group.level }});
        }

        return promise;
      });
    }
    return Q.when(0);
  }

  /**
   * Private method for fetching which CRUD operations are permitted
   * for the given model and user.
   * @param  {model}
   * @param  {user}
   * @return {promise}
   */
  function fetchPermissions(model, user) {
    var promises = [];
    // find for current model/user, which CRUD operations are permitted
    _.map(['GET','POST','PUT','DELETE'], function(method) {
      var options = {
        method: method,
        model: model,
        user: user
      }
      promises.push(PermissionService.findModelPermissions(options)
        .then(function (permissions) {
          return permissions;
        })
      );
    });

    var permissions = [];
    var promise = Q.allSettled(promises).then(function (results) {
      results.forEach(function(result) {
        if (result.value.length > 0)
          permissions.push(result.value[0].action);
      });
    }).then(function() {
      permissions = permissions.join(',');
      return permissions;
    }).catch(function (err) {
      return err;
    });

    return promise;
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
      var modelPromise = Model.findOne({name: modelName})
        .then(function (model) {
          return fetchPermissions(model, req.user);
        });

      return [hateoasResponse, data.length, fetchResultCount(query, modelName), modelPromise];
      // return [hateoasResponse, fetchResultCount(query, modelName), modelPromise];
    })
    .spread(function(hateoasResponse, resultCount, modelCount, permissions) {
      hateoasResponse.count = resultCount;
      hateoasResponse.total = modelCount;

      // hateoasControls will read the allow header
      // to determine which buttons/actions to render
      res.set({
        'Access-Control-Expose-Headers': 'allow,Content-Type',
        'Content-Type': 'application/collection+json; charset=utf-8',
        'allow': permissions
      });
      hateoasResponse.items = hateoasResponse.items;
      sendData(req, res, hateoasResponse);
    })
    .fail(function(err) {
      res.status(500);
      sails.log(err);
      var error = {
        type: 'danger',
        message: 'HATEOAS response failure'
      };
      return res.jsonx(error);
    });
};
