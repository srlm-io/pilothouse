'use strict';

var config = require('../../settings/config');
var calibration = require('../../settings/calibration');
var i2c = require('i2c-bus');
var utilities = require('../utilities');

const bytesToRead = 2;

module.exports.init = function (server, callback) {
    var errorReported = false;
    server.log(['info'], 'Setting windsensor to bus ' + config.get('windSensor.bus') + ' and address ' + config.get('windSensor.address'));
    var bus = i2c.openSync(config.get('windSensor.bus'));

    var buffer = new Buffer(bytesToRead);

    var windMap = utilities.createMap(
        calibration.get('wind.minimumPulse'),
        calibration.get('wind.maximumPulse'),
        0, 360
    );

    function task(globalState, callback) {
        var result = {
            raw: null,
            direction: null
        };

        bus.i2cRead(config.get('windSensor.address'), bytesToRead, buffer, function (err, bytesRead, buffer) {
            if (err) {
                if (err.errno === -121) {
                    if (!errorReported) {
                        errorReported = true;
                        server.log(['error'], 'Wind sensor not responding. Is it powered on?')
                    }
                } else {
                    server.log(['error'], 'Error while reading windsensor: ' + err);
                }
            } else if (bytesRead != bytesToRead) {
                server.log(['error'], 'Expected to read ' + bytesToRead + ' bytes from windsensor, instead read ' + bytesRead + ' bytes.');
            } else {
                errorReported = false;
                result.raw = buffer.readInt16LE(0);
                result.direction = windMap(result.raw - calibration.get('wind.headUp'));

                if (result.direction < 0) {
                    result.direction += 360;
                }
                result.direction = Math.round(result.direction);
            }
            globalState.wind = result;
            callback(null, globalState);
        });
    }

    callback(null, task);
};

