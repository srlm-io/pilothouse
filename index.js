'use strict';

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var currentUser = process.env.USER;
console.log('Current user: ' + currentUser);

if (currentUser !== 'root') {
    console.log('Must be run as root. Current user is ' + currentUser);
    process.exit(1);
}


console.dir(process.env);

var nconf = require('nconf');
nconf.argv()
    .env()
    .file({file: process.env.NODE_CONFIG_DIR + '/config.json'});


require('./src/heartbeat').init();

//process.exit(0);


