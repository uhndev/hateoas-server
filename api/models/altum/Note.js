/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    /**
     * name
     * @description note text
     * @type {String}
     */
    text: {
      type: 'string'
    },

    /**
     * name
     * @description A referral which the note belong to
     * @type {Model}
     */
    referral: {
      model: 'referral'
    },

    /**
     * name
     * @description A client which the note belong to
     * @type {Model}
     */
    client: {
      model: 'client'
    },

    /**
     * name
     * @description A note type
     * @type {Model}
     */
    noteType: {
      model: 'NoteType'
    }

  }
};

