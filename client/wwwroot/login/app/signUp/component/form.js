'use strict';

define([
	'angular', 'constants', '/login/app/signUp/service/signUpFactory.js'
], function(angular, constants, factory){

	var appLogin = angular.module('appLogin');

	appLogin.controller('ctrlFrmSignUp', ['$scope', 'signUpFactory','$window', '$state', function($scope, signUpFactory, $window, $state){

		var _self = this;

		function _initError(){
			_self.error1 = false;
			_self.error2 = false;
			_self.error3 = false;
			_self.error4 = false;	
		}

		_initError();

		_self.provider = constants.documentTypes;

		
		_self.mNotification = {
			valueDefault: false,
		}

		_self._signUp = function(){
			_initError();

			if ($scope.validationForm()){
				var vDataSignUp = {
					Usuario: _self.mIngresaNumero,
					TipoDocumento: _self.mTipoDocumento.Codigo,
					Correo: _self.mIngresaCorreoElectronico,
					FlgAceptaRecibirCorreo: _self.mNotification.valueDefault ? 'S': 'N'
				};

				signUpFactory.signUp(vDataSignUp).then(function(response){
				// 	console.log('exito');
					// var response ={
					// 	operationCode: 200
					// };
					_self.tipoDocumento = vDataSignUp.TipoDocumento;
					switch (response.data.operationCode) {
						case 200:
							_self.tipoDocumento = '';
							vDataSignUp.TipoReenvioMail = '1';
							// vDataSignUp.Name = 'Erick';
							vDataSignUp.Name = response.data.data.nombre;
							// console.log(JSON.stringify(vDataSignUp));
							$window.localStorage['dataSigndUp'] = angular.toJson(vDataSignUp); // angular.toJson(vDataSignUp) Tranforma a JSon, porque el 'localStorage', solo lee string
							$state.go('signedUp'); // Redireccionamiento
							break;
						case 600:
							_self.error1 = true;
							break;
						case 611:
							_self.error2 = true;
							break;
						case 612:
							_self.error3 = true;
							break;
						case 613:
						case 614:
							_self.error4 = true;
							break;
					}
				}, function(error){
					console.log('error');
				});
			}

		};

		$scope.validationForm = function () {
			return $scope.frmSignUp.$valid && !$scope.frmSignUp.$pristine;
		};
		
	}]).component('mpfFormSignUp',{
		templateUrl: '/login/app/signUp/component/form.html',
		controller: 'ctrlFrmSignUp',
		bindings: {
			data: '='
		}
	})


});
