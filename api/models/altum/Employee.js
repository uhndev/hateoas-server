/**
 * Employee.js
 *
 * @description :: a table representing the employment of persons in companies
 * @docs        :: http://sailsjs.org/#!documentation/models
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
       * @description the person who's employed
       * @type {Model}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
      },

      /**
       * phoneNumber
       * @description the employed person's work number
       * @type {String}
       */
      phoneNumber: {
        type: 'string',
        generator: faker.phone.phoneNumber
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
          if (err) {
            cb(err);
          } else {
            values.displayName = person.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    }
  });
})();


