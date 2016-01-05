/**
* Form
*
* @class  Form
* @description Model representation of a form
* @docs        http://sailsjs.org/#!documentation/models
*/
(function() {
  var Promise = require('bluebird');
  var _super = require('./BaseModel.js');
  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  _.merge(exports, _super);
  _.merge(exports, {
    schema: true,

    attributes: {

      /**
       * name
       * @description Name of the form created by pluginEditor
       */
      name: {
        type: 'string',
        required: true
      },

      /**
       * metaData
       * @description Contains any amount of form-specific metadata the user would like to attach.
       *              Should be in the form of key-value pairs.
       * @type {Object}
       */
      metaData: {
        type: 'json'
      },

      /**
       * questions
       * @description Contains array of json-object questions
       * @type {Array}
       */
      questions: {
        type: 'array'
      },

      /**
       * studies
       * @description Associated studies for which this form is attached to.
       *              A study can have multiple forms attached to it
       * @type {Array} linked study references
       */
      studies: {
        collection: 'study',
        via: 'forms'
      },

      /**
       * versions
       * @description Collection of versions this particular form has, in git terms, the instance
       *              of this Form model is the HEAD revision, and the items in this collection
       *              represent the commit history.
       * @type {Association} 1-to-many relationship to the FormVersion model
       */
      versions: {
        collection: 'formversion',
        via: 'form'
      },

      /**
       * lastPublished
       * @description Boolean flag of null || date defining whether or not subjects have already begun
       *              participating in this Survey.  If publishedOn has a date set, this form can only
       *              be updated by creating a new FormVersion and bumping up the latest version reference to match.
       *              This date should always reflect the latest FormVersion's activeOn date attribute.
       * @type {Date} Date denoting the day when subjects began participating in a survey
       */
      lastPublished: {
        type: 'date',
        defaultsTo: null
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * afterCreate
     * @description After creating a brand new form, create initial mirrored FormVersion
     */
    afterCreate: function(values, cb) {
      // stamp out initial form version
      FormVersion.create({
        revision: 0,
        form: values.id,
        name: values.name,
        metaData: values.metaData,
        questions: values.questions,
        description: 'Initial commit'
      }).exec(function (err, formVersion) {
        cb(err);
      });
    },

    /**
     * afterUpdate
     * @description After updating the head revision, depending on whether or not users have
     *              filled out any AnswerSets, we create new FormVersions as needed.
     */
    afterUpdate: function(values, cb) {
      if (!_.isNull(values.expiredAt)) {
        Form.findOne(values.id)
          .populate('versions')
          .then(function (form) {
            return FormVersion.update({ id: _.pluck(form.versions, 'id') }, {
              expiredAt: new Date()
            });
          })
          .then(function (versions) {
            cb();
          })
          .catch(cb);
      } else {
        cb();
      }
    },

	  /**
     * destroyLifecycle
     * @description Lifecycle method for archiving forms; affected form versions in any existing survey
     *              sessions must be updated when removing a form from a study or archiving it altogether.
     *              If any answersets exists, this function should not even be called.  See FormController.destroy
     *              and StudyController.removeFormFromStudy for usages.
     * @param formID    ID of form to archive
     * @param criteria  Waterline find criteria for studysession when archiving form
     * @returns {Promise}
	   */
    destroyLifecycle: function(formID, criteria) {
      return Form.findOne(formID).populate('versions')
        .then(function (form) { // find affected form versions to be removed
          this.affectedFormVersionIds = _.pluck(form.versions, 'id');
          return studysession.find(criteria).then(function (studySessions) {
            return _.filter(studySessions, function (session) {
              return _.xor(this.affectedFormVersionIds, _.flatten([session.formVersions])).length > 0;
            });
          });
        })
        .then(function (affectedStudySessions) { // perform updates on related sessions
          return Promise.all(
            _.map(affectedStudySessions, function (affectedSession) {
              return Session.findOne(affectedSession.id).then(function (session) {
                _.each(this.affectedFormVersionIds, function (formVersionToRemove) {
                  session.formOrder = _.without(session.formOrder, formVersionToRemove);
                  session.formVersions.remove(formVersionToRemove);
                });
                session.save();
              })
            })
          );
        });
    },

    /**
     * findLatestFormVersions
     * @description Given a list of form objects, return a list of latest corresponding FormVersions
     * @param forms Array of form objects to search upon
     * @returns {Array | Promise} Array of form versions or promise
     */
    findLatestFormVersions: function(forms) {
      return Promise.all(
        _.map(forms, function (form) {
          return FormVersion.getLatestFormVersion(form.id);
        })
      );
    },

    findByStudy: function(studyID, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;

      // get study forms
      return Study.findOne(studyID).populate('forms')
        .then(function (study) {
          var studyFormIds = _.pluck(study.forms, 'id');
          return ModelService.filterExpiredRecords('form')
            .where(query.where)
            .populate('versions').then(function (forms) {
            return _.filter(forms, function (form) {
              return _.includes(studyFormIds, form.id);
            });
          });
        })
        .then(function (filteredForms) {
          return [false, filteredForms];
        })
        .catch(function (err) {
          return [err, null];
        });
    }

  });

})();
