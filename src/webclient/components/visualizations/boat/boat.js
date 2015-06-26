angular
    .module('pilothouseComponents.visualizations.boat', [])
    .directive('boat', function () {
        return {
            restrict: 'E',
            scope: {
                state: '='
            },
            templateUrl: '/components/visualizations/boat/boat.html',
            controller: function ($scope) {
                $scope.graph = {
                    width: 600,
                    height: 600
                };
            }
        };
    });
