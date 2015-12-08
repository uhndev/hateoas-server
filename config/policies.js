/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */

(function() {

  /**************************************************************************
  * Default Sails Permissions Policies                                      *
  ***************************************************************************/
  var permissionsPolicies = [
    'basicAuth',
    'passport',
    'tokenAuth',
    'sessionAuth',
    'ModelPolicy',
    'AuditPolicy',
    'OwnerPolicy',
    'PermissionPolicy',
    'RolePolicy',
    'CriteriaPolicy'
  ];

  module.exports.policies = {

    /***************************************************************************
     * Sails Permissions Policies                                              *
     ***************************************************************************/
    '*': permissionsPolicies,

    AuthController: {
      '*': [ 'passport' ]
    },

    /***************************************************************************
     * Enrollment findOne Policies                                             *
     ***************************************************************************/
    StudyController: {
      'findOne': _.union(permissionsPolicies, ['EnrollmentPolicy'])
    },

    CollectionCentreController: {
      'findOne': _.union(permissionsPolicies, ['EnrollmentPolicy'])
    },

    UserEnrollmentController: {
      'findOne': _.union(permissionsPolicies, ['EnrollmentPolicy'])
    },

    SubjectEnrollmentController: {
      'findOne': _.union(permissionsPolicies, ['EnrollmentPolicy'])
    },

    /***************************************************************************
     * Preventing Disastrous Changes                                           *
     ***************************************************************************/
    GroupController: {
      'destroy': false
    },

    CriteriaController: {
      '*': false
    },

    ModelController: {
      'create': false,
      'update': false,
      'destroy': false
    },

    RoleController: {
      'create': false,
      'update': false,
      'destroy': false
    },

    PermissionController: {
      'create': false,
      'update': false,
      'destroy': false
    },

    /***************************************************************************
     * Translation Policies                                                    *
     ***************************************************************************/
    TranslationController: {
      'getLocale': true
    }

  };
})();
