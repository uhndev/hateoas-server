/**
 * tokenAuth
 *
 * @module      Policies
 * @description Policy that verifies a given JWT token.
 *              If successful, associated user object is stored in req.user for future use.
 * @docs        http://sailsjs.org/#!documentation/policies
 * @see         http://github.com/auth0/express-jwt
 *
 */
var jwt = require('express-jwt');

module.exports = jwt({secret: sails.config.session.secret});
