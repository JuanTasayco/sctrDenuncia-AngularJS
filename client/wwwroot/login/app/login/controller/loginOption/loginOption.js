define([
    'angular', '/login/app/login/component/buttonsAuth/buttonsAuth.js'
], function(angular) {
    'use strict';
    angular.module('appLogin').controller('loginOptionController',['$scope','$stateParams',function($scope, $stateParams)
    {
        $scope.loginOptions ={ selectedType : $stateParams.type };  
    }]);
});