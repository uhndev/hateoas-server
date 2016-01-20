/**
 * NoteType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    /**
     * name
     * @description A note type name
     * @type {string}
     */
    name: {
      type: 'string'
    },

    /**
     * name
     * @description A note type icon will show in html
     * @type {Model}
     */
    iconClass: {
      type: 'string'
    },
    /**
     * name
     * @description note collection
     * @type {Model}
     */
    notes: {
      collection: 'note',
      via: 'noteType'
    }

  }
};

