/**
* Study.js
*
* @description :: Study Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes: {
        "name": {
            type: 'string',
            required: true,
            unique: true,
        },
        "REB": {
            type: 'string',
            required: true,
            unique: true,
        },
        "PI": {
            type: 'integer',
            required: true,
        },
        "coordinator": {
            model: 'user',
        },
        "centers": {
            type: 'array',
            required: true,
        },
        "expiredAt": {
            type: 'datetime',
            required: true,
            defaultsTo: 0,
        },
    }
};

