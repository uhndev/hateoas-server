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
  var StudyBase = require('./BaseControllers/ModelBaseController');

  _.merge(exports, StudyBase);      // inherits StudyBaseController.findByBaseModel
  _.merge(exports, {

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
                if (!_.includes(_.pluck(_.filter(user.enrollments, { expiredAt: null }), 'id'), this.enrollment.id)) {
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
          res.serverError(err);
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

      UserEnrollment.findOne(id).then(function (existingEnrollment) {
        this.existingRoleName = ['CollectionCentre', existingEnrollment.collectionCentre, 'Role'].join('');
        this.newRoleName = ['CollectionCentre', req.param('collectionCentre'), 'Role'].join('');
        this.updatePermissions = existingEnrollment.collectionCentre != req.param('collectionCentre');

        // check if we're trying to update an enrollment to something that already exists
        return UserEnrollment.findOne({
          collectionCentre: req.param('collectionCentre'),
          user: req.param('user'),
          expiredAt: null,
          id: { '!': id }
        });
      })
      .then(function (enrollment) {
        if (!enrollment) { // if no existing enrollment found, update can be performed safely
          return UserEnrollment.update({ id: id }, options)
            .then(function (enrollment) {
              this.enrollment = enrollment;
              // swap previous role with new role to update permissions iff collectionCentre in UserEnrollment changed
              if (this.updatePermissions) {
                return PermissionService.swapRoles(req.param('user'), this.existingRoleName, this.newRoleName);
              }
            })
            .then(function () {
              res.ok(this.enrollment);
            });
        } else { // otherwise, we are trying to register an invalid enrollment
          res.badRequest({
            title: 'Enrollment Error',
            status: 400,
            message: 'Unable to enroll user with ID ' + options.user + ', may already be registered at another collection centre.'
          });
        }
      })
      .catch(function (err) {
        res.serverError(err);
      });
    }

  });

})();


