/**
 * Generates JS Documentation
 */
module.exports = function(grunt) {

  grunt.config.set('jsdoc', {
    all: {
      src: [
        'api/**/*.js',
        '!api/policies/*.js',
        '!hooks/sails-auth.js', '!hooks/sails-permissions.js',
        '!controllers/LocaleController.js', '!controllers/ModelController.js',
        '!controllers/PermissionController.js', '!controllers/RoleController.js',
        '!controllers/WorkflowStateController.js',
        '!responses/badRequest.js', '!responses/forbidden.js', '!responses/notFound.js', '!responses/serverError.js',
        '!services/ModelService.js', '!services/passport.js', '!services/protocols/*.js'
      ],
      jsdoc: './node_modules/.bin/jsdoc',
      options: {
        destination: 'docs',
        configure: './jsdoc.conf.json',
        template: './node_modules/ink-docstrap/template',
        readme: './README.md'
      }
    }
  });

  grunt.config.set('doxx', {
    all: {
      src: 'api',
      target: 'docs',
      doxx: './node_modules/doxx/bin/doxx',
      options: {
        title: 'DADOS',
        ignore: [
          'policies',
          'hooks/sails-auth', 'hooks/sails-permissions',
          'controllers/LocaleController', 'controllers/ModelController',
          'controllers/PermissionController', 'controllers/RoleController',
          'controllers/WorkflowStateController',
          'responses/badRequest', 'responses/forbidden', 'responses/notFound', 'responses/serverError',
          'services/ModelService', 'services/passport', 'services/protocols'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-doxx');
};
