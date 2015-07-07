'use strict';

var async = require('async');

var wind = require('./wind');
var orientation = require('./orientation');
var gps = require('./gps');
var nconf = require('nconf');

module.exports.init = function (server, callback) {

    var state = {};

    async.series([
        wind.init(server),
        orientation.init(server),
        gps.init(server)
    ], function (err) {

        // Set up our sensor read loop.
        setInterval(readState, nconf.get('sensorReadPeriod'));

        callback(err, {
            getState: function(callback){
                callback(null, state);
            }
        });
    });

    function readState() {
        var newState = {
            time: (new Date()).getTime()
        };
        async.series([
            function (cb) {
                wind.read(function (err, result) {
                    newState.wind = result;
                    cb(err);
                });
            },
            function (cb) {
                orientation.read(function (err, result) {
                    newState.orientation = result;
                    cb(err);
                });
            },
            function (cb) {
                gps.read(function (err, result) {
                    newState.gps = result;
                    cb(err);
                });
            }
        ], function (err) {
            if(err){
                server.log(['error'], err);
            }else{
                state = newState;
            }
        });
    }
};





