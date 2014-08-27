/**
* AnswerSet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
    form: {
      // model: 'form',
      type: 'string',
      required: true
    },
		subject: {
			// model: 'subject',
      type: 'string', 
      required: true
		},
		user: {
			// model: 'user',
      type: 'string', 
			required: true
		},
		answers: {
			type: 'json',
      required: true
		},
		expired: {
			type: 'boolean'
		}
	}
};

