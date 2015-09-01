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

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByStudyName: function(studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;

      // get study forms
      return Study.findOneByName(studyName).populate('forms')
        .then(function (study) {
          var studyFormIds = _.pluck(study.forms, 'id');
          return Form.find(query).then(function (forms) {
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
