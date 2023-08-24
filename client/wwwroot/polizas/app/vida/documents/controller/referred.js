(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper',
	'/polizas/app/vida/proxy/vidaFactory.js'], 
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('vidaReferredController', 
			['$scope', '$window', '$state', '$timeout', 'vidaFactory', 'oimClaims', 'oimPrincipal',  
			function($scope, $window, $state, $timeout, vidaFactory, oimClaims, oimPrincipal){
		
				(function onLoad(){
					$scope.main = $scope.main || {};
					// $scope.firstStep = $scope.firstStep || {};
					// $scope.secondStep = $scope.secondStep || {};
          $scope.firstLoad = true;
					settingsVigencia();
					_filter('1');

				})();

				function settingsVigencia(){

          $scope.today = function() {
            var _today = new Date(); 
            if (typeof $scope.mDesdeFilter == 'undefined') $scope.mDesdeFilter = new Date();
            if (typeof $scope.mHastaFilter == 'undefined') $scope.mHastaFilter = new Date();
          };
          $scope.today();

          $scope.inlineOptions = {
            showWeeks: true
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(),
            startingDay: 1
          };

          $scope.openDesdeFilter = function() {
            $scope.popupDesdeFilter.opened = true;
          };
          $scope.openHastaFilter = function() {
            $scope.popupHastaFilter.opened = true;
          };

          $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
          };

          $scope.format = constants.formats.dateFormat;
          $scope.altInputFormats = ['M!/d!/yyyy'];

          $scope.popupDesdeFilter = {
            opened: false
          };
          $scope.popupHastaFilter = {
            opened: false
          };
        }

        /*########################
        # _clearFilter
        ########################*/
        function _clearFilter(){
          $scope.mNumeroCotizacionFilter = '';
          $scope.mNombreContratanteFilter = '';
          $scope.mNombreReferidoFilter = '';
          $scope.mDesdeFilter = new Date();
          $scope.mHastaFilter = new Date();
        }
        $scope.clearFilter = function(){
          _clearFilter();
        }
        /*########################
        # filter
        ########################*/
				function _buildFilter(currentPage){
          var data = {
						FechaIncio: 			$scope.main.filterDate($scope.mDesdeFilter, constants.formats.dateFormat), //'25/12/2016',
						FechaFin: 				$scope.main.filterDate($scope.mHastaFilter, constants.formats.dateFormat), //09/02/2017,
						NumeroCotizacion: (typeof $scope.mNumeroCotizacionFilter == 'undefined') ? '' : $scope.mNumeroCotizacionFilter, //'',
						NombreContratante: (typeof $scope.mNombreContratanteFilter == 'undefined') ? '' : $scope.mNombreContratanteFilter, //'',
						NombreReferido: (typeof $scope.mNombreReferidoFilter == 'undefined') ? '' : $scope.mNombreReferidoFilter, //'',
						Agente: {
							CodigoGestor: 		'0',
							CodigoOficina: 		(oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode //'0' //0 //pendiente en el claims o por CONFIRMar, pero si el rol es admin valor 0
						},
						CantidadFilasPorPagina: '10',
						PaginaActual: 					currentPage //'1'
          }
          return data;
        }
        function _filter(currentPage){
					$scope.noResult = false;
          var params = _buildFilter(currentPage);
          vidaFactory.filterRefrred(params, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Lista.length > 0){
                $scope.firstLoad = true;
                $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                $scope.items = response.Data.Lista;
              }else{
              	$scope.noResult = true;
              }
            }else{
              $scope.noResult = true;
              // mModalAlert.showError(response.Message, 'Error');
            }
          }, function(error){
            $scope.noResult = true;
            // console.log('error');
          }, function(defaultError){
            $scope.noResult = true;
            // console.log('errorDefault');
          });
        }
        function _clearFilterResult(){
          $scope.totalItems = 0;
          $scope.items = [];
        }
        $scope.filter = function(currentPage){
          $scope.mPagination = currentPage;
          _clearFilterResult();
          _filter(currentPage);
        }
        /*########################
        # Filter x page
        ########################*/
        $scope.pageChanged = function(page){
          _filter(page);
        }

		
		}])
});