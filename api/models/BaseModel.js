/**
 * BaseModel
 * @class BaseModel
 * @description the basemodel to be inherited by all other models
 */

module.exports = {

  // default sorting order
  defaultSortBy: 'displayName ASC',

  // default limit to restrict max number of records to return
  defaultLimit: 30,

  // default number of records to skip over
  defaultSkip: 0,

  // default attribute names to populate when querying model
  defaultPopulate: [],

  // default base query to apply to all finds
  defaultQuery: undefined,

  // array of field names to concatenate into display names, override in child models to pick unique fields for displayName
  displayFields: [ 'name' ],

  // BaseModel attributes
  attributes: {

    /**
     * displayName
     * @description stores persistent displayName of child models, filled in by beforeCreate and beforeUpdate
     *              using the potential fields listed in defaultsTo
     * @type {String}
     */
    displayName: {
      type: 'string'
    }
  },

  /**
   * beforeValidate
   * @description After validation/creation displayName is updated with values
   *              from fields listed in the defaultsTo attribute of displayName
   *              this can be overridden in child models inheriting from the
   *              basemodel to pick specific fields
   * @param  {Object}   values  given subject enrollment object for creation
   * @param  {Function} cb      callback function on completion
   */
  beforeValidate: function (values, cb) {
    // for each field listed in default, check values for those fields and add to display
    var display = _.values(_.pick(values, this.displayFields)).join(' ');

    // if display fields are found in values set the displayName, otherwise set default
    values.displayName = display ? display : 'No Display Name';
    cb();
  }

};
