/**
 * StudyController
 *
 * @module controllers/Study
 * @description Server-side logic for managing studies
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var Promise = require('bluebird');
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    identity: 'study',

    /**
     * findOne
     * @description Finds and returns one study with enrollment summaries including
     *              number of overseeing coordinators and enrolled subjects.  Users
     *              with coordinator or subject group permissions will only see the
     *              requested study if they are enrolled in a collection centre
     *              registered in that study.
     */
    findOne: function (req, res, next) {
      var studyID = req.param('id');

      Study.findOne(studyID).populate('administrator').populate('pi')
        .then(function (study) {
          this.study = study;
          if (req.user.group == 'admin') { // is admin
            return collectioncentreoverview.find({study: studyID});
          } else {
            return collectioncentreoverview.find({username: req.user.username, study: studyID});
          }
        })
        .then(function (centres) {
          if (_.isUndefined(this.study)) {
            return res.notFound();
          }
          else if (req.user.group != 'admin' && centres.length === 0) {
            return res.forbidden({
              title: 'Error',
              code: 403,
              message: "User " + req.user.email + " is not permitted to GET "
            });
          }
          else {
            this.study.centreSummary = _.unique(centres, 'name');
            res.ok(this.study, { links: study.getResponseLinks() });
          }
        })
        .catch(function (err) {
          return res.serverError(err);
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
    },

    /**
     * removeFormFromStudy
     * @description Overrides default blueprint behaviour of removing form from study.  Additionally
     *              will check and update any sessions which contain forms affected by this removal
     *              as long as no AnswerSets rely on those forms.
     * @param req
     * @param res
     */
    removeFormFromStudy: function (req, res) {
      var studyID = req.param('id');    // study primary key to remove form from
      var formID = req.param('formID'); // form primary key to remove

      FormVersion.hasAnswerSets(formID).then(function (hasAnswerSets) {
        if (hasAnswerSets) {
          return res.badRequest({
            title: 'Study Error',
            code: 400,
            message: 'Unable to remove form from study, there are answers associated to the requested form.'
          });
        } else {
          Study.findOne(studyID)
            .populate('forms')
            .then(function (studyRecord) {
              if (!studyRecord) return res.notFound();
              if (!studyRecord.forms) return res.notFound();

              studyRecord.forms.remove(formID);
              return studyRecord.save();
            })
            .then(function (studyRecord) {
              this.studyRecord = studyRecord;
              if (sails.hooks.pubsub) {
                Study.publishRemove(studyRecord.id, 'forms', formID, !sails.config.blueprints.mirror && req);
              }
              // update any associated sessions to form in question
              return Form.destroyLifecycle(formID, {study: studyID});
            })
            .then(function () {
              return res.ok(this.studyRecord);
            })
            .catch(function (err) {
              return res.serverError(err);
            });
        }
      });
    }
  };

})();
