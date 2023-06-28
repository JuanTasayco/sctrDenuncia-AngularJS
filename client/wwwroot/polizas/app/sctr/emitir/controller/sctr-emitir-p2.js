(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper', 'jquery'],
	function(angular, constants, helper, jq){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrEmitirS2Controller',
			['$scope', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', 'proxySctr', 'mModalAlert', '$uibModal', '$stateParams', 'oimClaims', 'mainServices','$window','mapfreAuthetication'
			, 'accessSupplier',
			function($scope, $state, $timeout, $rootScope, sctrEmitFactory, proxySctr, mModalAlert, $uibModal, $stateParams, oimClaims, mainServices,$window,mapfreAuthetication,accessSupplier){

      (function onLoad(){
		proxySctr.GenerarRestriccion("EMISION").then(function (response) {
			if(response.OperationCode===200){
				$scope.formData.showRamos = response.Data;
				$scope.formData.pension = ($scope.formData.showRamos.Pension === 'S') ? false : true;
				$scope.formData.salud = ($scope.formData.showRamos.Salud === 'S') ? false : true;
			}
			else if(response.OperationCode===401){
				mModalAlert.showError("Al obtener credenciales de acceso para la restricción de pólizas SCTR (Pensión/Salud)","error")
				.then(function(response){
					mapfreAuthetication.signOut()
                	.then(function() {
                  	mapfreAuthetication.goLoginPage(false);
                  	accessSupplier.clean();});
				})
				.catch(function () {
					mapfreAuthetication.signOut()
                	.then(function() {
                  	mapfreAuthetication.goLoginPage(false);
                  	accessSupplier.clean();});
				})
			}
		})
      	proxySctr.ValidarAgente().then(function(response){
          if(response.Data && response.Data.Bloqueado == 1){
            $state.go('sctrHome');
          }else{
		        $scope.formData = $rootScope.formData || {};
		        $scope.formData.mAgente = $rootScope.mAgente;
		        $scope.formData.isUploading = false;						

		        // @TODO Jordi - Descomentar después

		        // if(typeof $rootScope.formData == 'undefined'){
		        // 	 $scope.formData.permitir = true;
		        // 	 $state.go('.',{
				      //     step: 1
				      //   });
		        // }

		 				function setRole(){
							if (angular.isArray($state.current.submenu)){
								$scope.formData.onlyRole = $state.current.submenu.length == 1
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

						if($scope.formData.agenteBloqueado){
              $state.go('sctrHome');
            }

						if(typeof $scope.formData.TipoRol == 'undefined'){
							setRole();
						}

		        $scope.formData.quotation = $stateParams.quotation;
		        $scope.formData.tipoSCTR = $stateParams.tipo;

						if($scope.formData.quotation > 0){cargarPaso1();}else{
							$scope.formData.dataContractor2 = {};
							$scope.formData.dataContractor2.EmailUsuario = $scope.formData.mCorreoElectronico;
							$scope.formData.dataContractor2.Telefono = $scope.formData.mTelefonoFijo;
							$scope.formData.dataContractor2.McaReciboPendienteSalud = $scope.formData.McaReciboPendienteSalud
			      	$scope.formData.dataContractor2.McaReciboPendientePension = $scope.formData.McaReciboPendientePension;

				      if($scope.formData && !$scope.formData.esCliente){
								$scope.formData.dataContractor2.McaReciboPendientePension  = 'N';
								$scope.formData.dataContractor2.McaReciboPendienteSalud  = 'N';
							}
						}

						if($scope.formData.paso1Grabado){
			       		disableNextStep();
				     }else{
				        $state.go('.',{
				          step: 1
				        });
				      }

			      if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
			      	$scope.formData.pNormal = false;
			 				sctrEmitFactory.getFrecuencia(1, false).then(function(response){
								if (response.OperationCode == constants.operationCode.success){
									$scope.frecDeclaracionData = response.Data;
								}
							});
			      }else{
			      	$scope.formData.pNormal = true;
							sctrEmitFactory.getFrecuencia(2, false).then(function(response){
								if (response.OperationCode == constants.operationCode.success){
									$scope.frecDeclaracionData = response.Data;
								}
							});
			       }

		        jq('html, body').animate({
		          scrollTop: jq('.js-section-emitir').offset().top - 170
		        }, 1000);


		      	if(typeof $scope.formData.mFrecDeclaracion != 'undefined'){
		      		changeCobertura();
		      	}
	      	}
        }, function(response){
          //defer.reject(response);
        });
      })();

      $scope.$watch('formData', function(nv)
	    {
	      $rootScope.formData =  nv;
	    })

	    function disableNextStep(){
	      $scope.formData.thirdStepNextStep = false;
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
		      if (typeof $scope.formData.thirdStepNextStep == 'undefined') $scope.formData.thirdStepNextStep = false;
		      if (parseInt(e.step) < 3) {
		        e.cancel = false;
		      }else {
		      	$scope.formData.validatedPaso2 = $scope.frmSCTR2.$valid ? true : false;
		      	if(parseInt(e.step)>=4){
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
	      		}else
			      	if($scope.formData.validatedPaso2 && $scope.formData.paso2Grabado){
								e.cancel = false;
			      	}else{
			      		e.cancel = true;
	        			disableNextStep();
			      	}
		      }
		    });

	    function cargarPaso1(){

	    	$scope.formData.paso1Grabado = true;

				var paramsCoti = {

					NumeroSolicitud: $scope.formData.quotation,
  				Tipo: 1,
  				TipoRol: $scope.formData.TipoRol

				};

				$scope.formData.NroSolicitud = $scope.formData.quotation;
				sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

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

						$scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;
						$scope.formData.dataContractor2 = {};
			      $scope.formData.dataContractor2.EmailUsuario = $scope.cotizacion[0].EmailUsuario;
			      $scope.formData.dataContractor2.Telefono = $scope.cotizacion[0].Telefono;
			      $scope.formData.dataContractor2.McaReciboPendienteSalud = $scope.cotizacion[0].McaReciboPendienteSalud;
			      $scope.formData.dataContractor2.McaReciboPendientePension = $scope.cotizacion[0].McaReciboPendientePension;

						//recuperamos el rol
						//$scope.formData.TipoRol = $scope.cotizacion[0].Solicitud.RolUsuario;
						//tipo de seguro
						if($scope.cotizacion.length==2){
							$scope.formData.salud = true;
							$scope.formData.pension = true;
						}else if($scope.cotizacion[0].CodigoCompania==3){
							$scope.formData.salud = true;

						}else if($scope.cotizacion[0].CodigoCompania==2){
							$scope.formData.pension = true;

						}

						//paso
						if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg>=2){
							$scope.paso2 = true;

							$scope.formData.mTipoDocumento = {Codigo:$scope.cotizacion[0].TipoDocumento, Descripcion:$scope.cotizacion[0].TipoDocumento};
							$scope.formData.mNumeroDocumento = $scope.cotizacion[0].NumeroDocumento;

							$scope.buscarContratante();

							$scope.formData.mRazonSocial = $scope.cotizacion[0].RazonSocial;


							$scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
				      $scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;
				      $scope.formData.McaFisico		         = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
				      $scope.formData.mSexo 							 = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;

				      $scope.formData.mProfesion = {};
				      $scope.formData.mProfesion.Codigo 	 = ($scope.cotizacion[0].CodigoProfesion == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;

							$scope.formData.mActivSunat = {codigo:$scope.cotizacion[0].CodigoCiiuEmp, descripcion: $scope.cotizacion[0].DescripcionCiiuEmp};

							$scope.formData.mDirReferencias = $scope.cotizacion[0].Referencia;
							$scope.formData.mRepresentante = $scope.cotizacion[0].Representante;
							$scope.formData.mRepresentanteCargo = {Codigo:$scope.cotizacion[0].TipoCargoRep, Descripcion: $scope.cotizacion[0].CargoRepresentante};
							isRuc();
							getClausula();
						}else if($scope.cotizacion[0].Solicitud.SecuenciaReg>=2){
							$scope.paso2 = true;

							$scope.formData.mTipoDocumento = {Codigo:$scope.cotizacion[0].TipoDocumento, Descripcion:$scope.cotizacion[0].TipoDocumento};
							$scope.formData.mNumeroDocumento = $scope.cotizacion[0].NumeroDocumento;

							$scope.buscarContratante();

							$scope.formData.mRazonSocial = $scope.cotizacion[0].RazonSocial;


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

							$scope.formData.mActivSunat = {codigo:$scope.cotizacion[0].CodigoCiiuEmp, descripcion: $scope.cotizacion[0].DescripcionCiiuEmp};

							$scope.formData.mDirReferencias = $scope.cotizacion[0].Referencia;
							$scope.formData.mRepresentante = $scope.cotizacion[0].Representante;
							$scope.formData.mRepresentanteCargo = {Codigo:$scope.cotizacion[0].TipoCargoRep, Descripcion: $scope.cotizacion[0].CargoRepresentante};

							isRuc();

							if($scope.cotizacion[0].Solicitud.CodigoEstado=='SC' || $scope.cotizacion[0].Solicitud.CodigoEstado=='RE')
								$scope.formData.paso3GrabadoNotEdit = false;
							else
								$scope.formData.paso3GrabadoNotEdit = true;

							if($scope.cotizacion[0].Solicitud.SecuenciaReg>2){
								$scope.formData.paso2Grabado = true;
								$scope.formData.paso3Grabado = true;

								$scope.formData.mActEco = {
									CodigoCiiuEmp: $scope.cotizacion[0].Solicitud.CodCiiuPol,
									DescripcionCiiuEmp: $scope.cotizacion[0].Solicitud.DescripcionCiiuPol,
									codigoDescricionCiiu: $scope.cotizacion[0].Solicitud.CodCiiuPol + '-' + $scope.cotizacion[0].Solicitud.DescripcionCiiuPol
								};
								$scope.formData.mCentroRiesgo = $scope.cotizacion[0].Solicitud.ColegAseg;
								$scope.formData.ColegAseg = $scope.formData.mCentroRiesgo;
								$scope.formData.subactividad = {
									Descripcion: $scope.cotizacion[0].Solicitud.DescTrabPol
								};

		            $scope.formData.mFrecDeclaracion = {
									Codigo : $scope.cotizacion[0].Solicitud.FormaPago,
									Descripcion: $scope.cotizacion[0].Solicitud.FormaPagoDescripcion
								}

								$scope.formData.desde = $scope.cotizacion[0].Solicitud.FechaEfectivoPoliza;
								$scope.formData.hasta = $scope.cotizacion[0].Solicitud.FechaVencimientoPoliza;

								$scope.formData.descripcionDuracion = sctrEmitFactory.getDescripcionDuracion($scope.formData.desde, $scope.formData.hasta);
								$scope.formData.mDuracionCobertura = {
									Codigo: $scope.cotizacion[0].CodigoCobertura
								};
							}else{
								$scope.formData.paso3Grabado = false;
								getClausula();
							}
						}

					}
				});
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

	    /*########################
      # Vigencia
      ########################*/

      $scope.format = 'dd/MM/yyyy';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
          opened: false
      };

      $scope.open1 = function() {
          $scope.popup1.opened = true;
      };

      if ($scope.formData){

	      $scope.formData.mConsultaDesde = new Date();

	      if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
	      	//Solo 2 dias antes
	      	 $scope.dateOptions = {
			        initDate: new Date(),
			        // maxDate: new Date(),
			        minDate: new Date(new Date().setDate(new Date().getDate()-2))
			      };
	      }else{
	      	//principios de mes
	      	 $scope.dateOptions = {
			        initDate: new Date(),
			        // maxDate: new Date(),
			        minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
			      };
	      }
	    }

      $scope.$watch('formData.mConsultaDesde',function(){
				if($scope.formData && $scope.formData.mConsultaDesde!=null){
					$scope.formData.desde = sctrEmitFactory.formatearFecha($scope.formData.mConsultaDesde);
				}
			});

			$scope.calcularFinVigencia = function(){
				if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
					$scope.formData.hasta = sctrEmitFactory.agregarMes($scope.formData.mConsultaDesde, $scope.formData.mDuracionCobertura.Codigo);
					$scope.formData.hasta = sctrEmitFactory.formatearFecha($scope.formData.hasta);
				}else if($scope.formData.tipoSCTR!=constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
					//periodo normal
					$scope.formData.hasta = sctrEmitFactory.firstDate(sctrEmitFactory.agregarMes($scope.formData.mConsultaDesde, $scope.formData.mDuracionCobertura.Codigo));
				}
			}

			/*########################
      # Actividad SUNAT
      ########################*/
    	var seed = undefined;
    	$scope.loading = false;

    	$scope.searchActividadOptions = [];
    	$scope.subactividadOptions = [];

    	// @TODO Jordi - Buscar el sitio para la propiedad subactividad
      $scope.subactividad = null;

    	$scope.searchActividadEco = function(wilcar) {
    	  if (!wilcar || wilcar.length < 3) {
          $scope.searchActividadOptions = [];
          return;
        }

        sctrEmitFactory.getActividadEco({
          CodigoDescripcionCiiuEmp: wilcar.toUpperCase(),
          Solicitud: {
            TipoPeriodo:
              $scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo
                ? constants.module.polizas.sctr.periodoCorto.TipoPeriodo
                : constants.module.polizas.sctr.periodoNormal.TipoPeriodo
          },
          CodigoGrupo: constants.module.polizas.sctr.periodoCorto.CodigoGrupo,
          TamanoPagina : 10,
          NumeroPagina : 1
        }).then(function(res) {
          $scope.searchActividadOptions = res.Data.length ? res.Data : [];
        });
      };

			function getClausula() {
				proxySctr.GetListClausulaAutomaticaByCiiu($scope.formData.mActEco.CodigoCiiuEmp, true)
				.then(function(response){
					$scope.formData.clausulaAutomatica2 = response.Data && response.Data.length>0 ?
																	//response.Data[0].Nombre:"";
																	response.Data:"";
					$scope.formData.clausulaAutomatica = "";
					if($scope.formData.clausulaAutomatica2!=""){
						angular.forEach($scope.formData.clausulaAutomatica2, function(value,key){
	            $scope.formData.clausulaAutomatica += $scope.formData.clausulaAutomatica2[key].Nombre + ". ";
	          });
					}else{
						$scope.formData.clausulaAutomatica = $scope.formData.clausulaAutomatica2;
					}
				});
			}

    	$scope.selectActividadEco = function(selection) {
				$scope.formData.mActEco = selection;
				getClausula();
       	getSubActivities(selection.CodigoCiiuEmp);
      };

      function getSubActivities(codigo){
      	 proxySctr.GetListSubactividadByCiiu(codigo, true).then(function(response) {
          $scope.subactividadOptions = response.Data || [];
          $scope.formData.arrayExample = [];
          angular.forEach($scope.subactividadOptions, function (item) {
	          $scope.formData.arrayExample.push({
	              Codigo: item.IdSubactividad,
	              Descripcion: item.Nombre
	            });
	          });
	          if($scope.formData.arrayExample.length == 0 || !$scope.formData.arrayExample){
	        		mModalAlert.showError("Favor comuníquese con su gestor comercial porque no hay subactividades configuradas para la actividad seleccionada", "Error");
	        }
        })
      }

      $scope.showModalActivities = function() {
        var vModal = $uibModal.open({
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          template: '<sctr-Mng-Search-Activity hiden-period="true" on-activity="selectActivity($event)" on-close="closeModal()" type-periodo="typePeriodo"></sctr-Mng-Search-Activity>',
          controller: ['$scope', '$uibModalInstance', '$uibModal',
            function ($scope, $uibModalInstance) {
							$scope.typePeriodo = {codigo: $stateParams.tipo}
							$scope.selectActivity = function(event){
								$uibModalInstance.close(event);
							}
              $scope.closeModal = function () {
                $uibModalInstance.close({});
              };
            }]
        });
        vModal.result.then(function(response){
					if(response.selectedItem){
						$scope.formData.arrayExample = [];
						$scope.formData.subactividad = undefined;
						$scope.selectActividadEco(response.selectedItem);
					}
        });
      };

      $scope.showModalSubActivities = function() {
      	if (!$scope.formData.arrayExample) {
					getSubActivities($scope.cotizacion[0].Solicitud.CodCiiuPol);
					$timeout(function(){
						if($scope.formData.arrayExample.length === 0 || !$scope.formData.arrayExample){
	        		mModalAlert.showError("Favor comuníquese con su gestor comercial porque no hay subactividades configuradas para la actividad seleccionada", "Error");
	        	} else {
	         	openModalSubActivities();
	         }
	        }, 500);
      	}else{
      		if($scope.formData.arrayExample.length === 0 || !$scope.formData.arrayExample){
	        		mModalAlert.showError("Favor comuníquese con su gestor comercial porque no hay subactividades configuradas para la actividad seleccionada", "Error");
	        	} else {
	         	openModalSubActivities();
	         }
      	}
      };

      function openModalSubActivities(){
	      var vModal = $uibModal.open({
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          template: '<sctr-Mng-Search-Subactivity on-activity="selectActivity($event)" on-close="closeModal()" subactividades="subactividades"></sctr-Mng-Search-Subactivity>',
          controller: ['$scope', '$uibModalInstance', '$uibModal',
            function ($scope, $uibModalInstance) {
							$scope.subactividades = $scope.formData.arrayExample;
							$scope.selectActivity = function(event){
								$uibModalInstance.close(event);
							}
              $scope.closeModal = function () {
                $uibModalInstance.close({});
              };
            }]
        });
        vModal.result.then(function(response){
					if(response.selectedItem){
						$scope.formData.subactividad = response.selectedItem;
					}
        });
      }

    	/*#########################
	    # ModalConfirmation
	    #########################*/
	    $scope.showModalConfirmation = function(){
	    	if($scope.formData.paso3GrabadoNotEdit){
					$timeout(function(){
	          $state.go('.',{
		            step: 3
		        });
	        }, 500);
	    	}else{
	    		$scope.validationForm();
		      if($scope.formData.validatedPaso2){// && $scope.formData.arrayExample.length>0){
		      	if($scope.formData.subactividad && $scope.formData.subactividad){//.Codigo != null){
			        $scope.showRequieredSubActivity = false;
			        $scope.dataConfirmation = {
			          save:false,
			          title: '¿Estás seguro que quieres guardar los datos de la póliza?',
			          subTitle: 'Recuerda que una vez guardados los datos no podrás hacer cambios',
			          lblClose: 'Seguir editando',
			          lblSave: 'Guardar y continuar'
			        };
			        var vModalSteps = $uibModal.open({
			          backdrop: true, // background de fondo
			          backdropClick: true,
			          dialogFade: false,
			          keyboard: true,
			          scope: $scope,
			          // size: 'lg',
			          template : '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
			          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
			            //CloseModal
			            $scope.close = function () {
			              $uibModalInstance.close();
			            };
			          }]
			        });
			        vModalSteps.result.then(function(){
			          $scope.$watch('dataConfirmation', function(value){
			            if (value.save) {
			             $scope.nextStep();
			            }
			          });
			          //Action after CloseButton Modal
			          //console.log('closeButton');
			        },function(){
			          //Action after CancelButton Modal
			         // console.log("CancelButton");
			        });			        
			      }else{
			      	$scope.showRequieredSubActivity = true;
			      }
		      }
	    	}
	    }

    	/*########################
      # Grabar Paso # 2
      ########################*/
      function grabarP2(){
      	if($scope.formData.mAgente.codigoAgente != '0'){
	      	$scope.formData.mAgente = $rootScope.mAgente;

	      	if($scope.formData.salud && $scope.formData.pension){
	      		$scope.codProd =  $scope.formData.productos[0].Codigo;//64;
	      	}else if($scope.formData.pension){
						$scope.codProd =  $scope.formData.productos[1].Codigo;//62;
	      	}else if($scope.formData.salud){
	      		$scope.codProd =  $scope.formData.productos[2].Codigo;//63;
	      	}

      		$scope.calcularFinVigencia();

      		$scope.formData.isUploading = true;

	      	if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
		      	var paramsP2 =
							{
								Solicitud : {
									NumeroSolicitud : $scope.formData.NroSolicitud,
									FormaPago : $scope.formData.mFrecDeclaracion.Codigo,
									FechaEfectivoPoliza : $scope.formData.desde,
									FechaVencimientoPoliza : $scope.formData.hasta,
									CodigoAgente : $scope.formData.mAgente.codigoAgente,
									CodCiiuPol :  $scope.formData.mActEco.CodigoCiiuEmp,
									ColegAseg : $scope.formData.mCentroRiesgo,
									DescTrabPol : $scope.formData && $scope.formData.subactividad ?
														 $scope.formData.subactividad.Descripcion : "",
									CodigoUsuReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
									Tipo : 1, //fijo
									SecuenciaReg : 3,
									CodSuscriptor : $scope.formData.CodigoSuscriptor,//0, //viene de servicio pendiente
									CodEstado : '',
									DescEstado : '',
									CodProducto :	$scope.codProd,//constants.module.polizas.sctr.periodoCorto.CodigoProducto,//55,//solo PC
									ClausulaAutomatica: $scope.formData.clausulaAutomatica,
									ClausulaManual: ""
								}
							}

						sctrEmitFactory.grabarPasos2PC(paramsP2, true).then(function(response){
							if (response.OperationCode == constants.operationCode.success){
								$scope.formData.paso2 = response.Data;
								$scope.formData.paso2Grabado = true;
								$scope.formData.descripcionDuracion = sctrEmitFactory.getDescripcionDuracion($scope.formData.desde, $scope.formData.hasta);
								$scope.formData.CodigoEstado = 'RE';

								$timeout(function(){
									$scope.formData.isUploading = false;
				          $state.go('.',{
					            step: 3
					        });
				        }, 1000);

							}else{
								mModalAlert.showWarning(response.Message, 'Paso 2');
								$scope.formData.paso2Grabado = false;
							}
						});

	      	}else if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoNormal.TipoPeriodo){
	      		var paramsP2 =
							{
								Solicitud : {
									NumeroSolicitud : $scope.formData.NroSolicitud,
									FormaPago : $scope.formData.mFrecDeclaracion.Codigo,
									FechaEfectivoPoliza : $scope.formData.desde,
									FechaVencimientoPoliza : $scope.formData.hasta,
									CodigoAgente : $scope.formData.mAgente.codigoAgente,
									CodCiiuPol :  $scope.formData.mActEco.CodigoCiiuEmp,
									ColegAseg : $scope.formData.mCentroRiesgo,
									DescTrabPol : $scope.formData && $scope.formData.subactividad ? $scope.formData.subactividad.Descripcion : "",
									DescripcionCiiuPol: $scope.formData.mActEco.DescripcionCiiuEmp,
									CodigoUsuReg : oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
									EmailEmp : $scope.formData.mCorreoElectronico,//'RICARDO@MULTIPLICA.COM',
									Tipo : 1,
									TipoRol: $scope.formData.TipoRol,
									TipoDocumento : $scope.formData.mTipoDocumento.Codigo,//'RUC',
									NumeroDocumento : $scope.formData.mNumeroDocumento,//20145549478,
									RazonSocial : $scope.formData.mRazonSocial,
									SecuenciaReg : 3,
									CodSuscriptor : $scope.formData.CodigoSuscriptor,//0, //viene de servicio pendiente
									CodEstado : '',
									DescEstado : '',
									CodProducto :	$scope.codProd, //constants.module.polizas.sctr.periodoNormal.CodigoProducto,//55,//solo PC
									ClausulaAutomatica: $scope.formData.clausulaAutomatica,
									ClausulaManual: ""
								}
							};

						sctrEmitFactory.grabarPasos2PN(paramsP2, true).then(function(response){
							if (response.OperationCode == constants.operationCode.success){
								$scope.formData.paso2 = response.Data;
								$scope.formData.paso2Grabado = true;
								$scope.formData.descripcionDuracion = sctrEmitFactory.getDescripcionDuracion($scope.formData.desde, $scope.formData.hasta);
								$scope.formData.CodigoEstado = 'RE';

								if(typeof $scope.formData.paso2.Suscriptor != 'undefined'){
									$scope.formData.usuarioDestino = $scope.formData.paso2.Suscriptor.CodUsuario;
								}else{
									$scope.formData.usuarioDestino = '';
								}
								$timeout(function(){
									$scope.formData.isUploading = false;
				          $state.go('.',{
					            step: 3
					        });
				        }, 1000);

							}else{
								mModalAlert.showWarning(response.Message, 'Paso 2');
								$scope.formData.paso2Grabado = false;

							}
						});

	      	}
	      }else{
	      	mModalAlert.showError("No tiene un agente seleccionado", "Error");
	      }
      };

      $scope.nextStep = function(){
				sctrEmitFactory.getListProduct().then(function(response){          if (response.OperationCode == constants.operationCode.success){
            $scope.formData.productos = response.Data;
            grabarP2();
          }
        });
      };

      $scope.validationForm = function(){

      	$scope.frmSCTR2.markAsPristine();//$scope.formData.subactividad
        if ($scope.formData.mActEco == null ||
						$scope.formData.mFrecDeclaracion == null || $scope.formData.mFrecDeclaracion.selectedEmpty ||
						$scope.formData.mConsultaDesde == null ||
						$scope.formData.mDuracionCobertura == null || $scope.formData.mDuracionCobertura.selectedEmpty ||
						$scope.formData.mCentroRiesgo == null ||
						$scope.formData.mCentroRiesgo == '' ||
						!($scope.formData.pension || $scope.formData.salud)
        	){
          if($scope.formData.paso2Grabado)
          	$scope.formData.validatedPaso2 =  true;
          else
          	$scope.formData.validatedPaso2 =  false;
        }else{
          $scope.formData.validatedPaso2 =  true;
        }
      }

      /*#########################
	    # Frecuencia-Cobertura
	    #########################*/

      $scope.changeCobertura = function(){
      	changeCobertura();
      }

      function changeCobertura(){
				if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
					if($scope.formData.mFrecDeclaracion.Codigo === 'MEN'){
						$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":1,"Descripcion":"1 MES"}, {"Codigo":2,"Descripcion":"2 MESES"}];
	      	}else{
	      		$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":2,"Descripcion":"2 MESES"}];
	      	}
				}else{//periodo normal
					if($scope.formData.mFrecDeclaracion.Codigo === 'MEN'){
						$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":3,"Descripcion":"3 MESES"},{"Codigo":4,"Descripcion":"4 MESES"},{"Codigo":5,"Descripcion":"5 MESES"},{"Codigo":6,"Descripcion":"6 MESES"},{"Codigo":7,"Descripcion":"7 MESES"},{"Codigo":8,"Descripcion":"8 MESES"},{"Codigo":9,"Descripcion":"9 MESES"},{"Codigo":10,"Descripcion":"10 MESES"},{"Codigo":11,"Descripcion":"11 MESES"},{"Codigo":12,"Descripcion":"12 MESES"}];
	      	}else if($scope.formData.mFrecDeclaracion.Codigo === 'BIM'){
	      		$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":4,"Descripcion":"4 MESES"},{"Codigo":6,"Descripcion":"6 MESES"},{"Codigo":8,"Descripcion":"8 MESES"},{"Codigo":10,"Descripcion":"10 MESES"},{"Codigo":12,"Descripcion":"12 MESES"}];
	      	}else if($scope.formData.mFrecDeclaracion.Codigo === 'TRI'){
	      		$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":3,"Descripcion":"3 MESES"},{"Codigo":6,"Descripcion":"6 MESES"},{"Codigo":9,"Descripcion":"9 MESES"},{"Codigo":12,"Descripcion":"12 MESES"}];
	      	}else if($scope.formData.mFrecDeclaracion.Codigo === 'CUA'){
	      		$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":4,"Descripcion":"4 MESES"},{"Codigo":8,"Descripcion":"8 MESES"},{"Codigo":12,"Descripcion":"12 MESES"}];
						$scope.formData.duraciones = true;
	      	}else if($scope.formData.mFrecDeclaracion.Codigo === 'SEM'){
	      		$scope.formData.duraciones = true;
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":6,"Descripcion":"6 MESES"},{"Codigo":12,"Descripcion":"12 MESES"}];
	      	}else if($scope.formData.mFrecDeclaracion.Codigo === 'ANU'){
	      		$scope.formData.duraciones = true
						$scope.duracionCoberturaData = [{"Descripcion":"--Seleccione--","Codigo":null,"selectedEmpty":true},{"Codigo":12,"Descripcion":"12 MESES"}];
	      	}
				}
      }

      function isRuc(){
      	$scope.formData.showNaturalRucPerson = !mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
      }

    }]);
});
