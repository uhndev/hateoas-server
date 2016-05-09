/**
 * EmailController
 *
 * @description :: Server-side logic for managing Emails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
(function(){
  module.exports = {
    sendEmail: function(req, res) {
      // sails.hooks.email.send(template, data, options, cb)
      sails.hooks.email.send(
        "testEmail",
        {
          recipientName: "Steve",
          senderName: "yamasnax",
          senderEmail: "hello@yamasnax.com"
        },
        {
          from: "Admin <admin@yamasnax.com>",
          to: "calvin.su@uhn.ca",
          subject: "SailsJS email test"
        },
        function(err) {
          console.log(err || "Email is sent");
        }
      )
      return res.send('Email Test');
    }
  };
})();


