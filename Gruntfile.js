'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', '*.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                node: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'config.json'],
            tasks: ['jshint', 'shell:deploy']
        },
        shell: {
            deploy: {
                // Make an exact copy of the current directory.
                command: "rsync -au --verbose --delete --exclude 'node_modules' --exclude '.idea' --exclude '.git' ./ pilothouse@ubilinux:pilothouse " +
                    '&&  ssh pilothouse@ubilinux "sudo /etc/init.d/pilothoused restart"'
            },
            install: {
                command: ''
            }
        }
    });

    grunt.registerTask('default', ['jshint']);

};
