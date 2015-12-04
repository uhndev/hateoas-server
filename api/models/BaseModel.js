/**
 * BaseModel
 * @class BaseModel
 * @description the basemodel to be inherited by all other models
 */

//array of field names to concatenate into display names, override in child models to pick unique fields for displayName
displayFields= ['name','prefix','firstname','lastname'];

module.exports = {
  attributes: {
    /**
     * displayName
     * @description stores persistent displayName of child models, filled in by beforeCreate and beforeUpdate
     *              using the potential fields listed in defaultsTo
     * @type {string}
     */
    displayName: {
      type: 'string'
    }
  },

  /**
   * beforeCreate
   * @description Before validation/creation displayName is updated with values
   *              from fields listed in the defaultsTo attribute of displayName
   *              this can be overridden in child models inheriting from the
   *              basemodel to pick specific fields
   * @param  {Object}   values  given subject enrollment object for creation
   * @param  {Function} cb      callback function on completion
   */

  beforeCreate: function (values, cb) {

    //for each field listed in default, check values for those fields and add to display
    display = _.values(_.pick(values, displayFields)).join(' ');

    //if display fields are found in values set the displayName, otherwise set default
    values.displayName = display ? display : 'No Display Name';
    cb();
  },

  /**
   * beforeUpdate
   * @description Before validation/update displayName is updated with values
   *              from fields listed in the defaultsTo attribute of displayName
   *              this can be overridden in child models inheriting from the
   *              basemodel to pick specific fields
   * @param  {Object}   values  given subject enrollment object for creation
   * @param  {Function} cb      callback function on completion
   */
  beforeUpdate: function (values, cb) {

    //for each field listed in default, check values for those fields and add to display
    display = _.values(_.pick(values, displayFields)).join(' ');

    //if display fields are found in values set the displayName, otherwise set default
    values.displayName = display ? display : 'No Display Name';
    cb();
  }
}
