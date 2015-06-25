/**
 * tokenAuth
 *
 * @module      :: Policy
 * @description :: Policy for verifying user json web tokens
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
          credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {
        title: 'Authorization Error',
        code: 401,
        message: 'Format is Authorization: Bearer [token]'
      });
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {
      title: 'Authorization Error',
      code: 401,
      message: 'No Authorization header was found'
    });
  }

  SessionService.verifyToken(req, token, function(err, token) {
    if (err) {
      return res.json(401, {
        title: 'Authorization Error',
        code: 401,
        message: 'Invalid token'
      });
    }
    req.token = token;
    next();
  });
};