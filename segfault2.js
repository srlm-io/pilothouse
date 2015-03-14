'use strict';

var mraa = require('mraa');

var gyro = new mraa.I2c(1);
gyro.address(0x6B);

var test2 = new mraa.I2c(1);
test2.address(0x7B);


var counter = 0;
setInterval(function(){
    console.log(counter++);
}, 1000);
