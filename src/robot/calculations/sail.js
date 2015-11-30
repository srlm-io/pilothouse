'use strict';

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


module.exports.init = function (server) {
    function calculateOutput(callback) {
        function task(globalState, callback) {
            globalState.output.sail = {
                angle: mapWindToSail(globalState.wind.direction)
            };
            callback(null, globalState);
        }

        callback(null, task);
    }

    return calculateOutput;
};
