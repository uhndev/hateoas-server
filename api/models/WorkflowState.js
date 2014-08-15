/**
* WorkflowState.js
*
* @description :: The State model is used to represent a state in the
*                 application workflow. Each State contains links to
*                 other states. These links are divided into three
*                 types: ['queries', 'links', 'template']
*
*                 Queries represents a list of links to query the 
*                 object. These queries should be queries to objects
*                 related to the current application state. Default
*                 blueprint queries should not be re-created.
*
*                 Links represents a list of links to related objects.
*                 These objects should be associated to the current
*                 object viewed in the current application state.
*
*                 Template represents an object that shows how the 
*                 current object is created.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    path: {
      type: 'string',
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
  }
};
