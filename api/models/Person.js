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
          return BaseModel.defaultGenerator(state, 'address', Address);
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
       * daytimePhone
       * @description A client's daytimePhone
       * @type {String}
       */
      daytimePhone: {
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
       * otherEmail
       * @description A person's other eMail
       * @type {String}
       */
      otherEmail: {
        type: 'string',
        generator: faker.internet.email
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
       * preferred emergency contact
       * @description Pointer to the current approval in our approval history
       * @type {Model}
       */
      primaryEmergencyContact: {
        model: 'emergencyContact'
      },

      /**
       * approvals
       * @description Collection of approvals linked to a specific service (history of approvals)
       * @type {Collection}
       */
      emergencyContacts: {
        collection: 'emergencyContact',
        via: 'person'
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
    },

    /**
     * afterCreate
     * @description After creating a Person model, in order to keep the one-to-one relationship between Person
     *              and Address in sync, we include some lifecycle logic to update the Address table.
     * @param person
     * @param cb
     */
    afterCreate: function (person, cb) {
      if (person.address) {
        var addressID = _.isObject(person.address) ? person.address.id : person.address;
        Address.update({id: addressID}, {person: person.id}).exec(function (err, updatedPerson) {
          cb(err);
        });
      } else {
        cb();
      }
    }

  });
})();

