(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper){
	angular.module('appTransportes').controller('transporteEmitS1', ['$scope', 'proxyPoliza','$state',function($scope, proxyPoliza, $state) {
		//Pagination configuration
		$scope.filteredPolizasGrupo = [];
		$scope.numPerPage = 4;
		$scope.maxSize = 4;
		$scope.currentPage = 0;
		$scope.polizaSelected = null;
		$scope.format = 'dd/MM/yyyy';
		$scope.selectDate = null;
		$scope.selectDateEnd = null;
		$scope.dateError = false;
		$scope.changePoliza = false;

		// $scope.dateConfigurations = {
		// 	dateDisabled: function(data){
		// 		var date = data.date;
		// 		var _today = new Date(); 
		// 		_today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
		// 		return  date < _today;
  //     },
		// 	initDate : new Date(),
		// 	minDate : new Date(),
		// 	showWeeks : false,
		// 	customClass : function(date, mode) {
		// 		return "transporte-picker";
		// 	}
		// }
		function _calendarSettings(){
      $scope.today = function() {
        if (typeof $scope.selectDate == 'undefined') $scope.selectDate = new Date();
      };
      $scope.today();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };

      $scope.optionsFechaInicioVigencia = {
      	dateDisabled: function(data){
					var date = data.date;
					var _today = new Date(); 
					_today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
					return  date < _today;
	      },
        formatYear: 'yy',
        minDate: new Date(),
        startingDay: 1
      };
      
      $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.optionsFechaInicioVigencia.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMin();

      $scope.openFechaInicioVigencia = function() {
        $scope.popupFechaInicioVigencia.opened = true;
      };

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupFechaInicioVigencia = {
        opened: false
      };

      $scope.changeDate = function(){
        recalcularFechaFin();
      }
      $scope.changeDate();
    }
    _calendarSettings();

		$scope.polizasGrupo = [];
		$scope.$on('claimschange', function() {
			$scope.$parent.firstStep.existGroupPolicy = false;
			$scope.currentPage = 0;
			proxyPoliza.GetListPolizaGrupo(253,$scope.$parent.mainStep.claims.codigoAgente,358, true).then( function (response) {
				if(response.OperationCode == constants.operationCode.success){
					$scope.polizasGrupo = response.Data;
					if (response.Data.length > 0) $scope.$parent.firstStep.existGroupPolicy = true;
					for (var i = 0; i < $scope.polizasGrupo.length; i++) {
						$scope.polizasGrupo[i].FechaVencimiento = new Date();
						$scope.polizasGrupo[i].FechaVencimiento.setDate($scope.polizasGrupo[i].FechaVencimiento.getDate() + $scope.polizasGrupo[i].DiasVigencia);
					}
					$scope.polizasGrupo.sort(function(a,b) {
						return parseInt(a.NumeroPolizaGrupo) - parseInt(b.NumeroPolizaGrupo);
					});
					$scope.currentPage = 1;
					$scope.polizaSelected = null;
				} else if (response.Message.length > 0){
					console.log(response.Message);
				}
			}, function(error) {
				console.log("Error obteniendo polizas" + error);
			});
		});
		

		$scope.$watch('currentPage + numPerPage', function () {
			var begin = (($scope.currentPage - 1) * $scope.numPerPage);
			var end = begin + $scope.numPerPage;

			$scope.filteredPolizasGrupo = $scope.polizasGrupo.slice(begin, end);
		});

		$scope.onPolizaSelected = function(poliza) {
			if ($scope.$parent.firstStep.poliza) {
				$scope.changePoliza = true;
			}
			$scope.polizaSelected = poliza;
			recalcularFechaFin();

			if ($scope.polizasGrupo.length == 0) {
				$scope.$broadcast('claimschange',{"val":$scope.$parent.mainStep.claims});
			}
		}

		function recalcularFechaFin() {
			if ($scope.selectDate != null) {
				$scope.dateError = $scope.selectDate > $scope.maxDate;
				$scope.selectDateEnd = new Date($scope.selectDate);
				if ($scope.polizaSelected) {
					var diasVigencia = parseInt($scope.polizaSelected.DiasVigencia);
					$scope.selectDateEnd.setDate($scope.selectDate.getDate() + diasVigencia);
				}
			}
		}
		// $scope.$watch('selectDate', recalcularFechaFin);

		$scope.nextStep = function() {
			$scope.fData.markAsPristine();
			if (!$scope.fData.$valid) {
				return;
			}
			if ($scope.polizaSelected == null || $scope.selectDate == null || $scope.dateError == true) {
				//TODO : Show message errors
				return false;
			}

			$scope.$parent.firstStep.poliza = $scope.polizaSelected;
			$scope.$parent.firstStep.vigencia = $scope.selectDate;
			$scope.$parent.firstStep.vigenciaFin = $scope.selectDateEnd;
			if ($scope.changePoliza) {
				$scope.$parent.resetState();	
			}

			$state.go('.', {
				step : 2
			});
		};

		//load data if exists
		if ($scope.$parent.firstStep && $scope.$parent.firstStep.poliza) {
			$scope.polizaSelected = $scope.firstStep.poliza;
			if (typeof $scope.$parent.firstStep.vigencia == 'string') {
				$scope.$parent.firstStep.vigencia = new Date($scope.$parent.firstStep.vigencia);
				$scope.$parent.firstStep.vigenciaFin = new Date($scope.$parent.firstStep.vigenciaFin);	
			}

			$scope.selectDate = $scope.$parent.firstStep.vigencia;
			$scope.selectDateEnd = $scope.$parent.firstStep.vigenciaFin;
		} else {
			$scope.selectDate = new Date();
		}
	}]);
});