/**
* Form
*
* @class  Form
* @description Model representation of a form
* @docs        http://sailsjs.org/#!documentation/models
*/
(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {
  schema: true,
  attributes: {

    /**
     * name
     * @description Name of the form created by pluginEditor
     */
    name: {
      type: 'string',
      required: true
    },

    /**
     * metaData
     * @description Contains any amount of form-specific metadata the user would like to attach.
     *              Should be in the form of key-value pairs.
     * @type {Object}
     */
    metaData: {
      type: 'json'
    },

    /**
     * questions
     * @description Contains array of json-object questions
     * @type {Array}
     */
    questions: {
      type: 'array'
    },

    /**
     * study
     * @description Associated study for which this form is attached to.
     *              A study can have multiple forms attached to it
     * @type {Integer} linked study reference
     */
    study: {
      model: 'study',
      required: true
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },

  findByStudyName: function(studyName, currUser, options, cb) {
    var query = _.cloneDeep(options);
    query.where = query.where || {};
    delete query.where.name;

    return Study.findOneByName(studyName).populate('forms')
      .then(function (study) {
        return [false, study.forms];
      })
      .catch(function (err) {
        return [err, null];
      });
  },

  /**
   * beforeValidate
   * @description Lifecycle callback meant to handle take a studyName and replace
   *              it with the study ID before passing to validation.
   *
   * @param  {Object}   values  proposed form values object
   * @param  {Function} cb      callback function on completion
   */
  beforeValidate: function(values, cb) {
    if (!values.study) {
      Study.findOneByName(values.studyName).exec(function (err, study) {
        values.study = study.id;
        cb(err);
      });
    }
    cb();
  }

};

}());
