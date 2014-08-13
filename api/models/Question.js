/**
* Question.js
*
* @description :: Question Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        // unique id or name attribute of the field
        field_name: {
            type: 'string',
            required: true,
            unique: true
        },
        // html label of each field
        field_title: {
            type: 'string',
            required: true
        },        
        // text, textarea, radio, select, number, checkbox, password, hidden, email
        field_type: {
            type: 'string',
            required: true,
            defaultsTo: null
        },
        field_placeholder: {
            type: 'string'
        },
        field_validation: {
            type: 'json',
            defaultsTo: null
        },
        // optional text to display when field fails validation
        field_helpertext: {
            type: 'string'
        },
        // options fields for radio and select input types
        field_options: {
            type: 'array',
            defaultsTo: null
        },
        field_hasOptions: {
            type: 'boolean',
            defaultsTo: false
        },
        field_required: {
            type: 'boolean',
            required: true,
            defaultsTo: true
        }
    }
};

