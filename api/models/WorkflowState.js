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

      /**
       * model
       * @description Unique name of this workflow state
       * @type {String}
       */
      model: {
        type: 'string',
        required: true,
        unique: true
      },

      /**
       * path
       * @description Array of paths that should are applicable to this workflow state
       *              that is to say these routes should share this template.
       * @type {Array}
       */
      path: {
        type: 'array',
        required: true
      },

      /**
       * queries
       * @description Array of applicable/available queries from this workflowstate
       * @type {Array}
       */
      queries: {
        type: 'array'
      },

      /**
       * links
       * @description Array of applicable/available links from this workflowstate
       * @type {Array}
       */
      links: {
        type: 'array'
      },

      /**
       * template
       * @description Object containing optional (systemform|href|data) attributes.
       *              systemform denotes the name of the form that should be used to manage this model
       *              href denotes the URL to the systemform
       *              data denotes the available columns that are displayed on the hateoas table
       * @type {Object}
       */
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
