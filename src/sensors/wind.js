'use strict';

var mraa = require('mraa');
var nconf = require('nconf');

var utilities = require('../utilities');


var windSensor;

var loggedError = false;

module.exports.init = function (server) {
    function init(callback) {

        server.log(['info'], 'Setting windsensor to bus ' + nconf.get('windSensor:bus') + ' and address ' + nconf.get('windSensor:address'));

        windSensor = new mraa.I2c(nconf.get('windSensor:bus'));
        windSensor.address(nconf.get('windSensor:address'));

        callback(null);
    }

    var windMap = utilities.createMap(
        nconf.get('wind:minimumPulse'),
        nconf.get('wind:maximumPulse'),
        0, 360
    );


    module.exports.read = function (callback) {


        var result = {
            raw: null,
            direction: null
        };

        try {
            var buffer = windSensor.read(2);
            result.raw = buffer.readInt16LE(0);
            result.direction = windMap(result.raw - nconf.get('wind:headUp'));

            if (result.direction < 0) {
                result.direction += 360;
            }

            result.direction = Math.round(result.direction);

        } catch (e) {
            if (!loggedError) {
                loggedError = true;
                server.log(['error'], 'Failed to read wind sensor: ' + e);

                setTimeout(function () {
                    loggedError = false;
                }, 1000 * 60 * 5);

            }
        }

        callback(null, result);
    };

    return init;
};


