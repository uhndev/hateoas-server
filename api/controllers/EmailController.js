/**
 * EmailController
 *
 * @description :: Server-side logic for managing Emails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
(function () {
  module.exports = {
    sendEmail: function (req, res) {
      var template = req.body.template;
      var data = req.body.data;
      var options = req.body.options;
      sails.hooks.email.send(
        template,
        data,
        options,
        function (err) {
          console.log(err || "Email is sent");
        }
      )
      return res.send('Email Test');
    }
  };
})();


