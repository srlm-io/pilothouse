'use strict';

var ansi = require('ansi-escape-sequences');

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var currentUser = process.env.USER;
console.log('Current user: ' + currentUser);

if (currentUser !== 'root') {
    console.log('Must be run as root. Is user "' + currentUser + '" root?');
    //process.exit(1);
}

//process.on('uncaughtException', function (err) {
//    console.log('Caught eaddrinuse');
//    console.dir(err);
//    console.log(err);
//    process.exit(1);
//});

process.on('exit', function () {
    console.log('Exiting...');
});

//process.on('SIGTERM', function () {
//    console.log('Received SIGTERM. Exiting');
//});

//process.on('SIGKILL', function () {
//    console.log('Received SIGKILL. Exiting');
//});

require('./monit');

//setTimeout(function () {
//    console.log('Throwing demo error!!!!!!!!!!!!!!!!!!!');
//    process.exit(99);
//}, 20000);

var nconf = require('nconf');
nconf.argv()
    .env()
    .file({file: '/home/pilothouse/pilothouse/config.json'});


var _ = require('lodash');

var state = {
    sensor: {
        windDirection: null
    },
    servo: {
        rudder: 1500,
        sail: 1500
    }
};


/**
 *
 * @param value
 * @param places number of decimal places, or null for natural.
 * @param columnWidth
 * @returns {*}
 */
function padSensor(value, places, columnWidth) {

    var numberString;
    if (_.isUndefined(value) || _.isNull(value)) {
        numberString = '***';
    } else {
        numberString = '' + (places ? value.toFixed(places) : value);
    }

    if (numberString.length > columnWidth) {
        // We're overflowing...
        return numberString;
    } else {
        return '                                    '.substr(0, columnWidth - numberString.length) +
            numberString;
    }
}

function printSensors(state) {
    console.log(
        padSensor(state.time, 0, 12) +
        padSensor(state.wind.direction, 0, 4) +
        padSensor(state.orientation.acceleration.x, 2, 7) +
        padSensor(state.orientation.acceleration.y, 2, 7) +
        padSensor(state.orientation.acceleration.z, 2, 7) +
        padSensor(state.orientation.rotationRate.x, 2, 8) +
        padSensor(state.orientation.rotationRate.y, 2, 8) +
        padSensor(state.orientation.rotationRate.z, 2, 8) +
        padSensor(state.gps.latitude, 6, 11) +
        padSensor(state.gps.longitude, 6, 11) +
        padSensor(state.gps.speed, 2, 6) +
        padSensor(state.gps.heading, 1, 5) +
        padSensor(state.gps.satellites, 0, 4) +
        padSensor(state.gps.hdop, 0, 6)
    );
}


function mapWindToSail(windDirection) {

    // Deal with wind over the port side the same as wind over the starboard side
    if (windDirection > 180) {
        windDirection = 360 - windDirection;
    }

    var result = 0;
    if (windDirection < 45) {
        result = 0;
    } else if (windDirection > 135) {
        result = 90;
    } else {
        result = Math.round(windDirection - 45);
    }
    return result;
}

var currentCommand = 'manual tack';
var currentSetpoint = 90;

require('./server').init(function (err, server) {
    require('./output').init(server, function (err, output) {
        if (err) {
            server.log(['error'], 'Output error: ' + err);
        }
        require('./sensors').init(server, function (err, sensors) {
            if (err) {
                server.log(['error'], 'Sensors error: ' + err);
            }

            server.log(['info'], 'Sensors initialized');

            var http = require('http');
            var socketServer = http.createServer().listen(3000);
            var io = require('socket.io')(socketServer);

            io.on('connection', function (socket) {
                server.log(['debug'], 'socket.io user connected');
                socket.on('disconnect', function () {
                    server.log(['debug'], 'socket.io user disconnected');
                });

                socket.on('set manual tack', function (newSetpoint) {
                    server.log(['debug'], 'Got new manual tack setpoint: ' + newSetpoint);
                    currentCommand = 'manual tack';
                    currentSetpoint = newSetpoint;
                });
            });

            server.log(['info'], 'Socket.io initialized');

            function calculateRudder(state){

                var error = state.wind.direction - state.setpoint;

                if (error < (state.setpoint - 180)) {
                    error += 180;
                }

                var kP = 1;

                state.output.rudder = kP * error;

                if (state.output.rudder > 45) {
                    state.output.rudder = 45;
                } else if (state.output.rudder < -45) {
                    state.output.rudder = -45;
                }
            }

            function controlLoop() {
                sensors.getState(function (err, state) {

                    state.command = currentCommand;

                    state.output = {
                        sail: mapWindToSail(state.wind.direction)
                    };

                    if (currentCommand === 'manual tack') {
                        state.setpoint = currentSetpoint;
                        calculateRudder(state);

                    } else { //(currentCommand === 'hold') {
                        state.setpoint = null;
                        state.output.rudder = 0;
                    }


                    output.setSail(state.output.sail);
                    output.setRudder(state.output.rudder);

                    io.emit('state', state);

                    //printSensors(state);

                    setTimeout(controlLoop, 100);

                });
            }

            setTimeout(controlLoop, 400);

        });
    });
});




