angular.module('pilothouse.states.calibrate', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('calibrate', {
            url: '/calibrate',
            templateUrl: 'states/calibrate/calibrate.html',
            controller: 'StateCalibrateCtrl'
        });
    })
    .controller('StateCalibrateCtrl', function ($scope, lodash, socket) {

        socket.on('state', function (state) {
            $scope.state = state;
        });

        $scope.constants = {
            rudder: {
                floor: 1000,
                ceil: 2000
            }
        };

        $scope.calibrations = {
            rudder: {
                low: 1000,
                high: 2000
            }
        };

        function servoChanged(name){
            return function (newValue, oldValue) {
                if(newValue !== oldValue) {
                    console.log('changed ' + name + ' to ' + newValue);
                }
            }
        }


        $scope.$watch('calibrations.rudder.low', servoChanged('rudder'));
        $scope.$watch('calibrations.rudder.high', servoChanged('rudder'));

    });