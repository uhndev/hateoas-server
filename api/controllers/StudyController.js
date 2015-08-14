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

      Group.findOne(req.user.group).then(function (group) {
        this.group = group;
        return Study.findOne({name: name});
      })
      .then(function (study) {
        this.study = study;
        switch (this.group.level) {
          case 1: return collectioncentreoverview.find({ study: name });
          case 2: return collectioncentreoverview.find({ username: req.user.username, study: name });
          case 3: return null; //TODO
          default: return res.notFound();
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
          this.study.centreSummary = _.unique(centres, 'name');
          res.ok(this.study);
        }
      })
      .catch(function (err) {
        return res.serverError({
          title: 'Server Error',
          code: err.status,
          message: err.details
        });
      });
    },

    /**
     * create
     * @description Creates a study given name, reb, attributes, administrator and
     *              pi.  We prevent users from being able to add collection centres
     *              when creating studies; they should only be able to do so on the
     *              study/:name/collectioncentre page.  We also verify that the name
     *              is unique and provide the user an error if it isnt.
     */
    create: function (req, res, next) {
      var name = req.param('name');
      var attributes = req.param('attributes') || Study.attributes.attributes.defaultsTo;
      var options = _.pick(_.pick(req.body, 'name', 'reb', 'attributes', 'administrator', 'pi'), _.identity);

      Study.findOneByName(name).exec(function (err, study) {
        if (err) res.serverError(err);
        if (study) {
          return res.badRequest({
            title: 'Study Error',
            code: 400,
            message: 'Unable to create study ' + name + ', a study by that name already exists.'
          });
        } else {
          // validating passed in study attribute object structure
          if (_.isObject(attributes) &&
              _.all(_.keys(attributes), _.isString) &&
              _.all(_.values(attributes), _.isArray)) {

            Study.create(options).exec(function (err, study) {
              if (err || !study) {
                return res.badRequest({
                  title: 'Study Error',
                  code: err.status || 400,
                  message: err.details || 'Error creating study'
                });
              } else {
                res.status(201);
                return res.json(study);
              }
            });
          }
          // otherwise structure is invalid and we fail
          else {
            return res.badRequest({
              title: 'Study Attributes Error',
              code: 400,
              message: 'Invalid study attributes structure, keys must be strings and values must be arrays'
            });
          }
        }
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
          attributes = req.param('attributes');
      var options = _.pick(_.pick(req.body, 'name', 'reb', 'administrator', 'pi'), _.identity);

      if (attributes) {
        // validating passed in study attribute object structure
        if (_.isObject(attributes) &&
            _.all(_.keys(attributes), _.isString) &&
            _.all(_.values(attributes), _.isArray)) {
          options.attributes = attributes;
        } else {
          return res.badRequest({
            title: 'Study Attributes Error',
            code: 400,
            message: 'Invalid study attributes structure, keys must be strings and values must be arrays'
          });
        }
      }

      Study.update({id: id}, options).exec(function (err, study) {
        if (err) {
          return res.serverError({
            title: 'Server Error',
            code: err.status,
            message: err.details
          });
        }
        res.ok(_.first(study));
      });
    }

  };

})();


