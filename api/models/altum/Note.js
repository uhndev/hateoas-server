/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        text: {
            type: 'string'
        },
        referral: {
            model: 'referral'
        },
        client: {
            model: 'client'
        },
        noteType: {
            model: 'NoteType'
        }

    }
};

