/**
 * StudyController
 *
 * @module controllers/Study
 * @description Server-side logic for managing studies
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    /**
     * find
     * @description Finds and returns a list of studies with 3 modes of filtering
     *              based on the current user's group.  Admins are simply returned
     *              all studies, coordinators are filtered based on their enrollments
     *              at their respective collection centres and similarily so for
     *              subjects and their enrollments.
     */
    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('study')
        .where( actionUtil.parseCriteria(req) )
        .limit( actionUtil.parseLimit(req) )
        .skip( actionUtil.parseSkip(req) )
        .sort( actionUtil.parseSort(req) );

      query.populate('collectionCentres');
      query.exec(function found(err, studies) {
        if (err) {
          return res.serverError(err);
        }

        Group.findOne(req.user.group).then(function (group) {
          switch(group.level) {
            case 1: // allow all as admin
              return res.ok(studies);
            case 2: // find specific user's access
              return User.findOne(req.user.id).populate('enrollments')
              .then(function(user) {
                var filteredRecords = _.filter(studies, function (record) {
                  return _.some(record.collectionCentres, function(centre) {
                    return _.includes(_.pluck(user.enrollments, 'collectionCentre'), centre.id);
                  });
                });
                res.ok(filteredRecords);
              }).catch(function (err) {
                return res.serverError(err);
              });
            case 3: // find subject's collection centre access
              return Subject.findOne({user: req.user.id}).populate('enrollments')
              .then(function(user) {
                var filteredRecords = _.filter(studies, function (record) {
                  return _.some(record.collectionCentres, function(centre) {
                    return _.includes(_.pluck(user.enrollments, 'collectionCentre'), centre.id);
                  });
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
     * @description Finds and returns one study with enrollment summaries including
     *              number of overseeing coordinators and enrolled subjects.  Users
     *              with coordinator or subject group permissions will only see the
     *              requested study if they are enrolled in a collection centre
     *              registered in that study.
     */
    findOne: function (req, res, next) {
      var name = req.param('name');
      var getCollectionCentreSummary = function(centreId) {
        var summary = {};
        return CollectionCentre.findOne(centreId)
          .then(function (cc) {
            summary = _.pick(cc, 'id', 'name', 'contact');
            return Promise.all([
              UserEnrollment.count().where({ collectionCentre: centreId, expiredAt: null }),
              SubjectEnrollment.count().where({ collectionCentre: centreId, expiredAt: null })
            ]);
          })
          .spread(function (coordinatorCount, subjectCount) {
            summary.coordinators_count = coordinatorCount || 0;
            summary.subjects_count = subjectCount || 0;
            return summary;
          });
      };

      Group.findOne(req.user.group).then(function (group) {
        this.group = group;
        return Study.findOne({name: name}).populate('collectionCentres');
      })
      .then(function (study) {
        this.study = study;
        switch (this.group.level) {
          case 1: return null;
          case 2: return User.findOne(req.user.id).populate('enrollments');
          case 3: return Subject.findOne({user: req.user.id}).populate('enrollments');
          default: return res.notFound();
        }
      })
      .then(function (user) {
        if (this.study) {
          if (this.group.level > 1 && user) { // for non-admins, only return summaries for valid enrollments
            return Promise.all(
              _.map(_.pluck(user.enrollments, 'collectionCentre'), getCollectionCentreSummary)
            );
          } else { // otherwise, return summaries for all collection centres
            return Promise.all(
              _.map(_.pluck(this.study.collectionCentres, 'id'), getCollectionCentreSummary)
            );
          }
        } else {
          // study not found
          return null;
        }
      })
      .then(function (centres) {
        if (_.isUndefined(this.study)) {
          return res.notFound();
        }
        else if (_.isNull(centres)) {
          return res.forbidden({
            title: 'Error',
            code: 403,
            message: "User "+req.user.email+" is not permitted to GET "
          });
        }
        else {
          this.study.centreSummary = centres;
          res.ok(this.study);
        }
      })
      .catch(function (err) {
        return res.serverError({
          title: 'Server Error',
          code: err.status,
          message: err.message
        });
      });
    },

    /**
     * update
     * @description Updates the study attributes given id, name, reb, attributes,
     *              administrator or pi.  We prevent users from being able to
     *              update a study's collection centre directly, and only allow
     *              this from the CollectionCentre model.
     *
     * @see controllers/CollectionCentreController
     */
    update: function (req, res, next) {
      // can only update study collection centres via CollectionCentre model
      var id = req.param('id'),
          name = req.param('name'),
          reb = req.param('reb'),
          attributes = req.param('attributes'),
          administrator = req.param('administrator'),
          pi = req.param('pi');

      var fields = {};
      if (name) fields.name = name;
      if (reb) fields.reb = reb;
      if (attributes) fields.attributes = attributes;
      if (administrator) fields.administrator = administrator;
      if (pi) fields.pi = pi;

      Study.update({id: id}, fields).exec(function (err, study) {
        if (err) {
          return res.serverError({
            title: 'Server Error',
            code: err.status,
            message: err.message
          });
        }
        res.ok(_.first(study));
      });
    }

  };
})();


