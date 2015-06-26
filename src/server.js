'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var path = require('path');
var nconf = require('nconf');

module.exports.init = function (callback) {


    var server = new Hapi.Server({
        connections: {
            routes: {
                files: {
                    relativeTo: path.join(__dirname, 'webclient')
                }
            }
        }
    });
    server.connection({port: nconf.get('server:port')});

    server.register([{
        register: require('hapi-swagger'),
        options: {
            payloadType: 'form'
        }
    },
        {
            register: require('good'),
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    events: {
                        log: '*',
                        response: '*'
                    }
                }]
            }
        }

    ], function (err) {
        if (err) {
            server.log(['error'], 'Hapi server plugin error: ' + err);
        }

        server.log(['debug'], 'Server framework created.');

        server.route({
            method: 'GET',
            path: '/hello',
            handler: {
                file: 'index.html'
            }
        });

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: './',
                    listing: true
                }
            }
        });


        server.route({
            method: 'GET',
            path: '/state',
            handler: function (request, reply) {
                console.log('GET /state');
                reply({});
            },
            config: {
                tags: ['api'],
                description: 'Get the current state',
                notes: 'Get the current state vector of the sailboat'
            }
        });


        server.route({
            method: 'POST',
            path: '/output/{type}',
            handler: function (request, reply) {
                reply({});
            },
            config: {
                validate: {
                    params: {
                        type: Joi.string()
                    },
                    payload: {
                        pulsewidth: Joi.number().integer().min(1000).max(2000)
                    }
                },
                tags: ['api'],
                description: 'Set output',
                notes: 'Set an output of the sailboat'
            }

        });

        server.log(['debug'], 'Server routes defined');

        server.start(function () {
            server.log(['info'], 'Server running at:' + server.info.uri);

            callback(null, server);
        });
    });
};