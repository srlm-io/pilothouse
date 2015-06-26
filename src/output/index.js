'use strict';

module.exports.init = function (server, callback) {
    server.log(['debug'], 'starting heartbeat.');
    require('./heartbeat').init(server);

    server.log(['debug'], 'starting servo driver.');
    require('./servo').init(server, function (err, servo) {
        server.log(['debug'], 'servo driver started.');

        callback(err, {
            setRudder: servo.setRudder,
            setSail: servo.setSail
        });
    });
};
