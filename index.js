'use strict';


var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var currentUser = process.env.USER;
console.log('Current user: ' + currentUser);

//if (currentUser !== 'root') {
//    console.log('Must be run as root. Current user is ' + currentUser);
//    process.exit(1);
//}

var nconf = require('nconf');
nconf.argv()
    .env()
    .file({file: '/home/pilothouse/pilothouse/config.json'});


var _ = require('lodash');




var servo;
var state = {
    sensor: {
      windDirection: null
    },
    servo: {
        rudder: 1500,
        sail: 1500
    }
};

require('./src/heartbeat').init();
require('./src/orientation').init();

//var gyro = new mraa.I2c(1);

//require('./src/wind').init(state);

/*require('./src/servo').init(state, function (err, servo_) {
    if (err) {
        console.log('servo error: ' + err);
        process.exit(1);
    }
    servo = servo_;


//(function () {
//    function buttonPressed() {
//        console.log((new Date()).toLocaleString() + ' Button pressed!');
//    }
//
//    var button = new mraa.Gpio(36); // GP14
//    button.dir(mraa.DIR_IN);
//
//    button.isr(mraa.EDGE_RISING, _.debounce(buttonPressed, 200));
//
//})();


    //setInterval(function(){
    //    servo.setPosition('rudder', Math.floor(state.sensor.windDirection * 1000 / 1024) + 1000, function(){});
    //}, 100);

    var Hapi = require('hapi');
    var Joi = require('joi');

    var server = new Hapi.Server();
    server.connection({port: 3000});


    server.route({
        method: 'GET',
        path: '/state',
        handler: function (request, reply) {
            console.log('GET /state');
            reply(state);
        },
        config: {
            tags: ['api'],
            description: 'Get the current state',
            notes: 'Get the current state vector of the sailboat'
        }
    });

    server.route({
        method: 'POST',
        path: '/output/{type}',
        handler: function (request, reply) {
            servo.setPosition(request.params.type, request.payload.pulsewidth, function (err) {
                if (err) {
                    reply(err);
                } else {
                    reply(state);
                }
            });
        },
        config: {
            validate: {
                params: {
                    type: Joi.string()
                },
                payload: {
                    pulsewidth: Joi.number().integer().min(1000).max(2000)
                }
            },
            tags: ['api'],
            description: 'Set output',
            notes: 'Set an output of the sailboat'
        }

    });


    server.register({
        register: require('hapi-swagger'),
        options: {
            payloadType: 'form'
        }
    }, function (err) {
        if (err) {
            console.log('hapi-swagger err: ' + err);
        }

        server.start(function () {
            console.log('Server running at:', server.info.uri);
        });
    });

});/**/








