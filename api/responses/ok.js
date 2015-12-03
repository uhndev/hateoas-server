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
  var Promise = require('bluebird');
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
  function fetchResultCount(req, query, modelName) {
    var models = sails.models;
    if (_.has(models, modelName)) {
      var model = models[modelName];
      return Group.findOneByName('subject').then(function (subjectGroup) {
        var promise;
        var filterQuery = { where: {} };
        // if provided a query, include in where clause
        if (query.where) {
          filterQuery.where = JSON.parse(query.where);
        }

        // when options.filteredTotal is passed to res.ok, use the filtered total instead
        if (options && _.has(options, 'filteredTotal')) {
          promise = options.filteredTotal;
        }
        // otherwise, we can just return the model count total
        else {
          if (_.has(model.attributes, 'expiredAt')) {
            filterQuery.where.expiredAt = null;
          }
          // we do not want to include subjects' users in our total count
          if (model.identity === 'user') {
            if (req.user.group == subjectGroup.id) { // if subject, return self count
              filterQuery.where.id = req.user.id;
            } else { // otherwise, omit subjects from count
              filterQuery.where.group = {"!": subjectGroup.id};
            }
          }

          promise = model.count(filterQuery);
        }

        return promise;
      });
    }
    return Promise.resolve(0);
  }

  /**
   * Private method for fetching which CRUD operations are permitted
   * for the given model and user.
   * @param  {model}
   * @param  {user}
   * @return {promise}
   */
  function fetchPermissions(model, user) {
    // find for current model/user, which CRUD operations are permitted
    return Promise.all(
      _.map(['GET','POST','PUT','DELETE'], function(method) {
        return PermissionService.findModelPermissions({
          method: method,
          model: model,
          user: user
        });
      })
    ).then(function (permissions) {
      return _.reduce(permissions, function (result, permission) {
        var perm = _.first(permission);
        if (!_.isUndefined(perm) && _.has(perm, 'action')) {
          return result.concat(_.first(permission).action);
        }
        return result;
      }, []).join(',');
    })
    .catch(function (err) {
      return err;
    });
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
      var modelName = req.options.model || req.options.controller;
      var query = Utils.Path.getWhere(req.query);
      var modelPromise = Model.findOne({name: modelName})
        .then(function (model) {
          return fetchPermissions(model, req.user);
        });
      return [hateoasResponse, data.length, fetchResultCount(req, query, modelName), modelPromise];
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
