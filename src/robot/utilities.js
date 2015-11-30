'use strict';
var _ = require('lodash');

module.exports.createMap = function (inMin, inMax, outMin, outMax, clipToBounds) {

    if (!_.isNumber(inMin) || !_.isNumber(inMax) || !_.isNumber(outMin) || !_.isNumber(outMax)) {
        console.log('Bounds passed to map function not a number: ' + inMin + ':' + inMax + '; ' + outMin + ':' + outMax);
    }

    return function (x) {
        // Adapted from http://www.arduino.cc/en/Reference/Map
        var result = (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

        if (clipToBounds) {
            if (result < outMin) {
                result = outMin;
            } else if (result > outMax) {
                result = outMax;
            }
        }
        return result;
    };
};