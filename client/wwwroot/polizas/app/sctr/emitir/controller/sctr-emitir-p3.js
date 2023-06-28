(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper', 'lodash'],
	function(angular, constants, helper, _){
		var sctrStates = {
			creado: {
				code:"RE",
				descripcion:"Creador",
				active:'A'
			},
			solicitarCotizacion: {
				code:"SC",
				descripcion:"SOLICITAR COTIZACION",
				active:'A'
			},
			reajusteTasa: {
				code:"ST",
				descripcion:"Reajuste de tasa",
				active:'A'
			},
			devoler: {
				code:"DS",
				descripcion:"Devolver a Agente",
				active:'A'
			},
			aceptarSolicitud:{
				code:'AS',
				descripcion:"Aceptar Solicitud",
				active:'S'
			}

		}
		var appAutos = angular.module('appAutos');
    appAutos.directive("contenteditable", function() {
		  return {
		    restrict: "A",
		    require: "ngModel",
		    link: function(scope, element, attrs, ngModel) {

		      function read() {
		        ngModel.$setViewValue(element.html());
		      }

		      ngModel.$render = function() {
		        element.html(ngModel.$viewValue || "");
		      };

		      element.bind("blur keyup change", function() {
		        scope.$apply(read);
		      });
		    }
		  };
		});

		appAutos.controller('sctrEmitirS3Controller',
			['$scope', '$window', 'proxySctr', 'mpSpin', '$q', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', 'mModalAlert', 'mModalConfirm', '$uibModal', 'fileUpload', '$stateParams', '$sce', 'oimClaims', 'mainServices',
			function($scope, $window, proxySctr, mpSpin, $q, $state, $timeout, $rootScope, sctrEmitFactory, mModalAlert, mModalConfirm, $uibModal, fileUpload, $stateParams, $sce, oimClaims, mainServices){
        $scope.sctrStates = sctrStates;

		 /* BEGIN GIANCARLO: INITIAL DATA */
		function initalData(){
			var promises = [];
			promises.push(loadSueldoMinimo());
			promises.push(loadEmail());
			if ($scope.formData.tipoSCTR === constants.module.polizas.sctr.periodoCorto.TipoPeriodo) {
				promises.push(loadTasasPaso3PC());
			}
			promises.push(getPrimaMinima(true));
			promises.push(listarMensajes());
			return $q.all(promises);
		}
		function runIntoPromise(action){
			var defferd = $q.defer();
			if (angular.isFunction(action))
				action(defferd);
			return defferd.promise;
		}
		/*#########################
    # Comentarios
    #########################*/
		function listarMensajes(){
			return runIntoPromise(function(deffer){
				if (!$scope.formData.pNormal) deffer.resolve({});
				if (!$scope.formData.NroSolicitud) return $q.resolve({})
				sctrEmitFactory.listarMensajes($scope.formData.NroSolicitud, true).then(function(response){
					if (response.OperationCode === constants.operationCode.success){
						$scope.formData.mensajes = response.Data;
						$rootScope.chatNumber = $scope.formData.mensajes.length;
					}
					deffer.resolve(response);
				}, function(response){
					deffer.reject(response);
				});
			})
		}
		function loadSueldoMinimo(){
			return runIntoPromise(function(deffer){
				sctrEmitFactory.getSueldoMinimo(false).then(function(response){
					if (response.OperationCode === constants.operationCode.success){
						$scope.formData.sueldoMinimo = response.Data;
					}
					deffer.resolve(response);
				}, function(response){
					deffer.reject(response);
				});
			})
		}
		function loadEmail(){
			runIntoPromise(function(deffer){
				if(typeof $scope.formData.mAgente !== 'undefined'){
					sctrEmitFactory.getSuscriptorByIdAgent($scope.formData.mAgente.codigoAgente).then(function(response){
					 if(response.OperationCode === constants.operationCode.success){
						 $scope.formData.suscriptorData = response.Data;
						 $scope.formData.suscriptorEmail =  $scope.formData.suscriptorData.Correo;
						// console.log($scope.formData.suscriptorEmail);
					 }
					 deffer.resolve(response);
				 }, function(error){
					deffer.reject(response);
				 });
				}
			});
		}

		function loadTasasPaso3PC(){
			var	fdata = $scope.formData;
			if(fdata.mActEco){
				var isLarge = constants.module.polizas.sctr.periodoCorto.TipoPeriodo !== $stateParams.tipo;

				var brequest = {
						TipoPeriodo: $stateParams.tipo,
						Ciiu: fdata.mActEco.CodigoCiiuEmp,
						CodigoAgente: fdata.mAgente.codigoAgente
					}
					brequest.Ramos = [{
						CodigoRamo: constants.module.polizas.sctr.pension.CodigoRamo,
						SueldoMedio: isLarge ? fdata.mImportePlanillaPension/ fdata.mNroTrabajadores:0,
						CantidadTrabajador: isLarge ? fdata.mNroTrabajadores : 0
					},{
						CodigoRamo: constants.module.polizas.sctr.salud.CodigoRamo,
						SueldoMedio: isLarge ? fdata.mImportePlanillaSalud / fdata.mNroTrabajadores:0,
						CantidadTrabajador: isLarge ? fdata.mNroTrabajadores:0
				}];


				var value = findTax(brequest)
			  var promise = !value ? proxySctr.CalcularPrima(brequest, true) : $q.resolve(value);

				var defer = $q.defer();
				promise.then(function(response){
					if (!value){
						value = response.Data;
					}
					if(value.length>1){
						$scope.formData.mTasaPension = (value[0].CodigoRamo === constants.module.polizas.sctr.pension.CodigoRamo) ? value[0].Tasa : value[1].Tasa;
						$scope.formData.mTasaSalud = (value[0].CodigoRamo === constants.module.polizas.sctr.salud.CodigoRamo) ? value[0].Tasa : value[1].Tasa;
					}else{
						$scope.formData.mTasaPension = (value[0].CodigoRamo === constants.module.polizas.sctr.pension.CodigoRamo) ? value[0].Tasa : '';
						$scope.formData.mTasaSalud = (value[0].CodigoRamo === constants.module.polizas.sctr.salud.CodigoRamo) ? value[0].Tasa : '';
					}
					defer.resolve(value)
				}, function(response){
					defer.reject(response)
				});
				return defer.promise;
			}else{
				$state.go('.',{
	          step: 1
	        });
			}
		}

		/*#########################
	    # Prima Minima
	    #########################*/
			function getPrimaMinimaByRamo(codigoCompania, codigoRamo, nameProperty){
				return runIntoPromise(function(deffer){
					var paramsPrimaMin = {
						codCia: codigoCompania,
						codRamo: codigoRamo,
						codMoneda: 1//puede variar
					};

					var promise = sctrEmitFactory.getPrimaMinima(paramsPrimaMin).then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.formData[nameProperty] = response.Data;
						}
						deffer.resolve(response);
					}, function(response){deffer.reject(response);});
				});
			}
			function getPrimaMinima(showSpin){
				var promises = [];

				if($scope.formData.salud){
					promises.push(getPrimaMinimaByRamo(
						constants.module.polizas.sctr.salud.CodigoCompania,
						constants.module.polizas.sctr.salud.CodigoRamo,
						"primaMinSalud"
					));
				}
				if($scope.formData.pension){
					promises.push(getPrimaMinimaByRamo(
						constants.module.polizas.sctr.pension.CodigoCompania,
						constants.module.polizas.sctr.pension.CodigoRamo,
						"primaMinPension"
					));
				}
				return $q.all(promises);
	    }
		/* END GIANCARLO: INITIAL DATA */
      (function onLoad(){

      	proxySctr.ValidarAgente().then(function(response){
        if(response.Data && response.Data.Bloqueado === 1){
          $state.go('sctrHome');
        }else{
	        $scope.formData = $scope.formData || {};
			console.log("$scope.formData.chatNumber: " + $rootScope.chatNumber);
	         if(typeof $scope.formData === 'undefined'){
						 $scope.formData.permitir = true;
	        	 $state.go('.',{
			          step: 1
			        });
	        }

	        if($scope.formData.agenteBloqueado){
              $state.go('sctrHome');
            }

	        function setRole(){
						if (angular.isArray($state.current.submenu)){
							$scope.formData.onlyRole = $state.current.submenu.length === 1
							$scope.roles = [];
							angular.forEach($state.current.submenu, function(submenu){
								$scope.roles.push({
									descripcion: submenu.nombreLargo,
									codigo: helper.searchQuery('ROL', submenu.ruta)
								});
							});

							if($scope.roles[0].codigo == null){
	              $scope.roles = [];
	              angular.forEach($state.current.submenu, function(submenu){
	                $scope.roles.push({
	                  descripcion: submenu.nombreLargo,
	                  codigo: helper.searchQuery('Rol', submenu.ruta)
	                });
	              });
	            }

							if ($scope.formData.onlyRole){
								$scope.formData.mRole = $scope.roles[0];
								$scope.formData.TipoRol = $scope.formData.mRole.codigo;
							}else{
								$scope.formData.TipoRol = $scope.roles[0].codigo;
							}

						}
					}

					$scope.adjURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/mensaje/archivo');

					if(typeof $scope.formData.TipoRol === 'undefined'){
						setRole();
					}else{
						$scope.formData.sinTasasAgt = false;
					}

					if(typeof $rootScope.formData === 'undefined' && $scope.formData.TipoRol !== 'SUS' && $stateParams.quotation<0){
	        	 $scope.formData.permitir = true;
	        	 $state.go('.',{
			          step: 1
			        });
	        }

	        console.log($scope.formData.TipoRol);
	        if($scope.formData.TipoRol === 'AGT'|| $scope.formData.TipoRol === 'EAC' || $scope.formData.TipoRol === 'GST'){
	        	$scope.formData.esAgente = true;
	        	$scope.formData.esAdmin = false;
	        	$scope.formData.esAdminSus = false;
	        	$scope.formData.conTasas = true;
	        	$scope.formData.esCliente = false;
	        }else if($scope.formData.TipoRol === 'ADM'){
	        	$scope.formData.esAgente = false;
	        	$scope.formData.esAdmin = true;
	        	$scope.formData.esAdminSus = true;
	        	$scope.formData.SolEnviada = false;
	        	$scope.formData.tasasEnviadas = false;
	        	$scope.formData.conTasas = false;
	        	$scope.formData.esCliente = false;
	        }else if($scope.formData.TipoRol === 'SUS'){
	        	$scope.formData.esAgente = false;
	        	$scope.formData.esAdminSus = true;
	        	$scope.formData.conTasas = false;
	        	$scope.formData.esCliente = false;
	        	$scope.formData.esAdmin = false;
	        }else if($scope.formData.TipoRol === 'CLI'){
						$scope.formData.esCliente = true;
						$scope.formData.esAgente = false;
	          $scope.formData.esAdminSus = false;
	          $scope.formData.esAdmin = false;
	        }

	        $scope.formData.mensajes = [];
	        $scope.formData.mMoneda = 1;
	        $scope.formData.quotation = $stateParams.quotation;
	        $scope.formData.tipoSCTR = $stateParams.tipo;

	        if($scope.formData.tipoSCTR === constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
						$scope.formData.pNormal = false;
						$scope.formData.tasaPC = true;
					}else{
						$scope.formData.pNormal = true;
					}

					if(($scope.formData.CodigoEstado === 'RE' || typeof $scope.formData.CodigoEstado == 'undefined')&& $scope.formData.pNormal){
	        	$scope.formData.agenteSinTasa = true;
	        	$scope.formData.estadoSolicitudAgente = 'Enviar para aprobación.';
	        	$scope.formData.tasasPN = false;
	        }else if($scope.formData.CodigoEstado === 'RE'){
	        	//if(!$scope.formData.pNormal){$scope.formData.tasaPC = true;}
	        }

	        if($scope.formData.pNormal && !$scope.formData.tasasPN){
	        	$scope.formData.estadoSolicitudAgente = 'Enviar para aprobación.';
	        }
	        $scope.tasasAceptadas = true;

	        if($scope.formData.quotation > 0){
						cargarPaso2().then(function(){
							onloaded();
						});
					}
					else{
						onloaded();
					}

	        if($scope.formData.paso2Grabado || $scope.formData.TipoRol == 'SUS'){
						disableNextStep();
			     }else{
			        $state.go('.',{
			          step: 2
			        });
			     }
					$scope.formData.pNormal = !($scope.formData.tipoSCTR === constants.module.polizas.sctr.periodoCorto.TipoPeriodo);
					$scope.formData.estadoRE = false;
					$scope.formData.estadoSC = false;
					$scope.formData.estadoST = false;
				}
      }, function(response){
        //defer.reject(response);
      });

      })();
			function onloaded(){
				mpSpin.start();
				initalData().
				then(function(){
					if((!(typeof $scope.formData.mActEco == 'undefined'))){
							if($scope.formData.pNormal && $scope.formData.TipoRol != 'AGT'){
								if ((typeof $scope.formData.paso2 != 'undefined')){
									if ((typeof $scope.formData.paso2.FactorPension != 'undefined') ||
										(typeof $scope.formData.paso2.FactorSalud != 'undefined')){
											if($scope.formData.CodigoEstado != 'RE' && $scope.formData.CodigoEstado != 'SC' && typeof $scope.formData.CodigoEstado != 'undefined'){$scope.formData.tasasPN = true;}
										if ((typeof $scope.formData.paso2.FactorPension != 'undefined') ){
											$scope.formData.tasaPC = {
												Valor2: $scope.formData.paso2.FactorPension
											}
										}
										if ((typeof $scope.formData.paso2.FactorSalud != 'undefined') ){
											$scope.formData.tasaPC = {
												Valor2: $scope.formData.paso2.FactorSalud
											}
										}
									}
								}
							}
					}

					if(($scope.formData.TipoRol == 'AGT' || $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST') && $scope.formData.CodigoEstado != 'RE' && $scope.formData.CodigoEstado != 'SC' && typeof $scope.formData.CodigoEstado != 'undefined'){
						$scope.formData.tasasPN = true;
					}
						sctrEmitFactory.getFactor(constants.module.polizas.sctr.codigoGrupo, false).then(function(response){

							$scope.formData.primaTotalSalud = 0;
							$scope.formData.primaNetaSalud = 0;
							$scope.formData.factorSalud = 0;
							$scope.formData.subTotalSalud = 0;
							$scope.formData.primaTotalPension = 0;
							$scope.formData.primaNetaPension = 0;
							$scope.formData.factorPension = 0;
							$scope.formData.subTotalPension = 0;

							if (response.OperationCode == constants.operationCode.success){
								$scope.formData.factor = response.Data;
								$scope.formData.factorPension = $scope.formData.factor[0].Valor1;
								$scope.formData.factorSalud = $scope.formData.factor[1].Valor1;
								if((!(typeof $scope.formData.mNroTrabajadores == 'undefined'))
										&& (!(typeof $scope.formData.mImportePlanillaSalud == 'undefined')
										|| !(typeof $scope.formData.mImportePlanillaPension == 'undefined'))
										//&& (typeof $scope.formData.tasaPC != 'undefined')
										){
										if($scope.formData.pension && !(typeof $scope.formData.mImportePlanillaPension == 'undefined')){//parseFloat(data.MapfreDolars).toFixed(2);
											$scope.formData.subTotalPension = CalcularPrimaMinimaTotal(($scope.formData.mImportePlanillaPension * $scope.formData.mTasaPension)/100);
											$scope.formData.primaNetaPension = ($scope.formData.subTotalPension < CalcularPrimaMinimaTotal($scope.formData.primaMinPension)) ? CalcularPrimaMinimaTotal($scope.formData.primaMinPension) : $scope.formData.subTotalPension;
											$scope.formData.primaTotalPension = ($scope.formData.primaNetaPension * $scope.formData.factorPension).toFixed(2);
										}
										if($scope.formData.salud && !(typeof $scope.formData.mImportePlanillaSalud == 'undefined')){
											$scope.formData.subTotalSalud = CalcularPrimaMinimaTotal(($scope.formData.mImportePlanillaSalud * $scope.formData.mTasaSalud)/100);
											$scope.formData.primaNetaSalud = ($scope.formData.subTotalSalud < CalcularPrimaMinimaTotal($scope.formData.primaMinSalud)) ? CalcularPrimaMinimaTotal($scope.formData.primaMinSalud) : $scope.formData.subTotalSalud;
											$scope.formData.primaTotalSalud = ($scope.formData.primaNetaSalud * $scope.formData.factorSalud).toFixed(2);
										}
									}

							}
							mpSpin.end();
						});
				});
			}
      $scope.$watch('formData', function(nv) {
	      $rootScope.formData =  nv;
	    })

	    function disableNextStep(){
	      $scope.formData.fourthStepNextStep = false;
	      $scope.formData.fifthStepNextStep = false;
	    }

	    if(!$scope.cotizacion){
	    	$scope.cotizacion = [
	    		{
	    			Solicitud: {
	    				SecuenciaReg: 0,
	    				CodigoEstado: ''
	    			}
	    		}
	    	];
	    }

      $scope.$on('changingStep', function(ib,e){
	      if (typeof $scope.formData.fourthStepNextStep == 'undefined') $scope.formData.fourthStepNextStep = false;

	      if (e.step < 4) {
	        e.cancel = false;
	      }else{
    			if(parseInt(e.step)==4){
      			if($scope.formData.paso4Grabado ||
      				($scope.cotizacion[0].Solicitud.CodigoEstado=='AT') ||
							($scope.cotizacion[0].Solicitud.CodigoEstado=='ER')
      				){
        			e.cancel = false;
        		}else{
        			e.cancel = true;
	        		disableNextStep();
        		}
      		}else if(parseInt(e.step)==5){
      			if($scope.formData.paso4Grabado ||
      				($scope.cotizacion[0].Solicitud.CodigoEstado=='EM')
      				){
        			e.cancel = false;
        		}else{
        			e.cancel = true;
	        		disableNextStep();
        		}
      		}
	      }
    	});
			function prepareByRamo(ramo, index){
				var fdata = $scope.formData
				var cotizacion = $scope.cotizacion[index]
				fdata[ramo.toLowerCase()] = true;

				$scope.formData.CodigoEstadoSol = cotizacion.Solicitud.CodigoEstado;

				if(cotizacion.Solicitud.CodigoEstado=='RT' && cotizacion.Solicitud.SecuenciaReg==3){
					fdata["subTotal" + ramo] = cotizacion.Riesgo.SubTotal;
					fdata["primaNeta" + ramo] = cotizacion.Riesgo.PrimaNeta;
					fdata["primaTotal" + ramo] = cotizacion.Riesgo.PrimaTotal;

					fdata.tasaPC = {
						Valor2: cotizacion.Riesgo.Tasa
					};
				}else if(
					(cotizacion.Solicitud.CodigoEstado==sctrStates.reajusteTasa.code ||
						cotizacion.Solicitud.CodigoEstado==sctrStates.devoler.code ||
						cotizacion.Solicitud.CodigoEstado=='AS' ) &&
						cotizacion.Solicitud.SecuenciaReg==3){

					fdata["subTotal" + ramo] = cotizacion.Riesgo.SubTotal;
					fdata["primaNeta" + ramo] = cotizacion.Riesgo.PrimaNeta;

					fdata.tasaPC = { //tasas diferentes para cada uno
						Valor2: cotizacion.Riesgo.Tasa
					};

					fdata["mTasa" + ramo] = cotizacion.Riesgo.Tasa;

					if(typeof fdata["mTasa" + ramo] == 'undefined'){
						fdata.sinTasasAgt = true;
					}else{
						fdata.sinTasasAgt = false;
					}

					if(fdata.TipoRol == 'AGT'|| fdata.TipoRol == 'EAC'){
						$scope.tasasAceptadas = true;
					}

					if(cotizacion.Solicitud.CodigoEstado=='AS') {
						$scope.formData.tasaAsignada = true;
					}

					$scope.calcularPrima();
				}else if(cotizacion.Solicitud.CodigoEstado=='EM'){
					fdata["mTasa" + ramo] = cotizacion.Riesgo.Tasa;
				}
			}
			function prepareByStateAS_RS(estadoSolicitudAgenteDescription, tasasEnviadas, rechazado){
				var fdata = $scope.formData
				fdata.tasasEnviadas = tasasEnviadas;
				fdata.rechazado = rechazado;

				if(fdata.tipoSCTR!=constants.module.polizas.sctr.periodoCorto.TipoPeriodo)
					fdata.tasasPN = true;

				if(fdata.TipoRol == 'SUS')
					fdata.paso3GrabadoSUS = true;

				if(fdata.TipoRol == 'AGT'|| fdata.TipoRol == 'EAC'){
					fdata.tasaAsignada = true;
				}else{
					fdata.tasaSolicitada = false;
					fdata.estadoSolicitudAgente = estadoSolicitudAgenteDescription;
				}

				if(fdata.TipoRol == 'ADM'){
					fdata.activarAdm = true;
				}else{
					fdata.activarAdm = false;
				}

				for(var i=0; i<$scope.cotizacion.length; i++){
					if($scope.cotizacion[i].CodigoCompania==3){//salud
						fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
						fdata.mImportePlanillaSalud = $scope.cotizacion[i].Riesgo.ImportePlanilla;
					}

					if($scope.cotizacion[i].CodigoCompania==2){//pension
						fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
						fdata.mImportePlanillaPension = $scope.cotizacion[i].Riesgo.ImportePlanilla;
					}
				}
			}

			function cargarPaso2(){
				var fdata = $scope.formData

							fdata.subTotalSalud = 0;
							fdata.primaNetaSalud = 0;
							fdata.primaTotalSalud = 0;

							fdata.subTotalPension = 0;
							fdata.primaNetaPension = 0;
							fdata.primaTotalPension = 0;

							 fdata.paso2Grabado = true;

							 fdata.NroSolicitud = fdata.quotation;

							var paramsCoti = {

								NumeroSolicitud: fdata.quotation,
								Tipo: 1,
								TipoRol: fdata.TipoRol

							};
							var promise = sctrEmitFactory.getCotizacion(paramsCoti, true)
							promise.then(function(response){

								if (response.OperationCode == constants.operationCode.success){
									$scope.cotizacion = response.Data;
									$scope.formData.codigoAgente = $scope.cotizacion[0].Solicitud.CodigoAgente;

			            proxySctr.ValidarAgentePorCodigo($scope.formData.codigoAgente).then(function(response){
			              if(response.Data && response.Data.Bloqueado == "1"){
			                $scope.formData.agenteBloqueado = true;
			                 mModalAlert.showError('El código de agente ' + $scope.formData.codigoAgente + ' ha sido bloqueado para emisión SCTR por presentar 3 pólizas pendientes de pago (primer recibo pendiente vencido mayor a 45 días). <br/>'+
				                'Coordinar con su gestor comercial', 'Agente Bloqueado').then(function(response){
				                    $state.go('sctrHome');
				                  }, function(error){
				                    $state.go('sctrHome');
				                  });
			              }else{
			                $scope.formData.agenteBloqueado = false;
			              }
			            }, function(response){
			              //defer.reject(response);
			            });

			            var isdeficitario = $scope.cotizacion[0].McaDeficitarioPension == 'S' ||
																$scope.cotizacion[0].McaDeficitarioSalud == 'S';

									$scope.formData.isdeficitario = isdeficitario;
									$scope.formData.applyDeficitarioValidation = $scope.formData.isdeficitario;

									fdata.mActEco = {
										CodigoCiiuEmp: $scope.cotizacion[0].Solicitud.CodCiiuPol,
										DescripcionCiiuEmp: $scope.cotizacion[0].Solicitud.DescripcionCiiuPol
									};

									$scope.formData.subactividad = {
										Descripcion: $scope.cotizacion[0].Solicitud.DescTrabPol
									};

									fdata.subactividad = {
										Descripcion: $scope.cotizacion[0].Solicitud.DescTrabPol
									};

									fdata.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;

									fdata.usuarioDestino = $scope.cotizacion[0].Solicitud.Suscriptor.CodigoUsuario;
									fdata.dataContractor2 ={
										MontoDeficitarioPension: $scope.cotizacion[0].MontoDeficitarioPension,
										MontoDeficitarioSalud: $scope.cotizacion[0].MontoDeficitarioSalud,
										EmailUsuario: $scope.cotizacion[0].EmailUsuario,
						      	Telefono: $scope.cotizacion[0].Telefono
									}
									fdata.suscriptorEmail = $scope.cotizacion[0].Solicitud.Suscriptor.Correo;
									fdata.clausulaAutomatica = $scope.cotizacion[0].Solicitud.ClausulaAutomatica;
									$scope.formData.clausulaAutomatica = fdata.clausulaAutomatica;
									fdata.clausulaAutomatica.replace('&lt;', '<')
									.replace('&gt;', '>')
									.replace('<span style="font-family: Roboto, sans-serif; font-size: 12px; font-style: normal; font-weight: 400;">', '')
									.replace('</span>', '')
									.replace('<div>', '')
									.replace('</div>', '');
									$scope.formData.clausulaAutomatica = fdata.clausulaAutomatica;
									$scope.formData.clausulaAutomatica.replace('&lt;', '<')
									.replace('&gt;', '>')
									.replace('<span style="font-family: Roboto, sans-serif; font-size: 12px; font-style: normal; font-weight: 400;">', '')
									.replace('</span>', '')
									.replace('<div>', '')
									.replace('</div>', '');
console.log(fdata.clausulaAutomatica);

									fdata.clausulaManual = $scope.cotizacion[0].Solicitud.ClausulaManual;

									if(fdata.TipoRol == 'AGT'|| fdata.TipoRol == 'EAC'){
										fdata.esAgente = true;
										fdata.esAdmin = false;
										fdata.esAdminSus = false;
										fdata.conTasas = true;
									}else if(fdata.TipoRol == 'ADM'){
										fdata.esAgente = false;
										fdata.esAdmin = true;
										fdata.esAdminSus = true;
										fdata.SolEnviada = false;
										fdata.tasasEnviadas = false;
										fdata.conTasas = false;
									}else if(fdata.TipoRol == 'SUS'){
										fdata.esAgente = false;
										fdata.esAdminSus = true;
										fdata.conTasas = false;
									}

									if(fdata.CodigoEstado == 'SC' ||
										fdata.CodigoEstado == sctrStates.reajusteTasa.code
										){
										fdata.tasaSolicitada = true;
										fdata.estadoSolicitudAgente = 'Enviado para aprobación.';
										fdata.SolEnviada = true;
										fdata.estadoSC = true;
										fdata.estadoST = true;

										if(fdata.TipoRol == 'ADM'){
											fdata.activarAdm = true;
										}else{
											fdata.activarAdm = false;
										}

										if((fdata.tipoSCTR!=constants.module.polizas.sctr.periodoCorto.TipoPeriodo)){
											fdata.agenteSinTasa = true;
											fdata.tasasPN = false;
										}

										if((fdata.tipoSCTR!=constants.module.polizas.sctr.periodoCorto.TipoPeriodo)
											&& (fdata.TipoRol == 'AGT'|| fdata.TipoRol == 'EAC')){
											fdata.disabledRiesgoPaso3 = true;
											fdata.agenteSinTasa = true;
											fdata.tasasPN = false;
										}

										for(var i=0; i<$scope.cotizacion.length; i++){
											if($scope.cotizacion[i].CodigoCompania==3){//salud
												fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
												fdata.mImportePlanillaSalud = $scope.cotizacion[i].Riesgo.ImportePlanilla;
												fdata.NumeroRiesgoSalud = $scope.cotizacion[i].Riesgo.NumeroRiesgo;
											}

											if($scope.cotizacion[i].CodigoCompania==2){//pension
												fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
												fdata.mImportePlanillaPension = $scope.cotizacion[i].Riesgo.ImportePlanilla;
												fdata.NumeroRiesgoPension = $scope.cotizacion[i].Riesgo.NumeroRiesgo;
											}
										}

									}else if(fdata.CodigoEstado == 'AS' ){
										prepareByStateAS_RS('Solicitud aceptada',true,  false);
									}else if(fdata.CodigoEstado == 'RS'){
										prepareByStateAS_RS('Solicitud rechazada',false,  true);
									}else if(fdata.CodigoEstado == sctrStates.devoler.code ){
										prepareByStateAS_RS('Solicitud aceptada',false,  false);
									}

									//recuperamos la tasa
									if((!(typeof fdata.mActEco == 'undefined'))){


										if(fdata.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
											//si es periodo corto
											var paramsTasaPC = {
												codigoGrupo: constants.module.polizas.sctr.periodoCorto.CodigoGrupo,
												codigoActividad: fdata.mActEco.CodigoCiiuEmp
											};

											sctrEmitFactory.getTasaPC(paramsTasaPC, false).then(function(response){
												if (response.OperationCode == constants.operationCode.success){
													fdata.tasaPC = response.Data;
												}
											});
										}else{

											if ((typeof fdata.paso2 != 'undefined')){
												if ((typeof fdata.paso2.FactorPension != 'undefined') ||
													(typeof fdata.paso2.FactorSalud != 'undefined')){


													if((fdata.CodigoEstado != 'RE'

														|| fdata.CodigoEstado != 'SC'

														|| typeof fdata.CodigoEstado != 'undefined')){

														fdata.tasasPN = true;

													}

													if ((typeof fdata.paso2.FactorPension != 'undefined') ){
														fdata.tasaPC = {
															Valor2: fdata.paso2.FactorPension
														}
													}

													if ((typeof fdata.paso2.FactorSalud != 'undefined') ){
														fdata.tasaPC = {
															Valor2: fdata.paso2.FactorSalud
														}
													}

												}
											}
										}
									}

									fdata.mCentroRiesgo = $scope.cotizacion[0].Solicitud.ColegAseg;
									fdata.ColegAseg = fdata.mCentroRiesgo;
									fdata.subactividad = {
										Descripcion: $scope.cotizacion[0].Solicitud.DescTrabPol
									};


									fdata.mDescripcionTrabajo = $scope.cotizacion[0].Solicitud.DescTrabPol;

									fdata.mFrecDeclaracion = {
										Codigo : $scope.cotizacion[0].Solicitud.FormaPago,
										Descripcion: $scope.cotizacion[0].Solicitud.FormaPagoDescripcion
									}

									fdata.desde = $scope.cotizacion[0].Solicitud.FechaEfectivoPoliza;
									fdata.hasta = $scope.cotizacion[0].Solicitud.FechaVencimientoPoliza;

									fdata.descripcionDuracion = sctrEmitFactory.getDescripcionDuracion(fdata.desde, fdata.hasta);

									if($scope.cotizacion.length>0){
											//recuperamos paso1

										fdata.mTipoDocumento = {Codigo:$scope.cotizacion[0].TipoDocumento, Descripcion:$scope.cotizacion[0].TipoDocumento};
										fdata.mNumeroDocumento = $scope.cotizacion[0].NumeroDocumento;

										$scope.buscarContratante();

										fdata.mRazonSocial = $scope.cotizacion[0].RazonSocial;


									 if($scope.cotizacion[0].ApellidoPaterno == '' && mainServices.fnShowNaturalRucPerson(fdata.mTipoDocumento.Codigo, fdata.mNumeroDocumento)){
											var arregloDeCadenas = $scope.cotizacion[0].RazonSocial.split(' ');

											$scope.cotizacion[0].ApellidoPaterno = arregloDeCadenas[0];
											$scope.cotizacion[0].ApellidoMaterno = arregloDeCadenas[1];
											var nombre = '';

											angular.forEach(arregloDeCadenas, function(value,key){

												if(key>1){
													nombre += arregloDeCadenas[key] + ' ';
												}

											});
											fdata.mRazonSocial = nombre;

											 fdata.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
											fdata.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

										}else{

											fdata.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
											fdata.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

										}

										fdata.McaFisico		         = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
										fdata.mSexo 							 = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;

										fdata.mProfesion = {};
										fdata.mProfesion.Codigo 	 = ($scope.cotizacion[0].CodigoProfesion == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;


										fdata.mActivSunat = {codigo:$scope.cotizacion[0].CodigoCiiuEmp, descripcion: $scope.cotizacion[0].DescripcionCiiuEmp};

										fdata.mDirReferencias = $scope.cotizacion[0].Referencia;
										fdata.mRepresentante = $scope.cotizacion[0].Representante;
										fdata.mRepresentanteCargo = {Codigo:$scope.cotizacion[0].TipoCargoRep, Descripcion: $scope.cotizacion[0].CargoRepresentante};
									}

									//tipo de seguro
									if($scope.cotizacion.length==2){

										prepareByRamo("Salud", 1);
										prepareByRamo("Pension", 0);


									}else if($scope.cotizacion[0].CodigoCompania==3){
										prepareByRamo("Salud", 0);
									}else if($scope.cotizacion[0].CodigoCompania==2){
										prepareByRamo("Pension", 0);
									}

									//paso
									if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
										$scope.paso3 = true;
										$scope.tasasAceptadas = true;
										fdata.agenteSinTasa = true;
										fdata.estadoSolicitudAgente = 'Enviar para aprobación.';
										fdata.tasasPN = false;
										fdata.estadoRE = true;

									}else if(($scope.cotizacion[0].Solicitud.CodigoEstado=='RT' || $scope.cotizacion[0].Solicitud.CodigoEstado=='AT') && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
										$scope.paso3 = true;
										$scope.tasasAceptadas = $scope.cotizacion[0].Solicitud.CodigoEstado=='AT';

										for(var i=0; i<$scope.cotizacion.length; i++){
											if($scope.cotizacion[i].CodigoCompania==3){//salud
												fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
												fdata.mImportePlanillaSalud = $scope.cotizacion[i].Riesgo.ImportePlanilla;
											}

											if($scope.cotizacion[i].CodigoCompania==2){//pension
												fdata.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
												fdata.mImportePlanillaPension = $scope.cotizacion[i].Riesgo.ImportePlanilla;
											}
										}

									}else if($scope.cotizacion[0].CodigoCompania==3){
										fdata.salud = true;

									}else if($scope.cotizacion[0].CodigoCompania==2){
										fdata.pension = true;
									}
								}
							});
							return promise;
						}

	    $scope.buscarContratante = function(){
      	// Contratante

				$scope.formData.resultContratante = 2;
				$scope.formData.contrante = true;

				$scope.formData.contractorAddress.mTipoVia = {
					Codigo:         ($scope.cotizacion[0].TipoDomicilio== '') ? null : $scope.cotizacion[0].TipoDomicilio
				};

				$scope.formData.contractorAddress.mNombreVia = $scope.cotizacion[0].NombreDomicilio;

				$scope.formData.contractorAddress.mTipoNumero = {
					Codigo:         ($scope.cotizacion[0].TipoNumero == '') ? null : $scope.cotizacion[0].TipoNumero
				};

				$scope.formData.contractorAddress.mNumeroDireccion = $scope.cotizacion[0].DescripcionNumero;

				$scope.formData.contractorAddress.mTipoInterior = {
					Codigo:         ($scope.cotizacion[0].TipoInterior == '') ? null : $scope.cotizacion[0].TipoInterior
				};

				$scope.formData.contractorAddress.mNumeroInterior = $scope.cotizacion[0].DescripcionInterior;

				$scope.formData.contractorAddress.mTipoZona = {
					Codigo:         ($scope.cotizacion[0].TipoZona == '') ? null : $scope.cotizacion[0].TipoZona
				};

				$scope.formData.contractorAddress.mNombreZona = $scope.cotizacion[0].DescripcionZona;

	      if (typeof $scope.formData.dataContractorAddress == 'undefined'){

	        $scope.formData.mRazonSocial         = $scope.cotizacion[0].RazonSocial;

	        if($scope.cotizacion[0].ApellidoPaterno == '' && mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)){
    	      var arregloDeCadenas = $scope.cotizacion[0].RazonSocial.split(' ');

		        $scope.cotizacion[0].ApellidoPaterno = arregloDeCadenas[0];
		        $scope.cotizacion[0].ApellidoMaterno = arregloDeCadenas[1];
		        var nombre = '';

		        angular.forEach(arregloDeCadenas, function(value,key){

		        	if(key>1){
		        		nombre += arregloDeCadenas[key] + ' ';
		        	}

		        });
		        $scope.formData.mRazonSocial = nombre;

		       	$scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
		      	$scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

	        }else{

		        $scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
		      	$scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

	        }

					$scope.formData.McaFisico		         = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
		      $scope.formData.mSexo 							 = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;

					$scope.formData.mProfesion = {};
		      $scope.formData.mProfesion.Codigo 	 = ($scope.cotizacion[0].CodigoProfesion == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;

	        $scope.formData.mTelefonoFijo         = $scope.cotizacion[0].Telefono;
	        $scope.formData.mTelefonoCelular      = $scope.cotizacion[0].NumeroMovil;
	        $scope.formData.mCorreoElectronico    = $scope.cotizacion[0].EmailUsuario;

	        $scope.formData.dataContractorAddressClone = helper.clone($scope.formData.dataContractorAddress, true);
					var isload = false;
          $scope.$watch('setterUbigeo', function() {
            if ($scope.setterUbigeo && !isload) {
                $scope.setterUbigeo($scope.cotizacion[0].Departamento, $scope.cotizacion[0].Provincia, $scope.cotizacion[0].Distrito);
                isload = true;
            }
          });
	      }
      }

    	/*#########################
	    # Prima
	    #########################*/

			var debounceCalcularPrimaImporteByTasaPension = _.debounce(cbWatchCalcularPrimaImporteByTasaPension, 700);
			var debounceCalcularPrimaImporteByTasaSalud = _.debounce(cbWatchCalcularPrimaImporteByTasaSalud, 700);
			var debounceCalcularPrimaByTasaPension = _.debounce(cbWatchCalcularPrimaByTasaPension, 700);
			var debounceCalcularPrimaByTasaSalud = _.debounce(cbWatchCalcularPrimaByTasaSalud, 700);
			var debounceCalcularPrima = _.debounce(cbWatchCalcularPrima, 700);

			function cbWatchCalcularPrima() {
				$scope.calcularPrima();
			}

			function cbWatchCalcularPrimaImporteByTasaPension(nv, ov) {
				if(nv){

					var	fdata = $scope.formData;
					if((!(fdata.mTasaPension)) ||
						(!(typeof fdata.mNroTrabajadores == 'undefined'))){
							fdata.mInferTasaPension = fdata.mTasaPension;
						//console.log(fdata.mInferTasaPension);
						if($scope.formData.CodigoEstado=='AS') {
						$scope.formData.tasaAsignada = true;
					}
							calcByRamo("Pension");
						}
        }
			}

			function cbWatchCalcularPrimaImporteByTasaSalud(nv, ov) {
				if(nv){

					var	fdata = $scope.formData;
					if((!(fdata.mTasaSalud)) ||
						(!(typeof fdata.mNroTrabajadores == 'undefined'))){
							fdata.mInferTasaSalud = fdata.mTasaSalud;
						if($scope.formData.CodigoEstado=='AS') {
						$scope.formData.tasaAsignada = true;
					}
							calcByRamo("Salud");
						}
        }
			}

			function cbWatchCalcularPrimaByTasaPension(nv, ov) {
				if($scope.formData.CodigoEstado){
					if($scope.formData.CodigoEstado=='AS') {
							$scope.formData.tasaAsignada = true;
						}
					if(nv && $scope.isAdmin() || (($scope.formData && $scope.formData.CodigoEstado!='AS'))){

						var	fdata = $scope.formData;
						if((!(fdata.mTasaPension)) ||
							(!(typeof fdata.mNroTrabajadores == 'undefined'))){
								fdata.mInferTasaPension = fdata.mTasaPension;
								if($scope.formData.CodigoEstado !== 'AS' && $scope.formData.TipoRol === 'ADM' && $scope.formData.mTasaPension>0) {
									calcByRamoPN("Pension");
								}
							}
	        }
	      }
			}

			function cbWatchCalcularPrimaByTasaSalud(nv, ov) {
				if($scope.formData.CodigoEstado){
					if($scope.formData.CodigoEstado=='AS') {
							$scope.formData.tasaAsignada = true;
						}
					if(nv && $scope.isAdmin() || (($scope.formData && $scope.formData.CodigoEstado!='AS'))){


						var	fdata = $scope.formData;
						if((!(fdata.mTasaSalud)) ||
							(!(typeof fdata.mNroTrabajadores == 'undefined'))){
								fdata.mInferTasaSalud = fdata.mTasaSalud;
								if($scope.formData.CodigoEstado !== 'AS' && $scope.formData.TipoRol === 'ADM' && $scope.formData.mTasaSalud>0) {
									calcByRamoPN("Salud");
								}
							}
	        }
	      }
			}

 			$scope.$watch('formData.mNroTrabajadores', debounceCalcularPrima);
	    $scope.$watch('formData.mImportePlanillaPension', debounceCalcularPrimaImporteByTasaPension);
	    $scope.$watch('formData.mImportePlanillaSalud', debounceCalcularPrimaImporteByTasaSalud);
	    $scope.$watch('formData.mTasaPension', debounceCalcularPrimaByTasaPension);
	   	$scope.$watch('formData.mTasaSalud', debounceCalcularPrimaByTasaSalud);

	  	function calcByRamoPN(ramoName){
	  		var	fdata = $scope.formData;
	  		// if($scope.formData.CodigoEstado === 'AS' && $scope.formData.TipoRol === 'ADM') {
					// return;
	  		// }else{
	  			fdata["mTasa" + ramoName] = fdata["mInferTasa" + ramoName] &&
																					fdata["mInferTasa" + ramoName]>0 ? fdata["mInferTasa" + ramoName]: 0;

						var range = fdata["mTasa"+ ramoName] > 0 && fdata["mTasa"+ ramoName] <=100

						if (!range && fdata["mTasa" + ramoName] !== 0) return;

						fdata["subTotal" + ramoName] = CalcularPrimaMinimaTotal((fdata["mImportePlanilla" + ramoName] * fdata["mTasa" + ramoName])/100);
						fdata["primaNeta" + ramoName]= (fdata["subTotal" + ramoName] < CalcularPrimaMinimaTotal(fdata["primaMin" + ramoName]))
																					 ? CalcularPrimaMinimaTotal(fdata["primaMin" + ramoName])
																					 : fdata["subTotal" + ramoName];
						if (fdata.dataContractor2)
							fdata["isDeficiario" + ramoName] = fdata.dataContractor2["MontoDeficitario" + ramoName] / fdata["primaNeta" + ramoName]>0.65
						fdata["primaTotal" + ramoName] = (fdata["primaNeta" + ramoName] * fdata["factor" + ramoName]).toFixed(2);

						fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																		 (!fdata.salud || fdata["mTasaSalud"]>0 );
	  		//}
	  	}

			function itemRamoRequest(ramoName){
				var fdata = $scope.formData
				var item = {//pension
					NumeroSolicitud : fdata.NroSolicitud,
					CodigoCompania : constants.module.polizas.sctr[ramoName.toLowerCase()].CodigoCompania,
					CodigoRamo : constants.module.polizas.sctr[ramoName.toLowerCase()].CodigoRamo,
					CodUserReg : oimClaims.loginUserName.toUpperCase(),
					NumeroRiesgo : '',
					Tipo : constants.module.polizas.sctr[ramoName.toLowerCase()].Tipo,
					CantidadTrabajador : $scope.formData.mNroTrabajadores,
					ImportePlanilla : $scope.formData["mImportePlanilla"+ ramoName],
					Tasa : $scope.formData["mTasa" + ramoName],
					SubTotal : $scope.formData["subTotal" + ramoName],
					PrimaNeta : $scope.formData["primaNeta" + ramoName],
					Factor : $scope.formData["factor" + ramoName],
					PrimaTotal : $scope.formData["primaTotal" + ramoName]
				}
				return item;
			}
			function validationSend(){
				return true;
			}
			function getRequest(state){

				var paramsP3 = {
					Solicitud :
					{
						CodigoAgente : $scope.formData.mAgente.codigoAgente,
						NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
						NumeroSolicitud : $scope.formData.NroSolicitud,
						RazonSocial : $scope.formData.mRazonSocial,
						DescripcionCiiuPol: $scope.formData.mActEco.DescripcionCiiuEmp,
						NumeroSolicitud : $scope.formData.NroSolicitud,
						ClausulaManual: $scope.formData.clausulaManual,
						ClausulaAutomatica: $scope.formData.clausulaAutomatica,
						Tipo : 2,
						CodigoEstado : state,
						CodigoUsuReg : oimClaims.loginUserName.toUpperCase()
					},
					Riesgos :[]
				}
				$scope.formData.pension ? paramsP3.Riesgos.push(itemRamoRequest("Pension")):null;

				$scope.formData.salud ? paramsP3.Riesgos.push(itemRamoRequest("Salud")) : null;
				return paramsP3;
			}
			function taxChangeStatus(state, settingMessages){
				if (validationSend()){
					var request = getRequest(state)
					if(settingMessages.buildRequest)settingMessages.buildRequest(request)
					mModalConfirm
					.confirmInfo(settingMessages.confirmText, settingMessages.confirmTitle)
					.then(function(response){
						proxySctr[settingMessages.method || 'PnGrabarPolizaP3CotizacionGestionar'](request, true).then(function(response){
							if (response.OperationCode == constants.operationCode.success){
								mModalAlert.showSuccess(settingMessages.alertText, settingMessages.alertTitle);
								$scope.formData.CodigoEstado = state;
								if (angular.isFunction(settingMessages.changedAction))
									settingMessages.changedAction();
							}
							else{
								mModalAlert.showError(response.Message, 'Paso 3');
							}
						}, function(){
							mModalAlert.showError ("Ha sucedido un error, por favor, vuelva intentarlo", 'Error')
						});
					})
				}
			}
			$scope.rejectTax = function(){
				taxChangeStatus('RT',  {confirmText: "¿Desea rechazar la tasa?",
															confirmTitle:"Rechazar tasa",
															alertText: "Se ha rechazado la tasa",
															alertTitle:"Tasa rechazada",
															changedAction: function(){
																$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
															},
															method: 'PnGrabarPolizaP3TasaGestionar'
														});
			}
			$scope.acceptTax = function(){
				
				
				taxChangeStatus('AT', {confirmText: "¿Desea aceptar la tasa?",
					confirmTitle:"Aceptar tasa",
					alertText: "Se ha aceptado la tasa",
					alertTitle:"Tasa aceptada",
					changedAction: function(){
						$scope.formData.paso3Grabado = true;
						$scope.$parent.formData = $scope.formData;
						$state.go('.',{
							step: 4
						});
					},
					method: 'PnGrabarPolizaP3TasaGestionar'

				});
			}

			$scope.giveBackAgent = function(){
				taxChangeStatus("DS", {confirmText: "¿Desea devolver al agente ?",
					confirmTitle:"Devolver",
					alertText: "Se ha devuelto al agente",
					alertTitle:"Devuelto",
					changedAction: function(){
						$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
					},
					buildRequest: function(request){
						delete request.Riesgos;
					}
				});
			}
			$scope.readjustmentTax = function(){
				taxChangeStatus("ST", {confirmText: "¿Desea solicitar un reajuste ?",
															confirmTitle:"Reajuste",
															alertText: "Se ha enviado la solicitud de ajuste de tasa",
															alertTitle:"Reajuste",
															changedAction: function(){
																$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
															},
															method: 'PnGrabarPolizaP3TasaGestionar'
												});
			}
			function showButtonAcceptReject(){
				var	fdata = $scope.formData;
				if(fdata)
					return  fdata.esAgente &&
							(fdata.tasaSolicitada ||
								fdata.tasaAsignada) &&
								fdata.pNormal;
			}
			function showButtonAgent(){
				var	fdata = $scope.formData;
				if(fdata)
					return IsAssignedTasa() && fdata.esAgente &&
							(fdata.CodigoEstado == sctrStates.aceptarSolicitud.code ||
								fdata.CodigoEstado == sctrStates.devoler.code);
			}
			function showButtonSusc(){
				var	fdata = $scope.formData;
				if(fdata)
					return showClausulas() && (fdata.esAdminSus || fdata.esAdmin) &&
								 (fdata.CodigoEstado == sctrStates.reajusteTasa.code ||
									fdata.CodigoEstado == sctrStates.solicitarCotizacion.code );
			}

			function showClausulas(){
				var	fdata = $scope.formData;
				if(fdata)
					return (IsAssignedTasa() || fdata.CodigoEstado == sctrStates.solicitarCotizacion.code || fdata.CodigoEstado == sctrStates.reajusteTasa.code) && fdata.pNormal &&
					((fdata.CodigoEstado == sctrStates.solicitarCotizacion.code && (fdata.esAdminSus || fdata.esAdmin)) ||
					fdata.CodigoEstado == 'RS' ||
					fdata.CodigoEstado == sctrStates.reajusteTasa.code ||
					fdata.CodigoEstado == sctrStates.devoler.code ||
					fdata.CodigoEstado == 'AS')
			}

			function isStateRTAT(){
				var	fdata = $scope.formData;
				if(fdata)
					return fdata.CodigoEstado == 'AT' ||
								 fdata.CodigoEstado == 'RT';
			}
			function isDeficitario(){
				var	fdata = $scope.formData;
				if(fdata)
					return fdata.applyDeficitarioValidation;
			}
			$scope.isDeficitario = isDeficitario;

			function allowSetTax(){
				var	fdata = $scope.formData;
				if(fdata)
					return !isDeficitario() && !fdata.CodigoEstado && fdata.esAgente;
			}

			function isInferCalc(){
				var	fdata = $scope.formData;
				if(fdata)
					return (fdata.mInferTasaPension || 0) > 0 && (fdata.mInferTasaSalud || 0) > 0;
			}

			$scope.IsAssignedTasa = IsAssignedTasa;

			function IsAssignedTasa(){
				var	fdata = $scope.formData;
				if(fdata)
					return (!fdata.pension ||(fdata.mTasaPension || 0) > 0) && ( !fdata.salud || fdata.mTasaSalud || 0) > 0;
			}

			$scope.isInferCalc = isInferCalc;
			$scope.isStateRTAT = isStateRTAT;
			$scope.showButtonAcceptReject = showButtonAcceptReject;
			$scope.showClausulas = showClausulas;
			$scope.showButtonAgent= showButtonAgent;
			$scope.showButtonSusc = showButtonSusc
			var taxs = []

			function findTax(key){
				for (var index = 0;taxs && index < taxs.length; index++) {
					var element = taxs[index];
					if (helper.compareObject(element.key, key)) {
						return element.value;
					}
				}
				return undefined;
			}

			function inferTax() {
				var isLarge = constants.module.polizas.sctr.periodoCorto.TipoPeriodo != $stateParams.tipo;
				var fdata = $scope.formData;

				var brequest = {
					TipoPeriodo: $stateParams.tipo,
					Ciiu: fdata.mActEco.CodigoCiiuEmp,
					CodigoAgente: fdata.mAgente.codigoAgente
				}
				brequest.Ramos = [
					{
						CodigoRamo: constants.module.polizas.sctr.pension.CodigoRamo,
						SueldoMedio: isLarge ? fdata.mImportePlanillaPension/ fdata.mNroTrabajadores:0,
						CantidadTrabajador: isLarge ? fdata.mNroTrabajadores : 0
					},
					{
						CodigoRamo: constants.module.polizas.sctr.salud.CodigoRamo,
						SueldoMedio: isLarge ? fdata.mImportePlanillaSalud / fdata.mNroTrabajadores:0,
						CantidadTrabajador: isLarge ? fdata.mNroTrabajadores:0
					}
				];

				var value = findTax(brequest)
			  var promise = !value ? proxySctr.CalcularPrima(brequest, true) : $q.resolve(value);

				var defer = $q.defer();
				promise.then(function(response){
					if (!value){
						value = response.Data;
					}
					taxs.push({key: brequest, value:value });
					defer.resolve(value)
				}, function(response){
					defer.reject(response)
				});
				return defer.promise;
			}

			var cdPension = constants.module.polizas.sctr.pension.CodigoRamo
			var cdSalud = constants.module.polizas.sctr.salud.CodigoRamo

			function asyncSetTaxs(){
				if($scope.formData.CodigoEstado === 'AS' && $scope.formData.TipoRol === 'ADM') {
					return;
				}else if($scope.formData.TipoRol === 'AGT' && $scope.formData.isdeficitario){
					return;
				}else if($scope.formData.TipoRol === 'AGT' && $scope.formData.CodigoEstado === 'ST'){
					$scope.formData.mTasaPension = 0;
					$scope.formData.mTasaSalud = 0;
					return;
				}else{
					var  defferd = $q.defer();
					var	fdata = $scope.formData;

					inferTax().then(function(response) {

						var taxp = _.find(response, function(t){ return t && t.CodigoRamo == cdPension });
						var taxs = _.find(response, function(t){ return t && t.CodigoRamo == cdSalud });

						if(!taxp && !$stateParams.quotation>0){
							$scope.formData.mTasaPension = undefined;
							$scope.mInferTasaPension = undefined;
							fdata["mInferTasaPension"] = undefined;
							$scope.formData.primaTotalPension = undefined;
						}
						if(!taxs && !$stateParams.quotation>0){
							$scope.formData.mTasaSalud = undefined;
							$scope.mInferTasaSalud = undefined;
							fdata["mInferTasaSalud"] = undefined;
							$scope.formData.primaTotalSalud = undefined;
						}
						if($scope.formData.TipoRol != 'SUS' && $scope.formData.TipoRol != 'ADM'){
							fdata["mInferTasaPension"] = taxp ? taxp.Tasa : 0 //fdata["mInferTasaPension"];
							fdata["mInferTasaSalud"] = taxs ? taxs.Tasa : 0 //fdata["mInferTasaSalud"];

							if($scope.formData.CodigoEstado!='AS') {
								$scope.formData.mTasaPension = taxp ? taxp.Tasa : 0;
								$scope.formData.mTasaSalud = taxs ? taxs.Tasa : 0;
							}
						}

						if((taxp || taxs) && $scope.formData.TipoRol == 'ADM') {
							fdata["mInferTasaPension"] = taxp ? taxp.Tasa : 0 //fdata["mInferTasaPension"];
							fdata["mInferTasaSalud"] = taxs ? taxs.Tasa : 0 //fdata["mInferTasaSalud"];

							if(taxp && !$scope.formData.tasaEditada)
								$scope.formData.mTasaPension = taxp.Tasa;
							else if(!$scope.formData.tasaEditada)
								$scope.formData.mTasaPension = taxp ? taxp.Tasa : 0;
							else{
								$scope.formData.mTasaPension = ($scope.formData.mTasaPension || $scope.formData.mTasaPension == '') ? $scope.formData.mTasaPension : taxp ? taxp.Tasa : 0;
							}

							if(taxs && !$scope.formData.tasaEditada)
								$scope.formData.mTasaSalud = taxs.Tasa;
							else if(!$scope.formData.tasaEditada)
								$scope.formData.mTasaSalud = taxp ? taxp.Tasa : 0;
							else
								$scope.formData.mTasaSalud = ($scope.formData.mTasaSalud || $scope.formData.mTasaSalud == '') ? $scope.formData.mTasaSalud : taxp ? taxp.Tasa : 0;

						} else if ((!taxp && !taxs) && $scope.formData.TipoRol == 'ADM') {
							$scope.formData.mTasaPension = 0;
							$scope.formData.mTasaSalud = 0;
						}

						if ($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo) {
							if ($scope.formData.TipoRol == 'AGT' && ($scope.formData.mTasaPension === 0 || $scope.formData.mTasaSalud === 0)){
								$scope.formData.agenteSinTasaPC = true;
							}else{
								$scope.formData.agenteSinTasaPC = false;
								if($scope.formData.TipoRol == 'ADM' && ($scope.formData.mTasaPension === 0 || $scope.formData.mTasaSalud === 0)){
									$scope.formData.isAdminTasaCero = true;
									$scope.formData.agenteSinTasaPC = true;
								}else{
									if($scope.formData.mTasaPension === 0 || $scope.formData.mTasaSalud === 0){
										$scope.formData.agenteSinTasaPC = true;
									}
									$scope.formData.isAdminTasaCero = false;
								}
							}
						}else{
							$scope.formData.agenteSinTasaPC = false;
						}

						defferd.resolve(response);
					}, function(respose){
						defferd.reject(respose);
					});
					return defferd.promise;
				}
			}

			$scope.isAdmin = function(){
				if($scope.formData && $scope.formData.TipoRol == 'ADM'){
					return true;
				}else{
					return false;
				}
			}

			function calcByRamo(ramoName){

				if($scope.formData.CodigoEstado === 'AS' && $scope.formData.TipoRol === 'ADM') {
					return;
				}else if($scope.formData.TipoRol === 'AGT' && $scope.formData.CodigoEstado === 'ST'){
					$scope.formData.mTasaPension = 0;
					$scope.formData.mTasaSalud = 0;
					return;
				} else{
					var	fdata = $scope.formData;
					var vvalidacion = (fdata["mImportePlanilla" + ramoName]/fdata.mNroTrabajadores) >= fdata.sueldoMinimo

					if (	     fdata[ramoName.toLowerCase()] &&
							typeof fdata["mImportePlanilla" + ramoName] != 'undefined' &&
							       vvalidacion ){

						var promise = asyncSetTaxs()
						promise.then(function(response){
							if (allowSetTax())
								fdata["mTasa" + ramoName] = fdata["mInferTasa" + ramoName] &&
																						fdata["mInferTasa" + ramoName]>0 ? fdata["mInferTasa" + ramoName]: 0;

							var range = fdata["mTasa"+ ramoName] > 0 && fdata["mTasa"+ ramoName] <=100

							if (!range && fdata["mTasa" + ramoName] !== 0) return;

							fdata["subTotal" + ramoName] = CalcularPrimaMinimaTotal((fdata["mImportePlanilla" + ramoName] * fdata["mTasa" + ramoName])/100);
							fdata["primaNeta" + ramoName]= (fdata["subTotal" + ramoName] < CalcularPrimaMinimaTotal(fdata["primaMin" + ramoName]))
																						 ? CalcularPrimaMinimaTotal(fdata["primaMin" + ramoName])
																						 : fdata["subTotal" + ramoName];
							if (fdata.dataContractor2)
								fdata["isDeficiario" + ramoName] = fdata.dataContractor2["MontoDeficitario" + ramoName] / fdata["primaNeta" + ramoName]>0.65
							fdata["primaTotal" + ramoName] = (fdata["primaNeta" + ramoName] * fdata["factor" + ramoName]).toFixed(2);
						})
						return promise;
					}
					else{
						fdata["subTotal" + ramoName] = 0;
						fdata["primaTotal" + ramoName] = 0
					}

					return $q.resolve({});

				}
			}
			function calcPrima() {

				if($scope.formData.CodigoEstado){
					if($scope.formData.TipoRol == 'ADM' && $scope.formData.CodigoEstado =='AS'){//se tienen las tasas y es administrador
						return;
					}
					var	fdata = $scope.formData;
					if(!$stateParams.quotation>0){
							if((!(fdata.mTasaPension || fdata.mTasaSalud)) ||
								(!(typeof fdata.mNroTrabajadores == 'undefined'))){
								// if(!(typeof fdata.mNroTrabajadores == 'undefined')){
									$q.all([calcByRamo("Pension"), calcByRamo("Salud")])
									.then(function(){
										fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																				 (!fdata.salud || fdata["mTasaSalud"]>0 )
									})
								// }
							}

							if((fdata.mTasaPension == 0 || fdata.mTasaSalud == 0) ||
								(!(typeof fdata.mNroTrabajadores == 'undefined'))){
								$q.all([calcByRamo("Pension"), calcByRamo("Salud")])
									.then(function(){
										fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																				 (!fdata.salud || fdata["mTasaSalud"]>0 )
									})
							}
							if($scope.formData.CodigoEstadoSolo=='AS') {fdata.tasaAsignada = true;}


						}else if(!(fdata.mTasaPension || fdata.mTasaSalud)){
								$q.all([calcByRamo("Pension"), calcByRamo("Salud")])
									.then(function(){
										fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																				 (!fdata.salud || fdata["mTasaSalud"]>0 )
									})
						}else{
							if($scope.cotizacion[0].Riesgo){
								for(var i=0; i<$scope.cotizacion.length; i++){
									if($scope.cotizacion[i].CodigoCompania==3){//salud
										$scope.mImportePlanillaSalud2 = $scope.cotizacion[i].Riesgo.ImportePlanilla;
									}

									if($scope.cotizacion[i].CodigoCompania==2){//pension
										$scope.mImportePlanillaPension2 = $scope.cotizacion[i].Riesgo.ImportePlanilla;
									}
								}

								if(($scope.formData.mNroTrabajadores != $scope.cotizacion[0].Riesgo.CantidadTrabajador ||
									$scope.formData.mImportePlanillaPension != $scope.mImportePlanillaPension2 ||
									$scope.formData.mImportePlanillaSalud != $scope.mImportePlanillaSalud2
									) && !(typeof fdata.mNroTrabajadores == 'undefined')){
										$q.all([calcByRamo("Pension"), calcByRamo("Salud")])
											.then(function(){
												fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																						 (!fdata.salud || fdata["mTasaSalud"]>0 )
											})
								}
							}else{
								$q.all([calcByRamo("Pension"), calcByRamo("Salud")])
											.then(function(){
												fdata.tasaAsignada = (!fdata.pension || fdata["mTasaPension"]>0) &&
																						 (!fdata.salud || fdata["mTasaSalud"]>0 )
											})
							}
						}

						if($scope.formData.TipoRol == 'ADM' && !$scope.formData.isAdminTasaCero){
							$scope.formData.isAdminTasaCero = true;
						}
					}
		 }

			$scope.calcularPrima = function(){
				if($scope.formData)
					if(!($scope.formData.isdeficitario && $scope.formData.TipoRol == 'AGT')){
						calcPrima();
					}
      };



      /*#########################
	    # Adjuntos
	    #########################*/
      $scope.uploadFile = function(){

      	$scope.formData.mAgente = $rootScope.mAgente;
				if (!$scope.mComment) return;
      	if($scope.formData.TipoRol == 'AGT' || $scope.formData.TipoRol == 'CLI'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){

	      	$scope.frmSCTR3Comment.markAsPristine();

	        var file = null;

					if(!(typeof $scope.myFile == 'undefined')){
						file = $scope.myFile;

					}

					//$scope.formData.mAgente.nombre

					if(!(typeof $scope.mComment == 'undefined')) {
						var paramsFile = {
							numeroSolicitud: $scope.formData.NroSolicitud,
							rolOrigen: $scope.formData.TipoRol,
							usuarioOrigen: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							usuarioDestino: $scope.formData.usuarioDestino,
							asunto: 'MESSAGE: ' + new Date(),
							mensaje: $scope.mComment
		        };

		       	fileUpload.uploadFileToUrl(file, paramsFile);
		       	$timeout(function () {
		   				listarMensajes();
		   				$scope.mComment = '';
		   				$scope.myFile = undefined;
		   			}, 2000);
					}

      	}else if($scope.formData.TipoRol == 'ADM'){

      		$scope.frmSCTR3Comment.markAsPristine();

	        var file = null;

					if(!(typeof $scope.myFile == 'undefined')){
						file = $scope.myFile;

					}

      		if(!(typeof $scope.mComment == 'undefined')) {
						 var paramsFile = {
							numeroSolicitud: $scope.formData.NroSolicitud,
							rolOrigen: $scope.formData.TipoRol,
							usuarioOrigen: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							usuarioDestino: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							asunto: 'MESSAGE: ' + new Date(),
							mensaje: $scope.mComment
		        };

		       	fileUpload.uploadFileToUrl(file, paramsFile);
		       	$timeout(function () {
		   				listarMensajes();
		   				$scope.mComment = '';
		   				$scope.myFile = undefined;
		   			}, 2000);
					}

      	}else{// if($scope.formData.TipoRol == 'SUS'){

      		$scope.frmSCTR3Comment.markAsPristine();

	        var file = null;

					if(!(typeof $scope.myFile == 'undefined')){
						file = $scope.myFile;

					}

      		if(!(typeof $scope.mComment == 'undefined')) {
						 var paramsFile = {
							numeroSolicitud: $scope.formData.NroSolicitud,
							rolOrigen: $scope.formData.TipoRol,
							usuarioOrigen: $scope.formData.usuarioDestino,
							usuarioDestino: $scope.formData.usuarioDestino,
							asunto: 'MESSAGE: ' + new Date(),
							mensaje: $scope.mComment
		        };

		       	fileUpload.uploadFileToUrl(file, paramsFile);
		       	$timeout(function () {
		   				listarMensajes();
		   				$scope.mComment = '';
		   				$scope.myFile = undefined;
		   			}, 2000);
					}
      	}
    	};

    	$scope.deleteFile = function(index){
    		$scope.myFile = $.map($scope.myFile, function(myFile) { return myFile; })

        if ((index) > -1) {
          $scope.myFile.splice((index), 1);
        }
      }

      $scope.getAdjunto = function(adjunto){
	      $scope.adjData = {
	        NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
	        ArchivoAdjunto: adjunto
	      };
	      $window.setTimeout(function(){
	        document.getElementById('frmDownloadADJ').submit();
	      });
	    }

    	/*#########################
	    # ModalConfirmation
	    #########################*/
	    $scope.showModalConfirmation = function(tipo){
								

	    	$scope.formData.mAgente = $rootScope.mAgente;

				$scope.formData.salarioFueraRango = ($scope.formData.pension &&
																						($scope.formData.mImportePlanillaPension/$scope.formData.mNroTrabajadores) < $scope.formData.sueldoMinimo) ||
																						($scope.formData.salud &&
																						($scope.formData.mImportePlanillaSalud/$scope.formData.mNroTrabajadores) < $scope.formData.sueldoMinimo)



		    	if(!$scope.formData.rechazado){

			    	if($scope.formData.paso3Grabado){
							$scope.$parent.formData  = $scope.formData;
							$timeout(function(){
			          $state.go('.',{
				            step: 4
				        });
			        }, 500);
			    	}else{
				    	$scope.validationForm();
				     	if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
			     			if($scope.formData.validatedPaso3 && $scope.tasasAceptadas){


			            if (tipo==1) {
			            	$scope.formData.suscriptorAS = true;
			            	$scope.formData.paso3GrabadoNotEdit = true;
			             	reject();
			            }else if (tipo==0) {
			            	$scope.formData.suscriptorAS = true;
			            	$scope.formData.paso3GrabadoNotEdit = true;
			            	aceppt();
			            }

					      }else if(!$scope.tasasAceptadas){
					      	mModalAlert.showWarning('Las condiciones han sido rechazadas anteriormente, no se puede continuar', 'Tasas Rechazadas');
					      }
				     	}else{ //periodo normal
				     		if($scope.formData.validatedPaso3){

				     			//SI ES ADMIN
				     			if($scope.formData.TipoRol == 'ADM' && $scope.formData.tasasPN){//se tienen las tasas y es administrador
											var paramsP3 = {
												Solicitud :
												{
													CodigoAgente : $scope.formData.mAgente.codigoAgente,
													DescripcionCiiuPol: $scope.formData.mActEco.DescripcionCiiuEmp,
													NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
													NumeroSolicitud : $scope.formData.NroSolicitud,
													RazonSocial : $scope.formData.mRazonSocial,
													Tipo : 2,
													CodigoEstado : 'SC',
													CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario
													Riesgos:[]
												}
											};
											if($scope.formData.pension){
												paramsP3.Riesgos.push({
													NumeroSolicitud : $scope.formData.NroSolicitud,
													CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
													CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
													CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
													NumeroRiesgo : '',
													Tipo : constants.module.polizas.sctr.pension.Tipo,
													CantidadTrabajador : $scope.formData.mNroTrabajadores,
													ImportePlanilla : $scope.formData.mImportePlanillaPension,
													Tasa : $scope.formData.mTasaPension,//$scope.formData.tasaPC.Valor2,
													SubTotal : $scope.formData.subTotalPension,
													PrimaNeta : $scope.formData.primaNetaPension,
													Factor : $scope.formData.factorPension,
													PrimaTotal: $scope.formData.primaTotalPension
												})
											}
											if($scope.formData.salud){
												paramsP3.Riesgos.push({
													NumeroSolicitud : $scope.formData.NroSolicitud,
													CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
													CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,//salud
													CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
													NumeroRiesgo : '',
													Tipo : constants.module.polizas.sctr.salud.Tipo,
													CantidadTrabajador : $scope.formData.mNroTrabajadores,
													ImportePlanilla : $scope.formData.mImportePlanillaSalud,
													Tasa : $scope.formData.mTasaSalud,//$scope.formData.tasaPC.Valor2,
													SubTotal : $scope.formData.subTotalSalud,
													PrimaNeta : $scope.formData.primaNetaSalud,
													Factor : $scope.formData.factorSalud,
													PrimaTotal: $scope.formData.primaTotalSalud
												});
											}

											grabarP3PN(paramsP3, '');
					     		}else if($scope.formData.TipoRol == 'AGT' || $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){ //SI ES AGENTE
							     	if($scope.formData.validatedPaso3 && $scope.tasasAceptadas){
							     		if (tipo==1) {
					             	rejectAgent();
					            }else if (tipo==0) {
					            	acepptAgent();
					            }
							      }else if(!$scope.tasasAceptadas){
							      	mModalAlert.showWarning('Las condiciones han sido rechazadas anteriormente, no se puede continuar', 'Tasas Rechazadas');
							      }
					     		}
					     	}
					    }
				    }
				  }else{
				  	mModalAlert.showWarning('Las condiciones han sido rechazadas anteriormente, no se puede continuar', 'Tasas Rechazadas');
				  }
	    }

	    $scope.solicitudAgente = function(){

	    	$scope.formData.mAgente = $rootScope.mAgente;

	    	$scope.validationForm();

        if(($scope.formData.TipoRol == 'AGT' || $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST')&& $scope.formData.validatedPaso3){//se tienen las tasas y es administrador
          var paramsP3 = {
						Solicitud :
						{
								CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
								DescripcionCiiuPol:  $scope.formData.mActEco.DescripcionCiiuEmp,
								NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
								NumeroSolicitud : $scope.formData.NroSolicitud,
								RazonSocial : $scope.formData.mRazonSocial,
								Tipo : 2,
								CodigoEstado : 'SC',
								CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
								FechaIniCad: $scope.formData.desde,
								FechaFinalCad: $scope.formData.hasta,
								CodCiiuPol: $scope.formData.mActEco.CodigoCiiuEmp,
								FormaPagoDescripcion: $scope.formData.mFrecDeclaracion.Descripcion,
								CentroRiesgo: $scope.formData.mCentroRiesgo,
								DescTrabPol:  $scope.formData && $scope.formData.subactividad ? $scope.formData.subactividad.Descripcion : "",
							  ClausulaManual: $scope.formData.clausulaManual,
								ClausulaAutomatica: $scope.formData.clausulaAutomatica,
								Empresa: {
									CodCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.codigo : '',
									CodDesCiiu: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.descripcion : ''
								}
						},
						Riesgos:[]
					};

           if($scope.formData.pension){
              paramsP3.Riesgos.push({
								NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
								CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
								CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
								CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
								NumeroRiesgo : '',
								Tipo : constants.module.polizas.sctr.pension.Tipo,
								CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
								ImportePlanilla : parseFloat($scope.formData.mImportePlanillaPension),
								Tasa : 0,
								SubTotal : 0,
								PrimaNeta : 0,
								Factor : parseFloat($scope.formData.factorPension),
								PrimaTotal: 0
						})
          } if($scope.formData.salud){
            paramsP3.Riesgos.push({
							NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
							CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
							CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,
							CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							NumeroRiesgo : '',
							Tipo : constants.module.polizas.sctr.salud.Tipo,
							CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
							ImportePlanilla : parseFloat($scope.formData.mImportePlanillaSalud),
							Tasa : 0,
							SubTotal : 0,
							PrimaNeta : 0,
							Factor : parseFloat($scope.formData.factorSalud),
							PrimaTotal: 0
					});
					}

					$scope.formData.salarioFueraRango = false;

					if(!$scope.formData.salarioFueraRango){
						grabarP3PN(paramsP3, $scope.formData.CodigoEstado);
					}
	      }
	    }

	    $scope.enviarAgente = function(tipo){//0 aceptada 1 rechazada
	    	if(!$scope.formData.isUploading){
		    	$scope.formData.mAgente = $rootScope.mAgente;
		    	$scope.formData.isUploading = true;

				if (tipo==0){
					$scope.validationForm();
					var p = ($scope.formData.mTasaPension || 0)
					var s = ($scope.formData.mTasaSalud || 0)
					if (
						(!$scope.formData.pension || (p <= 0 || p >100)) &&
						(!$scope.formData.salud || (s <= 0 || s >100))
					)
					{
						mModalAlert.showError("Debe ingresar una tasa menos que 100%", "Tasa");
						return;
					}

				}

	    	$scope.formData.mAgente = $rootScope.mAgente;

				  if(($scope.formData.TipoRol == 'SUS' || $scope.formData.TipoRol == 'ADM') && tipo == 0){//se tienen las tasas y es administrador
				    var paramsP3 = {
							Solicitud :
							{									
									CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
									NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
									NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
									RazonSocial : $scope.formData.mRazonSocial,
									EmailSolicitud : $scope.formData.suscriptorEmail, //'RICARDO@MULTIPLICA.COM',
									ClausulaManual: $scope.formData.clausulaManual,
									ClausulaAutomatica: $scope.formData.clausulaAutomatica,
									Tipo : 2,
									CodigoEstado : 'AS',
									CodigoUsuReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
							},
							Riesgos: []
						};

				    if($scope.formData.salud && $scope.formData.pension){

				    	if(($scope.formData.mTasaPension > 0 && $scope.formData.mTasaPension <=100)
	    					&& ($scope.formData.mTasaSalud > 0 && $scope.formData.mTasaSalud <=100)){
								  paramsP3.Riesgos.push({
										NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
										CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
										 CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
										CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
										NumeroRiesgo : $scope.formData.NumeroRiesgoPension,
										Tipo : 2,//constants.module.polizas.sctr.pension.Tipo,
										CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
										ImportePlanilla : parseFloat($scope.formData.mImportePlanillaPension),
										Tasa : parseFloat($scope.formData.mTasaPension),
										SubTotal : parseFloat($scope.formData.subTotalPension),
										PrimaNeta : parseFloat($scope.formData.primaNetaPension),
										Factor : parseFloat($scope.formData.factorPension),
										PrimaTotal: parseFloat($scope.formData.primaTotalPension)
								});
								paramsP3.Riesgos.push({
									NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
									CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
									CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,
									CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
									NumeroRiesgo : $scope.formData.NumeroRiesgoSalud,
									Tipo : 2,//constants.module.polizas.sctr.salud.Tipo,
									CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
									ImportePlanilla : parseFloat($scope.formData.mImportePlanillaSalud),
									Tasa : parseFloat($scope.formData.mTasaSalud),
									SubTotal : parseFloat($scope.formData.subTotalSalud),
									PrimaNeta : parseFloat($scope.formData.primaNetaSalud),
									Factor : parseFloat($scope.formData.factorSalud),
									PrimaTotal: parseFloat($scope.formData.primaTotalSalud)
								});

				        $scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }else if(!$scope.formData.salud && $scope.formData.pension){
				    	if($scope.formData.mTasaPension > 0 && $scope.formData.mTasaPension <=100){
				        paramsP3.Riesgos.push({
									NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
									CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
									CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
									CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
									NumeroRiesgo : $scope.formData.NumeroRiesgoPension,
									Tipo : 2,//constants.module.polizas.sctr.pension.Tipo,
									CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
									ImportePlanilla : parseFloat($scope.formData.mImportePlanillaPension),
									Tasa : parseFloat($scope.formData.mTasaPension),
									SubTotal : parseFloat($scope.formData.subTotalPension),
									PrimaNeta : parseFloat($scope.formData.primaNetaPension),
									Factor : parseFloat($scope.formData.factorPension),
									PrimaTotal: parseFloat($scope.formData.primaTotalPension)
								});
				        $scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }else if(!$scope.formData.pension && $scope.formData.salud){
				    	if($scope.formData.mTasaSalud > 0 && $scope.formData.mTasaSalud <=100){
					      paramsP3.Riesgos.push({
									NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
									CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
									CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,
									CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
									NumeroRiesgo : $scope.formData.NumeroRiesgoSalud,
									Tipo : 2,//constants.module.polizas.sctr.salud.Tipo,
									CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
									ImportePlanilla : parseFloat($scope.formData.mImportePlanillaSalud),
									Tasa : parseFloat($scope.formData.mTasaSalud),
									SubTotal : parseFloat($scope.formData.subTotalSalud),
									PrimaNeta : parseFloat($scope.formData.primaNetaSalud),
									Factor : parseFloat($scope.formData.factorSalud),
									PrimaTotal: parseFloat($scope.formData.primaTotalSalud)
								});
				      	$scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }

				    grabarP3PN(paramsP3, 'AS');
				  }else if(($scope.formData.TipoRol === 'SUS' || $scope.formData.TipoRol === 'ADM') && tipo === 1){//se tienen las tasas y es administrador
				    var paramsP3 = {};

				    if($scope.formData.salud && $scope.formData.pension){
				    	if(tipo === 1){
				        paramsP3 = {
				            Solicitud :
				            {
				                CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
				                NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
				                NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
				                RazonSocial : $scope.formData.mRazonSocial,
				                EmailSolicitud : $scope.formData.suscriptorEmail, //'RICARDO@MULTIPLICA.COM',
				                Tipo : 2,
				                CodigoEstado : 'RS',
				                CodigoUsuReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
				            }
				        };
				        $scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }else if(!$scope.formData.salud && $scope.formData.pension){
				    	if(tipo === 1){
				        paramsP3 = {
				            Solicitud :
				            {
				                CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
						            DescripcionCiiuPol:  $scope.formData.mActEco.DescripcionCiiuEmp,
						            NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
						            NumeroSolicitud : $scope.formData.NroSolicitud,
						            RazonSocial : $scope.formData.mRazonSocial,
						            Tipo : 2,
						            CodigoEstado : 'RS',
						            CodUserReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
				            }
				        };
				        $scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }else if(!$scope.formData.pension && $scope.formData.salud){
				    	if(tipo === 1){
					      paramsP3 = {
					          Solicitud :
					          {
					              CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
							          DescripcionCiiuPol:  $scope.formData.mActEco.DescripcionCiiuEmp,
							          NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
							          NumeroSolicitud : $scope.formData.NroSolicitud,
							          RazonSocial : $scope.formData.mRazonSocial,
							          Tipo : 2,
							          CodigoEstado : 'RS',
							          CodUserReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
					          }
					      };
					      $scope.tasaValida = true;
				      }else{
				      	$scope.tasaValida = false;
				      }
				    }

				    grabarP3PN(paramsP3, 'RS');
				  }
				}
			//	}
			}

			$scope.continuarAdminPN = function(){
				$scope.validationForm();

				$scope.formData.mAgente = $rootScope.mAgente;

        if($scope.formData.pension && $scope.formData.salud){
            $scope.formData.salarioFueraRango = false;
            if((parseFloat($scope.formData.mTasaPension) > 0 && parseFloat($scope.formData.mTasaPension) <=100)
              && (parseFloat($scope.formData.mTasaSalud) > 0 && parseFloat($scope.formData.mTasaSalud) <=100)){
              continuarCalculoPaso4();
            }
        } else if($scope.formData.pension) {
            $scope.formData.salarioFueraRango = false;
            if ((parseFloat($scope.formData.mTasaPension) > 0 && parseFloat($scope.formData.mTasaPension) <= 100)) {
              continuarCalculoPaso4();
            }
        } else if($scope.formData.salud) {
            $scope.formData.salarioFueraRango = false;
            if ((parseFloat($scope.formData.mTasaSalud) > 0 && parseFloat($scope.formData.mTasaSalud) <= 100)) {
              continuarCalculoPaso4();
            }
        }
			}

			function continuarCalculoPaso4() {
        if($scope.formData.TipoRol === 'ADM'){
          var paramsP3 = {
            Solicitud :
              {
                NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
                Tipo : 2,
                ClausulaManual: $scope.formData.clausulaManual,
                ClausulaAutomatica: $scope.formData.clausulaAutomatica,
                CodigoEstado : 'AT',
                CodigoUsuReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
              },
            Riesgos:[]
          };

          if($scope.formData.pension){

            if(($scope.formData.mTasaPension > 0 && $scope.formData.mTasaPension <=100)){
              $scope.tasasOK = true;
              paramsP3.Riesgos.push(
                {
                  NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
                  CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
                  CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
                  CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  NumeroRiesgo : $scope.formData.NumeroRiesgoPension,
                  Tipo : 1,//constants.module.polizas.sctr.pension.Tipo,
                  CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
                  ImportePlanilla : parseFloat($scope.formData.mImportePlanillaPension),
                  Tasa : parseFloat($scope.formData.mTasaPension),
                  SubTotal : parseFloat($scope.formData.subTotalPension),
                  PrimaNeta : parseFloat($scope.formData.primaNetaPension),
                  Factor : parseFloat($scope.formData.factorPension),
                  PrimaTotal: parseFloat($scope.formData.primaTotalPension)
                }

              );
            }
          } if($scope.formData.salud){
            if(($scope.formData.mTasaSalud > 0 && $scope.formData.mTasaSalud <=100)){
              $scope.tasasOK = true;

              paramsP3.Riesgos.push(
                {
                  NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
                  CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
                  CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,
                  CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  NumeroRiesgo : $scope.formData.NumeroRiesgoSalud,
                  Tipo : 1,//constants.module.polizas.sctr.salud.Tipo,
                  CantidadTrabajador : parseInt($scope.formData.mNroTrabajadores),
                  ImportePlanilla : parseFloat($scope.formData.mImportePlanillaSalud),
                  Tasa : parseFloat($scope.formData.mTasaSalud),
                  SubTotal : parseFloat($scope.formData.subTotalSalud),
                  PrimaNeta : parseFloat($scope.formData.primaNetaSalud),
                  Factor : parseFloat($scope.formData.factorSalud),
                  PrimaTotal: parseFloat($scope.formData.primaTotalSalud)
                }
              );
            }
          }

          if($scope.tasasOK && !$scope.formData.paso3Grabado){
            grabarP3PN(paramsP3, 'AT');
            $scope.formData.paso3GrabadoNotEdit = true;
            $scope.formData.suscriptorAS = true;
          }
          else{
            $scope.$parent.formData = $scope.formData
            $state.go('.',{
              step: 4
            });

          }

        }else if($scope.formData.TipoRol == 'SUS' && $scope.cotizacion[0].Solicitud.CodigoEstado=='AS'){
          mModalAlert.showInfo('Las condiciones aún no han sido aceptadas/rechazadas por el agente', 'Paso 3');
        }else{
          if($scope.cotizacion[0].Solicitud.CodigoEstado=='AT' && $scope.formData.TipoRol == 'SUS'){
            $scope.$parent.formData = $scope.formData
            $state.go('.',{
              step: 4
            });
          }
        }
      }

      function grabarP3PN(paramsP3, estado){				
      	if($scope.formData.mAgente.codigoAgente !== '0'){

					if($scope.formData.TipoRol === 'ADM' &&
						(estado !== 'AS' || estado !== 'RS') &&
						($scope.formData.CodigoEstado!=='SC' && $scope.formData.CodigoEstado!=='AS')){//se tienen las tasas y es administrador
	      		sctrEmitFactory.grabarPasos3PNAdmin(paramsP3, true).then(function(response){
	      			$scope.formData.isUploading = false;
							if (response.OperationCode === constants.operationCode.success){
								$scope.formData.paso3 = response.Data;
								$scope.formData.paso3Grabado = true;

								$timeout(function(){
									$scope.$parent.formData = $scope.formData;
									$state.go('.',{
					            step: 4
					        	});
				        }, 2000);

							}else{
								$scope.formData.paso3Grabado = false;
								mModalAlert.showError(response.Message, 'Paso 3');
							}
						});

					}else if(($scope.formData.TipoRol === 'AGT' || $scope.formData.TipoRol === 'EAC' || $scope.formData.TipoRol === 'GST') &&
					(!$scope.formData.tasasPN || estado === sctrStates.devoler.code ) && estado !== 'SC'  && estado!== 'AS' && estado !=='RS'){//se tienen las tasas y es administrador
	      		sctrEmitFactory.grabarPasos3PNSolicitudAgt(paramsP3, true).then(function(response){
	      			$scope.formData.isUploading = false;
							if (response.OperationCode === constants.operationCode.success){
								$scope.formData.paso3 = response.Data;
								$scope.formData.paso3Grabado = true;
								$scope.formData.CodigoEstado = 'SC';
								$timeout(function(){
									mModalAlert.showInfo('Se le notificará cuando el Suscriptor establezca la(s) tasa(s)', 'El documento ha sido enviado con éxito');

									$scope.formData.estadoSolicitudAgente = 'Enviado para aprobación.';
									$scope.formData.SolEnviada = true;
									$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
					        }, 2000);
							}else{

								$scope.formData.paso3Grabado = false;
								mModalAlert.showError(response.Message, 'Paso 3');
							}
						});
	      	}else if(($scope.formData.TipoRol === 'AGT' || $scope.formData.TipoRol === 'EAC' || $scope.formData.TipoRol === 'GST')&& $scope.formData.tasasPN && (estado ==='AT' || estado ==='RT')){//se tienen las tasas y es administrador
	      		sctrEmitFactory.grabarPasos3PNAgt(paramsP3, true).then(function(response){
	      			$scope.formData.isUploading = false;
							if (response.OperationCode === constants.operationCode.success){
								$scope.formData.paso3 = response.Data;
								$scope.formData.paso3Grabado = true;

								if(estado ==='RT'){
									mModalAlert.showWarning('Las condiciones han sido rechazadas anteriormente, no se puede continuar', 'Tasas Rechazadas');

									$timeout(function(){
										$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
					        }, 2000);

								}else{
									$timeout(function(){
										$scope.$parent.formData = $scope.formData
									  $state.go('.',{
						            step: 4
						        });
					        }, 1000);
								}
							}else{
								$scope.formData.paso3Grabado = false;
								mModalAlert.showError(response.Message, 'Paso 3');
							}
						});
					}else if(($scope.formData.TipoRol == 'SUS' || $scope.formData.TipoRol == 'ADM') &&
					  ($scope.formData.CodigoEstado=='SC' || $scope.formData.CodigoEstado == sctrStates.reajusteTasa.code )){//se tienen las tasas y es administrador
	      		sctrEmitFactory.grabarPasos3PNEnviarApro(paramsP3, true).then(function(response){
	      			$scope.formData.isUploading = false;
							if (response.OperationCode == constants.operationCode.success){
								$scope.formData.paso3 = response.Data;
								$scope.formData.paso3Grabado = true;
								$scope.formData.tasaAprobadaSus = true;

								$timeout(function(){

									var message = response.Message.replace(/<br\s*\/?>/mg,"\n");
									$scope.formData.tasasEnviadas = true;
									if($scope.formData.TipoRol == 'SUS'){
										if(estado=='AS'){
											$timeout(function(){
												mModalAlert.showInfo('Datos actualizados correctamente', 'Solicitud Aceptada');
												$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
								       }, 2000);
										}else{
											$timeout(function(){
												mModalAlert.showInfo('Datos actualizados correctamente', 'Solicitud Rechazada');
												$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
								       }, 2000);
										}
					        }else if($scope.formData.TipoRol == 'ADM'){
										if(estado == 'AS'){
											mModalAlert.showSuccess(message, 'Paso 3');//showInfo
							          $state.go('.',{
							            step: 4
							        	});
										}else{
											mModalAlert.showInfo('Solicitud de agente rechazada', 'Paso 3');//showInfo
											$scope.formData.rechazado = true;
											$state.go('bandejaSCTR', {documentNumber: $scope.formData.NroSolicitud}, {reload: true, inherit: false});
										}

					        }

					      }, 2000);
							}else{
								$scope.formData.paso3Grabado = false;
								mModalAlert.showError(response.Message, 'Paso 3');
							}
						});
	      	}

	      	if($scope.formData.TipoRol == 'ADM' && $scope.formData.CodigoEstado =='AS'){//se tienen las tasas y es administrador
	    			$timeout(function(){
		          $state.go('.',{
			            step: 4
			        	});
		        }, 500);
	      	}
      	}else{
      		mModalAlert.showError("No tiene un agente seleccionado", "Error");
      	}
      };

    	/*########################
      # Grabar Paso # 3
      ########################*/
      function reject(){
      	$scope.formData.mAgente = $rootScope.mAgente;
				var paramsP3 = {
					Solicitud :
					{
						NumeroSolicitud : $scope.formData.NroSolicitud,
						Tipo : 2, //fijo
						CodigoEstado : 'RT',
						CodigoUsuReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
					},
					Riesgos:[]
				};
	 			if( $scope.formData.pension){
					paramsP3.Riesgos.push({//pension
						NumeroSolicitud : $scope.formData.NroSolicitud,
						CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
						CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,
						CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
						NumeroRiesgo : '',
						Tipo : constants.module.polizas.sctr.pension.Tipo,
						CantidadTrabajador : $scope.formData.mNroTrabajadores,
						ImportePlanilla : $scope.formData.mImportePlanillaPension,
						Tasa : $scope.formData.mTasaPension,//$scope.formData.tasaPC.Valor2,
						SubTotal : $scope.formData.subTotalPension,
						PrimaNeta : $scope.formData.primaNetaPension,
						Factor : $scope.formData.factorPension,
						PrimaTotal : $scope.formData.primaTotalPension
					});
				}
				if( $scope.formData.salud){
						paramsP3.Riesgos.push({//salud
							NumeroSolicitud : $scope.formData.NroSolicitud,
							CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
							CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,//salud
							CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							NumeroRiesgo : '',
							Tipo : constants.module.polizas.sctr.salud.Tipo,
							CantidadTrabajador : $scope.formData.mNroTrabajadores,
							ImportePlanilla : $scope.formData.mImportePlanillaSalud,
							Tasa : $scope.formData.mTasaSalud,//$scope.formData.tasaPC.Valor2,
							SubTotal : $scope.formData.subTotalSalud,
							PrimaNeta : $scope.formData.primaNetaSalud,
							Factor : $scope.formData.factorSalud,
							PrimaTotal: $scope.formData.primaTotalSalud
						});
      	}

      	//if(!$scope.formData.errorImportes){
      		$scope.formData.rechazado = true;
    	  	grabarP3PC(paramsP3);
      	//}
      }

      function rejectAgent(){
      	$scope.formData.mAgente = $rootScope.mAgente;
				var paramsP3 = {};

      	if($scope.formData.salud || $scope.formData.pension){

						paramsP3 = {
							Solicitud :
							{
								NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
								Tipo : 2,
								CodigoEstado : 'RT',
								CodigoUsuReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
								NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
								RazonSocial : $scope.formData.mRazonSocial,
								CodigoAgente : parseInt($scope.formData.mAgente.codigoAgente)
							}
						};
      	}
      		$scope.formData.rechazado = true;
    	  	grabarP3PN(paramsP3, 'RT');
      }

      function aceppt(){
      	$scope.formData.mAgente = $rootScope.mAgente;
      	var paramsP3 = {
					Solicitud :
					{
						NumeroSolicitud : $scope.formData.NroSolicitud,
						Tipo : 2, //fijo
						CodigoEstado : 'AT',
						CodigoUsuReg : oimClaims.loginUserName.toUpperCase()//$scope.formData.mAgente.codigoUsuario
					},
					Riesgos :[]
				};

 				if($scope.formData.salud ){
						paramsP3.Riesgos.push(	{//salud
							NumeroSolicitud : $scope.formData.NroSolicitud,
							CodigoCompania : constants.module.polizas.sctr.salud.CodigoCompania,
							CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo,
							CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							NumeroRiesgo : '',
							Tipo : constants.module.polizas.sctr.salud.Tipo,
							CantidadTrabajador : $scope.formData.mNroTrabajadores,
							ImportePlanilla : $scope.formData.mImportePlanillaSalud,
							Tasa : $scope.formData.mTasaSalud,//$scope.formData.tasaPC.Valor2,
							SubTotal : $scope.formData.subTotalSalud,
							PrimaNeta : $scope.formData.primaNetaSalud,
							Factor : $scope.formData.factorSalud,
							PrimaTotal: $scope.formData.primaTotalSalud
						});
				}
				if($scope.formData.pension){
						paramsP3.Riesgos.push({//pension
							NumeroSolicitud : $scope.formData.NroSolicitud,
							CodigoCompania : constants.module.polizas.sctr.pension.CodigoCompania,
							CodigoRamo : constants.module.polizas.sctr.pension.CodigoRamo,//pension
							CodUserReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
							NumeroRiesgo : '',
							Tipo : constants.module.polizas.sctr.pension.Tipo,
							CantidadTrabajador : $scope.formData.mNroTrabajadores,
							ImportePlanilla : $scope.formData.mImportePlanillaPension,
							Tasa : $scope.formData.mTasaPension,//$scope.formData.tasaPC.Valor2,
							SubTotal : $scope.formData.subTotalPension,
							PrimaNeta : $scope.formData.primaNetaPension,
							Factor : $scope.formData.factorPension,
							PrimaTotal: $scope.formData.primaTotalPension
						});
      	}

    	  $scope.nextStep(paramsP3);
      }

      function acepptAgent(){
      	$scope.formData.mAgente = $rootScope.mAgente;
				var paramsP3 = {};

      	if($scope.formData.salud || $scope.formData.pension){
						paramsP3 = {
							Solicitud :
							{
								NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
								Tipo : 2,
								CodigoEstado : 'AT',
								CodigoUsuReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
								NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
								RazonSocial : $scope.formData.mRazonSocial,
								CodigoAgente : parseInt($scope.formData.mAgente.codigoAgente)
							}
						};
      	}

      	grabarP3PN(paramsP3, 'AT');
      	$scope.formData.rechazado = false;
      }

      $scope.nextStep = function(paramsP3){

      	grabarP3PC(paramsP3);
      };

      function grabarP3PC(paramsP3){
				
				
				if($scope.formData.mAgente.codigoAgente != '0'){
					sctrEmitFactory.grabarPasos3PC(paramsP3, true).then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.formData.paso3 = response.Data;
							$scope.formData.paso3Grabado = true;
							if(!$scope.formData.rechazado){
								$timeout(function(){
				      		$state.go('.',{
						            step: 4
						        });
					      }, 2000);
							}
						}else{
							$scope.formData.paso3Grabado = false;
							mModalAlert.showError(response.Message, 'Paso 3');
						}
					});
				}else{
					mModalAlert.showError("No tiene un agente seleccionado", "Error");
				}
      };

      $scope.continuarAT = function(){
				
      	if($scope.formData.CodigoEstado == 'AT'){
					$timeout(function(){
	      		$state.go('.',{
			            step: 4
			        });
		      }, 2000);
				}
      }

      $scope.validationForm = function(){
      	$scope.frmSCTR3.markAsPristine();
        if (typeof $scope.formData.mNroTrabajadores == 'undefined'){
            //mModalAlert.showWarning('Por favor verifique y/o complete los datos identificados con (*)', 'Datos Erróneos');
            $scope.formData.validatedPaso3 =  false;
        }else{
            $scope.formData.validatedPaso3 =  true;
        }



        if($scope.formData.salud || $scope.formData.pension){
					if(($scope.formData.salud && typeof $scope.formData.mImportePlanillaSalud == 'undefined') ||
						( $scope.formData.pension && typeof $scope.formData.mImportePlanillaPension == 'undefined')){
						$scope.formData.validatedPaso3 =  false;
					}else{
						$scope.formData.validatedPaso3 =  true;
					}
				}else{

					if($scope.formData.salud){
						if(typeof $scope.formData.mImportePlanillaSalud == 'undefined'){
							$scope.formData.validatedPaso3 =  false;
					}else{
						$scope.formData.validatedPaso3 =  true;
					}

					}else if($scope.formData.pension){
						if(typeof $scope.formData.mImportePlanillaPension == 'undefined'){
							$scope.formData.validatedPaso3 =  false;
					}else{
						$scope.formData.validatedPaso3 =  true;
					}
					}

				}
      }

      function CalcularPrimaMinimaTotal(subtotal){
					return subtotal;
      }

      function isRuc(){
      	$scope.formData.showNaturalRucPerson = !mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
      }
      $scope.renderHTML = function (html_code){
      	if(html_code) {
	      	var decoded = angular.element('<textarea />').html(html_code).text();
	            return $sce.trustAsHtml(decoded);
	      }
			}
    }]);
});
