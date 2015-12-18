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
   * Base Status Route                                                       *
   ***************************************************************************/
  'get /': function (req, res) {
    res.json({
      status: 'OK',
      lastUpdated: new Date()
    });
  },

  /***************************************************************************
  * Locale Routes                                                            *
  ***************************************************************************/
  'get /api/locale'                       : 'TranslationController.getLocale',

  /***************************************************************************
  * Authentication Routes                                                    *
  ***************************************************************************/
  'get /logout'                           : 'AuthController.logout',

  'post /auth/local'                      : 'AuthController.callback',
  'post /auth/local/:action'              : 'AuthController.callback',

  'get /auth/:provider'                   : 'AuthController.provider',
  'get /auth/:provider/callback'          : 'AuthController.callback',
  'get /auth/:provider/:action'           : 'AuthController.callback',

  /***************************************************************************
  * Study Routes                                                             *
  ***************************************************************************/
  'get /api/study/:id/subject'            : 'SubjectEnrollmentController.findByStudy',
  'get /api/study/:id/user'               : 'UserEnrollmentController.findByStudy',
  'get /api/study/:id/form'               : 'FormController.findByStudy',
  'get /api/study/:id/survey'             : 'SurveyController.findByStudy',
  'get /api/study/:id/collectioncentre'   : 'CollectionCentreController.findByStudy',

  'delete /api/study/:id/forms/:formID'   : 'StudyController.removeFormFromStudy',

  /***************************************************************************
  * User Routes                                                              *
  ****************************************************************************/
  'put /api/user/:id/roles'               : 'UserController.updateRoles',

  /***************************************************************************
  * Survey Session Lifecycle Routes                                          *
  ****************************************************************************/
  'put /api/survey/:id/addSessions'       : 'SurveyController.addSessions',
  'put /api/survey/:id/updateSessions'    : 'SurveyController.updateSessions',
  'put /api/survey/:id/removeSessions'    : 'SurveyController.removeSessions',

  /***************************************************************************
  * Study Routes                                                             *
  ***************************************************************************/
  'get /api/subjectschedule/:id/form/:formID'     : 'SubjectSchedule.findScheduledForm'
};
