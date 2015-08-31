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
      study: {
        model: 'study',
        required: true
      },
      formVersion: {
        model: 'formversion',
        required: true
      },
      surveyVersion: {
        model: 'surveyversion',
        required: true
      },
      subjectSchedule: {
        model: 'subjectschedule',
        required: true
      },
      subjectEnrollment: {
        model: 'subjectenrollment',
        required: true
      },
      userEnrollment: {
        model: 'userenrollment',
        required: true
      },
      answers: {
        type: 'json',
        required: true
      },
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

