'use strict';
/*jshint bitwise: false*/

var i2c = require('i2c-bus');
var async = require('async');
var _ = require('lodash');
var Boom = require('boom');
var config = require('../../settings/config');
var calibration = require('../../settings/calibration');

var utilities = require('../utilities');

var pwmAddress = config.get('servo.address');
var pwmBus = config.get('servo.bus');
var PCA9685 = {
    MODE1: 0,
    PRESCALE: 0xFE
};

var freq = config.get('servo.freq');
var stepSize = 1000000 / (4096 * freq); // in uS


function setup(doneCallback) {
    var bus = i2c.open(pwmBus, function (err) {
        if (err) {
            doneCallback(err);
        }

        function delay(ms) {
            return function (callback) {
                setTimeout(callback, ms);
            };
        }

        async.series([
            bus.writeByte.bind(bus, pwmAddress, 0x00, 0x10),// Set to sleep mode for update to prescale
            delay(20),
            bus.writeByte.bind(bus, pwmAddress, 0x01, 0x04), // SET MODE2
            delay(20),
            // Set prescale
            // The *0.89 is determined empirically. See https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/issues/11
            bus.writeByte.bind(bus, pwmAddress, PCA9685.PRESCALE, Math.round(25000000 / (4096 * freq * 0.89)) - 1),
            delay(20),
            bus.writeByte.bind(bus, pwmAddress, PCA9685.MODE1, 0x20), // internal clock, no sleep
            delay(20),
            function clearAll(callback) {
                var buffer = new Buffer(5);
                buffer[0] = 0xFA; // Write all registers
                buffer[1] = 0x00;
                buffer[2] = 0x00;
                buffer[3] = 0x00;
                buffer[4] = 0x10;

                bus.i2cWrite(pwmAddress, 5, buffer, callback);
            }
        ], function (err) {
            doneCallback(err, bus);
        });
    });
}


module.exports.init = function (server, doneCallback) {
    var bus;

    /**
     * @param {String} channel name
     * @param {Number} position 1000-2000
     * @param callback
     */
    function setPosition(channel, position, callback) {
        if (position > 2500 || position < 500) {
            callback(Boom.badData('Position "' + position + '" out of range'));
            return;
        }

        var t = Math.round(position / stepSize);

        var buffer = new Buffer(5);
        buffer[0] = 0x06 + (config.get('servo.channels')[channel] * 4);
        buffer[1] = 0x00;
        buffer[2] = 0x00;
        buffer[3] = (t & 0xFF);
        buffer[4] = (t >> 8) & 0x0F;
        bus.i2cWrite(pwmAddress, 5, buffer, function (err, bytesWritten) {
                if (err) {
                    callback(err);
                } else if (bytesWritten != 5) {
                    callback(Boom.badImplementation('Servo should have written 5 bytes, instead wrote ' + bytesWritten));
                } else {
                    callback(null, position);
                }
            }
        );
        return position;
    }

    var rudderMap = utilities.createMap(
        calibration.get('servo.rudder.minimumAngle'),
        calibration.get('servo.rudder.maximumAngle'),
        calibration.get('servo.rudder.minimumPulse'),
        calibration.get('servo.rudder.maximumPulse'),
        true // clipToBounds
    );

    var sailMap = utilities.createMap(
        calibration.get('servo.sail.minimumAngle'),
        calibration.get('servo.sail.maximumAngle'),
        calibration.get('servo.sail.minimumPulse'),
        calibration.get('servo.sail.maximumPulse'),
        true // clipToBounds
    );

    function task(globalState, callback, counter) {
        async.series([
            setPosition.bind(this, 'rudder',
                globalState.output.rudder.raw || rudderMap(globalState.output.rudder.angle)),
            setPosition.bind(this, 'sail',
                globalState.output.sail.raw || sailMap(globalState.output.sail.angle))
        ], function (err, results) {
            if (err) {
                if (!counter) {
                    counter = 1;
                } else {
                    counter += 1;
                }

                if (counter <= config.get('servo.i2cBusyRetryAttempts') &&
                    err.code === 'EAGAIN') {
                    server.log(['warning'], 'Servo write attempt #' + counter + ' failed after EAGIN i2c bus busy error, attempting retry.');
                    setTimeout(task.bind(this, globalState, callback, counter),
                        config.get('servo.i2cBusyRetryDelay'));
                } else {
                    // Timed out, pass back the error
                    callback(err);
                }


            } else {
                globalState.output.rudder.raw = results[0];
                globalState.output.sail.raw = results[1];
                callback(null, globalState);
            }
        });
    }

    setup(function (err, bus_) {
        bus = bus_;
        doneCallback(err, task);
    });
};