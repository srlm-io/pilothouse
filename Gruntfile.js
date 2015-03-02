'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'index.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                node: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'shell:deploy']
        },
        shell: {
            deploy: {
                // Make an exact copy of the current directory.
                command: 'rsync -au --delete ./ pilothouse@ubilinux:pilothouse'
            },
            install: {
                command: ''
            }
        }
    });

    grunt.registerTask('default', ['jshint']);

};