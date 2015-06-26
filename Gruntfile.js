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
            // Deploying and startup takes a long time, and why bother when it's
            // just the web client that has changed?
            client: {
                options: {
                    livereload: true,
                    livereloadOnError: false,
                    spawn: false // Faster, but more prone to watch failure
                },
                files: ['src/webclient/**/*'],
                tasks: ['shell:deployClient']
            },
            server: {
                options: {
                    spawn: false
                },
                files: ['<%= jshint.files %>', 'config.json', 'src/**/*', '!src/webclient/**/*'],
                tasks: ['shell:deployServer']
            }
        },
        shell: {
            deployClient: {
                command: "rsync -au --verbose --delete src/webclient/ pilothouse@ubilinux:pilothouse/src/webclient"
            },

            deployServer: {
                // Make an exact copy of the current directory.
                command: "rsync -au --verbose --delete --exclude 'node_modules' --exclude '.idea' --exclude '.git' ./ pilothouse@ubilinux:pilothouse " +
                    //'&&  ssh pilothouse@ubilinux "sudo /etc/init.d/pilothoused restart"'
                '&&  ssh pilothouse@ubilinux "sudo ./pilothouse/watchrun.sh"'

            },
            install: {
                command: ''
            }
        },

        // For the Web client
        wiredep: {
            client: {
                src: 'src/webclient/**/*.html'
            }
        },
        connect: {
            client: {
                options: {
                    port: 8080,
                    base: 'src/webclient',
                    livereload: true
                }
            }
        },

        wait: {
            deploy: {
                options: {
                    delay: 1000 * 15,
                    before: function (options) {
                        console.log('pausing %dms', options.delay);
                    },
                    after: function () {
                        console.log('pause end');
                    }
                }
            }
        }
    });

    grunt.registerTask('run', ['connect:client', 'watch']);

};
