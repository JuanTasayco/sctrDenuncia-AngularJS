define([
	'angular', '/login/app/recoverPassword/component/form.js'
], function(angular){
  
	var appLogin = angular.module('appLogin');

	appLogin.controller('recoverPasswordController', ['$scope', function($scope){
		$scope.data = {};
	}])

});