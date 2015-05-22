module.exports = function (grunt) {
	// sails.config.grunt._hookTime = 2000000;
  grunt.registerTask('compileAssetsProd', [
    'clean:dev',
    'less:dev',
    'hub:prod',
    'copy:prod'
  ]);
};
