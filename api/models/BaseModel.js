/**
 * Created by calvinsu on 15-09-11.
 */
module.exports = {

  migrate: 'alter',

  attributes: {

    /**
     * displayName
     * @description stores persistent displayName of child models, filled in by beforeCreate and beforeUpdate
     *              using the potential fields listed in defaultsTo
     * @type {string}
     */
    displayName: {
      type: 'string',
      defaultsTo: 'name prefix firstname lastname' // pick space seperated fields from the model to populate displayName
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

  beforeCreate: function (values,cb) {
    //init blank displayName
    display = '';

    //for each field listed in default, check values for those fields and add to display
    _.forEach(values.displayName.split(' '), function (field) {
      display += values[field] ? values[field] + ' ' : '';
    });

    //if display fields are found in values set the displayName, otherwise set default
    values.displayName = display ? display : 'No Display Name';
    cb();
  },

  /**
   * beforeUpdate
   * @description Before validation/creation displayName is updated with values
   *              from fields listed in the defaultsTo attribute of displayName
   *              this can be overridden in child models inheriting from the
   *              basemodel to pick specific fields
   * @param  {Object}   values  given subject enrollment object for creation
   * @param  {Function} cb      callback function on completion
   */

  beforeUpdate: function (values,cb) {
    //init blank displayName
    display = '';

    //for each field listed in default, check values for those fields and add to display
    _.forEach(values.displayName.split(' '), function (field) {
      display += values[field] ? values[field] + ' ' : '';
    });

    //if display fields are found in values set the displayName, otherwise set default
    values.displayName = display ? display : 'No Display Name';
    cb();
  }
}
