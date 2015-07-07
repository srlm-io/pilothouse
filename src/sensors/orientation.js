'use strict';
/*jshint bitwise: false*/

var mraa = require('mraa');
var Boom = require('boom');
var async = require('async');
var nconf = require('nconf');


var registers = {
    gyro: {
        WHO_AM_I_G: 0x0F,
        CTRL_REG1_G: 0x20,
        CTRL_REG2_G: 0x21,
        CTRL_REG3_G: 0x22,
        CTRL_REG4_G: 0x23,
        CTRL_REG5_G: 0x24,
        OUT_X_L_G: 0x28 | 0x80 // Set auto increment bit
    },
    acclmagn: {
        WHO_AM_I_XM: 0x0F,
        CTRL_REG1_XM: 0x20,
        CTRL_REG2_XM: 0x21,
        CTRL_REG5_XM: 0x24,
        CTRL_REG6_XM: 0x25,
        CTRL_REG7_XM: 0x26,
        OUT_X_L_A: 0x28 | 0x80, // Set auto increment bit
        OUT_X_L_M: 0x08 | 0x80
    }
};

var constant = {
    gyro: {
        bitWeight: 0.0175 // dps / LSb @ +-500dps
    },
    accl: {
        bitWeight: 0.000244 // g / LSb @ +- 8g
    },
    magn: {
        bitWeight: 0.00008 // gauss / LSb @ +- 2 gauss
    }
};

var settings = {
    acclmagn: {
        // Accl 100 Hz ODR
        CTRL_REG1_XM: 0x67,
        // Accl +- 8g
        CTRL_REG2_XM: 0x18,
        // Magn high resolution, 100Hz ODR
        CTRL_REG5_XM: 0x74,
        // Magn +- 2 gauss
        CTRL_REG6_XM: 0x20,
        // Accl Normal mode, Magn continuous conversion mode
        CTRL_REG7_XM: 0x00
    },

    gyro: {
        // 95 ODR, 25Hz BW Cutoff (bandwidth?)
        CTRL_REG1_G: 0x3F,
        // High Pass Filter cutoff at 0.45hz
        CTRL_REG2_G: 0x27,
        // 500 dps
        CTRL_REG4_G: 0x10,
        // high pass filter disabled
        //CTRL_REG5_G: 0x00 // 0x10 <- to enable high pass filter
        CTRL_REG5_G: 0x10 // 0x10 <- enable high pass filter
    }
};

var calibration = {
    gyro: {
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    }
};

var acclAddr = 0x1D;
var gyroAddr = 0x6B;
var updateRate = 100; // Hz
var intervalRate = Math.floor(1000 / updateRate);

var RAD_CONV = 57.2957; // 180/Pi, to convert radians to degrees


function calculateOriention(state) {

    // Freescale solution
    var roll = Math.atan2(state.acceleration.y, state.acceleration.z);
    var pitch = Math.atan(-state.acceleration.x / Math.sqrt(Math.pow(state.acceleration.y, 2) + Math.pow(state.acceleration.z, 2)));

    var magn_fy_fs = state.magneticField.z * Math.sin(roll) - state.magneticField.y * Math.cos(roll);
    var magn_fx_fs = state.magneticField.x * Math.cos(pitch) +
        state.magneticField.y * Math.sin(pitch) * Math.sin(roll) +
        state.magneticField.z * Math.sin(pitch) * Math.cos(roll);

    var yaw = Math.atan2(magn_fy_fs, magn_fx_fs);

    state.rawroll = roll * RAD_CONV;
    state.rawpitch = pitch * RAD_CONV;
    state.rawyaw = yaw * RAD_CONV;

    state.roll = state.rawroll - nconf.get('orientation:staticOffset:roll');
    state.pitch = state.rawpitch - nconf.get('orientation:staticOffset:pitch');
    state.yaw = state.rawyaw - nconf.get('orientation:staticOffset:yaw');
}

