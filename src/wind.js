'use strict';

var mraa = require('mraa');
var nconf = require('nconf');

var direction = null;

module.exports.init = function (state) {

    var wind = new mraa.I2c(nconf.get('windSensor:bus'));
    wind.address(nconf.get('windSensor:address'));

    setInterval(function () {
        var buffer = wind.read(2);
        direction = buffer.readInt16LE(0);
        state.sensor.windDirection = direction;
        //console.log(direction);
    }, Math.round(1000 / nconf.get('windSensor:updateRate')));
};
