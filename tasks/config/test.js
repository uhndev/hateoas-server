// Add the grunt-mocha-test tasks.

module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    // Configure a mochaTest task
    test: {
      options: {
        reporter: 'spec',
        quiet: false, // Optionally suppress output to standard out (defaults to false)
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
      },
      src: ['test/bootstrap.test.js', 'test/unit/**/*.js']
    },

    bamboo_test: {
      options: {
        reporter: 'json',
        captureFile: 'mocha.json',
        quiet: false, // Optionally suppress output to standard out (defaults to false)
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
      },
      src: ['test/bootstrap.test.js', 'test/unit/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
