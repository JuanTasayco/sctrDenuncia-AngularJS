(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'polizasFactory'], function(angular, constants){
      angular.module("appSoat").controller('soatEmitS4', ['$scope', 'soatFactory', 'mModalAlert', '$rootScope', '$state', 'mpSpin', 'mainServices', 'oimPrincipal', 'proxyOrchestrator', 'polizasFactory', 'oimAbstractFactory', 'gaService', 'proxyGeneral',
      	function($scope, soatFactory, mModalAlert, $rootScope, $state, mpSpin, mainServices, oimPrincipal, proxyOrchestrator, polizasFactory, oimAbstractFactory, gaService, proxyGeneral){

        var paramsEmitSOAT;
        var NumeroDocumento;
        var NumeroReferenciaBancaria;

       (function onLoad(){
	        $scope.formData = $scope.formData || {};

				  if($scope.formData.dataContractorAddress){
    	    	if(!$scope.formData.dataContractorAddress.ubigeoData.mProvincia){
			          $state.go('.',{
			            step: 3
			          });
			       }else{
			       	if($scope.formData.modalidadesSOAT) {
			       	 var a = $scope.formData.modalidadesSOAT.lastIndexOf($scope.formData.mProductoSoat.CodigoModalidad.toString());
                if(a == -1){
                  $scope.formData.isBlockedAll = false;
                }else{
                  if($scope.formData.isBlocked){
                    mModalAlert.showError('El sistema bloquea el acceso y muestra un mensaje de error indicando el mensaje: Tiene emisiones pendientes de pago mayores a 72 hrs', 'Agente Bloqueado');
                    $scope.formData.isBlockedAll = true;
                  }
                  else{
                    $scope.formData.isBlockedAll = false;
                  }
                }

                if(!$scope.formData.isBlockedAll) {
                  calcularPrima();
                }

			       	}else{
			       		calcularPrima();
			       	}
			       }

		      }else{
            $state.go('.',{
	            step: 3
	          });
	        }
	        $scope.formData.mMapfreDolar = '';
	      })();

		  getEncuesta();

				$scope.mapfreDollarError = false;
				if($scope.formData.mProductoSoat!=null){
					if($scope.formData.mProductoSoat.CodigoMoneda == 1){
						$scope.currencyType = constants.currencyType.soles.description;
						$scope.enSoles = true;

						var paramsMDolar = {
								CodigoMoneda : 2,
								Fecha : soatFactory.formatearFecha(new Date())
							}

    				soatFactory.getTipoCambio(paramsMDolar).then(function(response){
								if (response.OperationCode == constants.operationCode.success){
										$scope.formData.cambio = response.Data;

										$scope.montoEnSoles = $scope.formData.dataContractor.saldoMapfreDolares * $scope.formData.cambio;

								}else if(response.OperationCode == constants.operationCode.code900){
										mModalAlert.showError(response.Message, "¡Error!")
									}else {
									mModalAlert.showError(response.Message, "¡Error!")
								}
						});

					}else{
						$scope.currencyType = constants.currencyType.dollar.description;
						$scope.enSoles = false;
					}
				}

				$scope.addMapfreDollar = function(value){
	        $scope.mapfreDollarTotal = false;
					$scope.mapfreDollarError = false;
					if (typeof value != 'undefined' && (value > 0 && value <= $scope.formData.dataContractor.SaldoMapfreDolar)){
						$scope.montoAplicadoMDolar = value;
						_calculatePremium();
						$scope.mapfreDollarTotal = true;
					}else{
						$scope.mapfreDollarError = true;
					}
				};

				$scope.closeMapfreDollar = function(){
					$scope.mMapfreDolar = '';
					$scope.montoAplicadoMDolar = 0.00;
					$scope.mapfreDollarTotal = false;
					$scope.mapfreDollarError = false;
					_calculatePremium();
				};

		function getEncuesta(){
			var codCia = constants.module.polizas.soat.companyCode;
			var codeRamo = constants.module.polizas.soat.codeRamo;

			proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
				if(response.OperationCode == constants.operationCode.success){
				if (Object.keys(response.Data.Pregunta).length > 0){
					$scope.encuesta = response.Data;
					$scope.encuesta.CodigoCompania = codCia;
					$scope.encuesta.CodigoRamo = codeRamo;
				}else{
					$scope.encuesta = {};
					$scope.encuesta.mostrar = 0;
				}
				}
			}, function(error){
				console.log('Error en getEncuesta: ' + error);
			})
		}

        function calcularPrima(){//setear campos

					if((typeof $scope.formData.codPolizaGrupo == 'undefined')) {
				  	$scope.formData.codPolizaGrupo = '';
				  }else if(!$scope.formData.polizaEspecial){
				  	$scope.formData.codPolizaGrupo = $scope.formData.groupPolizeData.groupPolize;
				  }

					if($scope.formData.mTipoVehiculo &&  $scope.formData.mUsoRiesgo && $scope.formData.dataContractorAddress.ubigeoData){

						$scope.formData.vShowNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.dataContractor.mTipoDocumento.Codigo, $scope.formData.dataContractor.mNumeroDocumento);

						var paramsPrima = {
							CodigoCorredor: $scope.mAgente.codigoAgente,//9808,
							Poliza:{
								FinVigencia:    fechaToISO($scope.formData.mConsultaHasta),//new Date($scope.formData.mConsultaHasta).toISOString().split('.')[0],//'2017-10-28T00:00:00', //preguntar
								InicioVigencia: fechaToISO($scope.formData.mConsultaDesdeF)//new Date($scope.formData.mConsultaDesdeF).toISOString().split('.')[0],//'2016-10-28T00:00:00',  //preguntar
							},
							Vehiculo:{
								CodigoTipo : $scope.formData.mTipoVehiculo.Codigo,
								CodigoUso : $scope.formData.mUsoRiesgo.Codigo,
								TipoVolante : constants.module.polizas.soat.tipoVolante,//'I',  //es fijo
								NumeroPlaca : $scope.formData.mPlaca,
								NumeroRiesgo : constants.module.polizas.soat.NumeroRiesgo, //preguntar
								NumeroChasis : $scope.formData.mNumeroChasis,
								CodigoMarca : $scope.formData.ModeloMarca.codigoMarca,
								CodigoModelo : $scope.formData.ModeloMarca.codigoModelo,
								CodigoSubModelo : $scope.formData.mSubModelo.Codigo,
								PolizaGrupo : $scope.formData.codPolizaGrupo,
								NumeroOcupantes : $scope.formData.mNumAsientos,
								AnioFabricacion: $scope.formData.mYearFabric,
								ProductoVehiculo : {
									CodigoCompania : constants.module.polizas.soat.companyCode,//1, //es fijo
									CodigoPlan : constants.module.polizas.soat.codigoPlan,//1, //es fijo
									CodigoProducto:  $scope.formData.mProductoSoat.CodigoProducto,
									CodigoRamo : constants.module.polizas.soat.codeRamo,
									CodigoMoneda : $scope.formData.mProductoSoat.CodigoMoneda,
									CodigoModalidad : $scope.formData.mProductoSoat.CodigoModalidad,
									InicioVigencia : $scope.formData.mConsultaDesdeF,//'19/07/2016',//cambiar
									TipoSuplemento : constants.module.polizas.soat.TipoSuplemento
								}
							},
							Contratante : {
								TipoDocumento : $scope.formData.dataContractor.mTipoDocumento.Codigo,
								CodigoDocumento : $scope.formData.dataContractor.mNumeroDocumento,
								MCAMapfreDolar : $scope.formData.MCAMapfreDolar, //cambiar
								Ubigeo : {
									CodigoDepartamento : $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Codigo,
									CodigoProvincia : $scope.formData.dataContractorAddress.ubigeoData.mProvincia.Codigo,
									CodigoDistrito : $scope.formData.dataContractorAddress.ubigeoData.mDistrito.Codigo,
									CodigoZona : constants.module.polizas.soat.codigoZona//''//siempre vacio
								}
							}
						};

						proxyOrchestrator.QuoteSoat(paramsPrima, 'Cotizando ...').then(function(response){
							if (response.OperationCode == constants.operationCode.success){
									$scope.formData.dataPrima = response.Data;
									if(response.Data.CodigoZona == 'A'){
										$scope.formData.ZonaTarifa = 'S';
									}else{
										$scope.formData.ZonaTarifa = 'N';
									}
									calcularMontosPrima();

							}else if(response.OperationCode == constants.operationCode.code900){
									mModalAlert.showError(response.Message, "¡Error!")
								}else {
								mModalAlert.showError(response.Data.descError, "¡Error!")
							}
						});
					}
		    }
			function setCalPrima ()
			{
				$scope.formData.derechoEmision = $scope.formData.dataPrima.DerechoEmision
				$scope.primaNeta = $scope.formData.dataPrima.ImpPnetaBoni;//$scope.formData.dataPrima.PrimaNeta;
				$scope.formData.dataPrima.PrimaVehicular = $scope.primaNeta;
				$scope.formData.montoIGV = $scope.formData.dataPrima.MontoIgv;
				$scope.formData.dataPrima.PorcentajeDerechoEmision =100*$scope.formData.dataPrima.DerechoEmision / $scope.formData.dataPrima.PrimaNeta;
				$scope.formData.dataPrima.PorcentajeIgv = 100*($scope.formData.montoIGV / ($scope.formData.derechoEmision + $scope.primaNeta));
			}

		    function calcularMontosPrima(){
				  var val;
				  setCalPrima();

    			//Antes: $scope.totalPrima = ($scope.primaNeta + $scope.formData.derechoEmision) + $scope.formData.montoIGV;
				$scope.totalPrima = $scope.formData.dataPrima.ImpPnetaBoni + $scope.formData.derechoEmision + $scope.formData.montoIGV;

    			if($scope.formData.mapfreDollarTotal){
    				$scope.formData.MCAMapfreDolar = 'S';

    				if($scope.formData.mProductoSoat.CodigoMoneda == 1){//soles

    					//consultamos tipo de cambio
    						$scope.formData.montoDolares = $scope.formData.montoMapfreDollar;//$scope.formData.cambio * $scope.formData.montoMapfreDollar;
								val = ($scope.formData.dataPrima.PorcentajeDerechoEmision * ($scope.formData.dataPrima.PrimaVehicular - ($scope.formData.montoMapfreDollar * $scope.formData.cambio))) / 100;
				    		$scope.formData.derechoEmision = Math.round(val*100)/100;

		    				$scope.primaNetaMDolar = (($scope.primaNeta - ($scope.formData.montoMapfreDollar * $scope.formData.cambio)) + $scope.formData.derechoEmision);
		    				val = ($scope.primaNetaMDolar  * $scope.formData.dataPrima.PorcentajeIgv) / 100;

		    				$scope.formData.montoIGV =  Math.round(val*100)/100;
		    				$scope.totalPrimaMDolar = $scope.primaNetaMDolar + $scope.formData.montoIGV;

		    				if($scope.totalPrimaMDolar<0){
		    					$scope.formData.mMapfreDolarBkp = $scope.formData.mMapfreDolar;
									$scope.totalPrimaMDolar = $scope.totalPrima;
									$scope.formData.errorMaxDolar = true;
		    				}else{
		    					$scope.formData.errorMaxDolar = false;
		    				}
		    				$scope.totalSOAT = $scope.totalPrimaMDolar;
		    				$scope.totalPrima = $scope.totalSOAT;
						}else{//dolares

							$scope.formData.montoDolares =  $scope.formData.montoMapfreDollar;
							val = ($scope.formData.dataPrima.PorcentajeDerechoEmision * ($scope.formData.dataPrima.PrimaVehicular - $scope.formData.montoMapfreDollar)) / 100;
			    		$scope.formData.derechoEmision = Math.round(val*100)/100;

	    				$scope.primaNetaMDolar = (($scope.primaNeta - $scope.formData.montoMapfreDollar) + $scope.formData.derechoEmision);
	    				val = ($scope.primaNetaMDolar  * $scope.formData.dataPrima.PorcentajeIgv) / 100;

	    				$scope.formData.montoIGV =  Math.round(val*100)/100;
	    				$scope.totalPrimaMDolar = $scope.primaNetaMDolar + $scope.formData.montoIGV;

	    				if($scope.totalPrimaMDolar<0){
	    						$scope.formData.mMapfreDolarBkp = $scope.formData.mMapfreDolar;
		    					//$scope.formData.mMapfreDolar = 0;//$scope.totalPrima;
									$scope.totalPrimaMDolar = $scope.totalPrima;
		    					$scope.totalSOAT = $scope.totalPrima;
		    					$scope.formData.errorMaxDolar = true;
		    				}else{
		    					$scope.formData.errorMaxDolar = false;
		    				}
		    				$scope.totalSOAT = $scope.totalPrimaMDolar;
		    				$scope.totalPrima = $scope.totalSOAT;

						}
    			}
		    }

		    function fechaToISO(fecha){
				//new Date($scope.formData.mConsultaHasta).toISOString().split('.')[0]
				if(angular.isDate(fecha)) return fecha;
		    	var from = fecha.split("/");
					var t = new Date(from[2], from[1] - 1, from[0])

					return t.toISOString().split('.')[0];
		    }

        function getCampoFromFormData(path) {
          var cod;
          if (helper.hasPath($scope.formData, path)) {
            cod = getProp($scope.formData, path);
          }
          return cod;
        }

        function getProp(object, keys, defaultVal) {
          keys = Array.isArray(keys) ? keys : keys.split('.');
          object = object[keys[0]];
          if (object && keys.length > 1) {
              return getProp(object, keys.slice(1), defaultVal);
          }
          return object === undefined ? defaultVal : object;
      }

		    $scope.irAEmitir = function() {
		    	if($scope.totalPrima){
	          var mapfreDolarIngresado = $scope.formData.mMapfreDolar || 0;

	          if($scope.enSoles){
		      	  if(parseFloat(mapfreDolarIngresado) > ($scope.formData.dataContractor.saldoMapfreDolares * $scope.formData.cambio) ||
		      	  	parseFloat(mapfreDolarIngresado) > $scope.primaNeta) {
		            return;
		          }
		        }else{
		        	if(parseFloat(mapfreDolarIngresado) > $scope.formData.dataContractor.saldoMapfreDolares ||
		      	  	parseFloat(mapfreDolarIngresado) > $scope.primaNeta) {
		            return;
		          }
		        }

			    	if((typeof $scope.formData.codPolizaGrupo == 'undefined')) {
					  	$scope.formData.codPolizaGrupo = '';
					  }else if(!$scope.formData.polizaEspecial){
					  	$scope.formData.codPolizaGrupo = $scope.formData.groupPolizeData.groupPolize;
					  }

			    	if($scope.formData.enTramite){
							mModalAlert.showWarning("Sólo podrá calcular la prima del producto seleccionado, no podrá emitir una póliza SOAT", "¡Placa en trámite!");
			    	}else{
							 Number.prototype.padLeft = function(base,chr){
							  var  len = (String(base || 10).length - String(this).length)+1;
							  return len > 0? new Array(len).join(chr || '0')+this : this;
						}

            var ubigeo = $scope.formData.dataContractorAddress;
            var _direccion = (ubigeo.mTipoVia.Codigo ? ubigeo.mTipoVia.Descripcion : '') + ' ';
            _direccion += ubigeo.mNombreVia + ' ';
            _direccion += (ubigeo.mTipoNumero.Codigo ? ubigeo.mTipoNumero.Descripcion : '') + ' ';
            _direccion += ubigeo.mNumeroDireccion + ' ';
            _direccion += (ubigeo.mTipoInterior.Codigo ? ubigeo.mTipoInterior.Descripcion + ' ' + ubigeo.mNumeroInterior : '') + ' ';
            _direccion += (ubigeo.mTipoZona.Codigo ? ubigeo.mTipoZona.Descripcion + ' ' + ubigeo.mNombreZona : '');

	          if ($scope.formData.isDeliverySelected) {
	              var deliveryParams = {
	                FechaLlamada: soatFactory.getFechaDDMMYYYY($scope.formData.delivery.fechaLlamada),
	                FechaEnvio: soatFactory.getFechaDDMMYYYY($scope.formData.delivery.fechaEnvio),
	                CodTipoServicio: getCampoFromFormData('delivery.tipoServicio.CodItem'),
	                CodDepartamento: getCampoFromFormData('delivery.address.ubigeoData.mDepartamento.Codigo'),
	                CodProvincia: getCampoFromFormData('delivery.address.ubigeoData.mProvincia.Codigo'),
	                CodDistrito: getCampoFromFormData('delivery.address.ubigeoData.mDistrito.Codigo'),
	                CodVia: getCampoFromFormData('delivery.address.mTipoVia.Codigo'),
	                DesVia: getCampoFromFormData('delivery.address.mNombreVia'),
	                CodNumero: getCampoFromFormData('delivery.address.mTipoNumero.Codigo'),
	                DesNumero: getCampoFromFormData('delivery.address.mNumeroDireccion'),
	                CodInterior: getCampoFromFormData('delivery.address.mTipoInterior.Codigo'),
	                DesInterior: getCampoFromFormData('delivery.address.mNumeroInterior'),
	                CodZona: getCampoFromFormData('delivery.address.mTipoZona.Codigo'),
	                DesZona: getCampoFromFormData('delivery.address.mNombreZona'),
	                Referencia: getCampoFromFormData('delivery.address.mDirReferencias'),
	                CodTurno: getCampoFromFormData('delivery.turno.CodItem'),
	                CodRangoDelivery: getCampoFromFormData('delivery.rangoDelivery.CodItem'),
	                CodFormaPago: getCampoFromFormData('delivery.formaPago.CodItem'),
	                CodTipoLlamada: getCampoFromFormData('delivery.tipoLlamada.CodItem'),
	                CodTipoPoliza: getCampoFromFormData('delivery.tipoPoliza.CodItem'),
	                CodAnio: getCampoFromFormData('delivery.anho.CodItem'),
	                CodMes: getCampoFromFormData('delivery.mes.CodItem'),
	                CodScotiabank: getCampoFromFormData('codScotiabank'),
	            };
            }
            var valueMD;
            if ($scope.formData.mMapfreDolar){
              valueMD = $scope.formData.mProductoSoat.CodigoMoneda == 1? $scope.formData.mMapfreDolar/$scope.formData.cambio : $scope.formData.mMapfreDolar
              valueMD = Math.round(valueMD *100) / 100;
            }

			      paramsEmitSOAT = {
	              Delivery: deliveryParams || {},
								TipoEmision : constants.module.polizas.soat.tipoEmision, //fijo
								AccesorioMusicalCodigo: '', //es fijo
								AccesorioMusicalValor: '', //es fijo
								CodigoCompania: constants.module.polizas.soat.companyCode, //es fijo
								CodigoTipoEntidad: constants.module.polizas.soat.codigoTipoEntidad, //es fijo
								MCAEndosatario: '', //es fijo
								MCAInformeInspeccion: constants.module.polizas.soat.MCAInformeInspeccion,  //es fijo
								MCAInspeccionPrevia: constants.module.polizas.soat.MCAInspeccionPrevia, //es fijo
								NumeroPlan: constants.module.polizas.soat.codigoPlan,//es fijo
								SNEmite: constants.module.polizas.soat.SNEmite, //es fijo
								TieneAccesorioMusical: constants.module.polizas.soat.TieneAccesorioMusical, //es fijo
								Documento : {
                  CodigoSistema: oimAbstractFactory.getOrigin(),
									NumeroDocumento: 0, // es fijo
									NumeroAnterior: 0, // es fijo
									CodigoAgente: $scope.mAgente.codigoAgente,
									CodigoEstado: constants.module.polizas.soat.CodigoEstado, //es fijo
									CodigoMoneda: $scope.formData.mProductoSoat.CodigoMoneda,
									CodigoProceso: constants.module.polizas.soat.CodigoProceso, //es fijo
									CodigoProducto: $scope.formData.mProductoSoat.CodigoProducto, //producto de soat
									CodigoUsuario: $scope.mAgente.codigoUsuario,
									CodigoUsuarioRED: $scope.mAgente.codigoUsuario,
									EstadoEmision: '',
									FechaRegistro: $scope.formData.today,// al hacer click en emitir
									FlagDocumento: '',
							    IpDocumento : '::1',		//ip del cliente
									MarcaAsistencia: '',
									McaAsegNuevo: $scope.formData.McaAsegNuevo,//si es cliente nuevo o no
									MontoPrima: ($scope.totalPrima) ? $scope.totalPrima.toFixed(2) : '0', // monto original que retorna el servcio
									NombreDocumento: '',
									NumeroPlaca: $scope.formData.mPlaca,
									NumeroTicket: '',
									RutaDocumento: '',
									Ubigeo: {
										CodigoDistrito: $scope.formData.dataContractorAddress.ubigeoData.mDistrito.Codigo,
										CodigoDepartamento: $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Codigo,
										CodigoProvincia: $scope.formData.dataContractorAddress.ubigeoData.mProvincia.Codigo,
									}
								},
								Inspeccion : {
									NumeroInspeccionTRON : ''
								},
								Inspector : {
									Nombre : '',
									ApellidoPaterno : '',
									Telefono : 0,
									Telefono2 : 0,
									Observacion : ''
								},
								Poliza: {
									CodigoFinanciamiento: constants.module.polizas.soat.CodigoFinanciamiento, //es fijo
									FinVigencia:    fechaToISO($scope.formData.mConsultaHasta),//new Date($scope.formData.mConsultaHasta).toISOString().split('.')[0],//'2017-10-28T00:00:00', //preguntar
									InicioVigencia: fechaToISO($scope.formData.mConsultaDesdeF),//new Date($scope.formData.mConsultaDesdeF).toISOString().split('.')[0],//'2016-10-28T00:00:00',  //preguntar
									MarcaPolizaManual: $scope.formData.MarcaPolizaManual,
									ModalidadPrimeraCuota: '',
									NumeroCertificadoSoat: ($scope.formData.certificado) ? $scope.formData.certificado.NumeroCertificado : ($scope.formData.mNroSol) ? $scope.formData.mNroSol : '',
									NumeroPolizaManual: $scope.formData.polizaManual,
									MapfreDolares: valueMD,
									MCAMapfreDolares:$scope.formData.mMapfreDolar?'S': 'N'
								},
								Vehiculo: {
									NumeroPlaca: $scope.formData.mPlaca,
									NumeroChasis: $scope.formData.mNumeroChasis,
									NumeroMotor: $scope.formData.mNumeroMotor,
									CodigoColor: constants.module.polizas.soat.CodigoColor, //es fijo
									ZonaTarifa: $scope.formData.ZonaTarifa,
									ProductoVehiculo: {
										CodigoProducto: $scope.formData.mProductoSoat.CodigoProducto //producto de soat
									},
									PolizaGrupo: $scope.formData.codPolizaGrupo,
									NumeroOcupantes: $scope.formData.mNumAsientos,
									NombreModeloImpresion: $scope.formData.mModeloPrint,
									CodigoTipo: $scope.formData.mTipoVehiculo.Codigo,
									MCAGPS: ''//consultar servicio gps
								},
								Contratante: {
									MCAExistencia: '',
									Agente: {
										CodigoAgente: $scope.mAgente.codigoAgente //cambiar
									},
									ActividadEconomica: {
										Codigo: ($scope.formData.vShowNaturalRucPerson) ? '' : $scope.formData.dataContractor.mActividadEconomica.Codigo//($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? (($scope.formData.dataContractor.mActividadEconomica && $scope.formData.dataContractor.mActividadEconomica.Codigo && $scope.formData.dataContractor.mActividadEconomica.Codigo !== null) ? $scope.formData.dataContractor.mActividadEconomica.Codigo : '' ) : ''
									},
									Sexo:  ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mSexo : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mSexo : '',
									Profesion: {
										Codigo: ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mProfesion.Codigo : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? (($scope.formData.dataContractor.mProfesion && $scope.formData.dataContractor.mProfesion.Codigo && $scope.formData.dataContractor.mProfesion.Codigo !== null) ? $scope.formData.dataContractor.mProfesion.Codigo : '') : ''
									},
									ImporteAplicarMapfreDolar: (typeof $scope.formData.montoMapfreDollar != 'undefined') ? parseFloat($scope.formData.montoMapfreDollar).toFixed(2) : 0, //cambiar
									FechaNacimiento:  ($scope.formData.vShowNaturalRucPerson) ? new Date($scope.formData.dataContractor.mYear.description + '-' + $scope.formData.dataContractor.mMonth.description + '-' + $scope.formData.dataContractor.mDay.description).toISOString().split('.')[0] : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? (($scope.formData.contractorData.mYear && $scope.formData.contractorData.mMonth && $scope.formData.contractorData.mDay) ? new Date($scope.formData.contractorData.mYear.description + '-' + $scope.formData.contractorData.mMonth.description + '-' + $scope.formData.contractorData.mDay.description).toISOString().split('.')[0] : '') : '',
									Ubigeo: {
										CodigoDistrito: $scope.formData.dataContractorAddress.ubigeoData.mDistrito.Codigo,
										CodigoDepartamento: $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Codigo,
										CodigoProvincia: $scope.formData.dataContractorAddress.ubigeoData.mProvincia.Codigo,
										NombreDistrito: $scope.formData.dataContractorAddress.ubigeoData.mDistrito.Descripcion,
										NombreDepartamento: $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Descripcion,
										NombreProvincia: $scope.formData.dataContractorAddress.ubigeoData.mProvincia.Descripcion,
										CodigoVia: ($scope.formData.dataContractorAddress.mTipoVia.Codigo == "0" || $scope.formData.dataContractorAddress.mTipoVia.Codigo == null) ? "" : $scope.formData.dataContractorAddress.mTipoVia.Codigo,
										CodigoNumero: ($scope.formData.dataContractorAddress.mTipoNumero.Codigo == "0" || $scope.formData.dataContractorAddress.mTipoNumero.Codigo == null) ? "" : $scope.formData.dataContractorAddress.mTipoNumero.Codigo,
										TextoNumero: $scope.formData.dataContractorAddress.mNumeroDireccion,//no sale
										CodigoInterior: ($scope.formData.dataContractorAddress.mTipoInterior.Codigo == "0" || $scope.formData.dataContractorAddress.mTipoInterior.Codigo == null) ? "" : $scope.formData.dataContractorAddress.mTipoInterior.Codigo,
										TextoInterior: $scope.formData.dataContractorAddress.mNumeroInterior,//no sale
										CodigoZona: ($scope.formData.dataContractorAddress.mTipoZona.Codigo == "0" || $scope.formData.dataContractorAddress.mTipoZona.Codigo == null) ? "" : $scope.formData.dataContractorAddress.mTipoZona.Codigo,
										TextoZona: $scope.formData.dataContractorAddress.mNombreZona,//no sale
										Referencia: $scope.formData.dataContractorAddress.mDirReferencias,//no sale
										Direccion: $scope.formData.dataContractorAddress.mNombreVia,
										DireccionCompleta : _direccion
									},
									Telefono: $scope.formData.dataContractor.mTelefonoFijo,
									Direccion: $scope.formData.dataContractorAddress.mNombreVia,
									CorreoElectronico: $scope.formData.dataContractor.mCorreoElectronico,
									Telefono2: $scope.formData.dataContractor.mTelefonoCelular,
									MCAFisico: constants.module.polizas.soat.MCAFisico,//es fijo
									Nombre: ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mNomContratante : $scope.formData.dataContractor.mRazonSocial, //($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mNomContratante : $scope.formData.dataContractor.mRazonSocial,
									ApellidoPaterno: ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mApePatContratante : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mApePatContratante : '',
									ApellidoMaterno: ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mApeMatContratante : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mApeMatContratante : '',
									TipoDocumento : $scope.formData.dataContractor.mTipoDocumento.Codigo,
									CodigoDocumento : $scope.formData.dataContractor.mNumeroDocumento,//no sale
									ImporteMapfreDolar: (typeof $scope.formData.montoMapfreDollar != 'undefined') ? parseFloat($scope.formData.montoMapfreDollar).toFixed(2) : 0, //cambiar
									MCAMapfreDolar: $scope.formData.MCAMapfreDolar
								},
								Endosatario: { //es fijo
									SumaEndosatario: 0.0,
									TipoDocumento: '',
									CodigoDocumento: ''
								},
								Cotizacion : {
								  CodigoCompania: constants.module.polizas.soat.companyCode,//es fijo
									CodigoCorredor: $scope.mAgente.codigoAgente,
								  CodigoTipoEntidad: constants.module.polizas.soat.codigoTipoEntidad,//es fijo
									Documento : {
										CodigoAgente: $scope.mAgente.codigoAgente,
										CodigoEstado: constants.module.polizas.soat.CodigoEstado, //es fijo
										CodigoMoneda: $scope.formData.mProductoSoat.CodigoMoneda,
										CodigoProceso: constants.module.polizas.soat.CodigoProceso, //es fijo
										CodigoProducto: $scope.formData.mProductoSoat.CodigoProducto, //producto de soat
										CodigoUsuario: $scope.mAgente.codigoUsuario,
										CodigoUsuarioRED: $scope.mAgente.codigoUsuario,
										EstadoEmision: '', //es fijo
										FechaRegistro: $scope.formData.today,//dformat,//'28/10/2016 13:33:05',
										FlagDocumento: '',
										IpDocumento : '::1', //cambiar
										MarcaAsistencia: '',
										McaAsegNuevo: $scope.formData.McaAsegNuevo,
										MontoPrima: ($scope.totalPrima) ? $scope.totalPrima.toFixed(2) : '0', //monto original
										NombreDocumento: '',
										NumeroAnterior: 0,
										NumeroDocumento: 0,
										NumeroPlaca: $scope.formData.mPlaca,
										NumeroTicket: '',
										RutaDocumento: '',
										Ubigeo: {
											CodigoDistrito: $scope.formData.dataContractorAddress.ubigeoData.mDistrito.Codigo,
											CodigoDepartamento: $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Codigo,
											CodigoProvincia: $scope.formData.dataContractorAddress.ubigeoData.mProvincia.Codigo,
										}
									},
									Vehiculo : {
										CodigoMarca : $scope.formData.ModeloMarca.codigoMarca,
										CodigoModelo :  $scope.formData.ModeloMarca.codigoModelo,
										CodigoSubModelo : $scope.formData.mSubModelo.Codigo,
										CodigoTipo : $scope.formData.mTipoVehiculo.Codigo,
										CodigoUso : $scope.formData.mUsoRiesgo.Codigo,
										DesTipoUsoVehiculo : $scope.formData.mUsoRiesgo.Descripcion,
										NumeroChasis : $scope.formData.mNumeroChasis,
										NumeroOcupantes : $scope.formData.mNumAsientos,  //preguntar
										NumeroPlaca : $scope.formData.mPlaca,
										NumeroMotor : $scope.formData.mNumeroMotor,
										NumeroRiesgo : constants.module.polizas.soat.NumeroRiesgo,  //x confirmar
										PolizaGrupo : $scope.formData.codPolizaGrupo,
										TipoVolante : constants.module.polizas.soat.tipoVolante, // es fijo
										AnioFabricacion: $scope.formData.mYearFabric,  //preguntar
										DsctoComercial: $scope.formData.descuentoComercial,
										PrimaVehicular: ($scope.totalPrima) ? $scope.totalPrima : '0',  //prima total con igv
										SumaAsegurada: 0, //es fijo
										ZonaTarifa: $scope.formData.ZonaTarifa,
										MCAGPS: '',
										MCAPICKUP: '',
										NombreMarca: $scope.formData.ModeloMarca.nombreMarca,
										NombreModelo: $scope.formData.ModeloMarca.nombreModelo,
										NombreTipo: $scope.formData.mTipoVehiculo.Descripcion,
										CodigoCategoria: constants.module.polizas.soat.CodigoCategoria,  //es fijo
										MCAREQUIEREGPS: $scope.formData.MCAREQUIEREGPS, //servicio de gps
										MCANUEVO: $scope.formData.MCANUEVO, //criterio para autos
										ProductoVehiculo : {
											CodigoCompania : constants.module.polizas.soat.companyCode, // es fijo
											CodigoPlan : constants.module.polizas.soat.codigoPlan,  //preguntar a fernando
											CodigoProducto: $scope.formData.mProductoSoat.CodigoProducto,//producto de soat
											CodigoRamo : constants.module.polizas.soat.codeRamo, //es fijo
											CodigoMoneda : $scope.formData.mProductoSoat.CodigoMoneda,
											CodigoModalidad : $scope.formData.mProductoSoat.CodigoModalidad,
											InicioVigencia : $scope.formData.mConsultaDesdeF, //cambiar
											TipoSuplemento : constants.module.polizas.soat.TipoSuplemento
										}
									},
									Contratante : {
										TipoDocumento : $scope.formData.dataContractor.mTipoDocumento.Codigo,
										CodigoDocumento : $scope.formData.dataContractor.mNumeroDocumento,//no sale
										Nombre: ($scope.formData.vShowNaturalRucPerson) ? $scope.formData.dataContractor.mNomContratante : $scope.formData.dataContractor.mRazonSocial, //($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mNomContratante : $scope.formData.dataContractor.mRazonSocial,
										ApellidoPaterno: ($scope.formData.vShowNaturalRucPerson) ?  $scope.formData.dataContractor.mApePatContratante : '',//($scope.formData.dataContractor.mTipoDocumento.Codigo !== constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mApePatContratante : '',
										MCAMapfreDolar : $scope.formData.MCAMapfreDolar,//cambiar
										ImporteMapfreDolar: (typeof $scope.formData.saldoMDolar != 'undefined') ? parseFloat($scope.formData.saldoMDolar).toFixed(2) : 0, //cambiarparseFloat($scope.formData.saldoMDolar).toFixed(2),//$scope.formData.montoMapfreDollar,//saldo mdolar
										Ubigeo : {
											CodigoDepartamento : $scope.formData.dataContractorAddress.ubigeoData.mDepartamento.Codigo,
											CodigoZona : constants.module.polizas.soat.codigoZona
										}
									}
								}
							}
						}

							paramsEmitSOAT.Rol = oimPrincipal.get_role().toUpperCase();

							paramsEmitSOAT.Cotizacion.PrimaNeta = ($scope.totalPrima) ? $scope.totalPrima.toFixed(2) : '0'; //$scope.primaNeta;
							paramsEmitSOAT.Cotizacion.DerechoEmision = $scope.formData.derechoEmision;
							paramsEmitSOAT.Cotizacion.MontoIGV = $scope.formData.montoIGV;
							paramsEmitSOAT.NumeroCotizacion = $scope.formData.dataPrima.NumeroCotizacion;

							paramsEmitSOAT = polizasFactory.setReferidoNumber(paramsEmitSOAT);

							soatFactory.emitirSOAT(paramsEmitSOAT)
							.then(function(response){

								if (oimPrincipal.get_role().toUpperCase() === "AGTDIG") {
									if (response.OperationCode == constants.operationCode.success){
										$scope.emitido = response.Data;
										 if (response.OperationCode == 200 && response.Data.NumeroReferenciaBancaria != ""){

			                 	NumeroDocumento	= $scope.emitido.NumeroDocumento;
                        NumeroReferenciaBancaria= $scope.emitido.NumeroReferenciaBancaria;

	                      soatFactory.addVariableSession('documentosCotizacion', NumeroDocumento);
	                      soatFactory.addVariableSession('ReferenciaBancariaSOAT', NumeroReferenciaBancaria);
												setTimeout(function(){
													$scope.formData = {};
													if($scope.encuesta.mostrar == 1){
														$scope.encuesta.numOperacion = response.Data.NumeroPoliza;
														$state.go('getSoat', {encuesta: $scope.encuesta}); // Redireccionamiento
													}else{
														$state.go('getSoat'); // Redireccionamiento
													}
											    }, 2000);

			                }
			                else if(response.Data.NumeroReferenciaBancaria == ""){

												if(response.Message != ''){
													mModalAlert.showError(response.Message, "¡Error!");
												}else{
													mModalAlert.showError("Se ha emitido con observación", "¡Error!");
												}

												setTimeout(function(){
													$scope.formData = {};
													$state.go('soatEmit.steps', {
														step: 1
													});
											  }, 2000);
			                }else{
			                	mModalAlert.showError(response.Message, "¡Error!");
			                }
									}else{
										mModalAlert.showError(response.Message, "¡Error!");
									}
								} else {
									if (response.OperationCode == constants.operationCode.success){
										$scope.emitido = response.Data;
										 if (response.OperationCode == 200 && response.Data.NumeroPoliza != ""){

										   NumeroDocumento	= $scope.emitido.NumeroDocumento;

	                      soatFactory.addVariableSession('documentosCotizacion', NumeroDocumento);
												setTimeout(function(){
												    $scope.formData = {};
													if($scope.encuesta.mostrar == 1){
														$scope.encuesta.numOperacion = response.Data.NumeroPoliza;
														$state.go('getSoat', {encuesta: $scope.encuesta}); // Redireccionamiento
													}else{
														$state.go('getSoat'); // Redireccionamiento
													}
											    }, 2000);

			                }
			                else if(response.Data.NumeroPoliza == ""){

												if(response.Message != ''){
													mModalAlert.showError(response.Message, "¡Error!");
												}else{
													mModalAlert.showError("Se ha emitido con observación", "¡Error!");
												}

												setTimeout(function(){
													$scope.formData = {};
													$state.go('soatEmit.steps', {
														step: 1
													});
											  }, 2000);
											}else{
												mModalAlert.showError(response.Message, "¡Error!");
											}
													}else{
														mModalAlert.showError(response.Message, "¡Error!");
													}
												}
											}, function error(response){
												mModalAlert.showError(response.Message, "¡Error!");
											},function(){
												mModalAlert.showError("No se pudo emitir", "¡Error!");
											});

					}
				};

				$scope.addMapfreDollar = function(value){
					value = parseFloat(value);
					$scope.formData.mapfreDollarTotal = false;
					$scope.formData.mapfreDollarError = false;

					if (typeof value != 'undefined' && (value > 0 && value <= $scope.formData.dataContractor.saldoMapfreDolares)
						&& (value <= $scope.primaNeta)){
						$scope.formData.montoMapfreDollar = value;
						$scope.formData.saldoMDolar = $scope.formData.dataContractor.saldoMapfreDolares-value;
						$scope.formData.mapfreDollarTotal = true;
					}else{
						$scope.formData.montoMapfreDollar = 0.00;
						$scope.formData.saldoMDolar = 0.00;
						$scope.formData.mapfreDollarError = true;
					}
					calcularMontosPrima();

					if($scope.enSoles){
						$scope.montoValido = value < 0 || value>($scope.formData.dataContractor.saldoMapfreDolares * $scope.formData.cambio) || (value>$scope.primaNeta);
					}else{
						$scope.montoValido = value < 0 || value>$scope.formData.dataContractor.saldoMapfreDolares || value>$scope.primaNeta;
					}
				};

				$scope.addMapfreSoles = function(value){
					value = parseFloat(value);
					$scope.formData.mapfreDollarTotal = false;
					$scope.formData.mapfreDollarError = false;

					if (typeof value != 'undefined' && (value > 0 &&
						(value / $scope.formData.cambio) <= $scope.formData.dataContractor.saldoMapfreDolares)
						&& (value <= $scope.primaNeta)){
						$scope.formData.montoMapfreDollar = parseFloat((value / $scope.formData.cambio)).toFixed(3);
						$scope.formData.saldoMDolar = $scope.formData.dataContractor.saldoMapfreDolares-(value / $scope.formData.cambio);
						$scope.formData.mapfreDollarTotal = true;
						$scope.montoMayor = true;
					}else{
						$scope.formData.montoMapfreDollar = 0.00;
						$scope.formData.saldoMDolar = 0.00;
						$scope.formData.mapfreDollarError = true;
					}

					calcularMontosPrima();

					if($scope.enSoles){
						$scope.montoValido = value < 0 || value>($scope.formData.dataContractor.saldoMapfreDolares * $scope.formData.cambio) || (value>$scope.primaNeta);
					}else{
						$scope.montoValido = value < 0 || value>$scope.formData.dataContractor.saldoMapfreDolares || value>$scope.primaNeta;
					}
				};

				$scope.closeMapfreDollar = function(){
					$scope.formData.mMapfreDolar = '';
					$scope.formData.montoMapfreDollar = 0.00;
					$scope.formData.saldoMDolar = 0.00;
					$scope.formData.mapfreDollarTotal = false;
					$scope.formData.mapfreDollarError = false;
					calcularMontosPrima();
				};

				$scope.isAgenteDigital = function(){
          return oimPrincipal.get_role().toUpperCase() === "AGTDIG";
				};

    }])
		.filter('dropDigits', function() {
		    return function(floatNum) {
		        return String(floatNum)
		            .split('.')
		            .map(function (d, i) { return i ? d.substr(0, 2) : d; })
		            .join('.');
		    };
		});
});
