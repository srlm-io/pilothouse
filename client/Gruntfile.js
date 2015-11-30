'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', '*.js', '**/*.js', '!bower_components/**/*']
        },
        watch: {
            server: {
                options: {
                    spawn: false,
                    livereload: true
                },
                files: ['<%= jshint.files %>', '**/*.html', '**/*.css', '!bower_components/**/*'],
                tasks: []
            }
        },
        // For the Web client
        wiredep: {
            client: {
                src: './**/*.html',
                options: {
                    overrides: {
                        bootstrap: {
                            main: ['dist/css/bootstrap.css',
                                'dist/js/bootstrap.js']
                        }
                    }
                }
            }
        },
        connect: {
            client: {
                options: {
                    port: 8080,
                    base: './',
                    livereload: true,
                    // Taken from http://stackoverflow.com/a/21514926/2557842
                    /* Support `$locationProvider.html5Mode(true);`
                     * Requires grunt 0.9.0 or higher
                     * Otherwise you will see this error:
                     *   Running "connect:livereload" (connect) task
                     *   Warning: Cannot call method 'push' of undefined Use --force to continue.
                     */
                    middleware: function (connect, options, middlewares) {
                        var modRewrite = require('connect-modrewrite');

                        // enable Angular's HTML5 mode
                        middlewares.unshift(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));

                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.registerTask('serve', ['connect:client', 'watch']);

};
