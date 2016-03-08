/**
 * Person.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {
  var _ = require('lodash');
  var _super = require('./altum/AltumBaseModel.js');
  var faker = require('faker');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    displayFields: [ 'prefix', 'firstName', 'lastName' ],

    attributes: {

      /**
       * firstName
       * @description A person's first name.
       * @type {String}
       */
      firstName: {
        type: 'string',
        generator: faker.name.firstName
      },

      /**
       * middleName
       * @description A person's middle name
       * @type {String}
       */
      middleName: {
        type: 'string',
        generator: faker.name.firstName
      },

      /**
       * lastName
       * @description A person's last name.
       * @type {String}
       */
      lastName: {
        type: 'string',
        generator: faker.name.lastName
      },

      /**
       * prefix
       * @description Enumeration of allowable prefixes for a client.
       * @type {Enum}
       */
      prefix: {
        type: 'string',
        enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
        generator: function() {
          return _.sample(Person.attributes.prefix.enum);
        }
      },

      /**
       * gender
       * @description Enumeration of allowable genders of a client.
       * @type {Enum}
       */
      gender: {
        type: 'string',
        enum: ['Male', 'Female'],
        generator: function() {
          return _.sample(Person.attributes.gender.enum);
        }
      },

      /**
       * dateOfBirth
       * @description A client's date of birth.
       * @type {Date}
       */
      dateOfBirth: {
        type: 'date',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * address
       * @description A person's address
       * @type {Collection}
       */
      address: {
        model: 'address',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'addresses', Address);
        }
      },

      /**
       * homePhone
       * @description A client's homePhone
       * @type {String}
       */
      homePhone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * workPhone
       * @description A client's workPhone
       * @type {String}
       */
      workPhone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * cellPhone
       * @description A client's cellPhone
       * @type {String}
       */
      cellPhone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * otherPhone
       * @description A client's otherPhone
       * @type {String}
       */
      otherPhone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * company
       * @description A person's company
       * @type {String}
       */
      company: {
        type: 'string',
        generator: faker.company.companyName
      },

      /**
       * title
       * @description A person's title
       * @type {String}
       */
      title: {
        type: 'string',
        generator: faker.name.title
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
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * homeEmail
       * @description A person's homeEmail
       * @type {String}
       */
      homeEmail: {
        type: 'string',
        generator: faker.internet.email
      },

      /**
       * workEmail
       * @description A person's work eMail
       * @type {String}
       */
      workEmail: {
        type: 'string',
        generator: faker.internet.email
      },

      /**
       * otherEmail
       * @description A person's other eMail
       * @type {String}
       */
      otherEmail: {
        type: 'string',
        generator: faker.internet.email
      },

      /**
       * occupation
       * @description A person's occupation
       * @type {String}
       */
      occupation: {
        type: 'string',
        generator: faker.name.jobTitle
      },

      /**
       * occupationType
       * @description A person's occupation type
       * @type {String}
       */
      occupationType: {
        type: 'string',
        generator: faker.name.jobType
      },

      /**
       * occupationSector
       * @description A person's occupation sector
       * @type {String}
       */
      occupationSector: {
        type: 'string',
        generator: faker.name.jobArea
      },

      /**
       * employments
       * @description A collection of a person's employments at various companies
       * @type {Collection}
       */
      employments: {
        collection: 'employee',
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
       * externalID
       * @description A person's external ID (usually MRN)
       * @type {String}
       */
      externalID: {
        type: 'string'
      },

      /**
       * requiresInterperter
       * @description a persons requires interperter flag
       * @type {String}
       */
      requiresInterpreter: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * users
       * @description a persons associated users
       * @type {Collection}
       */
      users: {
        collection: 'user',
        via: 'person'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();

