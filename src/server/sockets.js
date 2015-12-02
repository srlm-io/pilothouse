'use strict';

module.exports.init = function (server, callback) {
    var http = require('http');
    var socketServer = http.createServer().listen(3000);
    var io = require('socket.io')(socketServer);
    io.set('transports', ['websocket']); //forces client to connect as websockets. If client tries xhr polling, it won't connect.

    io.on('connection', function (socket) {
        server.log(['debug'], 'socket.io user connected');
        socket.on('disconnect', function () {
            server.log(['debug'], 'socket.io user disconnected');
        });
    });

    server.log(['info'], 'Socket.io initialized');


    function task(globalState, callback) {
        io.emit('state', globalState);
        callback(null, globalState);
    }

    callback(null, task);
};