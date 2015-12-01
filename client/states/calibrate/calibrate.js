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
                    return api.calibrate.get();
                }
            }
        });
    })
    .controller('StateCalibrateCtrl', function ($scope, lodash, socket, api, lodash, calibration) {

        socket.on('state', function (state) {
            $scope.state = state;
        });

        $scope.constants = {
            rudder: {
                floor: 1000,
                ceil: 2000
            }
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

        $scope.$watch('calibration.servo.rudder.minimumPulse', lodash.debounce(servoChanged('output.rudder.raw'), scrollDelay));
        $scope.$watch('calibration.servo.rudder.maximumPulse', lodash.debounce(servoChanged('output.rudder.raw'), scrollDelay));

    });