(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants) {
	angular.module('appTransportes').controller('transporteAplicacionS1',
		['$scope', '$state', 'proxyTransporte', 'proxyTipoDocumento', 'mModalAlert', 'oimClaims',
		function($scope, $state, proxyTransporte, proxyTipoDocumento, mModalAlert, oimClaims) {

			(function onLoad() {
				$scope.mainStep = $scope.mainStep || {};

				$scope.numPerPage = 4;
				$scope.maxSize = 4;
				$scope.currentPage = 0;
				$scope.polizasGrupo = [];
				// INFO: Validación ClienteEmpresa
				$scope.search = $scope.mainStep.IS_COMPANY_CLIENT
					? { tipoDocumento: { Codigo: 'RUC' }, numeroDocumento: oimClaims.rucNumber, cliente: '' }
					: { numeroDocumento: '', cliente: '' };

				_filter('1', !$scope.mainStep.IS_COMPANY_CLIENT);
			})();
		/*########################
    # filter
    ########################*/
    function _buildFilter(currentPage){
      var vParams = {
				CodigoCompania: 				constants.module.polizas.transportes.companyCode,
				CodigoRamo: 						'252',
				CantidadFilasPorPagina: '10',
				PaginaActual: 					currentPage,
				Contratante: {
					TipoDocumento: 		($scope.search.tipoDocumento && $scope.search.tipoDocumento.Codigo && $scope.search.tipoDocumento.Codigo !== null) ? $scope.search.tipoDocumento.Codigo : '0',
					CodigoDocumento: 	($scope.search.numeroDocumento || $scope.search.numeroDocumento !== '') ? $scope.search.numeroDocumento : '0',
					NombreCompleto: 	$scope.search.cliente ? $scope.search.cliente : '',
					Agente: {
						CodigoAgente: 	$scope.mainStep.claims.codigoAgente
					}
				},
				Poliza: {
					NumeroPoliza: $scope.search.poliza ? $scope.search.poliza : '0'
				}
			}
      return vParams;
    }
    function formatZeroBefore(number){
      var n = number.toString();
      return n.replace(/^(\d)$/, '0$1');
    }
    function _validateAgent() {
			return $scope.mainStep.IS_COMPANY_CLIENT
				? true
				: $scope.mainStep.claims.codigoAgente !== '0';
    }
		function _filter(currentPage, firstTime){
			$scope.noResultInfo = false;
      $scope.noResult = false;
      if (_validateAgent()){
      	var vParams = _buildFilter(currentPage);
	      proxyTransporte.GetPolizaBuscarAplicTransPaginado(vParams, true).then(function(response){
	        if (response.OperationCode == constants.operationCode.success){
	          if (response.Data.Lista.length > 0){
	            $scope.totalPolicies = formatZeroBefore(response.Data.CantidadTotalFilas);
	            $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
	            $scope.items = response.Data.Lista;
	          } else {
	          	(firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
	          }
	        }else{
	        	(firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
	        }
	      }).catch(function() {
					(firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
				});
	    }else{
	    	$scope.noResultInfo = true;
	    	mModalAlert.showError("No tiene un agente seleccionado", "Error");
	    }
    }
    function _clearFilterResult(){
      $scope.totalPolicies = 0;
      $scope.totalItems = 0;
      $scope.items = [];
    }
    $scope.filter = function(currentPage){
      $scope.mPagination = currentPage;
      _clearFilterResult();
      _filter(currentPage, false);
    };
    /*########################
    # Pager
    ########################*/
    $scope.pageChanged = function(page){
      _filter(page, false);
    };

		function _clearApplitaion(){
			$scope.$parent.firstStep = {};
			$scope.$parent.secondStep = {};
		}

		$scope.onAplicacion = function(item) {
			_clearApplitaion();
			$scope.$parent.firstStep.poliza = item;
			$scope.$parent.saveState();
			$state.go('.', {
				step: 2
			});
		};

		proxyTipoDocumento.getTipoDocumento(true).then(function(data) {
			$scope.tiposDeDocumentos = data.Data;
		});
	}]);
});