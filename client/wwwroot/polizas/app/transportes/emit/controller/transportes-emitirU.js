(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', 'modalSendEmail', 'polizasFactory'], function(angular, constants, helper) {
	angular.module('appTransportes').controller('transporteEmitController', ['$scope', 'oimPrincipal', 'proxyAgente', 'proxyEmision', 'proxyClaims', '$state', 'transporteEmitFactory', '$timeout', '$window',  'mModalAlert', '$uibModal', '$filter', '$sce', 'polizasFactory','httpData', 'oimProxyPoliza','mpfPersonFactory',
	function($scope, oimPrincipal, proxyAgente, proxyEmision, proxyClaims, $state, transporteEmitFactory, $timeout, $window,  mModalAlert, $uibModal, $filter, $sce, polizasFactory, httpData, oimProxyPoliza, mpfPersonFactory){
		(function onLoad() {
			$scope.mainStep = $scope.mainStep || {};
			$scope.firstStep = $scope.firstStep || {};
			$scope.secondStep = $scope.secondStep || {};
			$scope.thirdStep = $scope.thirdStep || {};
			$scope.fourthStep = $scope.fourthStep || {};
			$scope.summaryStep = $scope.summaryStep || {};
			// Inicio BuildSoft			
			$scope.fourthStep.relacionLista = {};//BUILDSOFT
        	obtenerRelacion();//BUILDSOFT

			$scope.fourthStep.accionistaShow = [];
			if (angular.isUndefined($scope.fourthStep.isRucContratanteShow)) {
			  $scope.fourthStep.isRucContratanteShow = false; 
			}
			//Fin BuildSoft

			proxyClaims.GetClaims(true).then(function(carClaims) {
				if (carClaims){ //Falta el ROLUSUARIO, para validar
					$scope.mainStep.claims = {
						codigoUsuario: carClaims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
						rolUsuario: carClaims[12].value, //'ADMIN', //carClaims[5].value,
						nombreAgente: carClaims[6].value.toUpperCase(),
						codigoAgente: carClaims[7].value //Ejm: 9808 //agendid en el claim
						// codigoRol: carClaims[].value
					}
					$scope.userRoot = oimPrincipal.validateAgent('evoSubMenuEMISA','TRANSPORTES');

					if (!$scope.userRoot) {
						$scope.$broadcast('claimschange',{"val":$scope.mainStep.claims});
					}
	      		}
			});
		})();

		$scope.pasosTransporte = [
			{description: 'Datos de la póliza'},
			{description: 'Datos del riesgo'},
			{description: 'Calculo de prima'},
			{description: 'Datos del contratante'},
			{description: 'Emitir póliza'}
		];

		$scope.$on('$stateChangeSuccess', function (s, state, param, d) {
	      $scope.currentStep = param.step;
	    });

	    $scope.saveAgent = function(agent){
			$scope.mainStep.mAgent = agent;
			$scope.mainStep.claims.codigoAgente = $scope.mainStep.mAgent.codigoAgente;
			$scope.mainStep.mAgente.codigoUsuario = $scope.mainStep.claims.codigoUsuario;
			$scope.$broadcast('claimschange',{"val":$scope.mainStep.claims});
	    }

	    $scope.gotoStep = function(step) {
	    	if ($scope.currentStep > step) {
	    		$state.go('.', {
	    			step : step
	    		});
	    	}
	    };

	    $scope.resetState = function() {
			$scope.secondStep = {};
			$scope.thirdStep = {};
			$scope.fourthStep = {};
			$scope.summaryStep = {};
	    };

	    $scope.saveState = function() {
	    };

	    $scope.nuevaAplicacion = function() {
	    	$scope.mainStep.mAgent = null;

	    	$state.go('.', {
				step: 1
			}, {reload: true});
	    }
	    $scope.reporteTransporte = function() {
	    	var pdf = {
	    		CodigoCompania : 1,
				NumeroDocumento : $scope.mainStep.numeroDeDocumento,
				CodigoAgente  : $scope.mainStep.claims.codigoAgente,
				NumeroPoliza : $scope.mainStep.numeroPoliza,
				Suplemento : "0",
				Aplicacion : "0",
				SuplementoAplicacion : "0",
				TipoImpresion : "P",
				CodApli: $window.localStorage['appCodeSubMenu'] || '',
                IpOrigen: $window.localStorage['clientIp'] || '',
				CodigoUsuario: oimPrincipal.getUsername().toUpperCase()
	    	};
	    	$scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + "/api/reporte/transporte/emision");
            $scope.pdfData = angular.toJson(pdf);
            $timeout(function(){
                document.getElementById('frmDownloadPDF').submit();
            })
	    }

	    $scope.guardarPoliza = function() {
			$scope.encuesta = $scope.fourthStep.encuesta;
			console.log("$scope.encuesta", $scope.encuesta);
	    	var codEndosatario = "";
	    	var docEndosatario = "";
	    	if (!$scope.fourthStep.contractor.mActividadEconomica) {
	    		$scope.fourthStep.contractor.mActividadEconomica ={
	    			Codigo : ''
	    		};
	    	}
	    	if ($scope.fourthStep.endosatario.Codigo !== null) {
	    		docEndosatario = $scope.fourthStep.endosatario.Codigo;
	    		codEndosatario = $scope.fourthStep.endosatario.TipoDocumento;
	    	}
	    	var polizaData = {
			    "TipoEmision": 2,
			    "CodigoCompania": $scope.firstStep.poliza.CodigoCompania,
			    "CodigoTipoEntidad": 1,
			    "NumeroDocumento" : 1,
			    "Poliza": {
			    	"CodigoCompania": $scope.firstStep.poliza.CodigoCompania,
			        "InicioVigencia": $filter("date")($scope.firstStep.vigencia, constants.formats.dateFormat),
			        "FinVigencia": $filter("date")($scope.firstStep.vigenciaFin, constants.formats.dateFormat),
			        "CodigoFinanciamiento": $scope.firstStep.poliza.CodigoFraccPago,
			        "MCAModalidad" : "N",
        			"PolizaGrupo" : $scope.firstStep.poliza.NumeroPolizaGrupo
			    },
			    "Contratante":{
			    	"CodigoCompania": $scope.firstStep.poliza.CodigoCompania,
			    	"MCAMapfreDolar": "N",
			        "Profesion":{
			            "Codigo": ($scope.fourthStep.contractor.showNaturalRucPerson) ? $scope.fourthStep.contractor.mProfesion.Codigo : ''
			        },
			        "Telefono": $scope.fourthStep.contractor.mTelefonoCelular !== undefined && $scope.fourthStep.contractor.mTelefonoCelular !== '' ? $scope.fourthStep.contractor.mTelefonoCelular : $scope.fourthStep.contractor.mTelefonoFijo,
			        "Ubigeo":{
			            "CodigoDepartamento": $scope.fourthStep.contractorAddress.ubigeoData.mDepartamento.Codigo,
			            "CodigoProvincia": $scope.fourthStep.contractorAddress.ubigeoData.mProvincia.Codigo,
			            "CodigoDistrito": $scope.fourthStep.contractorAddress.ubigeoData.mDistrito.Codigo,
			            "CodigoVia": $scope.fourthStep.contractorAddress.mTipoVia.Codigo || "0",
			            "CodigoNumero": $scope.fourthStep.contractorAddress.mTipoNumero.Codigo || "",
			            "TextoNumero": $scope.fourthStep.contractorAddress.mNumeroDireccion || "",
			            "CodigoInterior": $scope.fourthStep.contractorAddress.mTipoInterior.Codigo || "",
			            "TextoInterior": $scope.fourthStep.contractorAddress.mNumeroInterior || "",
			            "CodigoZona": $scope.fourthStep.contractorAddress.mTipoZona.Codigo || "",
			            "TextoZona": $scope.fourthStep.contractorAddress.mNombreZona || "",
			            "Referencia": $scope.fourthStep.contractorAddress.mDirReferencias || ""
			        },
			        "Direccion": $scope.fourthStep.contractorAddress.mNombreVia || "",
			        "TipoDocumento": $scope.fourthStep.contractor.documentType.Codigo,
			        "CodigoDocumento": $scope.fourthStep.contractor.mNumeroDocumento,
			        "Nombre": $scope.fourthStep.contractor.mNomContratante || $scope.fourthStep.contractor.mRazonSocial,
			        "ApellidoPaterno": $scope.fourthStep.contractor.mApePatContratante || "",
			        "ApellidoMaterno": $scope.fourthStep.contractor.mApeMatContratante || "",
			        "FechaNacimiento": ($scope.fourthStep.contractor.showNaturalRucPerson) ? ($scope.fourthStep.contractor.mDay.id + "/" + $scope.fourthStep.contractor.mMonth.id + "/" + $scope.fourthStep.contractor.mYear.id) : "",
			        "Sexo": ($scope.fourthStep.contractor.showNaturalRucPerson) ? $scope.fourthStep.contractor.mSexo : '',
			        "MCAFisico": ($scope.fourthStep.contractor.showNaturalRucPerson) ? "S" : "N",
			        "CorreoElectronico": $scope.fourthStep.contractor.mCorreoElectronico,
			        "Telefono2": $scope.fourthStep.contractor.mTelefonoCelular,
			        "Agente":{
			            "CodigoAgente": $scope.mainStep.claims.codigoAgente
			        },
			        "CodigoUsuarioModifico": $scope.mainStep.claims.codigoUsuario,
			        "ActividadEconomica":{
			            "Codigo": ($scope.fourthStep.contractor.showNaturalRucPerson) ? '' : ($scope.fourthStep.contractor.mActividadEconomica.Codigo)
			        }
			    },
			    "Endosatario":{
			        "TipoDocumento": codEndosatario,
			        "CodigoDocumento": docEndosatario,
			        "SumaEndosatario": $scope.fourthStep.endosatario.Codigo !== null ? $scope.thirdStep.valorMercaderia : ""
			    },
			    "MCAEndosatario": $scope.fourthStep.endosatario.Codigo !== null ? "S" : "N",
			    "Vehiculo":{
			        "PolizaGrupo": $scope.firstStep.poliza.NumeroPolizaGrupo,
			        "ProductoVehiculo":{
			            "CodigoProducto":26
			        },
			        "SumaAsegurada": $scope.fourthStep.endosatario.Codigo !== null ? $scope.thirdStep.valorMercaderia : ""
			    },
			    "Documento":{
			        "NumeroDocumento":"",
			        "NumeroAnterior":0,
			        "NumeroTicket":"",
			        "CodigoEstado":1,
			        "CodigoUsuario": $scope.mainStep.claims.codigoUsuario,
			        "IpDocumento":"",
			        "CodigoUsuarioRED":"Usuario",
			        "EstadoEmision":"",
			        "RutaDocumento":"",
			        "NombreDocumento":"",
			        "FlagDocumento":"",
			        "CodigoProceso":2,
			        "CodigoProducto":26,
			        "NumeroPlaca":"",
			        "CodigoMoneda": $scope.firstStep.poliza.CodigoMoneda,
			        "MontoPrima":0,
			        "McaAsegNuevo":"N",
			        "CodigoAgente": $scope.mainStep.claims.codigoAgente,
			        "Ubigeo":{
			            "CodigoDepartamento":"",
			            "CodigoProvincia":"",
			            "CodigoDistrito":""
			        },
			        "MarcaAsistencia":""
			    },
				"ListaAccionista": $scope.fourthStep.accionistas
				.map(function(it) {return {
                TipDocumento:                      it.documentType.Codigo,
                NroDocumento:                      it.documentNumber || '',
                ApellidoMaterno:                   it.ApellidoMaterno || '',
                ApellidoPaterno:                   it.ApellidoPaterno || '',
                Nombres:                           it.Nombre || '',
                RazonSocial:                       it.RazonSocial || '',
                Relacion:                          it.Relacion.Codigo,
				PorParticipacion:                  it.PorParticipacion,
				  };
				}),

			    "Transporte":{
			        "CodigoTipoTransporte": $scope.firstStep.poliza.CodigoTipoTransporte,
			        "NombreTipoTransporte": $scope.firstStep.poliza.NombreTipoTransporte,
			        "CodigoMateriaAsegurada": $scope.secondStep.materiaAsegurada.Codigo,
			        "NombreMateriaAsegurada": $scope.secondStep.materiaAsegurada.Descripcion,
			        "DescripcionMateriaAsegurada": $scope.secondStep.descripcionMateriaAsegurada,
			        "NombreRiesgo": $scope.secondStep.materiaAsegurada.Descripcion,
			        "CodigoPaisOrigen": $scope.secondStep.pais.Codigo,
			        "NombrePaisOrigen": $scope.secondStep.pais.Descripcion,
			        "TextoLugarOrigen": $scope.secondStep.nombreOrigen || "",
			        "CodigoEstadoOrigen":"",
			        "NombreEstadoOrigen":"",
			        "CodigoProvinciaOrigen":"",
			        "NombreProvinciaOrigen":"",
			        "CodigoLocalidadOrigen":"",
			        "NombreLocalidadOrigen":"",
			        "CodigoPaisDestino": $scope.secondStep.paisDestino.Codigo,
			        "NombrePaisDestino": $scope.secondStep.paisDestino.Descripcion,
			        "TextoLugarDestino": $scope.secondStep.nombreDestino,
			        "CodigoEstadoDestino": $scope.secondStep.departamento.Codigo,
			        "NombreEstadoDestino": $scope.secondStep.departamento.Descripcion,
			        "CodigoProvinciaDestino": $scope.secondStep.provincia.Codigo,
			        "NombreProvinciaDestino": $scope.secondStep.provincia.Descripcion,
			        "CodigoLocalidadDestino": $scope.secondStep.distrito.Codigo,
			        "NombreLocalidadDestino": $scope.secondStep.distrito.Descripcion,
			        "CodigoProvinciaAlmacen": $scope.secondStep.almacen.Codigo,
			        "NombreProvinciaAlmacen": $scope.secondStep.almacen.Descripcion,
			        "CodigoEmbalaje": $scope.firstStep.poliza.CodigoEmbalaje,
			        "NombreEmbalaje": $scope.firstStep.poliza.NombreEmbalaje,
			        "NombreEmpresaTransportadora": $scope.secondStep.companniaTransporte,
			        "NombreVehiculo": $scope.secondStep.nombreNave,
			        "ImporteEmbarque": $scope.thirdStep.valorMercaderia,
			        "NumeroGuia": $scope.secondStep.facturaGuia,
			        "TextoProveedor": $scope.secondStep.nombreProveedor,
			        "CodigoValuacionMercaderia": $scope.thirdStep.valuacionMercaderia.CodigoValuacion,
			        "NombreValuacionMercaderia": $scope.thirdStep.valuacionMercaderia.NombreValuacion,
			        "PorcentajeSobreSeguro": $scope.thirdStep.porcentajeSobreseguro,
			        "TipoSuscripcion": $scope.firstStep.poliza.TipoSuscripcion,
			        "NombreSuscripcion": $scope.firstStep.poliza.NombreTipoSuscripcion,
			        //"FlgImporteDerechoAduana": $scope.secondStep.tasaDerechoAduana,
			        "TasaNeta": $scope.secondStep.tasaDerechoAduana,
			        "TasaMercaderia": $scope.secondStep.tasaMercaderia,
			        "PorcentajeDerechosAduana": $scope.thirdStep.porcentajeSobreseguro,
			        "ImporteFleteTransporte": $scope.thirdStep.flete,
			        "ImporteDerechoAduana": $scope.thirdStep.derechoAduana
			    }
			};

			polizaData = polizasFactory.setReferidoNumber(polizaData)

			const pathParams = {
				opcMenu: localStorage.getItem('currentBreadcrumb')
			   };
			httpData.post(oimProxyPoliza.endpoint + 'api/emision/grabar/transporte?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu, polizaData, undefined, true)
			.then(function(data) {
	    		if (data.OperationCode == "200") {
	    			$scope.mainStep.numeroDeDocumento = data.Data.NumeroDocumento;
	    			$scope.mainStep.numeroPoliza = data.Data.NumeroPoliza;
	    			$scope.emailData = {
	    				emisor : "",
	    				nombreEmisor : "",
	    				reporteParamTransporte : {
	    					CodigoCompania : 1,
							NumeroDocumento : data.Data.NumeroDocumento,
							CodigoAgente  : $scope.mainStep.claims.codigoAgente,
							NumeroPoliza : data.Data.NumeroPoliza,
							Suplemento : "0",
							Aplicacion : "0",
							SuplementoAplicacion : "0",
							TipoImpresion : "P"
	    				}
	    			};
					if($scope.encuesta.mostrar == 1){
						$scope.encuesta.numOperacion = data.Data.NumeroPoliza;
					}
					
					//INICIO BUILDSOFT
					var typeDoc = $scope.fourthStep.contractor.mTipoDocumento.Codigo;
					var NumDoc = $scope.fourthStep.contractor.mNumeroDocumento;

					console.log("Accionista tipo y num", $scope.fourthStep)

					var NumDocAbreviado = NumDoc.substr(-20, 2);
					if (typeDoc == "RUC" && NumDocAbreviado == "20"){
						$scope.fourthStep.isRucContratanteShow = true;         
						getAccionistasSociosAsociado(typeDoc,NumDoc);                  
					} else {
						$scope.fourthStep.isRucContratanteShow = false;
					}
					//FIN BUILDSOFT

	    			$state.go('.', {
	    				step: 6
	    			});
	    			console.log(data);
	    		} else {
	    			mModalAlert.showWarning(data.Message, 'Error al emitir poliza');
	    			console.log(data);
	    		}
	    	}, function() {
	    		console.log(arguments);
	    	});
	    };

		// Inicio BuildSoft
		function getAccionistasSociosAsociado(typeDoc,NumDoc){
			mpfPersonFactory.getAccionista(typeDoc,NumDoc)
				.then(function(response){
				console.log("asociado vida",response);
				angular.forEach(response.Data, function(value){
					if (response.Data != [] && response.Data != null) {
					$scope.fourthStep.isRucContratanteShow = true;
					var accionista = {
						documentType: { Codigo: value.TipDocumento },
						documentNumber: value.NroDocumento,
						//Relacion : obtieneDescripcion(value.Relacion),
						Nombre : value.Nombres,
						ApellidoMaterno :value.ApellidoMaterno,
						ApellidoPaterno :value.ApellidoPaterno,
						RazonSocial : value.RazonSocial,
						PorParticipacion : parseInt(value.PorParticipacion) > 100 || parseInt(value.PorParticipacion) < 0 
											? 0 : parseInt(value.PorParticipacion)
					};
					if(value.Relacion in $scope.fourthStep.relacionLista){
						accionista.Relacion=$scope.fourthStep.relacionLista[value.Relacion];
					}              
					$scope.fourthStep.accionistaShow.push(accionista);
					}else{
						$scope.fourthStep.isRucContratanteShow = false;
					  }
				});
				console.log("todos los datos para mostrar", $scope.fourthStep.accionistaShow);
				}).catch(function (err) {
				console.error(err);
				});
			}

			function obtenerRelacion(){
				mpfPersonFactory.getRelacion().then(function (response) {
				  console.log("Lista relacion", response);				  
				  if (response.Data && response.Data.length) {
					angular.forEach(response.Data, function (value) {
					  $scope.fourthStep.relacionLista[value.Codigo]=value.Descripcion;
					});
				  } 
				  console.log("funcion obtenerRelacion ", $scope.fourthStep.relacionLista);         
				}).catch(function (err) {
				  console.error(err);
				});
			  }	 
			// Fin BuildSoft			

	    $scope.sendEmail = function() {
	    	$scope.optionSendEmail = constants.modalSendEmail.emitirTransporte.action;
			var vModalSendEmail = $uibModal.open({
				backdrop: true, // background de fondo
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				// size: 'lg',
				template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
				controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
					//CloseModal
					$scope.close = function () {
						$uibModalInstance.close();
					};
				}]
			});
	    };
	}]);
});