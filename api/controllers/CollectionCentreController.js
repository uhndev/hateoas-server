/**
 * CollectionCentreController
 *
 * @module controllers/CollectionCentre
 * @description Server-side logic for managing Collection Centres
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var Promise = require('q');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * find
     * @description Finds and returns collection centres by enrollment
     */
    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('collectioncentre')
        .where( actionUtil.parseCriteria(req) )
        .limit( actionUtil.parseLimit(req) )
        .skip( actionUtil.parseSkip(req) )
        .sort( actionUtil.parseSort(req) );

      query.exec(function found(err, centres) {
        if (err) {
          return res.serverError(err);
        }

        Group.findOne(req.user.group).then(function (group) {
          switch(group.level) {
            case 1: // allow all as admin
              return res.ok(centres);
            case 2: // find specific user's access
              return User.findOne(req.user.id).populate('enrollments')
              .then(function(user) {
                var filteredRecords = _.filter(centres, function (centre) {
                  return _.includes(_.pluck(user.enrollments, 'collectionCentre'), centre.id);
                });
                res.ok(filteredRecords);
              }).catch(function (err) {
                return res.serverError(err);
              });
            case 3: // find subject's collection centre access
              return Subject.findOne({user: req.user.id}).populate('enrollments')
              .then(function(subject) {
                var filteredRecords = _.filter(centres, function (record) {
                  return _.includes(_.pluck(subject.enrollments, 'collectionCentre'), centre.id);
                });
                res.ok(filteredRecords);
              }).catch(function (err) {
                return res.serverError(err);
              });
            default: return res.notFound();
          }
        });
      });
    },

    /**
     * findOne
     * @description Finds one collection centre given an id
     *              and populates enrolled coordinators and subjects
     */
    findOne: function (req, res, next) {
      CollectionCentre.findOne(req.param('id'))
        .populate('study')
        .populate('contact')
        .exec(function (err, centre) {
          if (err) {
            return res.serverError(err);
          }

          if (_.isUndefined(centre)) {
            res.notFound();
          } else {
            Group.findOne(req.user.group).then(function (group) {
              this.group = group;
              switch (group.level) {
                case 1: return null;
                case 2: return UserEnrollment.find({
                          user: req.user.id,
                          collectionCentre: centre.id
                        });
                case 3: return Subject.findOne({ user: req.user.id }).then(function (subject) {
                          return SubjectEnrollment.find({
                            subject: subject.id,
                            collectionCentre: centre.id
                          });
                        });
                default: return res.notFound();
              }
            })
            .then(function (enrollments) {
              // if no enrollments found for coordinator/subject, DENY
              if (this.group.level > 1 && enrollments.length === 0) {
                return res.forbidden({
                  title: 'Error',
                  code: 403,
                  message: "User "+req.user.email+" is not permitted to GET "
                });
              } else {
                var filteredUsers = { collectionCentreId: centre.id },
                  filteredSubjects = { collectionCentreId: centre.id };
                if (enrollments) { // return users with matching enrollments
                  filteredUsers.userenrollmentId = _.pluck(enrollments, 'id');
                  if (this.group.level === 3) { // if user is a subject, only return their enrollments
                    filteredSubjects.subjectenrollmentId = _.pluck(enrollments, 'id');
                  }
                }
                return Promise.all([
                  collectioncentreuser.find(filteredUsers),
                  collectioncentresubject.find(filteredSubjects)
                ]).spread(function (users, subjects) {
                  centre.coordinators = users;
                  centre.subjects = subjects;
                  res.ok(centre);
                });
              }
            });
          }
        });
    },

    /**
     * create
     * @description Creates a collection centre given a name, user contact,
     *              and associated (existing) study.  Will fail if a collection
     *              centre has already be registered under the same name in
     *              the requested study.
     */
    create: function(req, res, next) {
      var ccName = req.param('name'),
          ccContact = req.param('contact'),
          studyId = req.param('study');
      var options = _.pick(_.pick(req.body, 'name', 'contact', 'study'), _.identity);

      Study.findOne(studyId).populate('collectionCentres')
        .then(function (study) {
          if (_.isUndefined(study)) {
            err = new Error('Study '+studyId+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            if (_.some(study.collectionCentres, {name: ccName})) {
              err = new Error('Collection centre with name '+ccName+' already exists under this study.');
              err.status = 400;
              throw err;
            } else {
              return CollectionCentre.create(options);
            }
          }
        })
        .then(function (centre) {
          res.status(201).jsonx(centre);
        })
        .catch(function (err) {
          res.badRequest({
            title: 'Error',
            code: err.status,
            message: err.details
          });
        });
    },

    /**
     * update
     * @description Updates a collection centre given only name or contact
     */
    update: function(req, res, next) {
      var ccId = req.param('id'),
          ccName = req.param('name'),
          ccContact = req.param('contact');
      var options = _.pick(_.pick(req.body, 'name', 'contact'), _.identity);

      CollectionCentre.update({id: ccId}, options)
        .then(function (centre) {
          res.ok(centre);
        })
        .catch(function (err) {
          res.badRequest({
            title: 'Error',
            code: 400,
            message: 'Unable to update collection centre with id ' + ccId + ' and fields: ' + JSON.stringify(options)
          });
        });
    },

    /**
     * findByStudyName
     * @description Finds collection centres by their associations to a given
     *              study.  Is used for each of the hateoas response link objects.
     */
    findByStudyName: function(req, res) {
      var studyName = req.param('name');

      CollectionCentre.findByStudyName(studyName, req.user,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) }
      ).then(function(centres) {
        var err = centres[0];
        var centreItems = centres[1];
        if (err) res.serverError(err);
        res.ok(centreItems);
      });
    }
  };
})();

