/**
* Encounter.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,
    attributes: {
        "study": {
            model: 'study',
        },
        "type": {
            type: 'string',
            required: true,
            defaultsTo: null,
        },
        "name": {
            type: 'string',
            required: true,
            defaultsTo: null,
        },
        "label": {
            type: 'string',
            required: true,
        },
        "timeline": {
            type: 'integer',
            required: true,
            defaultsTo: 0,
        },
        "forms": {
            type: 'json',
        },
        "permissions": {
            type: 'json',
            required: true,
        },
        "expiredAt": {
            type: 'datetime',
            required: true,
            defaultsTo: null,
        },
    }
};