module.exports.init = function (server) {
    var sensorStatus = {};

    function init(callback) {
        var gyro = new mraa.I2c(1);
        gyro.address(gyroAddr);

        if (gyro.readReg(registers.gyro.WHO_AM_I_G) !== 0xD4) {
            server.log(['error'], new Boom.badImplementation('Gyro WHO_AM_I not found! Gyro attached?'));
            sensorStatus.gyro = false;
        } else {
            server.log(['info'], 'Found gyro');
            sensorStatus.gyro = true;
        }

        // -------------------------------------------------------------------------
        // Helper
        // -------------------------------------------------------------------------
        function createSetup(device, settings, registers) {
            return function setupGyro(callback) {
                async.eachSeries(Object.keys(settings), function (key, cb) {
                    server.log(['info'], 'Setting ____ register ' + key + ' at 0x' + registers[key].toString(16) + ' to 0x' + settings[key].toString(16));
                    device.writeReg(registers[key], settings[key]);
                    cb(null);
                }, callback);
            };
        }

        // -------------------------------------------------------------------------
        // Gyro
        // -------------------------------------------------------------------------

        function calibrateGyro(callback) {
            server.log(['info'], 'calibrate gyro begin');
            var count = 0;
            var sum = {
                x: 0,
                y: 0,
                z: 0
            };
            var interval = setInterval(function () {
                count++;
                readGyro(function (values) {
                    sum.x += values.x;
                    sum.y += values.y;
                    sum.z += values.z;

                    if (count >= updateRate) {
                        clearInterval(interval);
                        server.log(['info'], 'calibrate gyro end');

                        calibration.gyro.offset.x = sum.x / count;
                        calibration.gyro.offset.y = sum.y / count;
                        calibration.gyro.offset.z = sum.z / count;

                        server.log(['debug'], JSON.stringify(calibration.gyro.offset, null, 4));

                        callback(null);
                    }
                });
            }, intervalRate);
        }

        function readGyro(callback) {
            var buffer = gyro.readBytesReg(registers.gyro.OUT_X_L_G, 6);

            callback(null, {
                x: (buffer.readInt16LE(0) * constant.gyro.bitWeight) - calibration.gyro.offset.x,
                y: (buffer.readInt16LE(2) * constant.gyro.bitWeight) - calibration.gyro.offset.y,
                z: (buffer.readInt16LE(4) * constant.gyro.bitWeight) - calibration.gyro.offset.z
            });
        }

        // -------------------------------------------------------------------------
        // Accelerometer, Magnetometer
        // -------------------------------------------------------------------------
        var acclmagn = new mraa.I2c(1);
        acclmagn.address(acclAddr);

        if (acclmagn.readReg(registers.acclmagn.WHO_AM_I_XM) !== 0x49) {
            server.log(['error'], new Boom.badImplementation('AcclMag WHO_AM_I not found! AcclMag attached?'));
            sensorStatus.acclmagn = false;
        } else {
            server.log(['info'], 'Found acclmagn');
            sensorStatus.acclmagn = true;
        }

        function readAccl(callback) {
            var buffer = acclmagn.readBytesReg(registers.acclmagn.OUT_X_L_A, 6);

            callback(null, {
                x: buffer.readInt16LE(0) * constant.accl.bitWeight,
                y: buffer.readInt16LE(2) * constant.accl.bitWeight,
                z: buffer.readInt16LE(4) * constant.accl.bitWeight
            });
        }


        var magnRawRange = {
            x: {
                min: Number.MAX_VALUE,
                max: Number.MIN_VALUE
            },
            y: {
                min: Number.MAX_VALUE,
                max: Number.MIN_VALUE
            },
            z: {
                min: Number.MAX_VALUE,
                max: Number.MIN_VALUE
            }
        };

        function setRange(value, range) {
            if (value < range.min) {
                range.min = value;
            }

            if (value > range.max) {
                range.max = value;
            }
        }

        function readMagn(callback) {
            var buffer = acclmagn.readBytesReg(registers.acclmagn.OUT_X_L_M, 6);

            var result = {
                rawx: buffer.readInt16LE(0) * constant.magn.bitWeight,
                rawy: buffer.readInt16LE(2) * constant.magn.bitWeight,
                rawz: buffer.readInt16LE(4) * constant.magn.bitWeight
            };


            setRange(result.rawx, magnRawRange.x);
            setRange(result.rawy, magnRawRange.y);
            setRange(result.rawz, magnRawRange.z);

            result.x = result.rawx - nconf.get("magnetometer:hardiron:x");
            result.y = result.rawy - nconf.get("magnetometer:hardiron:y");
            result.z = result.rawz - nconf.get("magnetometer:hardiron:z");

            result.range = magnRawRange;

            callback(null, result);
        }

        // -------------------------------------------------------------------------
        // Setup
        // -------------------------------------------------------------------------


        var readFunctions = [];
        var state = {};

        function createErrorHandler(key, reader) {
            return function (cb) {
                try {
                    reader(function (err, result) {
                        state[key] = result;
                        cb(null);
                    });
                } catch (e) {
                    server.log(['error'], 'Failed to read ' + key + ', Error: ' + e);
                    state[key] = {
                        x: null,
                        y: null,
                        z: null
                    };
                    cb(null);
                }
            };
        }

        // Is the gyro good? If it is then we can read it.
        if (sensorStatus.gyro === true) {
            readFunctions.push(createErrorHandler('rotationRate', readGyro));
        }

        // Is the accl magn good? If it is then we can read it.
        if (sensorStatus.acclmagn === true) {
            readFunctions.push(createErrorHandler('acceleration', readAccl));
            readFunctions.push(createErrorHandler('magneticField', readMagn));
        }

        module.exports.calibrateGyro = calibrateGyro;

        module.exports.read = function (cb) {
            async.series(readFunctions,
                function (err) {
                    calculateOriention(state);
                    cb(err, state);
                });
        };

        async.waterfall([
            createSetup(gyro, settings.gyro, registers.gyro),
            //calibrateGyro,
            createSetup(acclmagn, settings.acclmagn, registers.acclmagn)

        ], function (err) {
            server.log(['info'], 'Done configuring I2C mems');
            callback(err);
        });

    }

    return init;
};