'use strict';

var mraa = require('mraa');
console.log('mraa version: ' + mraa.getVersion());

var device = new mraa.I2c(1);
device.address(0x1D);


//device.writeByte(0x28 | 0x80);
//device.read(2);

// Correct ordering
//device.readWordReg(0x28 | 0x80);

// Incorrect ordering
device.readBytesReg(0x28 | 0x80, 6);
