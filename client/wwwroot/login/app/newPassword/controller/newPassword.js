define([
	'angular', 'constants', 'lodash',
	'/login/app/common/factory/newLoginFactory.js'
], function(angular, constants, _){
  
	var appLogin = angular.module('appLogin');

	appLogin.controller('newPasswordController', 
		['$scope', '$rootScope', '$state', '$stateParams', 'newLoginFactory', 'mModalAlert', 
		function($scope, $rootScope, $state, $stateParams, newLoginFactory, mModalAlert){

			$scope.names = {};
			$scope.passwordIsValid = false;

			/*########################
			# onLoad
			########################*/
			(function onLoad(){

				$scope.data = $scope.data || {};

				if ($stateParams['token']){
					$scope.data.isEmailSent = false;
					$scope.data.token = $stateParams['token'];
					$scope.data.minLength = 8
					$scope.data.maxLength = 50
					var token = {
						token: $scope.data.token
					}
					getPatron(token);
					getNames(token);
				}else{
					$state.go('login');
				}

			})();

			// $scope.getPatron = getPatron;
			function getPatron(token){
				var pms = newLoginFactory.proxyUsuario.IsRegularExpression(token);
				pms.then(function(response){
					$scope.data.patron = response.data;
					$scope.data.regex = {};
					if(!$scope.data.patron){
						$scope.data.regex = {
							patron: /^(((?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])(?=.*[A-Z]))|((?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])(?=.*[a-z]))|((?=.*\d)(?=.*[A-Z]))|((?=.*\d)(?=.*[a-z]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*\d)(?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])))\S{8,}$/
						}
					}else{
						$scope.data.regex = {
							patron: /^(((?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])(?=.*[A-Z])(?=.*[a-z]))|((?=.*\d)(?=.*[A-Z])(?=.*[a-z]))|((?=.*\d)(?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])(?=.*[a-z]))|((?=.*\d)(?=.*[@$!%*?&{()`~#^\-+=|{}[\]:;\"'<>,./])(?=.*[A-Z])))\S{8,}$$/
						}	
					} 
				})
			}

			/*########################
			# fnNewPassword
			########################*/

			function getNames(token){
				newLoginFactory.proxyUsuario.GetNombresUser(token).then(function(response){
					
					if(response.operationCode === 200) {
						$scope.names = {
							nom_Persona1: response.data.nom_Persona1 && response.data.nom_Persona1.toLowerCase() || undefined,
							nom_Persona2: response.data.nom_Persona2 && response.data.nom_Persona2.toLowerCase()  || undefined,
							ape_Paterno: response.data.ape_Paterno && response.data.ape_Paterno.toLowerCase()  || undefined,
							ape_Materno: response.data.ape_Materno && response.data.ape_Materno.toLowerCase()  || undefined
						}
					}
				})
			}

			$scope.isPassInvalid = function(nuevaContrasena){
				if(nuevaContrasena){
					var pass = nuevaContrasena.toLowerCase();
					var arrayNames = [$scope.names.nom_Persona1, $scope.names.nom_Persona2, $scope.names.ape_Paterno, $scope.names.ape_Materno];

					arrayNames = arrayNames.filter(function( element ) {
						return element !== undefined &&  element !== '.';
					 });

					 return _.some(arrayNames, 
							function (name) {
								
								return new RegExp(name.replace(/\s+/g, '').toLowerCase()).test(pass);
							}
						) 
				
					
				}
			}

			function _validateForm(){
				$scope.frmNewPassword.markAsPristine();
				
				if($scope.isPassInvalid($scope.data.mNuevaContrasena)){
					$scope.frmNewPassword.$valid = false;
				} 

				return $scope.frmNewPassword.$valid;
			}
			function _paramsNewPassword(){
				var vParams = {
					token			: $scope.data.token, 
					password 	: $scope.data.mNuevaContrasena
				};
				return vParams;
			}
			$scope.fnNewPassword = function(){
				var vValidateForm = _validateForm();
				if (vValidateForm && !$scope.passwordIsValid){
					var vParams = _paramsNewPassword();
					newLoginFactory.proxyUsuario.ChangePassword(vParams, true).then(function(response) {
						switch (response.operationCode){
						case constants.operationCode.success:
							$scope.data.isEmailSent = true;
							break;
						case 404:
						case constants.operationCode.code900:
							mModalAlert.showWarning(response.message, "ALERTA");
							break;
						default:
							mModalAlert.showWarning("No se ha podido procesar la información. <br> Comunícate con el administrador para más información", "ALERTA");
						}
					}, function(error) {
						console.error('error ', error);
					});
				}
			};

	}])
	.directive('mpfPasswordVerify', function() {
    return {
      restrict: 'A',
      require: ['?ngModel', '^form'],
      link: function($scope, element, attrs, requirements) {
        var ngModel = requirements[0], 
            ngForm = requirements[1];

        $scope.$watch(attrs.ngModel, function(newValue, oldValue){
          var vModel = newValue,
              vModelPasswordVerify = $scope.$eval(attrs.mpfPasswordVerify), 
              vPasswordVerify = (vModel == vModelPasswordVerify);
          ngForm.$setValidity('passwordVerify', vPasswordVerify);
        });
      }
    };
  })
});