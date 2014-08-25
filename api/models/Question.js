/**
* Question.js
*
* @description :: Question Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        // text, textarea, radio, select, number, checkbox, password, hidden, email
        type: {
            type: 'string',
            required: true,
            defaultsTo: null
        },
        // options fields for radio and select input types
        options: {
            type: 'array',
            defaultsTo: null
        },
        // set to true if this question should appear when editing options
        omitOnEdit: {
            type: 'boolean',
            defaultsTo: false
        },
        // unique id or name attribute of the field
        name: {
            type: 'string',
            required: true
        },
        // set instead of type or templateUrl to use a custom inline html/directives
        template: {
            type: 'string'
        },
        // set instead of type or template to use custom html template relative to root
        templateUrl: {
            type: 'string'
        },
        // html label of each field
        label: {
            type: 'string',
            required: true
        },
        required: {
            type: 'boolean',
            required: true,
            defaultsTo: true
        },
        // used to conditionally show field - when true, input is hidden
        hideExpression: {
            type: 'string'
        },
        hide: {
            type: 'boolean',
            defaultsTo: false
        },
        disabled: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        placeholder: {
            type: 'string'
        },
        // optional text to display when field fails validation
        helpertext: {
            type: 'string'
        }
    }
};

