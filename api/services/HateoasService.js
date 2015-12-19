(function() {
  var HATEOAS_VERSION = '1.0';
  var _ = require('lodash');

  module.exports = {
    makeToHATEOAS: function(model) {
      return function() {
        var obj = this.toObject();
        obj.rel = model.exports.identity;
        obj.href = HateoasService.getSelfLink(model.exports.identity, this.id);

        if (_.contains(Utils.Model.SLUG_ROUTES, obj.rel) && this.name) {
          obj.slug = HateoasService.getSelfLink(model.exports.identity, this.name);
        }

        if (_.isFunction(this.getResponseLinks)) {
          obj.links = this.getResponseLinks(this.id);
        }
        return obj;
      }
    },
    getSelfLink: function(modelName, id) {
      // #here_be_dragons
      // Figure out how to get the model name within the model itself
      // in the future.
      var components = [sails.getBaseUrl() + sails.config.blueprints.prefix,
        modelName];

      if (id) {
        components.push(id);
      }

      return components.join('/');
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
          return _.omit(data.toJSON(), _.without(Utils.Model.SYSTEM_FIELDS, 'id'));
        }
      }

      /**
       * Private method that creates the data object based on the schema
       * of the given model.
       */
      function makeTemplate(modelName, previousModel) {
        var attributes = [];
        var models = sails.models;

        if (_.has(models, modelName)
             && _.has(models[modelName], '_attributes')) {
          var schema = Utils.Model.removeSystemFields(
                         models[modelName].definition);

          attributes = _.map(schema, function(definition, field) {
            var template = {
              'name': field,
              'type': definition.model || definition.type,
              'prompt': Utils.String.camelCaseToText(field),
              'value': '',
              'required': sails.models[modelName]._attributes.required || false
            };

            if (definition.enum) {
              template.value = definition.enum;
            }

            if (definition.model && (definition.model != previousModel)) {
              template = _.merge(template,
                makeTemplate(definition.model,modelName));
            }

            return template;
          });
        }
        return { data: attributes };
      }

      function addBaseUrl(link) {
        link.href = sails.getBaseUrl() + link.href;
      }

      function checkBaseModel(state) {
        var modelName = req.options.model || req.options.controller;
        if (!state) {
          // if WorkflowState not found, try again with the base model
          var response = url.parse(HateoasService.getSelfLink(modelName)).pathname;
          var href = decodeURIComponent(response);
          return WorkflowState.findOne({
            path: url.parse(href).pathname
          });
        }
        return state;
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
          href: HateoasService.getSelfLink(modelName),
          referrer: address.href,
          items: dataToJson(data),
          template: {
            rel: modelName
          }
        };

        if (state) {
          _.each(state.links, addBaseUrl);
          _.each(state.queries, addBaseUrl);
          response = _.merge(response,
                       Utils.Model.removeSystemFields(state));
        }

        if (!_.has(response.template, 'data')) {
          response.template = _.merge(response.template,
                              makeTemplate(modelName))
        }

        return response;
      }

      return WorkflowState.findOne({
        path: decodeURIComponent(address.pathname)
      })
      .then(checkBaseModel)
      .then(makeResponse);
    }
  };

}());
