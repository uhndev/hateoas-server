/**
 * @namespace EnrollmentService
 * @description Helper service for returning filtered data based on enrollments
 */

(function() {

  var _ = require('lodash');
  var Promise = require('q');

  module.exports = {

    /**
     * findStudyCollectionCentres
     * @description Finds and returns all collection centres in a given study.
     *              If current user is non-admin, should only return centres
     *              that current user is enrolled in.
     *
     * @param  {String}         studyName name of study to search on
     * @param  {Object}         currUser  current user object
     * @return {Array|Promise}  list of collection centres in study
     */
    findStudyCollectionCentres: function(studyName, currUser) {
      return Group.findOne(currUser.group).then(function (group) {
        this.group = group;
        return Study.findOneByName(studyName).populate('collectionCentres');
      })
      .then(function (study) { // return list of collection centres with enrollments in study
        if (!study) {
          err = new Error();
          err.message = require('util')
             .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }

        // filter out expired collection centres
        study.collectionCentres = _.filter(study.collectionCentres, { expiredAt: null });

        if (this.group.level > 1) {
          return UserEnrollment.find({ user: currUser.id })
            .then(function (enrollments) {
              return _.filter(study.collectionCentres, function (centre) {
                return _.some(enrollments, { collectionCentre: centre.id });
              });
            });
        }
        return study.collectionCentres;
      });
    },

    /**
     * findStudyUsers
     * @description Finds and returns all users enrolled in any of the collection
     *              centres.  If current user is non-admin, should only return
     *              users from collection centres that current user has in common.
     *
     * @param  {String}         studyName name of study to search on
     * @param  {Object}         options query options to filter on
     * @param  {Object}         currUser  current user object
     * @return {Array|Promise}  list of users in study
     */
    findStudyUsers: function(studyName, options, currUser) {
      return Group.findOne(currUser.group).then(function (group) {
        this.group = group;
        return Study.findOneByName(studyName).populate('collectionCentres');
      })
      .then(function (study) { // return list of enrollments in study
        if (!study) {
          err = new Error();
          err.message = require('util')
             .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }

        if (this.group.level > 1) { // if user is non-admin, return only their enrollments
          return ModelService.filterExpiredRecords('userenrollment').where({
            user: currUser.id,
            collectionCentre: _.pluck(study.collectionCentres, 'id')
          });
        }
        // otherwise, return all enrollments in study
        return ModelService.filterExpiredRecords('userenrollment').where({
          collectionCentre: _.pluck(study.collectionCentres, 'id')
        });
      })
      .then(function (enrollments) { // from enrollments, return users with enrollment data
        var query = _.cloneDeep(options);
        query.where = query.where || {};
        delete query.where.name;

        return Promise.all(
          _.map(enrollments, function (enrollment) {
            return User.findOne(query).where({ id: enrollment.user }).then(function (user) {
              if (user) {
                user.enrollmentId = enrollment.id;
                user.collectionCentre = enrollment.collectionCentre;
                user.centreAccess = enrollment.centreAccess;
                return user;
              }
            });
          })
        );
      })
      .then(function (users) {
        return _.compact(users);
      })
      .catch(function (err) {
        return err;
      })
    },

    /**
     * findCollectionCentreUsers
     * @description Finds and returns users enrolled in a given collection centre.
     *              If current user is non-admin and is not enrolled in the given
     *              collection centre, we returned null.
     *
     * @param  {ID}             centreId collection centre ID
     * @param  {Object}         currUser current user object
     * @return {Array|Promise}  list of users enrolled in collection centre
     */
    findCollectionCentreUsers: function(centreId, currUser) {
      return Group.findOne(currUser.group).then(function (group) {
        if (group.level > 1) { // if non-admin, only return enrollments of current user
          return ModelService.filterExpiredRecords('userenrollment').where({
            user: currUser.id, collectionCentre: centreId
          });
        } // otherwise if admin, just find corresponding enrollment
        return ModelService.filterExpiredRecords('userenrollment').where({
          collectionCentre: centreId
        });
      })
      .then(function (userEnrollment) {
        if (!userEnrollment) {
          return null;
        }
        // if enrollment found or is admin, return all collection centre's enrollments
        return CollectionCentre.findOne(centreId)
                               .populate('userEnrollments');
      })
      .then(function (collectionCentre) { // populate and return users in collection centre
        if (!collectionCentre) {
          return null;
        }

        return Promise.all(
          _.map(collectionCentre.userEnrollments, function (enrollment) {
            return User.findOne(enrollment.user).then(function (user) {
              user.enrollmentId = enrollment.id;
              user.collectionCentre = enrollment.collectionCentre;
              user.centreAccess = enrollment.centreAccess;
              return user;
            });
          })
        );
      })
      .then(function (users) {
        return users;
      })
      .catch(function (err) {
        return err;
      });
    }

  };

})();
