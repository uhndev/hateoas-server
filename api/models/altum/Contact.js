/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema:true,
  attributes: {

    /**
     * salutation
     * @description A contact's salutation
     * @type {String}
     */

    salutation: {
      type: 'string'
    },

    /**
     * firstName
     * @description A client's first name.
     * @type {String}
     */

    firstName: {
      type: 'string'
    },


    /**
     * middleName
     * @description A contact's middle name
     * @type {String}
     */

    middleName: {
      type: 'string'
    },

    /**
     * lastName
     * @description A client's last name.
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
     * @description A client's address
     * @type {model}
     */
    address: {
      model: 'address'
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
     * @description A contact's company
     * @type {String}
     */

    company: {
      type: 'string'
    },

    /**
     * title
     * @description A contact's title
     * @type {String}
     */

    title: {
      type: 'string'
    },

    /**
     * a contact's licence
     * @description A contact's licence
     * @type {String}
     */

    license: {
      type: 'string'
    },

    /**
     * familyDoctor
     * @description A contact's family doctor
     * @type {String}
     */

    familyDoctor: {
      model: 'physician'
    },
    /**
     * fax
     * @description A contact's fax number
     * @type {String}
     */

    fax: {
      type: 'string'
    },

    /**
     * homeEmail
     * @description A contact's homeEmail
     * @type {String}
     */

    homeEmail: {
      type: 'string'
    },

    /**
     * workEmail
     * @description A contact's work eMail
     * @type {String}
     */

    workEmail: {
      type: 'string'
    },


    /**
     * otherEmail
     * @description A contact's other eMail
     * @type {String}
     */

    otherEmail: {
      type: 'string'
    },

    /**
     * occupation
     * @description A contact's occupation
     * @type {String}
     */

    occupation: {
      type: 'string'
    },

    /**
     * occupationType
     * @description A contact's occupation type
     * @type {String}
     */

    occupationType: {
      type: 'string'
    },

    /**
     * occupationSector
     * @description A contact's occupation sector
     * @type {String}
     */

    occupationSector: {
      type: 'string'
    },

    /**
     * employer
     * @description A contact's employer
     * @type {String}
     */

    employer: {
      model: 'employer'
    },

    /**
     * contactComments
     * @description A contact's comments
     * @type {String}
     */

    contactComments: {
      type: 'string'
    },


    /**
     * language
     * @description A contact's language
     * @type {String}
     */

    language: {
      model: 'language'
    },

    /**
     * requiresInterperter
     * @description a contacts requires interperter flag
     * @type {String}
     */

    requiresInterpreter: {
      type: 'boolean'
    },

    /**
     * TODO: set up referralContacts table
     * referralContacts
     * @description A referral's contacts
     * @type {String}
     */

    referralContacts: {
      collection: 'referralContact',
      via: 'contact'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
};

