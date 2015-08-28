module.exports = function() {

var Q = require('q');

var self = {
  /** Start of "String" Utils **/
  "String" : {
    /**
     * converts camelCase to text by spacing all words and
     * capitalizing the first letter.
     */
    camelCaseToText: function camelCaseToText (camelString) {
      return sails.util.str.capitalize(
               camelString.replace(/([A-Z])/g, ' $1')
             );
    }

  },
  /** End of "String" Utils **/

  /** Start of "Path" Utils **/
  "Path" : {
    getFullUrl: function getFullUrl(req) {
      return sails.getBaseUrl() + req.url;
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
     * List of routes that allow slugs in lieu of ids
     */
    SLUG_ROUTES: ['study'],
    /**
     * List of system fields that SailsJS will add to all objects
     */
    SYSTEM_FIELDS: ['id', 'createdAt', 'updatedAt', 'createdBy', 'expiredAt', 'owner'],
    removeSystemFields: function removeSystemFields(data) {
      if (_.isArray(data)) {
        return data.map(function(item) {
          return self.Model.removeSystemFields(item);
        });
      }

      return _.omit(data, self.Model.SYSTEM_FIELDS);
    }
  },
  /** End of "Model" Utils **/

  /** Start of "User" Utils **/
  "User": {

    getFullName: function getFullName(user) {
      return [user.prefix, user.firstname, user.lastname].join(' ');
    },

    extractUserFields: function extractUserFields(data) {
      return {
        username: data.username,
        email: data.email,
        prefix: data.prefix,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        dob: data.dob
      };
    }
  }
  /** End of "User" Utils **/
}

return self;
}();
