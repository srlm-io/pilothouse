'use strict';

var calibration = require('../../settings/calibration');

function calculateRudder(state) {

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
var angle = -20;
var step = 1;

module.exports.init = function (server, callback) {
    function task(globalState, callback) {

        // Debugging loop
        angle += step;
        if(angle >= calibration.get('servo.rudder.maximumAngle')){
            step *= -1;
        }
        if(angle <= calibration.get('servo.rudder.minimumAngle')){
            step *= -1;
        }

        globalState.output.rudder = {
            angle: angle
        };
        callback(null, globalState);
    }

    callback(null, task);
};
