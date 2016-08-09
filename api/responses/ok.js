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
  var _ = require('lodash');
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

        /**
         * if header was sent from frontend (a query from getQueryLinks), apply populate here
         * with appropriate where clause for populate to get correct filtered count.
         *
         * Header is set in HateoasController.js in dados-client and
         * queryLinks are defined within the respective Model file in Sails.
         */
        var queryFilter = null;
        if (_.has(req.headers, 'x-uhn-deep-query')) {
          queryFilter = JSON.parse(req.headers['x-uhn-deep-query']);
          promise = model.find(filterQuery)
            .populate(queryFilter.collection, queryFilter.where)
            .then(function (totalItems) {
              return _.filter(totalItems, function (item) {
                return item[queryFilter.collection].length > 0;
              });
            });
        }

        // for non-admins, apply criteria here to get restricted count of permitted records
        if (_.has(req, 'criteria') && req.criteria.length > 0 && !_.isEmpty(_.first(req.criteria).where)) {
          // if header was included with populate query, filter matchingRecords by given successful matched criteria
          if (queryFilter && _.has(req.headers, 'x-uhn-deep-query')) {
            promise = promise.then(function (totalItems) {
              return PermissionService.filterByCriteria(req.criteria, totalItems).length;
            });
          }
          // otherwise no header set and just filter criteria from find
          // and merge filterQuery with any applicable criteria
          else {
            var criteriaList = _.pluck(req.criteria, 'where');
            if (!filterQuery.where.or) {
              filterQuery.where.or = criteriaList;
            } else {
              filterQuery.where.or.concat(criteriaList);
            }
            promise = model.count().where(filterQuery);
          }
        }
        // otherwise no criteria set
        else {
          // if no header set for populate filter, just do direct count
          if (!queryFilter) {
            promise = model.count(filterQuery);
          }
          // header set and no criteria, so just return direct count
          else {
            promise = promise.then(function (totalItems) {
              return totalItems.length;
            });
          }
        }
      }

      return promise;
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
          var permissionObject = {
            action: _.first(permission).action
          };

          // if permission has criteria with blacklisted attributes or where clause, include in result to filter hateoas template
          if (_.has(perm, 'criteria')) {
            if (_.has(_.first(perm.criteria), 'blacklist')) {
              permissionObject.blacklist = _.first(perm.criteria).blacklist;
            }
            if (_.has(_.first(perm.criteria), 'where')) {
              permissionObject.where = _.first(perm.criteria).where;
            }
          }

          return result.concat(permissionObject);
        }
        return result;
      }, []);
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

  HateoasService.create(req, res, data, options)
    .then(function(hateoasResponse) {
      var modelName = req.options.model || req.options.controller;
      var permissionModel = !_.has(options, 'permissionModel') ? modelName: options.permissionModel;
      var query = Utils.Path.getWhere(req.query);
      var modelPromise = Model.findOne({name: permissionModel})
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
        'allow': _.pluck(permissions, 'action').join(',')
      });

      // create blacklist dictionary of actions to blacklist array
      var blacklist = _.reduce(permissions, function (result, permission) {
        result[permission.action] = permission.blacklist;
        return result;
      }, {});

      var where = _.reduce(permissions, function (result, permission) {
        result[permission.action] = permission.where;
        return result;
      }, {});

      // include all blacklisted attributes in template
      hateoasResponse.template.blacklist = blacklist;
      hateoasResponse.template.where = where;

      // filter template data array based on any blacklisted attributes
      hateoasResponse.template.data = _.reject(hateoasResponse.template.data, function (field) {
        return _.contains(blacklist.read, field.name);
      });

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
