module.exports = function(grunt) {

    grunt.config.set('hub', {
        dev: {
            src: ['assets/Gruntfile.js'],
            tasks: ['build']
        },
        prod: {
            src: ['assets/Gruntfile.js'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-hub');
};