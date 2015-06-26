'use strict';

var _ = require('lodash');
var nconf = require('nconf');

var serialport = require('serialport');
var nmea = require('nmea');
var SerialPort = serialport.SerialPort;

var state = {};


function parseLatLongTemplate(string, decimalLength) {
    if (string === '') {
        return null;
    }

    var degrees = string.substr(0, decimalLength);
    var minutes = string.substr(decimalLength);
    return parseInt(degrees) + (parseFloat(minutes) / 60);
}

function parseLatitude(string) {
    return parseLatLongTemplate(string, 2);
}

function parseLongitude(string) {
    return parseLatLongTemplate(string, 3);
}

function processGPSLine(line) {
    try {
        var data = nmea.parse(line);

        if (data.sentence === 'RMC') {
            state.latitude = parseLatitude(data.lat);
            state.longitude = parseLongitude(data.lon);
            state.speed = data.speedKnots * 0.514444; // Convert to m/s
            state.heading = data.trackTrue;
        } else if (data.sentence === 'GGA') {
            state.fixType = data.fixType;
            state.satellites = data.numSat;
            state.hdop = data.horDilution;
        }

    } catch (err) {

    }
}


module.exports.init = function (server) {
    function init(callback) {

        server.log(['info'], 'Setting windsensor to bus ' + nconf.get('windSensor:bus') + ' and address ' + nconf.get('windSensor:address'));

        var gps = new SerialPort('/dev/ttyMFD1', {
            baudrate: 9600,
            parser: serialport.parsers.readline('\r\n')
        });

        gps.on('data', processGPSLine);

        gps.open(callback);
    }

    return init;
};

module.exports.read = function (callback) {
    callback(null, state);
};



