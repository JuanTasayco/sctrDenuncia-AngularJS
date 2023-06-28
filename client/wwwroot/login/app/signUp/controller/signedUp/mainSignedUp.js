define([
	'angular',
	'constants',
	'/login/app/login/component/authentication/component.js',
	'/login/app/signUp/service/signUpFactory.js'
], function(angular){
  
	var appLogin = angular.module('appLogin');

	appLogin.controller('signedUpController', ['$scope', 'signUpFactory', '$window', '$timeout', '$state', function($scope, signUpFactory, $window, $timeout, $state){
		
		$scope.type = constants.typeLogin.cliente.code; //Cliente persona, para componente login

		$scope.message = false;
		//Recuperamos los datos enviado de signUp
		var vDataSigndUp = angular.fromJson($window.localStorage['dataSigndUp']);
		delete $window.localStorage['dataSigndUp'];

		if (vDataSigndUp == null) $state.go('authoButtons'); //Redireccion
		// console.log('vDataSigndUp ' + JSON.stringify(vDataSigndUp));

		$scope.lblName = vDataSigndUp.Name;
		$scope.lblEmail = vDataSigndUp.Correo;
		vDataSigndUp.TipoLogin = $scope.type;

		$scope._sendPasswordxEmail = function(){
			signUpFactory.sendPasswordxEmail(vDataSigndUp).then(function(response){
			// 	console.log('exito');
				if (response.data.operationCode){
					$scope.message = true;
					$timeout(function () {
						$scope.message = false;
					}, 3000);
				};
			}, function(error){
				console.log('error');
			});
		};

	}])

});