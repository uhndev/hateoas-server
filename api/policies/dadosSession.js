/**
 * dadosSession
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  //if (req.session.authenticated) {
  sails.log.debug("[QDB]: policy request");
  var tok = SessionService.generateToken(req);
  sails.log.debug(tok);
  res.set('X-DADOS-KEY', tok);
  sails.log.debug("[QDB]: policy resp");
  SessionService.validateToken(req, tok);
  return next();
  //}

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
