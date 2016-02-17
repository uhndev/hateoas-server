module.exports = function (grunt) {
  grunt.registerTask('generate-docs', ['clean:docs', 'jsdoc:all']);
};
