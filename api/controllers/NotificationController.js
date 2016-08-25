/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
(function() {
  var _ = require('lodash');
  var http = require('http');
  var querystring = require('querystring');
  var redis = require('redis'),
      client = redis.createClient();

  module.exports = {

    /**
     * subscribeUsers
     * @description stores the current active endpoint and user so that notifications cna be sent later
     * @param req
     * @param res
     */
    subscribedUsers: function(req,res) {
      var endpoint = String(req.body.endpoint);
      var user = req.body.user;
      client.hmset("subscribed",user, endpoint);
      client.hgetall("subscribed", function(err, value) {
        if (err) {console.log(err)}
      });
      return res.send(200);
    },

    /**
     * sendNotification
     * @description Sends notification out to the selected list of users from redis
     * @param req
     * @param res
     */
    sendNotification: function(req,res) {
      var options = {
        host:'android.googleapis.com',
        path:'/gcm/send',
        headers: {
          'Authorization': 'key=AIzaSyBqEIMq8NoU67awlegaQMtXbSSvwreukZg',
          'Content-Type':'application/json'
        },
        method:'POST'
      };

      //gets the current subscribed users TODO: change this functionality so that instead of subscribed, it calls different user groups instead
      client.hgetall("subscribed", function(err, value) {
        if (err) {
          throw (err)
        }else{
          var receivers = _.values(value);
          var body = JSON.stringify({
            'registration_ids' : receivers
          });
          //request object
          var req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
              console.log('ended request');
            });
          });

          req.on('error', (e) => {
            console.log('${e.message}');
          });
          req.write(body);
          req.end();
        }
      });
      return res.send(200);
    }
  }

})();
