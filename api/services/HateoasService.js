(function() {
  var HATEOAS_VERSION = '1.0';
  var _ = require('lodash');
  var redis = require('redis'),
      client = redis.createClient();

  module.exports = {

    /**
     * makeToHATEOAS
     * @description Adds hateoas metadata to a bare sails item
     * @param model
     * @returns {Function}
     */
    makeToHATEOAS: function(model) {
      return function() {
        var obj = this.toObject();
        obj.rel = model.exports.identity;
        obj.href = HateoasService.getSelfLink(model.exports.identity, this.id);

        if (_.isFunction(this.getResponseLinks)) {
          obj.links = this.getResponseLinks(this.id);
        }
        return obj;
      }
    },

    /**
     * getSelfLink
     * @description Returns the URL endpoint for a given model name
     * @param modelName
     * @param id
     * @returns {string}
     */
    getSelfLink: function(modelName, id) {
      // #here_be_dragons
      // Figure out how to get the model name within the model itself
      // in the future.
      var components = [sails.config.appUrl + sails.config.blueprints.prefix,
        modelName];

      if (id) {
        components.push(id);
      }

      return components.join('/');
    },

    /**
     * makeTemplate
     * @description Public method that creates the data object based on the schema of the given model
     * @param modelName
     * @param previousModels
     */
    makeTemplate: function (modelName, previousModels) {
      var self = this;
      var attributes = [];
      var models = sails.models;

      if (_.has(models, modelName) && _.has(models[modelName], '_attributes')) {
        var schema = Utils.Model.removeSystemFields(models[modelName].definition);

        attributes = _.reduce(schema, function (result, definition, field) {
          // if field wants to be omitted from template definition, skip
          if (_.contains(models[modelName].defaultTemplateOmit, field)) {
            return result;
          }

          // if not a model field or is a model field that we've already built
          if (!definition.model || (definition.model && !_.contains(previousModels,  definition.model))) {
            var template = {
              'name': field,
              'type': definition.model || definition.type,
              'prompt': Utils.String.camelCaseToText(field),
              'value': definition.enum ? definition.enum : '',
              'preventCreate': models[modelName]._attributes[field].preventCreate,
              'required': models[modelName]._attributes[field].required || false
            };

            // haven't recursed on this model yet, so safe to recurse
            if (definition.model) {
              previousModels.push(modelName);
              template = _.merge(template, self.makeTemplate(definition.model, _.tail(previousModels)));
            }

            return result.concat(template);
          } else {
            return result;
          }
        }, []);
      }
      return { data: attributes };
    },

    /**
     * create
     * @description Main function called from ok.js to parse/convert the default sails response into
     *              a hateoas compliant one - will add relevant stateful links and hateoas templates.
     * @param req
     * @param res
     * @param data
     * @param options
     * @returns {*}
     */
    create: function(req, res, data, options) {
      var self = this;
      var url = require('url');
      var address = url.parse(Utils.Path.getFullUrl(req));

      function dataToJson(data) {
        if (_.isArray(data)) {
          return _.map(data, function(item) {
            return dataToJson(item);
          });
        }
        if (_.isObject(data)) {
          var dataToReturn = (_.isFunction(data.toJSON)) ? data.toJSON() : data;
          return _.omit(dataToReturn, _.without(Utils.Model.SYSTEM_FIELDS, 'id'));
        }
      }

      function addBaseUrl(link) {
        link.href = sails.config.appUrl + link.href;
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
          referrer: sails.config.appUrl + address.pathname,
          items: dataToJson(data),
          template: {
            rel: modelName
          }
        };

        // if getQueryLinks is defined as a Model function, set in response
        if (_.isFunction(sails.models[modelName].getQueryLinks)) {
          response.queries = sails.models[modelName].getQueryLinks(req.user);
        }

        // when options.links is passed to res.ok, pass onward to HateoasService.create under req.links
        if (options && _.has(options, 'links')) {
          response.links = options.links;
          _.each(response.links, function (link) {
            if (link.rel === modelName) {
              link.isActive = true;
            }
          });
        }

        if (state) {
          _.each(state.links, addBaseUrl);
          _.each(state.queries, addBaseUrl);
          response = _.merge(response, Utils.Model.removeSystemFields(state));
        }

        if (!_.has(response.template, 'data')) {
          // if templateOverride was passed along with res.ok, use given template instead of req.options.model
          var startingModel = !_.has(options, 'templateOverride') ? modelName: options.templateOverride;
          response.template.rel = startingModel;
          client.hget("templates", startingModel, function (err, cachedTemplate) {
            if (cachedTemplate) {
              response.template = _.merge(response.template, JSON.parse(cachedTemplate));
            } else {
              var computedTemplate = self.makeTemplate(startingModel, []);
              client.hset("templates", startingModel, JSON.stringify(computedTemplate));
              client.expire("templates", 28800);
              response.template = _.merge(response.template, computedTemplate);
            }

            return response;
          });
        }

        return response;
      }

      // search workflows for states whose paths contains the current route
      return WorkflowState.find().then(function (workflowstates) {
          return _.find(workflowstates, function (workflowstate) {
            return _.contains(workflowstate.path, req.route.path);
          });
        })
        .then(makeResponse);
    }
  };

}());
