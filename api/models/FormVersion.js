/**
 * FormVersion
 *
 * @class FormVersion
 * @description Model representation of a version of a form
 * @docs        http://sailsjs.org/#!documentation/models
 */
(function() {
  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  module.exports = {
    schema: true,
    attributes: {

      /**
       * revision
       * @description The version number which dictates what the version is for the associated Form
       * @type {Integer}
       */
      revision: {
        type: 'integer',
        defaultsTo: 1
      },

      /**
       * form
       * @description Reference to the form for which this FormVersion tracks changes for
       * @type {Association}
       */
      form: {
        model: 'form'
      },

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
       * description
       * @description Optional commit message that should describe reasons for changing a form
       * @type {String}
       */
      description: {
        type: 'string'
      },

      /**
       * sessions
       * @description Collection of set time intervals that define when data should be collected
       *              for each subject based on their date of event.  Each session created acts as
       *              a template for SubjectSchedules to be stamped out for each subject in
       *              SubjectEnrollment.
       * @type: {Association} many-to-many relationship to the Session model
       */
      sessions: {
        collection: 'session',
        via: 'formVersions'
      },

      /**
       * activeOn
       * @description Boolean date value denoting whether or not this FormVersion has had any AnswerSets filled out.
       *              If activeOn is null, then there's no need to create a new version of a Form.
       * @type {Date}
       */
      activeOn: {
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
    
  };

}());
