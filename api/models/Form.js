/**
* Form
*
* @class  Form
* @description Model representation of a form
* @docs        http://sailsjs.org/#!documentation/models
*/
(function() {
  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  module.exports = {
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
        // if lastPublished set on Form, then there are AnswerSets referring to this version
        if (values.lastPublished !== null) {
          // in that case, stamp out next form version and next survey version
          // create new form version with updated revision number
          FormVersion.find({ form: values.id })
            .sort('revision DESC')
            .then(function (latestFormVersions) {
              var newFormVersion = {
                revision: _.first(latestFormVersions).revision + 1,
                form: values.id
              };
              _.merge(newFormVersion, _.pick(values, 'name', 'metaData', 'questions'));
              return FormVersion.create(newFormVersion);
            })
            .then(function (newFormVersion) {
              cb();
            })
            .catch(cb);
        }
        // otherwise updates are done in place for the current head
        else {
          cb();
        }
      }
    },

    findByStudyName: function(studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;

      // get study forms
      return Study.findOneByName(studyName).populate('forms')
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

  };

}());
