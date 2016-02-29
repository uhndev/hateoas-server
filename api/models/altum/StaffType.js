/**
 * StaffType
 *
 * @description A model representation of a staffType
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description a staffType's name
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true
      },

      /**
       * altumServices
       * @description Collection of AltumServices that require one or many of this type of staff
       * @type {Collection}
       */
      altumServices: {
        collection: 'altumservice',
        via: 'staffTypes'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Clinician' },
        { name: 'Kinesiologist' }
      ];
    },

    generateAndCreate: function (state) {
      var staffTypes = this.generate();
      return Promise.all(
        _.map(staffTypes, function (staffType) {
          return StaffType.findOrCreate({ name: staffType.name }, staffType);
        })
      ).then(function (staffTypes) {
        sails.log.info(staffTypes.length + " staffType(s) generated");
      });
    }
  });
})();
