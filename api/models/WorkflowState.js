/**
* WorkflowState
*
* @class WorkflowState
* @description The State model is used to represent a state in the
*              application workflow. Each State contains links to
*              other states. These links are divided into three
*              types: ['queries', 'links', 'template']
*              Queries represents a list of links to query the
*              object. These queries should be queries to objects
*              related to the current application state. Default
*              blueprint queries should not be re-created.
*              Links represents a list of links to related objects.
*              These objects should be associated to the current
*              object viewed in the current application state.
*              Template represents an object that shows how the
*              current object is created.
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {
  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var Promise = require('bluebird');
  var workflowFixtures = require('../../test/fixtures/workflowstate.json');

  _.merge(exports, _super);
  _.merge(exports, {

    schema: true,
    attributes: {
      model: {
        type: 'string',
        required: true,
        unique: true
      },
      path: {
        type: 'array',
        required: true
      },
      queries: {
        type: 'array'
      },
      links: {
        type: 'array'
      },
      template: {
        type: 'json'
      }
    },

    generate: function (state) {
      return workflowFixtures;
    },

    generateAndCreate: function (state) {
      return SystemForm.generateAndCreate()
        .then(function (systemforms) {
          return Promise.all(
            _.map(workflowFixtures, function (workflowstate) {
              var systemform = _.find(systemforms, {form_name: workflowstate.template.systemform});
              if (systemform && _.has(systemform, 'id')) {
                workflowstate.template.href = [sails.config.appUrl + sails.config.blueprints.prefix, 'systemform', systemform.id].join('/');
              }
              return WorkflowState.findOrCreate({ model: workflowstate.model }, workflowstate);
            })
          );
        })
        .then(function (workflowstates) {
          sails.log.info(workflowstates.length + " workflowstate(s) found/generated");
        });
    }

  });
})();
