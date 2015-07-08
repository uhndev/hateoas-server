module.exports = function (grunt) {
  grunt.registerTask('generate-docs', ['clean:docs', 'doxx:all']);
};
