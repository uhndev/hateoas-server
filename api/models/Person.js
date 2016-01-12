/**
 * Person.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,
    attributes: {

      /**
       * salutation
       * @description A person's salutation
       * @type {String}
       */
      salutation: {
        type: 'string'
      },

      /**
       * firstName
       * @description A person's first name.
       * @type {String}
       */
      firstName: {
        type: 'string'
      },

      /**
       * middleName
       * @description A person's middle name
       * @type {String}
       */
      middleName: {
        type: 'string'
      },

      /**
       * lastName
       * @description A person's last name.
       * @type {String}
       */
      lastName: {
        type: 'string'
      },

      /**
       * prefix
       * @description Enumeration of allowable prefixes for a client.
       * @type {Enum}
       */
      prefix: {
        type: 'string',
        enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.']
      },

      /**
       * gender
       * @description Enumeration of allowable genders of a client.
       * @type {Enum}
       */
      gender: {
        type: 'string',
        enum: ['Male', 'Female']
      },

      /**
       * dateOfBirth
       * @description A client's date of birth.
       * @type {Date}
       */
      dateOfBirth: {
        type: 'date'
      },

      /**
       * address
       * @description A collection of a person's addresses
       * @type {collection}
       */
      addresses: {
        collection: 'address',
        via: 'person'
      },

      /**
       * homePhone
       * @description A client's homePhone
       * @type {string}
       */
      homePhone: {
        type: 'string'
      },

      /**
       * workPhone
       * @description A client's workPhone
       * @type {string}
       */
      workPhone: {
        type: 'string'
      },


      /**
       * cellPhone
       * @description A client's cellPhone
       * @type {string}
       */
      cellPhone: {
        type: 'string'
      },

      /**
       * otherPhone
       * @description A client's otherPhone
       * @type {string}
       */
      otherPhone: {
        type: 'string'
      },


      /**
       * company
       * @description A person's company
       * @type {String}
       */
      company: {
        type: 'string'
      },

      /**
       * title
       * @description A person's title
       * @type {String}
       */
      title: {
        type: 'string'
      },

      /**
       * a person's licence
       * @description A person's licence
       * @type {String}
       */
      license: {
        type: 'string'
      },

      /**
       * familyDoctor
       * @description A person's family doctor
       * @type {String}
       */
      familyDoctor: {
        model: 'physician'
      },

      /**
       * fax
       * @description A person's fax number
       * @type {String}
       */
      fax: {
        type: 'string'
      },

      /**
       * homeEmail
       * @description A person's homeEmail
       * @type {String}
       */
      homeEmail: {
        type: 'string'
      },

      /**
       * workEmail
       * @description A person's work eMail
       * @type {String}
       */
      workEmail: {
        type: 'string'
      },

      /**
       * otherEmail
       * @description A person's other eMail
       * @type {String}
       */
      otherEmail: {
        type: 'string'
      },

      /**
       * occupation
       * @description A person's occupation
       * @type {String}
       */
      occupation: {
        type: 'string'
      },

      /**
       * occupationType
       * @description A person's occupation type
       * @type {String}
       */
      occupationType: {
        type: 'string'
      },

      /**
       * occupationSector
       * @description A person's occupation sector
       * @type {String}
       */
      occupationSector: {
        type: 'string'
      },

      /**
       * employment
       * @description A collection of a person's employment
       * @type {collection}
       */
      employment: {
        collection: 'employment',
        via: 'person'
      },

      /**
       * personComments
       * @description A person's comments
       * @type {String}
       */
      personComments: {
        type: 'string'
      },


      /**
       * language
       * @description A person's language
       * @type {String}
       */
      language: {
        type: 'string'
      },

      /**
       * requiresInterperter
       * @description a persons requires interperter flag
       * @type {String}
       */
      requiresInterpreter: {
        type: 'boolean'
      },

      /**
       * user
       * @description a persons associated users
       * @type {collection}
       */

      users: {
        collection: 'user',
        via: 'person'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  }
})();

