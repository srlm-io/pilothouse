angular.module('pilothouse.states.calibrate', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('calibrate', {
            url: '/calibrate',
            templateUrl: 'states/calibrate/calibrate.html',
            controller: 'StateCalibrateCtrl',
            resolve: {
                calibration: function (api) {
                    return api.calibration.get();
                }
            }
        });
    })
    .controller('StateCalibrateCtrl', function ($scope, $rootScope, lodash, socket, api, lodash, calibration) {

        var initialized = false;
        socket.on('state', function (state) {

            if (!initialized) {
                initialized = true;
                $scope.override.output.rudder.raw = state.output.rudder.raw;
                $scope.$watch('override.output.rudder.raw',
                    lodash.debounce(servoChanged('output.rudder.raw'), scrollDelay));
            }
        });

        $scope.constants = {
            rudder: {
                floor: 1000,
                ceil: 2000
            }
        };

        $scope.override = {
            output: {
                rudder: {
                    raw: null
                }
            }
        };

        $scope.saveCalibration = function () {
            api.calibration.set(lodash.reduce([
                    'servo.rudder.minimumPulse',
                    'servo.rudder.maximumPulse',
                    'servo.sail.minimumPulse',
                    'servo.sail.maximumPulse'
                ], function (result, path) {
                    result[path] = lodash.get($scope.calibration, path);
                    return result;
                }, {}))

                .success(function () {
                    $rootScope.addAlert('success', 'Calibration completed.');
                })
        };

        $scope.clearOverride = function () {
            api.override.delete();
        };

        $scope.calibration = calibration.data; //TODO fix .data

        function servoChanged(name) {
            return function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log('changed ' + name + ' to ' + newValue);
                    api.override.set(name, newValue);
                }
            }
        }

        const scrollDelay = 500;


    });