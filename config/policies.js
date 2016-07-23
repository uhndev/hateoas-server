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

module.exports.policies = {

  /***************************************************************************
   * Sails Permissions Policies                                              *
   ***************************************************************************/
  '*': [
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
  ],

  AuthController: {
    '*': [ 'passport' ]
  },

  /***************************************************************************
   * Preventing Disastrous Changes                                           *
   ***************************************************************************/

  GroupController: {
    'destroy': [
      'basicAuth',
      'passport',
      'tokenAuth',
      'sessionAuth',
      'ModelPolicy',
      'AuditPolicy',
      'OwnerPolicy',
      'PermissionPolicy',
      'RolePolicy',
      'CriteriaPolicy',
      'groupPolicy'
    ]
  },

  ModelController: {
    'create': false,
    'update': false,
    'destroy': false,
    'checkExists': [
      'basicAuth',
      'passport',
      'tokenAuth',
      'sessionAuth'
    ],
    'fetchTemplate': [
      'basicAuth',
      'passport',
      'tokenAuth',
      'sessionAuth'
    ]
  },

  EmailController: {
    sendEmail: [
      'basicAuth',
      'passport',
      'tokenAuth',
      'sessionAuth'
    ]
  },

  /***************************************************************************
   * Translation Policies                                                    *
   ***************************************************************************/
  TranslationController: {
    'getLocale': true
  },

  /***************************************************************************
   * Fhir Policies                                                        *
   ***************************************************************************/

  FhirController: {
    'init': [
      'basicAuth',
      'passport',
      'tokenAuth',
      'sessionAuth'
    ]
  }
};
