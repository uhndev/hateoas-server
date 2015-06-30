/**
 * tokenAuth
 *
 * Policy that verifies a given JWT token.
 * If successful, associated user object is stored in req.user for future use.
 *
 * @module      :: Policy
 * @description :: Policy for verifying user json web tokens
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var jwt = require('express-jwt');

module.exports = jwt({secret: sails.config.session.secret});