(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper){
	angular.module('appTransportes').controller('transporteEmitS3', ['$scope', 'proxyTransporte', 'proxyCotizacion', '$state', 'mModalAlert',function($scope, proxyTransporte, proxyCotizacion, $state, mModalAlert) {
		$scope.data = $scope.$parent.thirdStep || {};
		$scope.calculado = false;
		$scope.cFormatDecimal = constants.formats.twoDecimals;
		
		console.log("Llega data transporte-emitir-p3: ", $scope);

		if (!$scope.data.flete) {
			$scope.data.flete = "0";
		}

		if (!$scope.data.derechoAduana) {
			$scope.data.derechoAduana = "0";
		}

		if (!$scope.data.porcentajeSobreseguro) {
			$scope.data.porcentajeSobreseguro = "0";
		}

		proxyTransporte.GetListByCodRamo(253, true).then(function(data) {
			$scope.valuacionesMercaderia = data.Data;

			if (!$scope.data.valuacionMercaderia) {
				var d = $scope.valuacionesMercaderia.filter(function(it){ return it.NombreValuacion=="F.O.B";});
				$scope.data.valuacionMercaderia = d[0];
			}
		}, function(){
			console.log(arguments);
		});

		$scope.calcularPrima = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid) {
				return;
			}

			if (parseInt($scope.data.derechoAduana) > parseInt($scope.$parent.firstStep.poliza.LimiteEmbarque)) {
				mModalAlert.showWarning("Derecho de aduana debe ser menor o  igual que el limite máximo de embarque", 'Error al calcular prima');
				return;
			}

			proxyCotizacion.cotizarTransporte({
				"PolizaGrupo": $scope.$parent.firstStep.poliza.NumeroPolizaGrupo,
			    "CodigoMateriaAsegurada": $scope.$parent.secondStep.materiaAsegurada.Codigo,
			    "CodigoValuacionMercaderia": $scope.data.valuacionMercaderia.CodigoValuacion,
			    "ImporteEmbarque": $scope.data.valorMercaderia,
			    "ImporteFleteTransporte": $scope.data.flete,
			    "PorcentajeSobreSeguro": $scope.data.porcentajeSobreseguro,
			    "ImporteDerechoAduana": $scope.data.derechoAduana,
			    "TasaMercaderia": $scope.$parent.secondStep.tasaMercaderia,
			    "PorcentajeDerechoAduana": $scope.$parent.firstStep.poliza.TasaDerechoAduana
			}, true).then(function(data) {
				if (parseFloat(data.Data.TotalImporteAsegurado) > parseFloat($scope.$parent.firstStep.poliza.LimiteEmbarque)) {
					mModalAlert.showWarning('"Importe Asegurado"debe ser menor o igual a valor "Limite Max. Embarque"', 'Error al calcular prima');
					$scope.calculado = false;
					return;
				}
				$scope.data.calculo = data.Data;
				$scope.calculado = true;
			}, function() {
				console.log(arguments);
			});
		};

		$scope.nextStep = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid) {
				return;
			}

			if (!$scope.calculado) {
				mModalAlert.showWarning("Se debe calcular la prima para poder continuar", 'Importante!');
				return;
			}
			$scope.$parent.thirdStep = $scope.data;
			$scope.$parent.saveState();
			
			$state.go('.', {
				step : 4
			});
		};
	}]);
});