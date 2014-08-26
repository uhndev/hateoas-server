(function() {
var HATEOAS_VERSION = '0.1';

module.exports = {
  makeToHATEOAS: function() {
    return function() {
      var obj = this.toObject();
      obj.href = HateoasService.getSelfLink(this.id);

      if (_.isFunction(this.getResponseLinks)) {
        obj.links = this.getResponseLinks(this.id);
      }
      return obj;
    }
  },
  getSelfLink: function(modelName, id) {
    return [sails.getBaseUrl() + sails.config.blueprints.prefix,
      modelName, id].join('/');
  },
  create: function(req, res, data) {
    var url = require('url');
    var address = url.parse(Utils.Path.getFullUrl(req));

    function dataToJson(data) {
      if (_.isArray(data)) {
        return _.map(data, function(item) {
          return dataToJson(item);
        });
      }
      if (_.isObject(data)) {
        return data.toJSON();
      }
    }

    /**
     * Private method that creates the data object based on the schema
     * of the given model.
     */
    function makeTemplate(modelName) {
      var attributes = [];
      var models = sails.models;

      if (_.has(models, modelName)
           && _.has(models[modelName], 'definition')) {
        var schema = Utils.Model.removeSystemFields(
                       models[modelName].definition);
        
        attributes = _.map(schema, function(definition, field) {
            var template = {
              'name': field,
              'type': definition.model || definition.type,
              'prompt': Utils.String.camelCaseToText(field),
              'value': ''
            }

            if (definition.model) {
              template = _.merge(template, 
                makeTemplate(definition.model));
            }

            return template;
        });
      }
      return { data: attributes };
    }

    function addBaseUrl(link) {
      link.href = sails.getBaseUrl() + link.href;
    }

    /**
     * Private method creates a HATEOAS Response
     * Once the promise has been resolved, the HATEOAS response is
     * constructed from the links object.
     */
    function makeResponse(state) {
      var modelName = req.options.model || req.options.controller;

      var response = {
        version: HATEOAS_VERSION,
        href: address.href,
        items: dataToJson(data)
      };

      if (state) {
        _.each(state.links, addBaseUrl);
        _.each(state.queries, addBaseUrl);
        response = _.merge(response, 
                     Utils.Model.removeSystemFields(state));
      }

      if (!_.has(response.template, 'data')) {
        response.template = _.merge(response.template || {}, 
                            makeTemplate(modelName))
      }

      return response;
    }

    return WorkflowState.findOne({ path: address.pathname })
                        .then(makeResponse);
  }
};

}());
