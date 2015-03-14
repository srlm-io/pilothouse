'use strict';
/*jshint bitwise: false*/

var mraa = require('mraa');
var Boom = require('boom');
var async = require('async');


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

//constant.gyro.bitWeight = constant.gyro.scale / (1 << 14) / 2; // get "degrees per bit", with +- ( divide by 2)
//console.log('bitWeight: ' + constant.gyro.bitWeight);


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

module.exports.init = function () {
    var gyro = new mraa.I2c(1);
    gyro.address(gyroAddr);

    //console.log(Object.getOwnPropertyNames(gyro));

    if (gyro.readReg(registers.gyro.WHO_AM_I_G) !== 0xD4) {
        throw new Boom.badImplementation('Gyro WHO_AM_I not found! Gyro attached?');
    } else {
        console.log('Found gyro');
    }

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------
    function createSetup(device, settings, registers) {
        return function setupGyro(callback) {
            async.eachSeries(Object.keys(settings), function (key, cb) {
                console.log('Setting ____ register ' + key + ' at 0x' + registers[key].toString(16) + ' to 0x' + settings[key].toString(16));
                device.writeReg(registers[key], settings[key]);
                cb(null);
            }, callback);
        };
    }

    // -------------------------------------------------------------------------
    // Gyro
    // -------------------------------------------------------------------------

    function calibrateGyro(callback) {
        console.log('calibrate gyro begin');
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
                    console.log('calibrate gyro end');

                    calibration.gyro.offset.x = sum.x / count;
                    calibration.gyro.offset.y = sum.y / count;
                    calibration.gyro.offset.z = sum.z / count;

                    console.dir(calibration.gyro.offset);

                    callback(null);
                }
            });
        }, intervalRate);
    }

    function readGyro(callback) {
        //var buffer = gyro.readBytesReg(registers.gyro.OUT_X_L_G, 6);
        gyro.writeByte(registers.gyro.OUT_X_L_G);
        var buffer = gyro.read(6);
        callback({
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
        throw new Boom.badImplementation('AcclMag WHO_AM_I not found! AcclMag attached?');
    } else {
        console.log('Found acclmagn');
    }

    function readAccl(callback) {

        var buffer = acclmagn.readBytesReg(registers.acclmagn.OUT_X_L_A, 6);

        //acclmagn.writeByte(registers.acclmagn.OUT_X_L_A);
        //var buffer = acclmagn.read(6);

        //console.log('0x' + buffer.readInt16LE(0).toString(16));

        callback({
            x: buffer.readInt16LE(0) * constant.accl.bitWeight,
            y: buffer.readInt16LE(2) * constant.accl.bitWeight,
            z: buffer.readInt16LE(4) * constant.accl.bitWeight
        });
    }

    function readMagn(callback) {
        //var buffer = acclmagn.readBytesReg(registers.acclmagn.OUT_X_L_M, 6);

        acclmagn.writeByte(registers.acclmagn.OUT_X_L_M);
        var buffer = acclmagn.read(6);


        callback({
            x: buffer.readInt16LE(0) * constant.magn.bitWeight,
            y: buffer.readInt16LE(2) * constant.magn.bitWeight,
            z: buffer.readInt16LE(4) * constant.magn.bitWeight
        });
    }

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    async.waterfall([
        //createSetup(gyro, settings.gyro, registers.gyro),
        //function (callback) {
        //    setInterval(function () {
        //        readGyro(function (values) {
        //            console.log(values.x + '\t' + values.y + '\t' + values.z);
        //        });
        //    }, 500);
        //},



        //calibrateGyro,
        createSetup(acclmagn, settings.acclmagn, registers.acclmagn),
        function (callback) {
            setInterval(function () {
                readAccl(function (valuesAccl) {
                    //readMagn(function (valuesMagn) {
                        console.log(valuesAccl.x + ', ' + valuesAccl.y + ', ' + valuesAccl.z +
                        ''); //'\t\t' + valuesMagn.x + ', ' + valuesMagn.y + ', ' + valuesMagn.z);
                    //});
                });
            }, 50);
        }
    ], function (err) {
        console.log('Done configuring I2C mems');
        //console.log('Gyro configured.');
    });

};