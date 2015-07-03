/**
* AnswerSet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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
		expired: {
			type: 'boolean',
      defaultsTo: false
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
        answer.expired = true;
        answer.save();  
      }
      cb();
    });
  }
};

}());

