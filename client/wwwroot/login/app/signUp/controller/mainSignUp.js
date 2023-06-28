define([
	'angular', '/login/app/signUp/component/form.js'
], function(angular){
  
	var appLogin = angular.module('appLogin');

	appLogin.controller('signUpController', ['$scope', function($scope){
		$scope.data = {};
	}])

});