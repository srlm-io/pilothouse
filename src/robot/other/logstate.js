'use strict';

var _ = require('lodash');

/**
 *
 * @param value
 * @param places number of decimal places, or null for natural.
 * @param columnWidth
 * @returns {*}
 */
function padSensor(value, places, columnWidth) {

    var resultString;
    if (_.isUndefined(value) || _.isNull(value)) {
        resultString = '***';
    } else {
        resultString = '' + (places ? value.toFixed(places) : value);
    }

    if (resultString.length > columnWidth) {
        // We're overflowing...
        return resultString;
    } else {
        return '                                    '.substr(0, columnWidth - resultString.length) +
            resultString;
    }
}


module.exports.init = function(server) { // Called before series
    function init(cb) { // Series task
        function logState(state, callback) { // Waterfall task
            console.log(
                padSensor(state.time, 0, 12) +
                padSensor(state.wind.direction, 0, 6) +
                padSensor(state.orientation.acceleration.x, 2, 7) +
                padSensor(state.orientation.acceleration.y, 2, 7) +
                padSensor(state.orientation.acceleration.z, 2, 7) +
                padSensor(state.orientation.rotationRate.x, 2, 8) +
                padSensor(state.orientation.rotationRate.y, 2, 8) +
                padSensor(state.orientation.rotationRate.z, 2, 8) +
                padSensor(state.gps.latitude, 6, 11) +
                padSensor(state.gps.longitude, 6, 11) +
                padSensor(state.gps.speed, 2, 6) +
                padSensor(state.gps.heading, 1, 5) +
                padSensor(state.gps.satellites, 0, 4) +
                padSensor(state.gps.hdop, 0, 6) +
                padSensor(state.output.sail, 0, 4) +
                padSensor(state.output.rudder, 0, 4)+
                ' ' + state.mission.mode
            );
            callback(null, state);
        }

        cb(null, logState);
    }

    return init;
}