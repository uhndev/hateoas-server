/**
 * Employee
 *
 * @class Employee
 * @description Model representing the employment of persons in companies
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: null,

    attributes: {

      /**
       * company
       * @description the company this employment is at
       * @type {Model}
       */
      company: {
        model: 'company',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'company', Company);
        }
      },

      /**
       * person
       * @description Reference to the person this Employee refers to
       * @type {Model}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
      },

      /**
       * referral
       * @description Reference to the referrals this Employee is a contact for
       * @type {collection}
       */
      referrals: {
        collection: 'referral',
        via: 'referralContacts'
      },

      /**
       * phoneNumber
       * @description the employed person's work number
       * @type {String}
       */
      workPhone: {
        type: 'string',
        generator: faker.phone.phoneNumber
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

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given employee object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.person) {
        Person.findOne(values.person).exec(function (err, person) {
          if (values.company) {
            Company.findOne(values.company).exec(function (err, company) {
              values.displayName = person.displayName + ', ' + values.occupation + ', ' + company.name;
              cb();
            });
          } else {
            values.displayName = person.displayName + ', ' + values.occupation;
            cb(err);
          }
        });
      } else {
        cb();
      }
    }
  });
})();


