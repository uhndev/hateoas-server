/**
 * UserEnrollmentController
 *
 * @module controllers/UserEnrollment
 * @description Server-side logic for managing User Enrollments
 * @help        See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * create
     * @description Route for handling collection centre access from study users page
     */
    create: function (req, res, next) {
      // user access enrollment params
      var options = _.pick(_.pick(req.body, 'collectionCentre', 'user', 'centreAccess'), _.identity);

      // find and create or update user enrollment data
      UserEnrollment
        .findOne({
          user: options.user,
          collectionCentre: options.collectionCentre,
          expiredAt: null
        })
        .then(function (enrollment) {
          if (!enrollment) {
            return UserEnrollment.create(options)
              .then(function (enrollment) {
                this.enrollment = enrollment;
                return User.findOne(options.user).populate('enrollments');
              })
              .then(function (user) {
                // if we were modifying an enrollment, nothing needs to be done
                if (!_.includes(_.pluck(user.enrollments, 'id'), this.enrollment.id)) {
                  return user;
                } else {
                  // otherwise, we are adding a new enrollment
                  user.enrollments.add(this.enrollment.id);
                  return user.save();
                }
              })
              .then(function (user) {
                res.ok(user);
              });
          } else {
            // otherwise we're trying to update an enrollment to something that already exists
            res.badRequest({
              title: 'Enrollment Error',
              status: 400,
              message: 'Unable to enroll user, user may already be registered at another collection centre.'
            });
          }
        })
        .catch(function (err) {
          res.serverError({
            title: 'Collection Centre Access Error',
            code: 500,
            message: 'Error when updating user centre access for user: ' + err
          });
        });
    },

    /**
     * update
     * @description Route handler for updating instances of user enrollments.
     *              Used when archiving an enrollment (via setting expiredAt)
     *              as well as changing individual permissions for users on the
     *              study-specific users page.
     */
    update: function (req, res, next) {
      // enrollment params
      var id = req.param('id');
      // user access enrollment params
      var options = _.pick(_.pick(req.body,
        'collectionCentre', 'user', 'centreAccess', 'expiredAt'
      ), _.identity);

      // check if we're trying to update an enrollment to something that already exists
      UserEnrollment.findOne({
        collectionCentre: req.param('collectionCentre'),
        user: req.param('user'),
        expiredAt: null,
        id: { '!': id }
      })
      .then(function (enrollment) {
        if (!enrollment) { // if no existing enrollment found, update can be performed safely
          return UserEnrollment.update({ id: id }, options).then(function (enrollment) {
            res.ok(enrollment);
          });
        } else { // otherwise, we are trying to register an invalid enrollment
          res.badRequest({
            title: 'Enrollment Error',
            status: 400,
            message: 'Unable to enroll user, user may already be registered at another collection centre.'
          });
        }
      })
      .catch(function (err) {
        res.serverError(err);
      });
    },

    /**
     * findByStudyName
     * @description Calls the UserEnrollment model function findByStudyName to return the list
     *              of users that are enrolled in a given study.  Further filtering
     *              of users based on enrollment is also done in the UserEnrollment model function.
     */
    findByStudyName: function(req, res) {
      var studyName = req.param('name');
      UserEnrollment.findByStudyName(studyName, req.user,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) }
      ).then(function(users) {
          var err = users[0];
          var userItems = users[1];
          if (err) res.serverError(err);
          res.ok(userItems);
        });
    }
  };

})();


