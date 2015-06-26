'use strict';

var mraa = require('mraa');
var nconf = require('nconf');

module.exports.init = function (server) {
    server.log(['info'], 'Setting heartbeat to pin ' + nconf.get('heartbeat:pin'));

    var heartbeatLED = new mraa.Gpio(nconf.get('heartbeat:pin'));
    heartbeatLED.dir(mraa.DIR_OUT);

    var ledState = true;

    setInterval(function () {
        heartbeatLED.write(ledState ? 1 : 0);
        ledState = !ledState;
    }, nconf.get('heartbeat:interval'));
};