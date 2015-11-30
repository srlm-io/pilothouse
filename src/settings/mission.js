'use strict';

var generic = require('./generic');
var config = require('./config');

var defaultMission = {
    mode: 'manual'
};

var mission = generic.load(defaultMission, config.get('missionFile'));
module.exports.get = generic.get(mission);
module.exports.set = generic.set(mission, config.get('missionFile'));