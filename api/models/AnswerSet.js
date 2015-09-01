/**
* AnswerSet
*
* @class AnswerSet
* @description Model representation of an AnswerSet
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,

    attributes: {
      /**
       * study
       * @description Associated study pertinent to this AnswerSet
       * @type {Association} one-way association to Study model
       */
      study: {
        model: 'study',
        required: true
      },

      /**
       * formVersion
       * @description Reference to version of form filled out for this AnswerSet
       * @type {Association} one-way association to FormVersion model
       */
      formVersion: {
        model: 'formversion',
        required: true
      },

      /**
       * surveyVersion
       * @description Reference to version of survey at time of data capture for AnswerSet
       * @type {Association} one-way association to SurveyVersion model
       */
      surveyVersion: {
        model: 'surveyversion',
        required: true
      },

      /**
       * subjectSchedule
       * @description Reference to instance of a subject's scheduled data capture event
       * @type {Association} one-to-one association between AnswerSet and SubjectSchedule
       */
      subjectSchedule: {
        model: 'subjectschedule',
        required: true
      },

      /**
       * subjectEnrollment
       * @description Reference to the subject & enrollment data to capture who this data refers to
       * @type {Association} one-way association to SubjectEnrollment model
       */
      subjectEnrollment: {
        model: 'subjectenrollment',
        required: true
      },

      /**
       * userEnrollment
       * @description Reference to the user/coordinator to capture who may have been capturing data on behalf of subject
       * @type {Association} one-way association to UserEnrollment model
       */
      userEnrollment: {
        model: 'userenrollment',
        required: true
      },

      /**
       * answers
       * @description Key-value mapping of unique field names in a particular version of a form to answers
       * @type {Object}
       */
      answers: {
        type: 'json',
        required: true
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

    // Set most recent previous answerset to be expired
    beforeCreate: function(values, cb) {
      AnswerSet.findOne({ where: {
        form: values.form,
        subject: values.subject,
        person: values.person
      }, sort: 'updatedAt DESC'}).exec(function (err, answer) {
        if (err) return cb(err);
        if (answer) {
          answer.expiredAt = new Date();
          answer.save();
        }
        cb();
      });
    }
  };
})();

