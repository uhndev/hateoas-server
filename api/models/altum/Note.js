/**
 * Note
 *
 * @class Note
 * @description Model representation of a Note
 */

(function () {
  var _super = require('./AltumBaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: null,

    attributes: {

      /**
       * name
       * @description note text
       * @type {String}
       */
      text: {
        type: 'string'
      },

      /**
       * name
       * @description A referral which the note belong to
       * @type {Model}
       */
      referral: {
        model: 'referral'
      },

      /**
       * name
       * @description A client which the note belong to
       * @type {Model}
       */
      client: {
        model: 'client'
      },

      /**
       * name
       * @description A note type
       * @type {Model}
       */
      noteType: {
        model: 'NoteType'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given note object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.createdBy) {
        User.findOne(values.createdBy).exec(function (err, user) {
          if (err) {
            cb(err);
          } else {
            values.displayName = user.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    }

  });
})();
