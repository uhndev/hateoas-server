/**
 * ServiceType
 *
 * @class ServiceType
 * @description Model representation of a ServiceType
 */

(function () {
  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'id ASC',

    attributes: {

      /**
       * name
       * @description A serviceType's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * category
       * @description A serviceType's category
       * @type {String}
       */
      category: {
        type: 'string',
        enum: [
          'WSIB Specialty',
          'WSIB Non-Specialty'
        ]
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'CA', category: 'WSIB Specialty' },
        { name: 'FPP CA', category: 'WSIB Specialty' },
        { name: 'FU', category: 'WSIB Specialty' },
        { name: 'Re-Ax', category: 'WSIB  Specialty' },
        { name: 'Spec Consult', category: 'WSIB Specialty' },
        { name: 'Pain Ax', category: 'WSIB Specialty' },
        { name: 'Med Spec FU', category: 'WSIB Specialty' },
        { name: 'Psychiatric Ax', category: 'WSIB Specialty' },
        { name: 'Psychological Ax', category: 'WSIB Specialty' },
        { name: 'Concurrent Mood', category: 'WSIB Specialty' },
        { name: 'Concurrent Substance', category: 'WSIB Specialty' },
        { name: 'Psychiatric Ax', category: 'WSIB Non-Specialty' },
        { name: 'Psychological Ax', category: 'WSIB Non-Specialty' }
      ];
    },

    generateAndCreate: function (state) {
      var serviceTypes = this.generate();
      return Promise.all(
        _.map(serviceTypes, function (serviceType) {
          return ServiceType.findOrCreate({ name: serviceType.name }, serviceType);
        })
      ).then(function (serviceTypes) {
        sails.log.info(serviceTypes.length + " serviceType(s) generated");
      });
    }

  });
})();

