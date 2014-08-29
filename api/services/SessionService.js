module.exports = function() {

var self = {
  /**
   * Generate one-time access token.
   */
  generateToken: function generateToken (req) {
    var crypto = require('crypto');
    var key = '6QUhX!98aW7';
    var timestamp = new Date().getTime();
    var data = req.ip + req.headers['user-agent'] + timestamp + key;
    sails.log.debug(data);
    
    var hash = crypto.createHmac('sha256', key).update(data).digest('hex');
    return hash + "," + timestamp;
  },

  /**
   * Validate the recieved access token.
   */
  validateToken: function validateToken (req, token) {
    var retval = false;
    var crypto = require('crypto');
    var key = '6QUhX!98aW7';
    var tokenData = token.split(",");
    
    // check if the token contains timestamp
    if (tokenData.length == 2) {
      var hash = tokenData[0];
      var timestamp = tokenData[1];
      var currentTime = new Date().getTime();
      
      // check if the token is expired (time in milliseconds -> 30 minutes)
      if ( currentTime < timestamp + 1000 * 60 * 30 ) {
        var data = req.ip + req.headers['user-agent'] + timestamp + key;
        var reqHash = crypto.createHmac('sha256', key).update(data).digest('hex');
        sails.log.debug(data);
        sails.log.debug(hash);
        sails.log.debug(reqHash);
        if (hash == reqHash) {
          retval = true;
        }
      }
    }
    sails.log.debug(retval);
    return retval;
  },
}

return self;
}();
