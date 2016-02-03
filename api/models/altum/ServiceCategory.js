/**
 * ServiceCategory
 *
 * @description A model representation of a serviceCategory
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
       * @description a serivceCategory's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Assessment' },
        { name: 'Diagnosis' },
        { name: 'Facilitation' },
        { name: 'Psychological' },
        { name: 'Surgical' },
        { name: 'Treatment' }
      ];
    },

    generateAndCreate: function (state) {
      var categories = this.generate();
      return Promise.all(
        _.map(categories, function (category) {
          return ServiceCategory.findOrCreate({ name: category.name }, category);
        })
      ).then(function (categories) {
        sails.log.info(categories.length + " serviceCategory(s) generated");
      });
    }
  });
})();
