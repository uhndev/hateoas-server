module.exports = function() {

var self = {
  /** Start of "String" Utils **/
  "String" : {
    /**
     * capitalizes a string
     */
    capitalize: function capitalize (s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },

    /**
     * converts camelCase to text by spacing all words and
     * capitalizing the first letter.
     */
    camelCaseToText: function camelCaseToText (camelString) {
      return self.String.capitalize(
               camelString.replace(/([A-Z])/g, ' $1')
             );
    }

  },
  /** End of "String" Utils **/

  /** Start of "Path" Utils **/
  "Path" : {
    /**
     * finds the model name from an api path.
     */
    toModelName: function pathToModelName (path) {
      var prefix = sails.config.blueprints.prefix;
      var regEx = new RegExp(prefix.replace(/\//, "\\\/") 
                    + "\\\/(\\w+)?");
      var match = path.match(regEx);
      if (match && _.isArray(match)) {
        return match[1].toLowerCase();
      } else {
        return '';
      }
    },

    getFullUrl: function getFullUrl(req) {
      return req.protocol + '://' + req.get('host') + req.originalUrl;
    },

    getWhere: function getWhere(query) {
      var clone = _.cloneDeep(query);
      delete clone.limit;
      delete clone.sort;
      delete clone.skip;

      return clone;
    }

  },
  /** End of "Path" Utils **/

  /** Start of "Model" Utils **/
  "Model" : {
    /**
     * List of system fields that SailsJS will add to all objects
     */
    SYSTEM_FIELDS: ['id', 'createdAt', 'updatedAt'],
    removeSystemFields: function removeSystemFields(data) {
      if (_.isArray(data)) {
        return data.map(function(item) {
          return self.Model.removeSystemFields(item);
        });
      } 

      return _.omit(data, self.Model.SYSTEM_FIELDS);
    }
  }
  /** End of "Model" Utils **/
}

return self;
}();
