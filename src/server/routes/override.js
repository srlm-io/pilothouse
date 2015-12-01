'use strict';

var overrides = require('../../settings/override');
var _ = require('lodash');
var Joi = require('joi');

module.exports.init = function (server) {
    server.route({
        method: 'PUT',
        path: '/override/',
        handler: function (request, reply) {
            console.dir(request.payload);

            _.each(request.payload, function (value, path) {
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
}