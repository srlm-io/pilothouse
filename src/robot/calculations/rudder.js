'use strict';

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

module.exports.init = function (server) {
    function calculateOutput(callback) {
        function task(globalState, callback) {
            globalState.output.rudder = {
                angle: 0
            };
            callback(null, globalState);
        }

        callback(null, task);
    }

    return calculateOutput;
};
