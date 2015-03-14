'use strict';

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var wind = new mraa.I2c(1);
wind.address(2);

var counter = 0;
setInterval(function () {
    wind.read(2);
    console.log(counter ++);
}, 10);

