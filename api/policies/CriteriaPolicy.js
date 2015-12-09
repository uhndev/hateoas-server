/**
 * CriteriaPolicy
 * @depends PermissionPolicy
 *
 * Verify that the User fulfills permission 'where' conditions and attribute blacklist restrictions
 */
var wlFilter = require('../../node_modules/sails-permissions/node_modules/waterline-criteria');
var _ = require('lodash');

module.exports = function(req, res, next) {
  var permissions = req.permissions;

  if (_.isEmpty(permissions)) {
    return next();
  }

  var action = PermissionService.getMethod(req.method);

  var body = req.body || req.query;

  // if we are creating, we don't need to query the db, just check the where clause vs the passed in data
  if (action === 'create') {
    if (!PermissionService.hasPassingCriteria(body, permissions, body)) {
      return res.forbidden({
        error: 'Can\'t create this object, because of failing where clause'
      });
    }
    return next();
  }

  // get all of the where clauses and blacklists into one flat array
  // if a permission has no criteria then it is always true
  sails.log.info('Request Query Before', req.query);

  req.query.or = req.query.or || [];
  var criteria = _.compact(_.flatten(
    _.map(permissions, function(permission) {
      if (_.isEmpty(permission.criteria)) {
        permission.criteria = [{
          where: {}
        }];
      }

      var criteriaList = permission.criteria;
      return _.map(criteriaList, function(criteria) {
        // ensure criteria.where is initialized
        criteria.where = criteria.where || {};

        if (permission.relation == 'owner') {
          criteria.where.owner = req.user.id;
        }

        if (!_.isEmpty(criteria.where)) {
          req.query.or.push(criteria.where);
        }

        return criteria;
      });
    })
  ));

  if (_.isEmpty(req.query.or)) {
    delete req.query.or;
  }

  sails.log.info('Request Query After', req.query);

  req.criteria = criteria;

  // set up response filters if we are not mutating an existing object
  if (!_.contains(['update', 'delete'], action)) {
    if (criteria.length) {
      bindResponsePolicy(req, res, criteria);
    }
    return next();
  }

  PermissionService.findTargetObjects(req)
    .then(function(objects) {

      // attributes are not important for a delete request
      if (action === 'delete') {
        body = undefined;
      }

      if (!PermissionService.hasPassingCriteria(objects, permissions, body, req.user.id)) {
        return res.forbidden({
          error: 'Can\'t ' + action + ', because of failing where clause or attribute permissions'
        });
      }
      next();
    })
    .catch(next);
};

function bindResponsePolicy(req, res, criteria) {
  res._ok = res.ok;

  res.ok = _.bind(responsePolicy, {
    req: req,
    res: res
  }, criteria);
}

function responsePolicy(criteria, _data, options) {
  sails.log.info('responsePolicy');

  var req = this.req;
  var res = this.res;
  var user = req.owner;
  var method = PermissionService.getMethod(req);
  var isResponseArray = _.isArray(_data);

  var data = isResponseArray ? _data : [_data];

  sails.log.info('data', data.length);
  sails.log.info('options', options);
  sails.log.info('criteria!', criteria);

  var permitted = data.reduce(function(memo, item) {
    criteria.some(function(crit) {
      var filtered = wlFilter([item], {
        where: {
          or: [crit.where]
        }
      }).results;

      if (filtered.length) {
        if (crit.blacklist && crit.blacklist.length) {
          crit.blacklist.forEach(function(term) {
            delete item[term];
          });
        }
        memo.push(item);
        return true;
      }
    });
    return memo;
  }, []);

  if (isResponseArray) {
    sails.log.info('Response Policy', permitted.length);
    return res._ok(permitted, options);
  } else {
    res._ok(permitted[0], options);
  }
}
