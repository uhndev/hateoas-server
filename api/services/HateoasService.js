module.exports = {
  create: function(req, res, data) {
    var url = require('url');
    var address = url.parse(Utils.Path.getFullUrl(req));

    /**
     * Adds a "self" link to the item by parsing the url and
     * the item id. If the item is an array, this function
     * applies itself to each item.
     */
    function addSelfReference(item) {
      if (_.isArray(item)) {
        return _.map(item, function(element) {
          return addSelfReference(element);
        });
      }

      if (_.has(item, 'id') && _.isObject(item)) {
        item.rel = 'self';
        item.href = address.protocol + '//' + address.host 
                      + address.pathname + '/' + item.id;
      }
      return item;
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
              'rel': field,
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

    /**
     * Private method creates a HATEOAS Response
     * Once the promise has been resolved, the HATEOAS response is
     * constructed from the links object.
     */
    function makeResponse(links) {
      var HATEOAS_VERSION = '0.1';
      var modelName = Utils.Path.toModelName(address.pathname);

      var response = {
        version: HATEOAS_VERSION,
        rel: 'self',
        href: address.href,
        items: addSelfReference(data)
      };

      if (links) {
        response = _.merge(response, 
                     Utils.Model.removeSystemFields(links));
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
