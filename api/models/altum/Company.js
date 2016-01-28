/**
 * Company
 *
 * @class Company
 * @description Model representation of a company
 */

(function () {
  var _super = require('../BaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description A company's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: faker.company.companyName
      },

      /**
       * phone
       * @description A company's phone
       * @type {String}
       */
      phone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * addresses
       * @description A company's addresses
       * @type {Model}
       */
      addresses: {
        collection: 'address',
        via: 'company'
      },

      /**
       * fax
       * @description A company's fax number
       * @type {String}
       */
      fax: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * email
       * @description A company's email
       * @type {String}
       */
      email: {
        type: 'string',
        generator: faker.internet.email
      },

      /**
       * employees
       * @description Collection of employees employed at this company
       * @type {Collection}
       */
      employees: {
        collection: 'employee',
        via: 'company'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

