'use strict';
var mission = require('../settings/mission');
var async = require('async');
const kIntervalTime = 250;

function startWaterfall() {
    function task(cb) { // Series task
        function task(callback) { // Waterfall task
            var state = {
                time: (new Date()).getTime(),
                mission: mission.get(),
                output: {}
            };
            callback(null, state);
        }

        cb(null, task);
    }

    return task
}

var overrides = require('../settings/override');
var _ = require('lodash');

function overrideTask(cb) {
    function task(globalState, callback) {
        console.dir(overrides.get());
        _.merge(globalState, overrides.get());
        callback(null, globalState);
    }

    cb(null, task);
}


// Each task is in the form of a function that takes (state, callback)
module.exports.init = function (server, initCB) {

    async.series([
        startWaterfall(),
        require('./sensors/wind').init(server),
        require('./sensors/orientation').init(server),
        require('./sensors/gps').init(server),
        overrideTask,
        require('./calculations/sail').init(server),
        require('./calculations/rudder').init(server),
        overrideTask,
        require('./output/servo').init(server),
        require('./output/heartbeat').init(server),
        require('../server/sockets').init(server)
        //require('./other/logstate').init(server)
    ], function (err, tasks) {
        function loop() {
            async.waterfall(tasks, function (err, state) {
                if (err) {
                    console.log('Error: ' + err);
                    // TODO Should it exit here?
                } else {
                    setTimeout(loop, kIntervalTime)
                }
            });
        }

        loop();
        initCB();
    });
};
