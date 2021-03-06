/**
 * SiteStaff
 *
 * @class SiteStaff
 * @description a model representation of a physician or staff at a site
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * site
       * @description The site where this physician is registered in
       * @type {Model}
       */
      site: {
        model: 'site',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'site', Site);
        }
      },

      /**
       * physician
       * @description The physician registered at this site
       * @type {Model}
       */
      physician: {
        model: 'physician',
        generator: function (state) {
          return BaseModel.defaultGenerator(state, 'physician', Physician);
        }
      },

      /**
       * staff
       * @description The staff registered at this site
       * @type {Model}
       */
      staff: {
        model: 'staff',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'staff', Staff);
        }
      },

      /**
       * physicianSchedules
       * @description Collection of schedules for this physician at this site
       * @type {Collection}
       * @TODO: When scheduling becomes an issue, the relationship to handle it should probably go here.
       */
      //physicianSchedules: {
      //  collection: 'schedule',
      //  via: 'physician'
      //},

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();
