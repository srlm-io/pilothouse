'use strict';

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

var mraa = require('mraa');


var gyro = new mraa.I2c(1);

var pwm = new mraa.I2c(1);
pwm.address(64);
pwm.writeReg(0x00, 0x10);

//var x = new mraa.I2c(0);
//x.address(0xFF);
//x.address(0xF2);
//x.writeReg(0x00, 0x10);

var counter = 0;
setInterval(function(){
    console.log(counter++);
}, 1000);
