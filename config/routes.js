/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  * Locale Routes                                                            *
  ***************************************************************************/  
  'get /api/locale'                : 'LocaleController.getLocale',

  /***************************************************************************
  * Authentication Routes                                                    *
  ***************************************************************************/
  'get /logout': 'AuthController.logout',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  /***************************************************************************
  * Study Routes                                                             *
  ***************************************************************************/
  'get /api/study/:name'           : 'StudyController.findOne',
  'get /api/study/:name/subject'   : 'SubjectController.findByStudyName',
  'get /api/study/:name/user'      : 'UserController.findByStudyName',
  // 'get /api/study/:name/form'      : 'FormController.findByStudyName',
  // 'get /api/study/:name/encounter' : 'EncounterController.findByStudyName'
  'get /api/study/:name/collectioncentre': 'CollectionCentreController.findByStudyName',
  
  /***************************************************************************
  * User Routes                                                              *
  ****************************************************************************/
  'get /api/user/:id'              : 'UserController.findOne',
  'get /api/role/:name/users'      : 'RoleController.findRoleUsers',
  'get /api/user/:id/access'       : 'CentreAccessController.findUserAccess',

  /***************************************************************************
  * Collection Centre Routes                                                 *
  ****************************************************************************/
  'get /api/collectioncentre/:id/subject'     : 'CollectionCentreController.findSubjects',
  'get /api/collectioncentre/:id/coordinator' : 'CollectionCentreController.findCoordinators'
};
