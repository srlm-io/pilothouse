angular
    .module('pilothouseComponents.visualizations.boat', [])
    .directive('boat', function () {
        return {
            restrict: 'E',
            scope: {
                state: '=defaultedState'
            },
            templateUrl: '/components/visualizations/boat/boat.html',
            controller: function ($scope) {
                $scope.graph = {
                    width: 300,
                    height: 300
                };
            }
        };
    });
