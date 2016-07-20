/**
 * GroupPolicy
 *
 * @module      Policies
 * @description Policy for ensuring the default admin groups are not deleted
 * @docs        http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  var groupID = req.param('id');
  var action = PermissionService.getMethod(req.method);
  if (action == 'delete' && (groupID === 'admin' || groupID === 'altumadmin')) {
    return res.forbidden('You are not permitted to perform this action.');
  } else {
    return next();
  }
};
