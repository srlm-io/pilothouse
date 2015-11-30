'use strict';

var config = require('./config');
var generic = require('./generic');

var defaultCalibration = {
    wind: {
        headUp: 512,
        minimumPulse: 0,
        maximumPulse: 1024
    },
    orientation: {
        staticOffset: {
            roll: 0,
            pitch: 0,
            yaw: 0
        }
    },
    magnetometer: {
        hardiron: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    servo: {
        rudder: {
            minimumPulse: 1250,
            maximumPulse: 1750,
            minimumAngle: -45,
            maximumAngle: 45
        },
        sail: {
            minimumPulse: 1000,
            maximumPulse: 1500,
            minimumAngle: 90,
            maximumAngle: 0
        }
    },
    gyro: {
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    }
};

var calibration = generic.load(defaultCalibration, config.get('calibrationFile'));
module.exports.get = generic.get(calibration);
module.exports.set = generic.set(calibration, config.get('calibrationFile'));
