//


angular.module('pilothouse.mainview', [
    'ui.router',
    'pilothouseComponents.visualizations.boat'
])
    .config(function ($stateProvider) {
        $stateProvider.state('main', {
            url: '',
            templateUrl: 'components/mainview/mainview.html',
            controller: 'MainviewCtrl'
        });
    })
    .controller('MainviewCtrl', function ($scope, socket) {
        console.log('Hello from mainview!');

        socket.on('state', function (state) {

            // Since the sail will flop to the downwind side, but out output
            // is 0-90. Let's make it appear as if it's being blown downwind.
            if (state.wind.direction < 180) {
                state.output.graphicalSail = -state.output.sail;
            } else {
                state.output.graphicalSail = state.output.sail;
            }

            $scope.state = state;
        });

        $scope.message = 'Hello, again!';

    });