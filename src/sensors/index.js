'use strict';

var async = require('async');

var wind = require('./wind');
var orientation = require('./orientation');
var gps = require('./gps');

module.exports.init = function (server, callback) {
    async.series([
        wind.init(server),
        orientation.init(server),
        gps.init(server)
    ], function (err) {
        callback(err, {
            getState: getState
        });
    });
};


function getState(callback) {
    var state = {
        time: (new Date()).getTime()
    };
    async.series([
        function (cb) {
            wind.read(function (err, result) {
                state.wind = result;
                cb(err);
            });
        },
        function (cb) {
            orientation.read(function (err, result) {
                state.orientation = result;
                cb(err);
            });
        },
        function (cb) {
            gps.read(function (err, result) {
                state.gps = result;
                cb(err);
            });
        }
    ], function (err) {
        callback(err, state);
    });
}
;