angular.module('pilothouse', [
        'ui.router',
        'pilothouse.states.dashboard',
        'pilothouse.states.home',
        'pilothouse.states.calibrate',
        'ngLodash',
        'rzModule',
        'ngResource',
        'ui.bootstrap',
        'angularMoment'
    ])
    .constant('api_domain', 'pilothouse.local')
    .factory('api', function (api_domain, $http, $resource, $rootScope) {

        function errorHandler(err) {
            if (err) {
                $rootScope.addAlert('error', err.statusCode + ', ' + err.message);
            } else {
                $rootScope.addAlert('error', 'Unknown network error.');
            }

        }

        api = {};

        var overrideUrl = 'http://' + api_domain + '/override/';
        api.override = {
            set: function (path, value) {
                var data = {};
                data[path] = value;
                return $http.put(overrideUrl, data).error(errorHandler);
            },
            get: function () {
                return $http.get(overrideUrl).error(errorHandler);
            },
            delete: function () {
                return $http.delete(overrideUrl).error(errorHandler);
            }
        };

        var calibrationUrl = 'http://' + api_domain + '/calibration/';
        api.calibration = {
            set: function (obj) {
                return $http.put(calibrationUrl, obj).error(errorHandler);
            },
            get: function () {
                return $http.get(calibrationUrl).error(errorHandler);
            }
        };

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
        var connectionOptions =  {
            "force new connection" : true,
            "reconnection": true,
            "reconnectionDelay": 2000,                  //starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
            "reconnectionDelayMax" : 10000,             //1 minute maximum delay between connections
            "reconnectionAttempts": "Infinity",         //to prevent dead clients, having the user to having to manually reconnect after a server restart.
            "timeout" : 10000,                           //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]                //forces the transport to be only websocket. Server needs to be setup as well/
        };
        var socket = io.connect('http://' + socketHost + ':3000', connectionOptions);
        $rootScope.last_connected = new Date();

        socket.on('connect', function () {
            $rootScope.$apply(function () {
                console.log('connect');
                $rootScope.last_connected = null;
            });
        });
        socket.on('disconnect', function () {
            $rootScope.$apply(function () {
                console.log('disconnect');
                console.dir($rootScope.last_connected);
                console.log($rootScope.last_connected === null);
                if ($rootScope.last_connected === null) {
                    console.log('Setting $rootScope.last_connected');
                    $rootScope.last_connected = new Date();
                }
            });
        });
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
    })
    .run(function ($rootScope) {
        $rootScope.alerts = [];
        // add info, success, warning, or error
        $rootScope.addAlert = function (type, message) {
            if (type === 'error') {
                type = 'danger'
            }
            $rootScope.alerts.push({type: type, date: new Date(), message: message});
        };
        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };
    })
    .run(function($rootScope, socket){
        socket.on('state', function (state) {
            $rootScope.state = state;
        });
    })
    .config(function (lodash) {
        /*  Copyright (C) 2014  Kurt Milam - http://xioup.com | Source: https://gist.github.com/kurtmilam/7006dc1c2123787f9679
         *
         *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
         *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
         *
         *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
         **/
// Taken from https://gist.github.com/kurtmilam/7006dc1c2123787f9679
// This function takes an arbitrarily deeply nested object and returns a flat 'copy',
// an object with no nesting, just properties, where each property's identifier is a
// dot notation string representation of the path to the property on the original
// object of which it's a copy (see the working sample code at the end)
        function slenderizeObject(fatObject) {
            var _propertyIdentifiers = [];
            var _slenderObject = {};

            function processNode(theNode, _propertyIdentifiers, _slenderObject) {
                theNode = theNode || {};
                _propertyIdentifiers = _propertyIdentifiers || [];
                var ret = _(theNode)
                    .map(
                        function (value, key) {
                            var myKeys = _.clone(_propertyIdentifiers),
                                ret = {};
                            myKeys.push(key);

                            // if value is a string, number or boolean
                            if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
                                // build a keyString to use as a property identifier
                                var keyString = myKeys.join('.');
                                // add a property with that identifier and childNode as the value to our return object
                                ret[keyString] = _slenderObject[keyString] = value
                            } else {
                                // Call processNode recursively if value isn't a leaf node type (string, number or boolean)
                                processNode(value, myKeys, _slenderObject)
                                ret = value
                            }

                            return ret;
                        }, this
                    ).value();

                return ret
            }

            processNode(fatObject, _propertyIdentifiers, _slenderObject);

            return _slenderObject;
        }

        lodash.mixin({'slenderizeObject': slenderizeObject});

    });
