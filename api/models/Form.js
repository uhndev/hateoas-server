/**
* Form.js
*
* @description :: Form Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/
(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {

    attributes: {
        // system, user generated form
        form_type: {
            type: 'string',
            required: true
        },
        // unique id or name attribute of form
        form_name: {
            type: 'string',
            required: true,
            unique: true
        },
        // title of the form to display
        form_title: {
            type: 'string',
            required: true
        },
        // list of questions in this form
        form_questions: {
            type: 'array',
            required: true
        },
        // text to appear on submit button
        form_submitText: {
            type: 'text',
            defaultsTo: 'Submit'
        },
        // text to appear on cancel button
        form_cancelText: {
            type: 'text',
            defaultsTo: 'Cancel'
        }
    }
};

}());