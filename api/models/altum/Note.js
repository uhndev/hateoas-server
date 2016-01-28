/**
 * Note
 *
 * @class Note
 * @description Model representation of a Note
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

