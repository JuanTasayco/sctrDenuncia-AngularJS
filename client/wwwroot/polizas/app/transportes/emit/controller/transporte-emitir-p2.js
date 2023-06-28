(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper){
	angular.module('appTransportes').controller('transporteEmitS2', ['$scope', 'proxyGeneral', 'proxyUbigeo', 'proxyTransporte', '$state', function($scope, proxyGeneral, proxyUbigeo, proxyTransporte, $state) {
		$scope.data = $scope.$parent.secondStep || {};

		if (!$scope.data.nombreDestino) {
			$scope.data.nombreDestino = "ALMAC.ASEG.LIMA VIA/CALLAO";
		}

		if (!$scope.data.paisDestino) {
			$scope.data.paisDestino = {
				Codigo : "PE", Descripcion: "PERU"
			};
		}

		if (!$scope.data.departamento) {
			$scope.data.departamento = {
				Codigo : "15", Descripcion:"LIMA"
			};
		}

		if (!$scope.data.provincia) {
			$scope.data.provincia = {
				Codigo : "128", Descripcion:"LIMA"
			}
		}

		if (!$scope.data.distrito) {
			$scope.data.distrito = {
				Codigo : "1", Descripcion:"CERCADO DE LIMA"
			}
		}

		if (!$scope.data.companniaTransporte) {
			$scope.data.companniaTransporte = "POR CONFIRMAR"
		}

		if (!$scope.data.nombreNave) {
			$scope.data.nombreNave = "POR CONFIRMAR"
		}

		if (!$scope.data.facturaGuia) {
			$scope.data.facturaGuia = "POR CONFIRMAR"
		}

		if (!$scope.data.nombreProveedor) {
			$scope.data.nombreProveedor = "POR CONFIRMAR"
		}

		if (!$scope.data.tasaMercaderia) {
			$scope.data.tasaMercaderia = $scope.$parent.firstStep.poliza.TasaDefectoMercaderia;
		}

		//load the data for al dropdowns
		proxyGeneral.GetListMateriaAsegurada(true).then(function(data) {
			$scope.materiasAseguradas = data.Data;
			if (!$scope.data.materiaAsegurada || $scope.data.materiaAsegurada.selectedEmpty) {
				var d = $scope.materiasAseguradas.filter(function(it){ return it.Codigo == "42";});
				$scope.data.materiaAsegurada = d[0];
			}
		}, function() {
			console.log(arguments);
		});

		proxyUbigeo.GetListPais(true).then(function(data) {
			$scope.paises = data.Data;
		}, function() {
			console.log(arguments);
		});

		proxyUbigeo.getDepartamento(true).then(function(data) {
			$scope.departamentos = data.Data;
		}, function() {
			console.log(arguments);
		});

		proxyTransporte.GetListAlmacen(true).then(function(data) {
			$scope.almacenes = data.Data;

			if (!$scope.data.almacen || $scope.data.almacen.selectedEmpty) {
				var d = $scope.almacenes.filter(function(it){ return it.Codigo == "128";});
				$scope.data.almacen = d[0];
			}
		}, function() {
			console.log(arguments);
		});

		$scope.onDepartamentosChange = function() {
			proxyUbigeo.getProvincia($scope.data.departamento.Codigo, true).then(function(data) {
				$scope.provincias = data.Data;
				if ($scope.data.provincia && $scope.data.provincia.Codigo != null) {
					$scope.onProvinciasChange();
				}
			}, function() {
				console.log(arguments);
			});
		}

		$scope.onProvinciasChange = function() {
			proxyUbigeo.getDistrito($scope.data.provincia.Codigo, true).then(function(data){
				$scope.distritos = data.Data;
			}, function() {
				console.log(arguments);
			});
		}

		$scope.nextStep = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid) {
				return;
			}
			$scope.$parent.secondStep = $scope.data;
			$scope.$parent.saveState();

			$state.go('.', {
				step : 3
			});
		};

		if ($scope.data.departamento && $scope.data.departamento.Codigo != null) {
			$scope.onDepartamentosChange();
		}
	}]);
});