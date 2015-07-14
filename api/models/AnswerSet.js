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
      form: {
        model: 'form',
        required: true
      },
      subject: {
        // model: 'subject',
        type: 'string',
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

