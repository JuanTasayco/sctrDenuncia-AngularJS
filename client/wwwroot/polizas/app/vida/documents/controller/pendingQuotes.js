(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper', 'lodash',
	'/polizas/app/vida/proxy/vidaFactory.js'],
	function(angular, constants, helper, _){

		var appAutos = angular.module('appAutos');

		appAutos.controller('vidaPendingQuotesController',
			['$scope', '$window', '$state', '$timeout', 'vidaFactory', 'oimClaims', 'oimPrincipal', 'vidaProducts', 'vidaRoles',
			function($scope, $window, $state, $timeout, vidaFactory, oimClaims, oimPrincipal, vidaProducts, vidaRoles){
				(function onLoad(){
          $scope.main = $scope.main || {};
          $scope.mAgenteFilter = $scope.main.agent;
          $scope.showAgent = _showAgent();
          $scope.firstLoad = true;
					// $scope.firstStep = $scope.firstStep || {};
          // $scope.secondStep = $scope.secondStep || {};

          vidaFactory.esUsuarioEspecial().then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.main.isSpecial = response.Data;
            }
          });

					if (vidaProducts) $scope.productoFilterData = vidaProducts;
					settingsVigencia();
					_filter('1');

				})();

        $scope.link = function(item) {
          // $window.sessionStorage["vidaCotizacion"] = item.NumeroCotizacion;
          // $state.go('vidaemit.steps', {step:1}, {reload:true});
          $state.go('vidaQuoted', {
            quotationNumber: item.NumeroCotizacionEncript
          });
        };

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
            //dateDisabled: disabled,
            // dateDisabled: function(data){
            //   // debugger;
            //   var date = data.date;
            //   var _today = new Date(); _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
            //   return  date < _today;
            // },
            formatYear: 'yy',
            maxDate: new Date(),
            startingDay: 1
          };

          // Disable weekend selection
          // function disabled(data) {
          //   var date = data.date,
          //   mode = data.mode;
          //   return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          // }

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
        # autocompleteGestor
        ########################*/
        function _buildGestor(value){
          var data = {
            NombreGestor: value.toUpperCase(),
            CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode, //'9999', //pendiente en el claims o por CONFIRMar, pero si el rol es admin valor 0
            CodigoAgente: oimClaims.agentID, //'1295',
            RolUsuario: oimPrincipal.get_role(), //'ADMIN'
            ValidarEspecial: true
          }
          return data;
        }
        $scope.searchGestor = function(value){
          var params = _buildGestor(value);
          return vidaFactory.getGestor(params, false);
        }
        /*########################
        # autocompleteAgent
        ########################*/
        function _buildAgent(value){
          var data = {
            CodigoNombre: value.toUpperCase(),
            CodigoGestor: (typeof $scope.mGestorFilter == 'undefined') ? '0' : $scope.mGestorFilter.codigo,
            CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode, //'9999', //pendiente en el claims o por CONFIRMar, pero si el rol es admin valor 0
            McaGestSel: 'S',
            RolUsuario: oimPrincipal.get_role()
          }
          return data;
        }
        $scope.searchAgent = function(value){
          var params = _buildAgent(value);
          return vidaFactory.getAgent(params, false);
        }
        function _showAgent(){
          var vRole = oimPrincipal.get_role();
          var vResult = $scope.main.isAdmin || _.contains([vidaRoles.director, vidaRoles.gestor, vidaRoles.eac, vidaRoles.directore, vidaRoles.eacemi, vidaRoles.gestoremi], vRole);
          return vResult;
        }
        /*########################
        # _clearFilter
        ########################*/
        function _clearFilter(){
          $scope.mGestorFilter = undefined;
          $scope.mAgenteFilter = undefined;
          $scope.mDniRucFilter = '';
          $scope.mNumeroCotizacionFilter = '';
          $scope.mProductoFilter = '';
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
					var vCodigoModalidad = '';
					if (typeof $scope.mProductoFilter !== 'undefined'){
						if ($scope.mProductoFilter.CodigoProducto !== null){
							vCodigoModalidad = $scope.mProductoFilter.CodigoProducto;
						}
					}
          var data = {
						FechaIncio: 			$scope.main.filterDate($scope.mDesdeFilter, constants.formats.dateFormat), //'25/12/2016',
						FechaFin: 				$scope.main.filterDate($scope.mHastaFilter, constants.formats.dateFormat), //09/02/2017,
						NumeroCotizacion: (typeof $scope.mNumeroCotizacionFilter == 'undefined') ? '' : $scope.mNumeroCotizacionFilter, //'',
						CodigoModalidad: 	vCodigoModalidad, //'',
						Agente: {
							CodigoDocumento: 	(typeof $scope.mDniRucFilter == 'undefined') ? '' : $scope.mDniRucFilter, //'',
							CodigoAgente: 		(typeof $scope.mAgenteFilter == 'undefined') ? oimClaims.agentID : $scope.mAgenteFilter.codigoAgente, //1295,
							CodigoGestor: 		(typeof $scope.mGestorFilter == 'undefined') ? '0' : $scope.mGestorFilter.codigo, //0,
							CodigoOficina: 		(oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode, //'0' //0 //pendiente en el claims o por CONFIRMar, pero si el rol es admin valor 0
						},
						CantidadFilasPorPagina: '10',
						PaginaActual: 					currentPage //'1'
          }
          return data;
        }
        function _filter(currentPage){
					$scope.noResult = false;
          var params = _buildFilter(currentPage);
          vidaFactory.filterPendingQuotes(params, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Lista.length > 0){
                $scope.firstLoad = false;
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
