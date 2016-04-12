/**
 * SessionController
 *
 * @description Server-side logic for managing Sessions
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  module.exports = {
    identity: 'session',
    
    /**
     * findOne
     * @description Finds one session given an id and populates formVersions
     */
    findOne: function (req, res) {
      Session.findOne(req.param('id'))
        .exec(function (err, session) {
          if (err) {
            return res.serverError(err);
          }

          if (_.isUndefined(session)) {
            res.notFound();
          } else {
            res.ok(session);
          }
        });
    },
  };

})();
