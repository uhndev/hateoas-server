// Add the grunt-mocha-test tasks. 
  
module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    // Configure a mochaTest task 
    test: {
      options: {
        reporter: 'spec',
        captureFile: 'results.txt', // Optionally capture the reporter output to a file 
        quiet: false, // Optionally suppress output to standard out (defaults to false) 
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
      },
      src: ['tests/bootstrap.test.js', 'tests/unit/**/*.js']
    }
  });
 
  grunt.loadNpmTasks('grunt-mocha-test');
};