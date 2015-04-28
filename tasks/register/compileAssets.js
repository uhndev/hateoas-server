module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'less:dev',
    	'hub:dev',
		'copy:dev'
	]);
};
