'use strict';

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

//var mraa = require('mraa'); //require mraa
//console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

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

var _ = require('lodash');

require('./server').init(function (err, server) {
    require('./robot').init(server, function(err){
        server.log(['info'], 'Robot up and running.')
    });
});




