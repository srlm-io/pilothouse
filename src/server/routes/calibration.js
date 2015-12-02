'use strict';

var calibration = require('../../settings/calibration');
var _ = require('lodash');
var Joi = require('joi');

module.exports.init = function (server) {
    server.route({
        method: 'PUT',
        path: '/calibration/',
        handler: function (request, reply) {
            _.each(request.payload, function (value, path) {
                calibration.set(path, value);
            });

            reply({});
        },
        config: {
            validate: {
                payload: {
                    'servo.rudder.minimumPulse': Joi.number().integer().min(1000).max(2000).optional(),
                    'servo.rudder.maximumPulse': Joi.number().integer().min(1000).max(2000).optional(),
                    'servo.sail.minimumPulse': Joi.number().integer().min(1000).max(2000).optional(),
                    'servo.sail.maximumPulse': Joi.number().integer().min(1000).max(2000).optional()
                }
            },
            tags: ['api'],
            description: 'Set calibration values',
            notes: 'c'
        }
    });
    server.route({
        method: 'GET',
        path: '/calibration/',
        handler: function (request, reply) {
            reply(calibration.get());
        },
        config: {
            tags: ['api'],
            description: 'Get the current calibration',
            notes: 'Get the current calibration'
        }
    });
}