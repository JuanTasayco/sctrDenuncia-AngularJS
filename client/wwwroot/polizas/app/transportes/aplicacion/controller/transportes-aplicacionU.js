(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', 'modalSendEmail'], function(angular, constants, helper) {
	angular.module('appTransportes').controller('transporteAplicacionController', ['$scope', 'oimPrincipal', '$state', 'proxyTransporte', '$timeout', 'mModalAlert', '$uibModal', '$sce', 'oimClaims',
	function($scope, oimPrincipal,  $state, proxyTransporte, $timeout, mModalAlert, $uibModal, $sce, oimClaims) {
		(function onLoad() {
			$scope.mainStep = $scope.mainStep || {};
			$scope.firstStep = $scope.firstStep || {};
			$scope.secondStep = $scope.secondStep || {};

			// INFO: Validación ClienteEmpresa
			$scope.mainStep.IS_COMPANY_CLIENT = $scope.mainStep.IS_COMPANY_CLIENT || oimPrincipal.isCompanyClient();
			$scope.mainStep.claims = $scope.mainStep.IS_COMPANY_CLIENT
				? { codigoAgente: '0',  codigoNombre: '' }
				: { codigoAgente: oimClaims.agentID, codigoNombre: oimClaims.agentID + ' >>> ' + oimClaims.agentName };

			$scope.userRoot = oimPrincipal.isAdmin();

		})();

		$scope.pasosTransporte = [
			{description: 'Buscador de pólizas'},
			{description: 'Datos de la aplicación'}
		];

		$scope.$on('$stateChangeSuccess', function (s, state, param, d) {
			$scope.currentStep = param.step;
	    });

			function _clearApplication(){
				$scope.firstStep = {};
				$scope.secondStep = {};
			}

	    $scope.gotoStep = function(step, newApplication) {
	    	if (newApplication) _clearApplication();
	    	if ($scope.currentStep > step) {
	    		$state.go('.', {
	    			step : step
	    		});
	    	}
	    };

	    $scope.saveState = function() {
	    };

	    $scope.guardarPoliza = function() {
	    	var fechaEmbarque = $scope.secondStep.fEmbarque.fDay.description + $scope.secondStep.fEmbarque.fMonth.description + $scope.secondStep.fEmbarque.fYear.description;
	    	var mesAplicacion = $scope.secondStep.fEmbarque.fMonth.description + $scope.secondStep.fEmbarque.fYear.description;
	    	var aplicacionInicio = $scope.secondStep.fInicioAplicacion.fDay.description + $scope.secondStep.fInicioAplicacion.fMonth.description + $scope.secondStep.fInicioAplicacion.fYear.description;
	    	var aplicacionFin = $scope.secondStep.fFinAplicacion.fDay.description + $scope.secondStep.fFinAplicacion.fMonth.description + $scope.secondStep.fFinAplicacion.fYear.description;


	    	var codEndosatario = "";
	    	var docEndosatario = "";
	    	if ($scope.secondStep.endosatario.Codigo !== null) {
	    		docEndosatario = $scope.secondStep.endosatario.Codigo;
	    		codEndosatario = $scope.secondStep.endosatario.TipoDocumento;
	    	}
	    	var polizaData = {
	    		"NumeroDocumento": 						0,
	        "CodigoProducto": 						10,
	        "NumeroRiesgo": 							$scope.secondStep.riesgo.NumeroRiesgo,
	        "FechaEmbarque": 							fechaEmbarque,
	        "CodigoMesAplicacion": 				mesAplicacion,
	        "ImpuestoDerechoAduana": 			$scope.secondStep.calculoPrima.ImporteDerechoAduana,
	        "TasaDerechoAduana": 					$scope.secondStep.marcoRiesgo.TasaDerechoAduana,
	        "ImporteEmbarque": 						$scope.secondStep.calculoPrima.ValorEmbarque,
	        "NombreEmpTransporte": 				$scope.secondStep.companniaTransporte,
	        "NombreVehiculo": 						$scope.secondStep.nombreNave,
	        "NumeroGuia": 								$scope.secondStep.facturaGuia,
	        "CodigoPaisOrigen": 					$scope.secondStep.pais.Codigo,
	        "CodigoValuacionMercaderia": 	$scope.secondStep.valuacionMercaderia.CodigoValuacion,
	        "PorcentajeSobreSeguro": 			$scope.secondStep.porcentajeSobreseguro,
	        "Origen": 										$scope.secondStep.nombreOrigen,
	        "Destino": 										$scope.secondStep.nombreDestino,
	        "Proveedor": 									$scope.secondStep.nombreProveedor,
	        "CodigoMateriaAsegurada": 		$scope.secondStep.materiaAsegurada.Codigo,
	        "FechaEfectivaPoliza": 				aplicacionInicio,
	        "FechaVencimientoPoliza": 		aplicacionFin,
	        "TipoDocumentoAsegurado": 		$scope.firstStep.poliza.ContratanteTipoDoc,
	        "TipoDocumentoEndosatario": 	codEndosatario,
	        "CodigoDocumentoAsegurado": 	$scope.firstStep.poliza.ContratanteNumeroDoc,
	        "CodigoDocumentoEndosatario": docEndosatario,
	        "ImporteAsegurado": 					$scope.secondStep.calculoPrima.SumaAsegurada,
	        "NumeroPolizaMarco": 					$scope.firstStep.poliza.NumeroPoliza,
	        "NumeroAplicacion": 					$scope.firstStep.poliza.Aplicacion,
	        "NombreRiesgo": 							$scope.secondStep.riesgo.NombreMaterial,
	        "MCA_DerechoAduana": 					$scope.secondStep.marcoRiesgo.Derechoaduana,
	        "ImporteFleteAsegurado": 			$scope.secondStep.flete,
	        "ValorMercaderia": 						$scope.secondStep.valorMercaderia,
	        "DescripcionMateria": 				$scope.secondStep.descripcionMateriaAsegurada,
	        "ImporteSobreSeguro": 				$scope.secondStep.calculoPrima.ImporteSobreSeguro,
	        "Contratante": 								$scope.firstStep.poliza.ContratanteNombre,
	        "UsuarioRegistro": 						oimPrincipal.getUsername(),
	        "IPRegistro": 								"",
	        "UsuarioRed": 								"usuario",
	        "MCA_TomadoresAlternos": 			"N",
	        "PorcentajeTomadorPrincipal": 100,
	        "CodigoCompania": 						$scope.firstStep.poliza.CodigoCompania,
	        "CodigoEntidad": 							1,
	        "CodigoPolizaMarco": 					$scope.firstStep.poliza.NumeroPoliza,
	        "InicioVigenciaPoliza": 			$scope.firstStep.poliza.InicioVigencia,
	        "FinVigenciaPoliza": 					$scope.firstStep.poliza.FinVigencia
	    	};

	    	proxyTransporte.InsertAplicacionTransporte(polizaData, true).then(function(data) {
	    		if (data.OperationCode == "200") {
	    			$scope.mainStep.numeroDeDocumento = data.Data.NumeroDocumento;
	    			$scope.mainStep.numeroAplicacion = data.Data.NumeroAplicacion;
	    			$scope.mainStep.numeroPoliza = data.Data.NumeroPolizaMarco;

	    			$scope.emailData = {
	    				emisor : "",
	    				nombreEmisor : "",
	    				reporteParamTransporte : {
	    					CodigoCompania : 1,
							NumeroDocumento : data.Data.NumeroDocumento,
							CodigoAgente  : $scope.mainStep.claims.codigoAgente,
							NumeroPoliza : data.Data.NumeroPoliza,
							Suplemento : "0",
							Aplicacion : $scope.mainStep.numeroAplicacion,
							SuplementoAplicacion : "0",
							TipoImpresion : "A"
	    				}
	    			}
	    			$state.go('.', {
	    				step: 3
	    			});
	    		} else {
	    			mModalAlert.showWarning(data.Message, 'Error al aplicar poliza');
	    		}
	    	});
	    };

	    $scope.sendEmail = function() {
	    	$scope.optionSendEmail = constants.modalSendEmail.emitirTransporte;
	    	$scope.optionSendEmail.title = "aplicación de transporte";
	    	$scope.optionSendEmail.button = "aplicación";
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

	    $scope.reporteTransporte = function() {
	    	var pdf = {
	    		CodigoCompania : 1,
				NumeroDocumento : $scope.mainStep.numeroDeDocumento,
				CodigoAgente  : $scope.mainStep.claims.codigoAgente,
				NumeroPoliza : $scope.mainStep.numeroPoliza,
				Suplemento : "0",
				Aplicacion : $scope.mainStep.numeroAplicacion,
				SuplementoAplicacion : "0",
				TipoImpresion : "A",
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

	    $scope.nuevaAplicacion = function() {
	    	$state.go('.', {
					step: 1
			}, {reload: true});
	    }
	}]);
});
