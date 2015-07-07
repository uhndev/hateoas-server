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
        '!controllers/WorkflowStateController.js'
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

  grunt.loadNpmTasks('grunt-jsdoc');
};
