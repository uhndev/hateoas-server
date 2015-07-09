/**
 * UserEnrollmentController
 *
 * @module controllers/UserEnrollment
 * @description Server-side logic for managing User Enrollments
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {

  module.exports = {

    update: function (req, res, next) {
      // enrollment params
      var id = req.param('id');
      // user access enrollment params
      var fields = {},
          collectionCentre = req.param('collectionCentre'),
          user = req.param('user'),
          centreAccess = req.param('centreAccess'),
          expiredAt = req.param('expiredAt')

      if (collectionCentre) fields.collectionCentre = collectionCentre;
      if (user) fields.user = user;
      if (centreAccess) fields.centreAccess = centreAccess;
      if (expiredAt) fields.expiredAt = expiredAt;

      // check if we're trying to update an enrollment to something that already exists
      UserEnrollment.findOne({
        collectionCentre: collectionCentre,
        user: user,
        expiredAt: null,
        id: { '!': id }
      })
      .then(function (enrollment) {
        if (!enrollment) {
          return UserEnrollment.update({ id: id }, fields).then(function (enrollment) {
            res.ok(enrollment);
          });
        } else {
          res.badRequest({
            title: 'Enrollment Error',
            status: 400,
            message: 'Unable to enroll user, user may already be registered at another collection centre.'
          });
        }
      });
    }
  };

})();


