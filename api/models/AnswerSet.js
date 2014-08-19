/**
* AnswerSet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		form_id: {
			type: 'text',
			required: true
		},
		study_id: {
			type: 'text',
			required: true
		},
		subject_id: {
			type: 'text',
			required: true
		},
		user_id: {
			type: 'text',
			required: true
		},
		answers: {
			type: 'json'
		},
		expiresAt: {
            type: 'datetime',
            required: true
		}
	}
};

