module.exports = function (grunt) {
	grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('bamboo_test', ['mochaTest:bamboo_test']);
};
