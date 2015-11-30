angular.module('pilothouse.states.home', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'states/home/home.html',
            controller: 'StateHomeCtrl'
        });
    })
    .controller('StateHomeCtrl', function ($scope, lodash, socket) {
    });