'use strict';
var generic = require('./generic');

const config = {
    sensorReadPeriod: 100,
    server: {
        port: 80
    },
    heartbeat: {
        pin: 14
    },
    windSensor: {
        bus: 1,
        address: 2
    },
    servo: {
        bus: 1,
        address: 64,
        freq: 50,
        i2cBusyRetryDelay: 50,
        i2cBusyRetryAttempts: 5,
        channels: {
            rudder: 0,
            sail: 1
        }
    },
    gps:{
        port: '/dev/ttyMFD1',
        baud: 9600
    },
    missionFile: '/settings/mission.json',
    calibrationFile: '/settings/calibration.json'
};

module.exports.get = generic.get(config);
