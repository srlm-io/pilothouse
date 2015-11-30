'use strict';

var config = require('./config');
var generic = require('./generic');
var _ = require('lodash');

var override = {};

function deleteProperties(objectToClean) {
    for (var x in objectToClean) if (objectToClean.hasOwnProperty(x)) delete objectToClean[x];
}

module.exports.get = generic.get(override);
module.exports.set = generic.set(override);
module.exports.reset = function () {
    deleteProperties(override);
};
