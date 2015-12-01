angular.module('pilothouse', [
        'ui.router',
        'pilothouse.states.dashboard',
        'pilothouse.states.home',
        'pilothouse.states.calibrate',
        'ngLodash',
        'rzModule',
        'ngResource'
    ])
    .constant('api_domain', 'pilothouse.local')
    .factory('api', function (api_domain, $http, $resource) {

        api = {};

        var overrideUrl = 'http://' + api_domain + '/override/';
        api.override = {
            set: function (path, value) {
                var data = {};
                data[path] = value;
                return $http.put(overrideUrl, data, {
                    // headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            },
            get: function () {
                return $http.get(overrideUrl);
            },
            delete: function () {
                return $http.delete(overrideUrl);
            }
        };

        var calibrateUrl = 'http://' + api_domain + '/calibration/';
        api.calibrate = {
            get: function () {
                return $http.get(calibrateUrl);
            }
        };

        //$resource('/api/entries/:id'); // Note the full endpoint address


        return api;
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
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
