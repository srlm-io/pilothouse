angular.module('pilothouse.states.dashboard', [
    'ui.router',
    'pilothouseComponents.visualizations.boat'
])
    .config(function ($stateProvider) {
        $stateProvider.state('dashboard', {
            url: '/dashboard',
            templateUrl: 'states/dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    })
    .controller('DashboardCtrl', function ($scope, lodash, socket) {
        console.log('Hello from dashboard!');

        socket.on('state', function (state) {

            var defaultedState = lodash.defaultsDeep({}, state, {
               gps: {
                   heading: 0
               }
            });
            if(defaultedState.wind.direction === null){
                defaultedState.wind.direction = 0;
            }

            // Since the sail will flop to the downwind side, but out output
            // is 0-90. Let's make it appear as if it's being blown downwind.
            if (state.wind.direction < 180) {
                state.output.graphicalSail = -state.output.sail;
            } else {
                state.output.graphicalSail = state.output.sail;
            }

            $scope.state = state;
            $scope.defaultedState = defaultedState;



        });


        $scope.tackAngle = 0;

        $scope.setTackAngle = function(){
          console.log('Setting tack angle to ' + $scope.tackAngle);

            socket.emit('set manual tack', $scope.tackAngle);
        };

        $scope.message = 'Hello, again!';

    });