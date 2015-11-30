'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var path = require('path');
var config = require('../settings/config');
var Inert = require('inert');
var Vision = require('vision');

module.exports.init = function (callback) {
    var server = new Hapi.Server({
        connections: {
            routes: {
                //cors: {
                //    origin: nconf.get('htmlOrigin'),
                //    credentials: true
                //},
                //security: {
                //    hsts: 1000 * 60 * 60 * 24 * 365
                //}
                files: {
                    relativeTo: path.join(__dirname, 'client')
                }
            }
        }
    });
    server.connection({
        host: 'pilothouse.local',
        port: config.get('server.port')
    });

    server.register([
        Inert,
        Vision,
        {
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

        var overrides = require('../settings/override');
        var _ = require('lodash');
        server.route({
            method: 'POST',
            path: '/override/',
            handler: function (request, reply) {
                console.dir(request.payload);

                _.each(request.payload, function(value, path){
                    overrides.set(path, value);
                });

                reply({});
            },
            config: {
                validate: {
                  payload: {
                      'output.rudder.raw': Joi.number().integer().min(1000).max(2000).optional(),
                      'output.sail.raw': Joi.number().integer().min(1000).max(2000).optional()
                  }
                },
                tags: ['api'],
                description: 'Override a state variable',
                notes: 'Keys are in the form path.to.object, and values are whatever.'
            }
        });
        server.route({
            method: 'GET',
            path: '/override/',
            handler: function (request, reply) {
                reply(overrides.get());
            },
            config: {
                tags: ['api'],
                description: 'Get the current overrides',
                notes: 'Get the current overrides'
            }
        });
        server.route({
            method: 'DELETE',
            path: '/override/',
            handler: function (request, reply) {
                overrides.reset();
                reply(overrides.get());
            },
            config: {
                tags: ['api'],
                description: 'Clear the current overrides',
                notes: 'Clear the current overrides'
            }
        });

        server.log(['debug'], 'Server routes defined');

        server.start(function (err) {
            if (err) {
                console.log('error starting server: ' + err);
            }else {
                server.log(['info'], 'Server running at:' + server.info.uri);
            }

            callback(null, server);
        });
    });
};