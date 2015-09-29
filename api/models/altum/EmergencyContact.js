/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    /**
     * contact
     * @description A emergency contact's associated contact id
     * @type {model}
     */

    contact: {
      model: 'contact'
    },

    /**
     *
     * @description A emergency contact's associated client id
     * @type {model}
     */

    emergencyContact: {
      model: 'contact'
    },

    /**
     * relationship
     * @description A emergencyContact's relationship
     * @type {String}
     */

    relationship: {
      type: 'string'
    },

    /**
     * emergencyPriority
     * @description A emergencyContact's priority
     * @type {integer}
     */

    emergencyPriority: {
      type: 'integer'
    },

    /**
     * notes
     * @description A emergencyContact's notes
     * @type {String}
     */

    notes: {
      type: 'string'
    }
  }
};

