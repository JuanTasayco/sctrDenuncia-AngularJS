(function($root, deps, action) {
  define(deps, action)
})(this,
  ['angular', 'constants',
  '/polizas/app/autos/autosCotizar2/service/autosCotizarFactory.js',
  '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
  '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js'],

  function(angular, constants) {
    angular
    	.module("appAutos")
    		.controller('autosCotizarS1', ['$scope', 'autosCotizarFactory', '$state', 'mpSpin', '$timeout', 'mModalAlert', '$stateParams', '$rootScope', '$q', '$http',
    		function($scope, autosCotizarFactory, $state, mpSpin, $timeout, mModalAlert, $stateParams, $rootScope, $q, $http) {

    			var vm = this;
    			vm.$onInit = onInit;

				function onInit() {
					$scope.formData = $rootScope.formData || {};
					disableNextStep();
					$scope.gLblTipoVehiculo = {
						label:'Tipo de vehículo',
						required: true,
						error1: '* Este campo es obligatorio',
						defaultValue: '- SELECCIONE -'
					};

          if ($rootScope.dataFromInspec) {
            var quotationData = $rootScope.dataFromInspec;

            $scope.formData.mTipoVehiculo = {
              CodigoTipo: quotationData.Vehiculo.CodigoTipoVehiculo,
              NombreTipo: quotationData.Vehiculo.NombreTipoVehiculo
            };
            $scope.loadMarca()
            $scope.formData.ModeloMarca = {
              codigoMarca: quotationData.Vehiculo.CodigoMarca,
              codigoModelo: quotationData.Vehiculo.CodigoModelo,
              marcaModelo: quotationData.Vehiculo.NombreMarca + " " + quotationData.Vehiculo.NombreModelo,
              nombreMarca: quotationData.Vehiculo.NombreMarca,
              nombreModelo: quotationData.Vehiculo.NombreModelo
            };
            $scope.getFunctionsModeloMarca($scope.formData.ModeloMarca);
            $scope.formData.Ubigeo = {
              mDepartamento: { Codigo: quotationData.Vehiculo.Ubigeo.CodigoDepartamento },
              mProvincia: { Codigo: quotationData.Vehiculo.Ubigeo.CodigoProvincia },
              mDistrito: { Codigo: quotationData.Vehiculo.Ubigeo.CodigoDistrito }
            };
          }

					if ($stateParams.token) {
						autosCotizarFactory.getDatosAutoCCCPorToken($stateParams.token).then(function (response) {
							if (response.OperationCode === constants.operationCode.success && Object.keys(response.Data).length !== 0) {
								$scope.dataFromCCC = response.Data;

								$scope.formData.mTipoVehiculo = {
									CodigoTipo: response.Data.Vehiculo.CodigoTipoVehiculo,
									NombreTipo: response.Data.Vehiculo.NombreTipoVehiculo
								};

								$scope.loadMarca();

								$scope.formData.ModeloMarca = {
									codigoMarca: response.Data.Vehiculo.CodigoMarca,
									codigoModelo: response.Data.Vehiculo.CodigoModelo,
									marcaModelo: response.Data.Vehiculo.MarcaModelo,
									nombreMarca: response.Data.Vehiculo.NombreMarca,
									nombreModelo: response.Data.Vehiculo.NombreModelo
								};
								
								$scope.getFunctionsModeloMarca($scope.formData.ModeloMarca);
							} else {
								mModalAlert.showWarning(response.Message, 'Error').then(function(res){
									$state.go('emisa');
								});
				}
						}).catch(function (err) {
							mModalAlert.showError(err.data.message, 'Error').then(function(res){
								$state.go('emisa');
							});
						});
					}

				}

				function disableNextStep() {
					$scope.formData.secondStepNextStep = false;
					$scope.formData.thirdStepNextStep = false;

					autosCotizarFactory.getTipoVehiculo().then(function(response) {
						if (response.OperationCode == constants.operationCode.success) {
							$scope.tipoVehiculo = response.Data;
						}
					});
				}

				$scope.$on('changingStep', function(ib,e) {
					if (angular.isUndefined($scope.formData.secondStepNextStep)) $scope.formData.secondStepNextStep = false;
						if (e.step < 2) {
							e.cancel = false;
						}
						else {
							$scope.formData.validatedPaso1 = $scope.frmPoliData.$valid ? true : false;
						if ($scope.formData.validatedPaso1 && !validateUbigeo() && ($scope.formData.mSubModelo && $scope.formData.mSubModelo.Codigo)) {
							e.cancel = false;
							validarAutoNuevo($scope.formData.mYearFabric.Codigo, $scope.formData.edoVehiculo);
							$scope.formData.Ubigeo = $scope.data;
						}else{
							e.cancel = true;
							disableNextStep();
						}
					}
				});

				$scope.$watch('formData', function(nv){
					$rootScope.formData =  nv;
				})

				if (angular.isUndefined($scope.formData.importeMapfreDolar)) {
					$scope.formData.importeMapfreDolar = 0;
				}

				if (angular.isUndefined($scope.formData.valorVehiculo)) {
					$scope.formData.valorVehiculo = 0;
					$scope.formData.valorVehiculoMin = 0;
					$scope.formData.valorVehiculoMax = 0;
				}

				$scope.formData.DocumentosAsociados = [];
				/*auto complete */
				$scope.loading = false;
				//UBIGEO
				$scope.data = $scope.formData.Ubigeo || {};
				$scope.ubigeoValid = $scope.ubigeoValid || {};

				$scope.$watch('setter', function() {
					$scope.setterUbigeo = $scope.setter;
					if($scope.setterUbigeo && $scope.formData.Ubigeo && $scope.formData.Ubigeo.mDepartamento){
						$scope.setterUbigeo(
							$scope.formData.Ubigeo.mDepartamento.Codigo,
							$scope.formData.Ubigeo.mProvincia.Codigo,
							$scope.formData.Ubigeo.mDistrito.Codigo)
					}
				})
				$scope.$watch('clean', function() {
					$scope.cleanUbigeo = $scope.clean;
				})

				$scope.gLblMarcaModelo = {
					label: 'Marca-Modelo',
					required: true,
					error1: 'Error lorem ipsum error lorem ipsum'
				};
				$scope.gLblSubModelo = {
					label:'Submodelo',
					required: true,
					error1: '* Este campo es obligatorio',
					defaultValue: '- SELECCIONE -'
				};
				$scope.gLblYearFabric = {
					label:'Año de Fabricación',
					required: true,
					error1: '* Este campo es obligatorio',
					defaultValue: '- SELECCIONE -'
				};

				$scope.gLblNuevo = {
					label: 'Nuevo',
					required: true,
					error1: '* Este campo es obligatorio'
				};
				$scope.gLblUsado = {
					label: 'Usado',
					required: true,
					error1: '* Este campo es obligatorio'
				};

				$scope.nuevo =
				{
					name: 'formData.optRadio',
					value: '1'
				};
				$scope.usado =
				{
					name: 'formData.optRadio',
					value: '2'
				};

				$scope.valorVehiculo = {
					label: 'Ingresa valor del auto',
					validate: 'validate[required,custom[number]]',
					disabled: false,
					valorMin:'0.00',
					valorMax:'0.00'
				};

				$scope.searchMarcaModelo = function(wilcar) {
					if (wilcar && wilcar.length>=3) {

						//cargamos las marcas y modelos
						var paramMarcaModelo = {
							CodigoTipo: $scope.formData.mTipoVehiculo.CodigoTipo,
							Texto : wilcar.toUpperCase()
						}

						return autosCotizarFactory.getMarcaModelo(paramMarcaModelo);
					}
				};

				$scope.getFunctionsModeloMarca = function(val) {//setear campos
					if (val.codigoMarca == null) {
						delete $scope.formData.ModeloMarca;
						delete $scope.formData.mSubModelo;
						delete $scope.formData.mYearFabric;
						$scope.formData.yearSelected = false;
					}
					else{
						delete $scope.formData.mSubModelo;
						delete $scope.formData.mYearFabric;
						$scope.formData.yearSelected = false;
						$scope.marcaModeloSelected = true;
						$scope.formData.ModeloMarca = val;
						$scope.formData.NombreTipo = '';
						$scope.formData.Tipo = '';
						$scope.formData.observaciones = '';

						$scope.formData.valorVehiculo = 0;
						$scope.formData.valorVehiculoMin = 0;
						$scope.formData.valorVehiculoMax = 0;

						loadSubModelo($scope.formData.mTipoVehiculo.CodigoTipo, $scope.formData.ModeloMarca.codigoMarca, $scope.formData.ModeloMarca.codigoModelo);
					}
				};

				// SubModelo

				if ($scope.formData.ModeloMarca!=null) {
					loadSubModelo($scope.formData.mTipoVehiculo.CodigoTipo, $scope.formData.ModeloMarca.codigoMarca, $scope.formData.ModeloMarca.codigoModelo);
				}


				function loadSubModelo(codTipoVehiculo, codMarca, codModelo) {

					var paramSubModelo = '/'  +  codTipoVehiculo + '/' + codMarca + '/' + codModelo;

					autosCotizarFactory.getSubmodelo(paramSubModelo).then(function(response) {
						if (response.OperationCode == constants.operationCode.success) {
							if (response.Data) {
								$scope.submodelos = response.Data;
								$scope.sinSubmodelo=false;
								if ($scope.submodelos.length==0) {
									$scope.sinSubmodelo=true;
									mModalAlert.showError("El vehiculo ingresado no esta configurado para cotizar", "Error");
								}else{
									$scope.formData.mSubModelo = $scope.submodelos[0];
									getFunctionsSubModelo($scope.submodelos[0]);
								}
							}
						}
						else if (response.Message.length > 0) {
							$scope.sinSubmodelo=true;
						}
					}).catch(function(error) {
						console.log('Error en getSubmodelo: ' + error);
					});
				}

				function getFunctionsSubModelo(val) {
					if (!(typeof val == 'undefined')) {
						if (val.Codigo == null) {
							delete $scope.formData.mYearFabric;
							$scope.formData.yearSelected = false;
						}
						else{
							$scope.formData.yearSelected = false;
							$scope.formData.usoSelected = false;

							$scope.formData.subModeloSelected = true;

							$scope.formData.NombreTipo = val.NombreTipo;
							$scope.formData.Tipo = val.Tipo;

							loadYearFabric(
										$scope.formData.ModeloMarca.codigoMarca,
										$scope.formData.ModeloMarca.codigoModelo,
										$scope.formData.mSubModelo.Codigo
										);
						}
					}
				}

				// AñoFabricacion
				function loadYearFabric(codMarca, codModelo, codSubModelo) {
					var vParams = codMarca + '/' + codModelo + '/' + codSubModelo;

					autosCotizarFactory.getYearFabric(vParams).then(function(response) {
						if (response.OperationCode == constants.operationCode.success) {
							$scope.formData.yearsFabric = response.Data;
							$scope.sinAnio=false;
              if ($rootScope.dataFromInspec) {
                $scope.formData.mYearFabric = {
                  Codigo: $rootScope.dataFromInspec.Vehiculo.AnioFabricacion,
                  Descripcion: $rootScope.dataFromInspec.Vehiculo.AnioFabricacion
                }
                $scope.getFuctionsYearFabric($scope.formData.mYearFabric);
              }

			  		if($scope.dataFromCCC && $stateParams.token) {
						$scope.formData.mYearFabric = {
							Codigo: $scope.dataFromCCC.Vehiculo.AnioFabricacion,
							Descripcion: $scope.dataFromCCC.Vehiculo.AnioFabricacion
						}
						$scope.getFuctionsYearFabric($scope.formData.mYearFabric);
					}

						if ($scope.formData.yearsFabric.length==0) {$scope.sinAnio=true;}
						}
						else if (response.Message.length > 0) {
							$scope.sinAnio=true;
						}
					}).catch(function(error) {
						console.log('Error en getYearFabric: ' + error);
					});
				}

				$scope.resetProducto = function(value) {
					delete $scope.formData.mProducto;
					if (value == 1) {
						$scope.formData.noLoad = false;
					}
					else {
						$scope.formData.noLoad = true;
					}
				};

				$scope.getFuctionsYearFabric = function(val) {
					delete $scope.formData.mProducto;
					$scope.formData.noLoad = false;
					if (val!=null || !(typeof val == 'undefined')) {
						if (val.Codigo == null) {
						$scope.formData.yearSelected = false;
						}
						else{
						$scope.formData.yearSelected = true;
						if ($scope.formData.mSubModelo && $scope.formData.mSubModelo.Codigo) {
							setearEstadoVehiculo();

							loadValorSugerido($scope.formData.ModeloMarca.codigoMarca,
											$scope.formData.ModeloMarca.codigoModelo,
											$scope.formData.mSubModelo.Codigo,
											$scope.formData.mTipoVehiculo.CodigoTipo,
											$scope.formData.mYearFabric.Codigo);

							showObservacion($scope.formData.ModeloMarca.codigoMarca,
											$scope.formData.ModeloMarca.codigoModelo,
											$scope.formData.mSubModelo.Codigo,
											$scope.formData.mYearFabric.Codigo);
						}
						}
					}else{
						$scope.formData.yearSelected = false;
					}
				};

				// Verificamos si el auto es o no nuevo
				function setearEstadoVehiculo() {
					var fecha = new Date();
					var ano = fecha.getFullYear();
					if ($scope.formData.mYearFabric != null) {
						//AnioFabricacion
						if ((ano - $scope.formData.mYearFabric.Codigo) < 2) {
							$scope.edoVehiculoNew=true;
							$scope.formData.optRadio = 1;
							$scope.formData.selectUsado = false;
						}else{
							$scope.formData.mcaNuevo = 'N';
							$scope.edoVehiculoNew=false;
							$scope.formData.selectUsado = true;
							$scope.formData.optRadio = 2;
						}
					}
				}

				// Observaciones
				function showObservacion(codMarca, codModelo, codSubModelo, anioFabricacion) {
					var vParams = codMarca + '/' + codModelo + '/' + codSubModelo + '/' + anioFabricacion;
					var vObservacion = '';

					autosCotizarFactory.getObservacion(vParams).then(function(response) {
						if (response.OperationCode == constants.operationCode.success) {
							$scope.formData.MCAREQUIEREGPS = response.Data;

							if (response.Data=='S') {
								vObservacion = 'Si requiere GPS';
							}
							else{
								vObservacion = 'No requiere GPS';
							}

							$scope.formData.observaciones = vObservacion;
							$scope.observaciones = vObservacion;
						}
						else if (response.Message.length > 0) {
							$scope.observaciones = vObservacion;
						}
					}).catch(function(error) {
						console.log('Error en getObservacion: ' + error);
					});
				}

				// Valor Sugerido
				function loadValorSugerido(codMarca, codModelo, codSubModelo , tipoVehiculo, anioFabricacion) {  // TODO: revisar
					var vParams =  '/' + codMarca + '/' + codModelo + '/' + codSubModelo + '/' + tipoVehiculo + '/' + anioFabricacion;

					autosCotizarFactory.getValorVehiculo(vParams).then(function(response) {
						if (response.OperationCode == constants.operationCode.success) {
							$scope.formData.valorVehiculo = response.Data.Valor;
							$scope.formData.valorVehiculoMin = response.Data.Minimo;
							$scope.formData.valorVehiculoMax = response.Data.Maximo;
						}
					}).catch(function(error) {
						console.log('Error en loadValorSugerido: ' + error);
					});
				}

				$scope.irAVariacionRiesgo = function() {
					$rootScope.formData = $scope.formData;
					$state.go('variacionRiesgo', {infoRiesgo:$scope.formData});
				}

				$scope.guardarPaso1 = function(optRadio) {

					if($scope.formData.valorVehiculo < $scope.formData.valorVehiculoMin || 
						$scope.formData.valorVehiculo > $scope.formData.valorVehiculoMax){

						mModalAlert.showError("Valor del vehículo cuando no se encuentre dentro del rango ("+ 
						$scope.formData.valorVehiculoMin + 
						" y " +
						$scope.formData.valorVehiculoMax +
						")", "Error");
						
						return;
					}

					$scope.formData.edoVehiculo = optRadio;
					$scope.formData.validatedPaso1 = false;

					$scope.frmPoliData.markAsPristine();
          $scope.formData.validatedPaso1  = $scope.frmPoliData.$valid & $scope.ubigeoValid.func();
					if ($scope.formData.mYearFabric){
						validarAutoNuevo($scope.formData.mYearFabric.Codigo, $scope.formData.edoVehiculo);
					}

					$scope.formData.Ubigeo = $scope.data;

					$timeout(function(){
						$scope.formData.validatedPaso1 = $scope.frmPoliData.$valid ? true : false;
							if ($scope.formData.validatedPaso1 && !validateUbigeo()  && ($scope.formData.mSubModelo && $scope.formData.mSubModelo.Codigo)) {
								if ($scope.mAgente.codigoAgente != '0') {
									$state.go('.', {
									  step: 2,

									});
								}
								else{
									mModalAlert.showError("No tiene un agente seleccionado", "Error");
								}
							}
						})

				}

				function validateUbigeo() {
					if ($scope.data.mDepartamento == null || $scope.data.mDepartamento.selectedEmpty ||
					$scope.data.mProvincia == null || $scope.data.mProvincia.selectedEmpty ||
					$scope.data.mDistrito == null || $scope.data.mDistrito.selectedEmpty) {
						$scope.ubigeoError = true;
						return true;
					}
					else{
						$scope.ubigeoError = false;
						return false;
					}
				}

				function validarAutoNuevo(yearFabric,optRadio) {
					if (optRadio == 1) {
						$scope.formData.mcaNuevo = 'S';
						$scope.formData.noLoad = false;
					}
					else {
            $scope.formData.noLoad = optRadio === 2;
						$scope.formData.mcaNuevo = 'N';
					}
					$scope.formData.mcaNuevoBkp = $scope.formData.mcaNuevo;
				}

				$scope.loadMarca = function() {
					if ($scope.formData.mTipoVehiculo){
						($scope.formData.mTipoVehiculo.CodigoTipo) ? $scope.formData.mTipoVehiculo.CodigoTipo : 0;
					}
					else{
						$scope.formData.mTipoVehiculo = undefined;

						delete $scope.formData.ModeloMarca;
						delete $scope.formData.mSubModelo;
						delete $scope.formData.mYearFabric;
						$scope.formData.yearSelected = false;

						$scope.formData.observaciones = '';

						$scope.formData.valorVehiculo = 0;
						$scope.formData.valorVehiculoMin = 0;
						$scope.formData.valorVehiculoMax = 0;
					}
				}

		}])
});
