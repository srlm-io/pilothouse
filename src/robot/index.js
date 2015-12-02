'use strict';
var mission = require('../settings/mission');
var async = require('async');
const kIntervalTime = 250;

function startWaterfall(cb) { // Series task
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

var overrides = require('../settings/override');
var _ = require('lodash');

function overrideTask(cb) {
    function task(globalState, callback) {
        _.merge(globalState, overrides.get());
        globalState.mission.override = overrides.get();
        callback(null, globalState);
    }

    cb(null, task);
}


// Each task is in the form of a function that takes (state, callback)
module.exports.init = function (server, initCB) {

    async.series([
        startWaterfall,
        require('./sensors/wind').init.bind(this, server),
        require('./sensors/orientation').init.bind(this, server),
        require('./sensors/gps').init.bind(this, server),
        overrideTask,
        require('./calculations/sail').init.bind(this, server),
        require('./calculations/rudder').init.bind(this, server),
        overrideTask,
        require('./output/servo').init.bind(this, server),
        require('./output/heartbeat').init.bind(this, server),
        require('../server/sockets').init.bind(this, server)
        //require('./other/logstate').init(server)
    ], function (err, tasks) {
        function loop() {
            async.waterfall(tasks, function (err, state) {
                if (err) {
                    server.log(['error'], 'Robot Loop Top Level Error: ' + err + '\n' + err.stack);
                    process.exit(1);
                } else {
                    setTimeout(loop, kIntervalTime)
                }
            });
        }

        loop();
        initCB();
    });
};
