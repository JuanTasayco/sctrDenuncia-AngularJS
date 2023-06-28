(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper',
'/polizas/app/sctr/emitir/service/sctrEmitFactory.js'
], 
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrParametrosController', 
			['$scope', '$window', '$state', '$timeout', '$uibModal', 'sctrEmitFactory', 'mModalAlert', 'oimPrincipal', '$rootScope', 
			function($scope, $window, $state, $timeout, $uibModal, sctrEmitFactory, mModalAlert, oimPrincipal, $rootScope){
				
		
				(function onLoad(){
					$scope.formData = $scope.formData || {};
					$scope.estadoDataParametro = [{"Codigo":1, "Descripcion":"VIGENTE"},{"Codigo":2,"Descripcion":"NO VIGENTE"}];

					filtrar('');

				})();

				$scope.$watch('formData', function(nv)
	      {
	        $rootScope.formData =  nv;
	      })

	      $scope.format = 'dd/MM/yyyy';
	      $scope.altInputFormats = ['M!/d!/yyyy'];

	      $scope.popup1 = {
	          opened: false
	      };

	      $scope.open1 = function() {
	          $scope.popup1.opened = true;
	      };
	      
	      $scope.formData.mValor3New = new Date();
	      $scope.formData.mValor3 = new Date();
	    	$scope.dateOptions = {
		        initDate: new Date()//,
		        // maxDate: new Date(),
		        //minDate: new Date(new Date().setDate(new Date().getDate()-2))
		      };

				$scope.showModalDatosGrupoParametros = function(detail, option, index, event){

					$scope.formData.mCodParametro = detail.CodigoGrupo;
					$scope.formData.mDescripParametro = detail.Descripcion;
					$scope.formData.mEstadoParametro = {"Descripcion":detail.DescripcionEstado,"Codigo":detail.CodigoEstado};
			
					//Modal
					var vModal = $uibModal.open({
						backdrop: true, // background de fondo
						backdropClick: true,
						dialogFade: false,
						keyboard: true,
						scope: $scope,
						size: 'lg',
						templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros.html',
						controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
							//CloseModal
							$scope.closeModal = function () {
								$uibModalInstance.close();
							};
							//
						}]
					});
					vModal.result.then(function(){
						//Action after CloseButton Modal
						// console.log('closeButton');
					},function(){
						//Action after CancelButton Modal
						// console.log("CancelButton");
					});
					//
				}

				$scope.showModalNuevoDatosGrupoParametros = function(option, index, event){
					$scope.formData.mDescripParametroNew = '';
					// $$scope.formData.mEstadoParametroNew
					//Modal
					var vModal = $uibModal.open({
						backdrop: true, // background de fondo
						backdropClick: true,
						dialogFade: false,
						keyboard: true,
						scope: $scope,
						size: 'lg',
						templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-nuevo.html',
						controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
							//CloseModal
							$scope.closeModal = function () {
								$uibModalInstance.close();
							};
							//
						}]
					});
					vModal.result.then(function(){
						//Action after CloseButton Modal
						// console.log('closeButton');
					},function(){
						//Action after CancelButton Modal
						// console.log("CancelButton");
					});
					//
				}				

				$scope.showMore = function(codigo, param){

					var key = 'paramsData';
          sctrEmitFactory.addVariableSession(key, param);

					$state.go('sctrParametrosDetalle', {number:codigo}, {reload: true, inherit: false}); 
				}

				$scope.filter = function(valor){

					filtrar(valor);

				}

				function filtrar(valor){
					var params = {
	         Descripcion: valor
	        };

	        sctrEmitFactory.getParamsSCTR(params, true).then(function(response){
	          if (response.OperationCode == constants.operationCode.success){
	            $scope.formData.parametros = response.Data;
	            if($scope.formData.parametros.length>0){
	            	$scope.formData.noResult = false;
	            }else{
	            	$scope.formData.noResult = true;
	            }	          
	          }else{
	          	mModalAlert.showError(response.Message, 'Error');	
	          	$scope.formData.noResult = true;	          
	          }
	        });
				}

				$scope.clearFilter = function(){
					$scope.formData.mDescrip = '';
					filtrar('');
				}

				$scope.newGroupParam = function(){
					console.log('newGroupParam');
					var newParams = {
					  TipoAccion: 1,
					  CodigoGrupo: 0,
					  Descripcion: $scope.formData.mDescripParametroNew,
					  CodigoEstado: $scope.formData.mEstadoParametroNew.Codigo,
					  UserCreacion: ""
					};

					$scope.formData.frmMaintenanceForm.markAsPristine();

					if(typeof $scope.formData.mDescripParametroNew != 'undefined' && $scope.formData.mDescripParametroNew !=''){
						sctrEmitFactory.grabarParametro(newParams, true).then(function(response){
		          if (response.OperationCode == constants.operationCode.success){
		            mModalAlert.showSuccess('Datos del grupo de parámetros creados con éxito', 'Parámetro creado');	
								$state.reload();
		          }else{
		          	mModalAlert.showError(response.Message, 'Error');	
		          }
		        });
		    
					}
         
				}

				$scope.updateGroupParams = function(){	
				console.log('updateGroupParams');			
					var updateParams = {
					  TipoAccion: 2,
					  CodigoGrupo: $scope.formData.mCodParametro,
					  Descripcion: $scope.formData.mDescripParametro,
					  CodigoEstado: $scope.formData.mEstadoParametro.Codigo,
					  UserCreacion: ""
					};
					if(typeof $scope.formData.mDescripParametro != 'undefined' && $scope.formData.mDescripParametro !=''){
	         	sctrEmitFactory.grabarParametro(updateParams, true).then(function(response){
		          if (response.OperationCode == constants.operationCode.success){
		            mModalAlert.showSuccess('Datos del grupo de parámetros actualizados con éxito', 'Datos actualizados');	
		            $state.reload();
		          }else{
		          	mModalAlert.showError(response.Message, 'Error');	
		          }
		        });
         	}
				}

		}])

	});
