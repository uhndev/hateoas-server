/**
 * SystemForm
 *
 * @class SystemForm
 * @description Model representation of a system form
 * @docs        http://sailsjs.org/#!documentation/models
 */


(function () {
  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var Promise = require('bluebird');
  var HateoasService = require('../services/HateoasService.js');
  var formFixtures = require('../../test/fixtures/systemform.json');

  _.merge(exports, _super);
  _.merge(exports, {

    displayFields: [ 'form_name' ],

    attributes: {

      // system, user generated form
      form_type: {
        type: 'string',
        required: true
      },

      // unique id or name attribute of form
      form_name: {
        type: 'string',
        required: true,
        unique: true
      },

      // title of the form to display
      form_title: {
        type: 'string',
        required: true
      },

      // list of questions in this form
      form_questions: {
        type: 'array',
        required: true
      },

      // text to appear on submit button
      form_submitText: {
        type: 'text',
        defaultsTo: 'Submit'
      },

      // text to appear on cancel button
      form_cancelText: {
        type: 'text',
        defaultsTo: 'Cancel'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return formFixtures;
    },

    generateAndCreate: function (state) {
      return Promise.all(
        _.map(formFixtures, function (form) {
          return SystemForm.findOrCreate({ form_name: form.form_name }, form);
        })
      ).then(function (forms) {
        sails.log.info(forms.length + " systemform(s) found/generated");
        return forms;
      });
    }
  });

}());
