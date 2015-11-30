'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                node: true
            }
        },
        watch: {
            server: {
                options: {
                    spawn: false
                },
                files: ['<%= jshint.files %>', 'config.json', 'src/**/*'],
                tasks: ['shell:deployServer']
            }
        },
        shell: {
            deployServer: {
                // Make an exact copy of the current directory.
                command: "rsync -au --verbose --delete --exclude 'node_modules' --exclude '.idea' --exclude '.git' ./ root@pilothouse.local:pilothouse " +
                '&&  ssh root@pilothouse.local "systemctl restart pilothouse.service"'

            }
        }
    });

    grunt.registerTask('run', ['watch']);

};
