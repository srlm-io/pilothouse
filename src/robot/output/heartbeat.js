'use strict';

var mraa = require('mraa');
var config = require('../../settings/config');

module.exports.init = function (server) {
    function init(callback) {
        server.log(['info'], 'Setting heartbeat to pin ' + config.get('heartbeat.pin'));

        var heartbeatLED = new mraa.Gpio(config.get('heartbeat.pin'));
        heartbeatLED.dir(mraa.DIR_OUT);

        var ledState = true;

        function read(globalState, callback){
            heartbeatLED.write(ledState ? 1 : 0);
            ledState = !ledState;
            callback(null, globalState);
        }

        callback(null, read);
    }
    return init;
};