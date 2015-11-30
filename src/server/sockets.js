'use strict';

module.exports.init = function(server) {
    function init(callback) {
        var http = require('http');
        var socketServer = http.createServer().listen(3000);
        var io = require('socket.io')(socketServer);

        io.on('connection', function (socket) {
            server.log(['debug'], 'socket.io user connected');
            socket.on('disconnect', function () {
                server.log(['debug'], 'socket.io user disconnected');
            });

            //socket.on('set manual tack', function (newSetpoint) {
            //    server.log(['debug'], 'Got new manual tack setpoint: ' + newSetpoint);
            //    currentCommand = 'manual tack';
            //    currentSetpoint = newSetpoint;
            //});
        });

        server.log(['info'], 'Socket.io initialized');


        function task(globalState, callback) {
            io.emit('state', globalState);
            callback(null, globalState);
        }

        callback(null, task);
    }
    return init;
};