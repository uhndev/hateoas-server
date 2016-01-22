/**
 * Status.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'createdAt ASC',

    attributes: {

      /**
       * name
       * @description A status's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Open' },
        { name: 'Discharged' },
        { name: 'Follow-up' }
      ];
    },

    generateAndCreate: function (state) {
      var statuses = this.generate();
      return Promise.all(
        _.map(statuses, function (status) {
          return Status.findOrCreate({ name: status.name }, status);
        })
      ).then(function (statuses) {
        sails.log.info(statuses.length + " status(s) generated");
      });
    }

  });
})();

