var _ = require('lodash');
var fs = require('fs');

module.exports.load = function (defaults, filename) {
    var object = {};
    try {
        object = JSON.parse(fs.readFileSync(filename))
    } catch (e) {
        // File does not exist
    } finally {
        _.defaultsDeep(object, defaults);
        save(object, filename);
    }
    return object;
};

function save(object, filename) {
    fs.writeFile(filename, JSON.stringify(object, null, '   '), function (err) {
        if (err) {
            console.log('Error writting ' + filename + ' file: ' + err);
        }
    });
}


module.exports.get = function (object, nullForEmpty) {
    return function (path) {
        if (!path) { //top level object
            if (nullForEmpty && _.isEmpty(object)) {
                return null;
            } else {
                return object;
            }
        } else {
            return _.get(object, path);
        }
    }
};

module.exports.set = function (object, filename) {
    return function (path, value) {
        _.set(object, path, value);
        if (filename) {
            save(object, filename);
        }
    };
};
