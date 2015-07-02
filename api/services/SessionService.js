/**
 * SessionService
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = function() {
  var jwt = require('jsonwebtoken'),
      secret = "6QUhX!98aW7";
  
  return {
    /**
     * [issueToken]
     * Generates a json web token from payload
     */
    issueToken: function(req, payload) {
      var tokenSecret = req.ip + req.headers['user-agent'] + secret;
      return jwt.sign(
        payload,
        tokenSecret,  // secret key used to sign
        {
          expiresInMinutes : 60
        }
      );
    },
     
    /**
     * [verifyToken]
     * Verifies a JWT on request
     */
    verifyToken: function(req, token, callback) {
      var tokenSecret = req.ip + req.headers['user-agent'] + secret;
      return jwt.verify(
        token,                                    // token to be verified
        tokenSecret,  // use same token we used to sign
        {},
        callback
      );
    }

  }
}();
