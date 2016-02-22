// Until @tjwebb makes this process easier, I'm modifying the hook from node_modules/sails-permissions

(function() {

  module.exports = function (sails) {
    return {
      initialize: function (next) {
        sails.after('hook:permissions:loaded', function () {
          Model.count()
            .then(function (count) {
              if (count == sails.models.length) return next();
              return initializeRoles()
                .then(initializeGroups)
                .then(checkAdminUser)
                .then(initializeTranslations)
                .then(next);
            })
            .catch(function (error) {
              sails.log.error(error);
              next(error);
            });
        });
      }
    };
  };

  /**
   * Install the application. Sets up additional Roles and Permissions
   * @return {Array} roles
   */
  function initializeRoles () {
    sails.log('finding or creating roles');
    return Promise.all(
      _.map(['public', 'registered'], function (defaultRole) {
        return Role.findOne({ name: defaultRole }).then(function (role) {
          return Permission.destroy({ role: role.id });
        });
      })
    ).then(function () {
      return require('../../config/fixtures/role').create();
    });
  }

  /**
   * Grants admin role and creates default admin person if not set
   * @return {Object} user
   */
  function checkAdminUser() {
    sails.log('checking admin user');
    return User.findOne({ email: sails.config.permissions.adminEmail })
      .then(function (user) {
        if (_.isUndefined(user.group) || _.isNull(user.group)) {
          return User.update({ id: user.id }, {
            prefix: 'Mr.',
            firstname: 'Admin',
            lastname: 'Admin',
            gender: 'Male',
            dob: new Date(),
            group: 'admin'
          });
        } else {
          return user;
        }
      });
  }

  /**
   * Creates default groups with their own specific roles
   * @return {Array} groups
   */
  function initializeGroups () {
    return Role.find()
      .then(function (roles) {
        this.roles = roles;
        return User.findOne({ email: sails.config.permissions.adminEmail });
      })
      .then(function (admin) {
        sails.log('setting additional groups');
        return require('../../config/fixtures/groups').create(this.roles, admin);
      })
      .then(function (groups) {
        return null;
      })
      .catch(function (error) {
        sails.log.error(error);
      });
  }

  /**
   * Creates default translations from files in config/locales
   * @return {Array} translations
   */
  function initializeTranslations () {
    sails.log('checking for valid translations');
    return require('../../config/fixtures/translations').create()
      .then(function (translations) {
        return null;
      })
      .catch(function (error) {
        sails.log.error(error);
      });
  }
})();

