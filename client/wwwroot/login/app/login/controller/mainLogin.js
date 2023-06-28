define([
  'angular', 
  '/login/app/login/component/authentication/component.js', 
  '/login/app/login/component/buttonsAuth/buttonsAuth.js'
], function(angular) {

  var appLogin = angular.module("appLogin");

  appLogin.controller("loginController", 
    ['$scope', 
    function($scope) {
      
      $scope.credentials = {};
      $scope.type = 0;

  }]);
});