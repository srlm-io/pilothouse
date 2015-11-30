
angular.module('pilothouse', [
        'ui.router',
        'pilothouse.states.dashboard',
        'pilothouse.states.home',
        'pilothouse.states.calibrate',
        'ngLodash',
        'rzModule'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        // for any unmatched url
        $urlRouterProvider.otherwise("/");

        $locationProvider.html5Mode(true);
    })
    // Taken from http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
    .factory('socket', function ($rootScope) {
        var socketHost = window.location.hostname;
        if (socketHost === 'localhost') {
            socketHost = 'pilothouse.local';
        }
        var socket = io.connect('http://' + socketHost + ':3000');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    });
