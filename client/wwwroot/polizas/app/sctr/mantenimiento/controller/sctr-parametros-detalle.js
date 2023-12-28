(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper',
'/polizas/app/sctr/emitir/service/sctrEmitFactory.js'
], 
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrParametrosDetalleController', 
			['$scope', '$window', '$state', '$timeout', '$uibModal', 'sctrEmitFactory', 'mModalAlert', 'oimPrincipal', '$rootScope', '$stateParams',  
			function($scope, $window, $state, $timeout, $uibModal, sctrEmitFactory, mModalAlert, oimPrincipal, $rootScope, $stateParams){
				
		
				(function onLoad(){

					$scope.formData = $scope.formData || {};
					$scope.userRoot = oimPrincipal.validateAgent('evoSubMenuEMISA','SCTR');
					var key = 'paramsData';			   

					$scope.estadoDataParametro = [{"Codigo":1, "Descripcion":"VIGENTE"},{"Codigo":2,"Descripcion":"NO VIGENTE"}];

					if(typeof $stateParams.number != 'undefined'){
						$scope.formData.number = $stateParams.number;

						var params = {
							CodigoGrupo: $scope.formData.number,
		         	Descripcion: ''
		        };

		         sctrEmitFactory.getListParametroDetalle(params, true).then(function(response){
		          if (response.OperationCode == constants.operationCode.success){
		            $scope.formData.paramDetalle = response.Data;
		            $scope.formData.param = $scope.formData.paramDetalle[0];

		            if(typeof $scope.formData.param == 'undefined'){

		            	if((sctrEmitFactory.getVariableSession(key).length>0) || (typeof(sctrEmitFactory.getVariableSession(key)) != 'undefined')){
							      $scope.valores = sctrEmitFactory.getVariableSession(key);			      
							      console.log($scope.valores);
							      // $scope.formData.param.CodigoGrupo = $scope.valores.CodigoGrupo;
							      // $scope.formData.param.DescripcionEstado = $scope.valores.DescripcionEstado;
							      $scope.formData.param = $scope.valores;
							      $scope.formData.param.DesGrupo = $scope.valores.Descripcion.toUpperCase();
							    }

		            }
		          }
		        });
					}

	 				sctrEmitFactory.getTipoDocumento().then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.tipoDocumentos = response.Data;
						}
					});
					

				})();

				$scope.$watch('formData', function(nv)
	      {
	        $rootScope.formData =  nv;
	      })

	      $scope.buscarAgente = function(val){
	      	console.log(val);

	      	$scope.mFiltroAgenteEdit = {
						codigoAgente: val.codigoAgente,
						codigoNombre: val.codigoNombre
					}

	      	$scope.formData.agenteData = val;

  	     	sctrEmitFactory.getDatoDocumentoAgente(val.codigoAgente).then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.formData.mValor1New = response.Data;
							var res = $scope.formData.mValor1New.split("_");

							$scope.formData.mTipoDocNew = {
								Codigo: res[0],
								Descripcion: res[0]
							};

							$scope.formData.mNroDocNew = res[1];

						}
					});
	      }

        $scope.format = 'dd/MM/yyyy';
	      $scope.altInputFormats = ['M!/d!/yyyy'];

	      $scope.popup1 = {
	          opened: false
	      };

	      $scope.open1 = function() {
	          $scope.popup1.opened = true;
	      };
	      
	      // $scope.formData.mValor3 = new Date();
	      // $scope.formData.mValor3New = new Date();
	    	$scope.dateOptions = {
		        initDate: new Date()//,
		        // maxDate: new Date(),
		        //minDate: new Date(new Date().setDate(new Date().getDate()-2))
		      };

				$scope.showModalNuevoDetalleEditarDatosGrupoParametros = function(detail, option, index, event){
					console.log('showModalNuevoDetalleEditarDatosGrupoParametros');
					console.log(detail);					

					$scope.formData.mNroDocNew = '';
					$scope.formData.mValor3 = '';

					$scope.formData.mCodGrupo = $scope.formData.param.CodigoGrupo;//detail.CodigoGrupo;

					$scope.formData.mGrupoParametro = $scope.formData.param.DesGrupo;//detail.DesGrupo;
					$scope.formData.mCodParametro = detail.CodigoParametro;//$scope.formData.param.CodigoGrupo;//detail.CodigoGrupo;
					$scope.formData.mDescripParametro = detail.Descripcion;
					$scope.formData.mValor1 = detail.Valor1;
					$scope.formData.mValor2 = detail.Valor2;
					$scope.formData.mValor3 = detail.Valor3;

					$scope.formData.mValor4 = detail.Valor4;
					$scope.formData.mEstadoParametro = {"Descripcion":detail.DescripcionEstado,"Codigo":detail.CodigoEstado};

					$scope.mFiltroAgenteEdit = {
						codigoAgente: detail.Valor1,
						codigoNombre: detail.Valor1 + '-' +detail.Descripcion
					}

					var res = detail.Valor2.split("_");

					$scope.formData.mTipoDocNew = {
						Codigo: res[0],
						Descripcion: res[0]
					};

					$scope.formData.mNroDocNew = res[1];

					if(typeof $scope.formData.mValor3 == 'undefined' || $scope.formData.mValor3 == ''){
						//$scope.formData.mValor3 = new Date();
						//$scope.formData.mValor3 = sctrEmitFactory.formatearFecha($scope.formData.mValor3);
						//console.log($scope.formData.mValor3);
					}else{
						// if($scope.formData.mValor3 instanceof Date){
						// 	$scope.formData.mValor3 = sctrEmitFactory.formatearFecha($scope.formData.mValor3);
						// }
					}

					console.log($scope.formData.mValor3);

					if($scope.formData.param.CodigoGrupo == 9){
						//Modal
						var vModal = $uibModal.open({
							backdrop: true, // background de fondo
							backdropClick: true,
							dialogFade: false,
							keyboard: true,
							scope: $scope,
							size: 'lg',
							templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-detalle-edit9.html',
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
					}else{
						//Modal
						var vModal = $uibModal.open({
							backdrop: true, // background de fondo
							backdropClick: true,
							dialogFade: false,
							keyboard: true,
							scope: $scope,
							size: 'lg',
							templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-detalle-edit.html',
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
				}


				// getDatoDocumentoAgente

				$scope.showModalNuevoDetalleEditarDatosGrupoParametros2 = function(option, index, event){
					console.log('showModalNuevoDetalleEditarDatosGrupoParametros2');
					$scope.formData.mCodGrupo = detail.CodigoGrupo;

					//Modal
					var vModal = $uibModal.open({
						backdrop: true, // background de fondo
						backdropClick: true,
						dialogFade: false,
						keyboard: true,
						scope: $scope,
						size: 'lg',
						templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-detalle-edit2.html',
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

				$scope.showModalNuevoDetalleDatosGrupoParametros = function(codigo, detail, option, index, event){
					console.log('showModalNuevoDetalleDatosGrupoParametros');

					$scope.formData.mGrupoParametro = detail;
					$scope.mFiltroAgenteEdit = '';

					$scope.formData.mCodParametro = $scope.formData.param.CodigoGrupo;//detail.CodigoGrupo;


					if($scope.formData.param.CodigoGrupo==9){

						//Modal
						var vModal = $uibModal.open({
							backdrop: true, // background de fondo
							backdropClick: true,
							dialogFade: false,
							keyboard: true,
							scope: $scope,
							size: 'lg',
							templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-detalle9.html',
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

					}else{
						//Modal
						var vModal = $uibModal.open({
							backdrop: true, // background de fondo
							backdropClick: true,
							dialogFade: false,
							keyboard: true,
							scope: $scope,
							size: 'lg',
							templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-parametros-detalle.html',
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
				}

				$scope.removeDate = function(){
					$scope.formData.mValor3 = undefined;
				}

				$scope.removeDateNew = function(){
					$scope.formData.mValor3New = undefined;
				}
			
				$scope.updateParam = function(codigo){
					console.log('updateParam');
					$scope.formData.frmMaintenanceForm.markAsPristine();


					var paramsUpdate = {};

					if($scope.formData.mValor3 instanceof Date){
						$scope.formData.mValor3 = sctrEmitFactory.formatearFecha($scope.formData.mValor3);
					}

					if(typeof $scope.formData.mValor3 == 'undefined'){
						$scope.formData.mValor3 = '';
					}

	        if($scope.formData.param.CodigoGrupo==9){

	        	var res = $scope.mFiltroAgenteEdit.codigoNombre.split('-');

	        	console.log($scope.formData.mValor3);

	        	paramsUpdate = {
						  TipoAccion: 2,
						  CodigoGrupo: $scope.formData.mCodGrupo,
						  CodigoParametro: $scope.formData.mCodParametro,
						  Descripcion: res[1],//$scope.formData.mDescripParametro, //agente
						  DesGrupo: $scope.formData.mGrupoParametro,
						  Valor1: $scope.mFiltroAgenteEdit.codigoAgente,//$scope.formData.mValor1,
						  Valor2: $scope.formData.mValor2,//$scope.formData.mValor2,
						  Valor3: $scope.formData.mValor3,//sctrEmitFactory.formatearFecha($scope.formData.mValor3),
						  Valor4: '',
						  CodigoEstado: $scope.formData.mEstadoParametro.Codigo,
						  DescripcionEstado: $scope.formData.mEstadoParametro.Descripcion
						};	

						console.log(paramsUpdate);

	         	sctrEmitFactory.grabarParametroDetalle(paramsUpdate, true).then(function(response){
		          if (response.OperationCode == constants.operationCode.success){
		            mModalAlert.showSuccess('Se actualizó el parámetro', 'Datos Actualizados');	
		            $state.reload();
		          }else{
		          	mModalAlert.showError(response.Message, 'Error');	
		          }
		        }); 

	        }else{

	        	if($scope.formData.mDescripParametro != '' && typeof $scope.formData.mDescripParametro != 'undefined'){
							paramsUpdate = {
							  TipoAccion: 2,
							  CodigoGrupo: $scope.formData.mCodGrupo,
							  CodigoParametro: $scope.formData.mCodParametro,
							  Descripcion: $scope.formData.mDescripParametro,
							  DesGrupo: $scope.formData.mGrupoParametro,
							  Valor1: $scope.formData.mValor1,
							  Valor2: $scope.formData.mValor2,
							  Valor3: $scope.formData.mValor3,//sctrEmitFactory.formatearFecha($scope.formData.mValor3),
							  Valor4: $scope.formData.mValor4,
							  CodigoEstado: $scope.formData.mEstadoParametro.Codigo,
							  DescripcionEstado: $scope.formData.mEstadoParametro.Descripcion
							};	

							console.log(paramsUpdate);

			        sctrEmitFactory.grabarParametroDetalle(paramsUpdate, true).then(function(response){
			          if (response.OperationCode == constants.operationCode.success){
			            mModalAlert.showSuccess('Se actualizó el parámetro', 'Datos Actualizados');	
			            $state.reload();
			          }else{
			          	mModalAlert.showError(response.Message, 'Error');	
			          }
			        });
	        	}
         
	        }
	       
				}

				$scope.grabarParam = function(codigo){
					console.log('grabarParam');
					var paramsNew = {};					

					$scope.formData.frmMaintenanceForm.markAsPristine();

					if(typeof $scope.formData.mValor3New == 'undefined'){
						$scope.formData.mValor3New = '';
					}

					if($scope.formData.param.CodigoGrupo == 9){

						if(typeof $scope.mFiltroAgenteEdit != 'undefined' && $scope.mFiltroAgenteEdit != ''){
							if($scope.formData.mValor3New instanceof Date){
								$scope.formData.mValor3New = sctrEmitFactory.formatearFecha($scope.formData.mValor3New);
							}

							var res = $scope.mFiltroAgenteEdit.codigoNombre.split('-');

							paramsNew = {
							  TipoAccion: 1,
							  CodigoGrupo: $scope.formData.mCodParametro, //$scope.formData.mCodGrupo
							  CodigoParametro: 0,
							  Descripcion: res[1],//$scope.formData.mDescripParametroNew,
							  DesGrupo: $scope.formData.mGrupoParametro,
							  Valor1: $scope.mFiltroAgenteEdit.codigoAgente,//$scope.formData.mValor1New,
							  Valor2: $scope.formData.mValor1New,
							  Valor3: $scope.formData.mValor3New,//sctrEmitFactory.formatearFecha($scope.formData.mValor3New),
							  Valor4: '',
							  CodigoEstado: $scope.formData.mEstadoParametroNew.Codigo,
							  DescripcionEstado: $scope.formData.mEstadoParametroNew.Descripcion
							};
						

							console.log(paramsNew);

						 	sctrEmitFactory.grabarParametroDetalle(paramsNew, true).then(function(response){
			          if (response.OperationCode == constants.operationCode.success){
			            mModalAlert.showSuccess('Se ha creado el parámetro', 'Datos Registrados');
			            $state.reload();	
			          }else{
			          	mModalAlert.showError(response.Message, 'Error');	
			          }
			        });						
	         }
					}else{

						if(typeof $scope.formData.mDescripParametroNew != 'undefined' && $scope.mDescripParametroNew != ''){
				
							if($scope.formData.mValor3New instanceof Date){
								$scope.formData.mValor3New = sctrEmitFactory.formatearFecha($scope.formData.mValor3New);
							}

							paramsNew = {
							  TipoAccion: 1,
							  CodigoGrupo: $scope.formData.mCodParametro,//$scope.formData.mGrupoParametro,
							  CodigoParametro: 0,//$scope.formData.mCodParametro,
							  Descripcion: codigo,
							  DesGrupo: $scope.formData.mGrupoParametro,
							  Valor1: $scope.formData.mValor1New,
							  Valor2: $scope.formData.mValor2New,
							  Valor3: $scope.formData.mValor3New,//sctrEmitFactory.formatearFecha($scope.formData.mValor3New),
							  Valor4: $scope.formData.mValor4New,
							  CodigoEstado: $scope.formData.mEstadoParametroNew.Codigo,
							  DescripcionEstado: $scope.formData.mEstadoParametroNew.Descripcion
							};

							console.log(paramsNew);

							sctrEmitFactory.grabarParametroDetalle(paramsNew, true).then(function(response){
				          if (response.OperationCode == constants.operationCode.success){
				            mModalAlert.showSuccess('Se ha creado el parámetro', 'Datos Registrados');	
				            $state.reload();
				          }else{
				          	mModalAlert.showError(response.Message, 'Error');	
				          }
				        });
						}
					}

				}

		}])

	});
