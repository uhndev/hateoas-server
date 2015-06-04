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
     * List of routes that allow slugs in lieu of ids
     */
    SLUG_ROUTES: ['study'],
    /**
     * List of system fields that SailsJS will add to all objects
     */
    SYSTEM_FIELDS: ['id', 'createdAt', 'updatedAt', 'createdBy', 'owner'],
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
    extractPersonFields: function extractPersonFields(data) {
      return {
        prefix: data.prefix,
        firstname: data.firstname,
        lastname: data.lastname
      };
    },
    
    populateAndFormat: function populateAndFormat(users) {
      return Q.all(
        _.map(users, function (user) {
          return User.findOne(user.id).populate('person').populate('roles')
            .then(function (popUser) {
              return _.merge(user, popUser);
            })
        })
      ).then(function(users) {
        _.map(users, function (user) {
          if (user.person) {
            _.merge(user, self.User.extractPersonFields(user.person));
            delete user.person;
          }
          if (user.roles) {
            user.role = _.first(user.roles).id;
            delete user.roles;
          }
        });
        return users;  
      })
      .catch(function (err) {
        return err;
      });
    }
  }
  /** End of "User" Utils **/
}

return self;
}();
