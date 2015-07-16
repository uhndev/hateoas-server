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
    // system, user generated form
    name: {
      type: 'string',
      required: true
    },
    // unique id or name attribute of form
    metaData: {
      type: 'json',
    },
    // title of the form to display
    questions: {
      type: 'json',
    },
    // list of questions in this form
    isDirty: {
      type: 'array'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
