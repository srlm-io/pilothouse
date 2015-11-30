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
    var bus = i2c.openSync(pwmBus);

    function delay(ms) {
        return function (callback) {
            setTimeout(callback, ms);
        };
    }

    async.waterfall([
        //delay(200),
        function setSleep(callback) { // SET MODE1
            bus.writeByteSync(pwmAddress, 0x00, 0x10);// Set to sleep mode for update to prescale
            callback(null);
        },
        delay(20),
        function setMode2(callback) { // SET MODE2
            bus.writeByteSync(pwmAddress, 0x01, 0x04);
            callback(null);
        },
        delay(20),
        function setPrescale(callback) {
            // The *0.89 is determined empirically. See https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/issues/11
            var prescale = Math.round(25000000 / (4096 * freq * 0.89)) - 1;
            //console.log('Prescale: 0x' + prescale.toString(16));
            bus.writeByteSync(pwmAddress, PCA9685.PRESCALE, prescale);
            //console.log('readPrescale: 0x' + pwm.readReg(PCA9685.PRESCALE).toString(16));
            callback(null);
        },
        delay(20),
        function setWakeup(callback) {
            bus.writeByteSync(pwmAddress, PCA9685.MODE1, 0x20); // internal clock, no sleep
            callback(null);
        },
        delay(20),
        function clearAll(callback) {
            var buffer = new Buffer(5);
            buffer[0] = 0xFA; // Write all registers
            buffer[1] = 0x00;
            buffer[2] = 0x00;
            buffer[3] = 0x00;
            buffer[4] = 0x10;

            bus.i2cWriteSync(pwmAddress, 5, buffer);
            callback(null);
        }
    ], function (err) {
        //doneCallback(err, pwm);
        doneCallback(err, bus);
    });
}


module.exports.init = function (server) {
    function init(doneCallback) {
        var bus;

        /**
         * @param {String} channel name
         * @param {Number} position 1000-2000
         * @param callback
         */
        function setPosition(channel, position) {
            if (position > 2500 || position < 500) {
                server.log(['error'], Boom.badData('Position "' + position + '" out of range'));
                return null;
            }

            //if (!_.has(state.servo, channel)) {
            //    server.log(['error'], Boom.badData('Channel "' + channel + '" not valid'));
            //    return;
            //}

            var t = Math.round(position / stepSize);

            var buffer = new Buffer(5);
            buffer[0] = 0x06 + (config.get('servo.channels')[channel] * 4);
            buffer[1] = 0x00;
            buffer[2] = 0x00;
            buffer[3] = (t & 0xFF);
            buffer[4] = (t >> 8) & 0x0F;
            bus.i2cWriteSync(pwmAddress, 5, buffer);
            return position;
        }

        var result = {};

        var rudderMap = utilities.createMap(
            calibration.get('servo.rudder.minimumAngle'),
            calibration.get('servo.rudder.maximumAngle'),
            calibration.get('servo.rudder.minimumPulse'),
            calibration.get('servo.rudder.maximumPulse'),
            true // clipToBounds
        );
        function setRudder(angle, rawOverride) {
            return setPosition('rudder', rawOverride || rudderMap(angle));
        }
        //result.setRudderRaw = function (value) {
        //    setPosition('rudder', value);
        //};

        var sailMap = utilities.createMap(
            calibration.get('servo.sail.minimumAngle'),
            calibration.get('servo.sail.maximumAngle'),
            calibration.get('servo.sail.minimumPulse'),
            calibration.get('servo.sail.maximumPulse'),
            true // clipToBounds
        );
        function setSail(angle, rawOverride) {
            return setPosition('sail', rawOverride || sailMap(angle));
        }
        //result.setSailRaw = function (value) {
        //    setPosition('sail', value);
        //};

        function task(globalState, callback){
            globalState.output.rudder.raw = setRudder(globalState.output.rudder.angle, globalState.output.rudder.raw);
            globalState.output.sail.raw = setSail(globalState.output.sail.angle, globalState.output.sail.raw);
            callback(null, globalState);
        }

        setup(function (err, bus_) {
            bus = bus_;
            doneCallback(err, task);
        });
    }
    return init;
};