'use strict';

var Hapi = require('hapi');
var path = require('path');
var config = require('../settings/config');
var Inert = require('inert');
var Vision = require('vision');

module.exports.init = function (callback) {
    var server = new Hapi.Server({
        connections: {
            routes: {
                cors: {
                    origin: ['http://pilothouse.local', 'http://localhost:8080'],
                    credentials: true
                },
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

        require('./routes/override').init(server);
        require('./routes/calibration').init(server);

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