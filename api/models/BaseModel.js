/**
 * BaseModel
 * @class BaseModel
 * @description the basemodel to be inherited by all other models
 */

module.exports = {

  // enforce schema by default
  schema: true,

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

  // default fields to omit from template
  defaultTemplateOmit: ['displayName'],

  // array of field names to concatenate into display names, override in child models to pick unique fields for displayName
  displayFields: ['name'],

  // BaseModel attributes
  attributes: {

    /**
     * deletedBy
     * @description record of who deleted record
     * @type {string}
     */
    deletedBy: {
      model: 'user'
    },

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
  },

  /**
   * defaultGenerator
   * @description Depending on a state's possible attributes, return and ID or recurse on
   *              given model's generator function with sub state.
   * @param state
   * @param attribute
   * @param model
   * @returns {Object}
   */
  defaultGenerator: function (state, attribute, model) {
    if (state && _.has(state, attribute)) {
      if (_.isNumber(state[attribute]) || _.isString(state[attribute])) {
        return state[attribute];
      } else {
        return model.generate(state[attribute]);
      }
    } else {
      return model.generate(state);
    }
  },

  /**
   * generate
   * @description Convenience method for returning a Model object to be created.  The function
   *              loops through Model attributes that have a generator function defined.
   *              Can be overridden from any child model that inherits BaseModel.
   * @param state {Object}
   * @returns {Object}
   */
  generate: function (state) {
    var generatedObject = {
      owner: 1,
      createdBy: 1
    };
    _.each(this._attributes, function (value, key) {
      if (_.isFunction(value.generator)) {
        generatedObject[key] = value.generator(state);
      }
    });
    return generatedObject;
  },

  /**
   * generateAndCreate
   * @description Calls the default sails model create method with randomly generated data retrieved
   *              from the generate above for any respective model.
   *              Can be overridden from any child model that inherits BaseModel.
   * @returns {Promise}
   */
  generateAndCreate: function (state) {
    return this.create(this.generate(state));
  }

};
