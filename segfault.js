'use strict';

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var button = new mraa.Gpio(32); // GP14
button.dir(mraa.DIR_IN);


var wind = new mraa.I2c(1);
wind.address(2);

var counter = 0;
setInterval(function () {
    wind.read(2);
    console.log(counter ++);
}, 10);

