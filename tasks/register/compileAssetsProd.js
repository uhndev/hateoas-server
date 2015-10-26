module.exports = function (grunt) {
  grunt.registerTask('compileAssetsProd', [
    'clean:dev',
    'less:dev',
    //'hub:prod',
    'copy:prod'
  ]);
};
