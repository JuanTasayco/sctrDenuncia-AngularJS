(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js'], function(angular, constants, helper) {
	angular.module('appTransportes').controller('transporteAplicacionS2',
		['$scope', '$state', 'proxyTransporte', 'proxyGeneral', 'proxyUbigeo', 'proxyContratante', '$timeout', '$window', '$uibModal','mModalAlert',
		function($scope, $state, proxyTransporte, proxyGeneral, proxyUbigeo, proxyContratante, $timeout, $window, $uibModal, mModalAlert){

		$scope.data = $scope.$parent.secondStep || {};
		$scope.calculado = false;
		$scope.fleteeditable = true;
		$scope.cFormatDecimal = constants.formats.twoDecimals;

		if (!$scope.$parent.firstStep.poliza){
			$state.go('.', {
				step: 1
			});
		}


		if (!$scope.data.paisDestino) {
			$scope.data.paisDestino = {
				Codigo : "PE", Descripcion: "PERU"
			};
		}
		if (!$scope.data.nombreDestino) {
			$scope.data.nombreDestino = "ALMAC.ASEG.LIMA VIA/CALLAO";
		}

		if (!$scope.data.nombreNave) {
			$scope.data.nombreNave = "POR CONFIRMAR";
		}

		if (!$scope.data.companniaTransporte) {
			$scope.data.companniaTransporte = "POR CONFIRMAR";
		}

		if (!$scope.data.facturaGuia) {
			$scope.data.facturaGuia = "POR CONFIRMAR";
		}

		if (!$scope.data.importeDerechoAduana) {
			// $scope.data.importeDerechoAduana = 0;
			_fnDiabledImporteDerechoAduana('N');
		}

		if (!$scope.data.porcentajeSobreseguro) {
			$scope.data.porcentajeSobreseguro = 0;
		}

		proxyTransporte.ListarRiesgosAplicacion($scope.$parent.firstStep.poliza.CodigoCompania,
			$scope.$parent.firstStep.poliza.NumeroPoliza,
			$scope.$parent.firstStep.poliza.NumeroShipTo,
			true
		).then(function(data) {
			$scope.tiposRiesgo = data.Data;
		}, function() {
			console.log(arguments);
		});

		proxyUbigeo.GetListPais(true).then(function(data) {
			$scope.paises = data.Data;
		}, function() {
			console.log(arguments);
		});

		proxyTransporte.GetListByCodRamo(252, true).then(function(data) {
			$scope.valuacionesMercaderia = data.Data;
			// console.log(JSON.stringify($scope.valuacionesMercaderia));
		}, function(){
			console.log(arguments);
		});

		proxyContratante.GetListEndosatario(true).then(function(data) {
			$scope.endorseeData = data.Data
		}, function() {
			console.log(arguments);
		});

		$scope.onValuacionChanged = function() {
			var fleteCollection = [
				2, 3 , 6, 7
			];
			var b = fleteCollection.filter(function(it) {
				// return it == $scope.data.valuacionMercaderia.CodigoValuacion;
				// return it == ($scope.data.valuacionMercaderia) ? $scope.data.valuacionMercaderia.CodigoValuacion : null;
				return (it == $scope.data.valuacionMercaderia.CodigoValuacion);
			});
			$scope.fleteeditable = b.length > 0;
			$scope.data.flete = '';
		}
		$scope.onEndorseeChange = function(endorsee){
			$scope.data.showCalculatePremium = false //Oculta Calculo prima porque se ha modifcado la suma a endosar
		}

		$scope.sumEndorseAction = function(sumEndorse){
			if ($scope.data.sumEndorseToggle){
				$scope.data.sumEndorseToggle = false;
			}else{
				$scope.sumEndorseError = false;
				if (typeof sumEndorse == 'undefined' || sumEndorse == '' || sumEndorse < 0 /*|| sumEndorse > $scope.secondStep.dataCarValue.Valor*/) {
					$scope.sumEndorseError = true;
				}else{
					$scope.data.showCalculatePremium = false //Oculta Calculo prima porque se ha modifcado la suma a endosar
					$scope.data.sumEndorseToggle = true;
				}
			}
		};

		var _self = $scope;
		$scope.onEmitirConfirmacion = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid && !$scope.calculado) {
				return;
			}
			$scope.$parent.secondStep = $scope.data;
			$scope.$parent.saveState();

			$scope.dataConfirmation = {
	          save:false
	        };
			var vModalConfirmation = $uibModal.open({
				backdrop: true, // background de fondo
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				// size: 'lg',
				template : '<mpf-modal-confirmation data="dataConfirmation" close="close()"></mpf-modal-confirmation>',
				controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
					//CloseModal
					$scope.close = function () {
						if (_self.dataConfirmation.save == true) {
							_self.$parent.guardarPoliza();
						}
						$uibModalInstance.close();
					};
				}]
			});
		}

		function _fnDiabledImporteDerechoAduana(derechoAduana){
			var vDisabled = derechoAduana == 'N';
			if (vDisabled) $scope.data.importeDerechoAduana = 0;
			$scope.diabledImporteDerechoAduana = vDisabled;
		}

		$scope.onRiesgoChanged = function() {
			proxyTransporte.GetMarcoRiesgo({
				CodigoCompania: $scope.$parent.firstStep.poliza.CodigoCompania,
				NumeroPoliza : $scope.$parent.firstStep.poliza.NumeroPoliza,
				NumeroSPTO : $scope.$parent.firstStep.poliza.NumeroShipTo,
				NumeroRiesgo : ($scope.data.riesgo && $scope.data.riesgo.NumeroRiesgo) ? $scope.data.riesgo.NumeroRiesgo : 0,
				CodigoRamo : "252"
			}, true).then(function(data) {
				$scope.data.marcoRiesgo = data.Data;
				_fnDiabledImporteDerechoAduana($scope.data.marcoRiesgo.Derechoaduana);
				$scope.data.porcentajeSobreseguro = data.Data.Sobreseguro || 0;
			}, function() {
				console.log(arguments);
			});

			var vValorCampo = ($scope.data.riesgo && $scope.data.riesgo.ValorCampo) ?  $scope.data.riesgo.ValorCampo : '';
			$scope.materiasAseguradas = [];
			if (vValorCampo != ''){
				proxyTransporte.ListarMateriaAseguradaPorCodigo($scope.data.riesgo.ValorCampo,true).then(function(data) {
					$scope.materiasAseguradas = data.Data;
				}, function() {
					console.log(arguments);
				});
			}
		}

		$scope.onCalcularPrima = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid) {
				return;
			}

			if (parseInt($scope.data.valorMercaderia) > parseInt($scope.data.marcoRiesgo.LimiteMaximoEmbarque)) {
				mModalAlert.showWarning("El valor de la mercadería excede el límite máximo por embarque", 'Error al calcular prima');
				return;
			}

			var fMin = new Date($scope.data.fInicioAplicacion.fYear.description + "-" + $scope.data.fInicioAplicacion.fMonth.description + "-" + $scope.data.fInicioAplicacion.fDay.description);
			var fMax = new Date($scope.data.fFinAplicacion.fYear.description + "-" + $scope.data.fFinAplicacion.fMonth.description + "-" + $scope.data.fFinAplicacion.fDay.description);

			if (fMin > fMax) {
				mModalAlert.showWarning('"Fecha fin aplicación" debe ser superior a "Fecha inicio aplicación"', 'Error al calcular prima');
				return;
			}

			proxyTransporte.CalcularPrimaApl({
				ValorMercaderiaFOB : $scope.data.valorMercaderia,
				ImporteDerechoAduana : $scope.data.importeDerechoAduana,
				PorcentajeSobreSeguro : $scope.data.porcentajeSobreseguro,
				Flete : $scope.data.flete
			}, true).then(function(data) {
				$scope.data.calculoPrima = data.Data;
				$scope.calculado = true;
			}, function() {
				console.log(arguments);
			})
		}

		// $scope.fnDiabledImporteDerechoAduana = function(){
		// 	return
		// }

	}]);
});
