(function($root, deps, action){
		define(deps, action)
})(this, [
		'angular', 'constants', 'helper', '/enel/app/bandeja/service/bandejaFactory.js'
	], 
	function(angular, constants, helper){

		var appEnel = angular.module('appEnel');

		appEnel.controller('enelBandejaController', 
			['$scope', '$window', '$state', '$timeout', 'mModalConfirm', 'mModalAlert', 'bandejaFactory', 'bandejaTipoDocumentos', '$q', '$filter', 
			function($scope, $window, $state, $timeout, mModalConfirm, mModalAlert, bandejaFactory, bandejaTipoDocumentos, $q, $filter){
		
				document.title = 'OIM - Enel - Bandeja de Certificados';

				(function onLoad(){
					
					$scope.mainStep = $scope.mainStep || {};
					
					$scope.mainStep.filterDate = $filter('date');
					$scope.mainStep.formatDate = constants.formats.dateFormat;
					$scope.mainStep.formatDate1 = "yyyy-MM-dd";

					$scope.mainStep.documentTypeData = bandejaTipoDocumentos;
					_calendarSettings();

					_clearSearchFilter();
					_clearFilterResult();
					_listarAfiliados('1', true);
					
				})();
							
				function _calendarSettings(){
					$scope.today = function() {
						$scope.mainStep.mDesdeFilter = new Date();
						$scope.mainStep.mDesdeFilter.setDate($scope.mainStep.mDesdeFilter.getDate() - 1);
						$scope.mainStep.mHastaFilter = new Date();
					};
					$scope.today();

					$scope.inlineOptions = {
						minDate: new Date(),
						showWeeks: true
					};
					$scope.dateOptionsDesdeFilter = {
						// initDate: new Date(Date.parse() - 1),
						formatYear: 'yy',
						maxDate: new Date(),
						startingDay: 1
					};
					$scope.dateOptionsHastaFilter = {
						formatYear: 'yy',
						maxDate: new Date(),
						minDate: $scope.mainStep.mDesdeFilter,
						startingDay: 1
					};

					$scope.toggleMin = function() {
						$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
						$scope.dateOptionsDesdeFilter.minDate = $scope.inlineOptions.minDate;
						$scope.dateOptionsHastaFilter.minDate = $scope.inlineOptions.minDate;
					};
					$scope.toggleMin();

					$scope.openDesdeFilter = function() {
						$scope.popupDesdeFilter.opened = true;
					};
					$scope.openHastaFilter = function() {
						$scope.popupHastaFilter.opened = true;
					};

					$scope.altInputFormatsProof = ['M!/d!/yyyy'];

					$scope.popupDesdeFilter = {
						opened: false
					};
					$scope.popupHastaFilter = {
						opened: false
					};

					$scope.changeDate = function(){
						$scope.dateOptionsHastaFilter.minDate = $scope.mainStep.mDesdeFilter;
						if ($scope.mainStep.mHastaFilter < $scope.mainStep.mDesdeFilter){
							$scope.mainStep.mHastaFilter = $scope.mainStep.mDesdeFilter;
						}
					}
					$scope.changeDate();
				}

				$scope.ordenarPorSource = [
					{ codigo:'DESC', descripcion:"Más reciente" },  
					{ codigo:'ASC', descripcion:"Más antiguo" } 
				];

				$scope.arrayCertificado = [];

				$scope.mainStep.mNroCertificado = [];

				// $scope.noResult = false;
				// $scope.noList = true;

				function _listarAfiliados(currentPage, firstTime){

					$scope.noResultInfo = false;
					$scope.noResult = false;

					var paramsToFilter = {
						Certificado: 								typeof $scope.mainStep.mNroCertifica === 'undefined' ? '' : $scope.mainStep.mNroCertifica,
						// Contratante_Datos: 					typeof $scope.mainStep.mNroDocumento === 'undefined' ? '' : $scope.mainStep.mNroDocumento,
						Contratante_Tipo_Documento: (typeof $scope.mainStep.mTipoDocumento == 'undefined' || $scope.mainStep.mTipoDocumento.codigo == null) ? 0 : $scope.mainStep.mTipoDocumento.codigo, //typeof $scope.mainStep.mTipoDocumento === 'undefined' ? 0 : $scope.mainStep.mTipoDocumento.codigo, 
						Digitador_Numero_Documento: '',
						Digitador_Tipo_Documento: 	0,
						Fecha_Fin: 									($scope.mainStep.mHastaFilter) ? $scope.mainStep.filterDate($scope.mainStep.mHastaFilter, $scope.mainStep.formatDate1) : '', 
						Fecha_Inicio: 							($scope.mainStep.mDesdeFilter) ? $scope.mainStep.filterDate($scope.mainStep.mDesdeFilter, $scope.mainStep.formatDate1) : '', 
						Numero_Suministro: 					typeof $scope.mainStep.mNroSuministro === 'undefined' ? '' : $scope.mainStep.mNroSuministro,
						Page: 											currentPage,
						Rows: 											10,
						SIdx: 											'ID_AFILIACION_PRODUCTO', //'1',
						SOrd: 											(typeof $scope.mainStep.mOrdenarPor == 'undefined' || $scope.mainStep.mOrdenarPor.codigo == null) ? '' : $scope.mainStep.mOrdenarPor.codigo, //typeof $scope.mainStep.mOrdenarPor === 'undefined' ? '' : $scope.mainStep.mOrdenarPor.codigo,
						Total: 											0,
						Vendedor_Codigo: 						typeof $scope.mainStep.mCodVendedor === 'undefined' ? '' : $scope.mainStep.mCodVendedor,
						Vendedor_Datos: 						typeof $scope.mainStep.mNomVendedor === 'undefined' ? '' : $scope.mainStep.mNomVendedor
					}
					if (typeof $scope.mainStep.mTipoDocumento == 'undefined' || $scope.mainStep.mTipoDocumento.codigo == null || $scope.mainStep.mTipoDocumento.codigo == 0) {
						console.log('No hay tipo de documento... ')
						paramsToFilter.Contratante_Datos = typeof $scope.mainStep.mNomContratante === 'undefined' ? '' : $scope.mainStep.mNomContratante
					} else {
						paramsToFilter.Contratante_Datos = typeof $scope.mainStep.mNroDocumento === 'undefined' ? '' : $scope.mainStep.mNroDocumento
					}

					// console.log('paramsToFilter: ' + JSON.stringify(paramsToFilter));


					bandejaFactory.getListaAfiliados(paramsToFilter, true).then(function(response) {
						// console.log('Filter: ' + JSON.stringify(response.afiliaciones));
						if (response.afiliaciones.length > 0) {
							$scope.mainStep.totalItems = Math.ceil(parseInt(response.total)/10) * 10;
							$scope.arrayCertificado = response.afiliaciones;
						} else {
							(firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
							// console.log('No se obtuvo lista de afiliados.')
						}
					}, function(error){
						(firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
						// mModalAlert.showError('No se obtuvo lista de afiliados.','Error'); 
					});
				}

				function _clearFilterResult(){
					$scope.mainStep.totalItems = 0;
          $scope.arrayCertificado = [];
        }

        function _validateForm(){
					$scope.frmDocuments.markAsPristine();
					return $scope.frmDocuments.$valid;
				}

				$scope.filter = function(currentPage){
					if (_validateForm()){
						if (currentPage == '1') $scope.mainStep.mPagination = currentPage;
          	_clearFilterResult();
          	_listarAfiliados(currentPage, false);
					}
				}

				function _clearSearchFilter(){
					$scope.mainStep.mNroCertifica = '';
					$scope.mainStep.mTipoDocumento = {
						codigo: null
					};
					$scope.mainStep.mNroDocumento = '';
					$scope.mainStep.mNomContratante = '';					
					$scope.mainStep.mNroSuministro = '';
					$scope.mainStep.mNomVendedor = '';
					$scope.mainStep.mCodVendedor = '';
					$scope.mainStep.mDesdeFilter = new Date(); //null;
					$scope.mainStep.mDesdeFilter.setDate($scope.mainStep.mDesdeFilter.getDate() - 1);
					$scope.mainStep.mHastaFilter = new Date(); //null;

					$scope.mainStep.mOrdenarPor = {
						codigo: null
					};
				}

				$scope.clearFilter = function(){
					_clearSearchFilter();
					_clearFilterResult();
					_listarAfiliados('1', false);
				}
				
				
				// Ir al detalle del certificado
				$scope.verDetalle = function(id){
					$state.go( 'enelFormularioDetalle', { id_afiliado_producto: id } );
				}

				function _disabledContractor(documentType){
						var vDisabled = (typeof documentType != 'undefined' && documentType.codigo) ? true : false;
						(vDisabled) ? $scope.mainStep.mNomContratante = '' : $scope.mainStep.mNroDocumento = '';
						$scope.disabledContractor = vDisabled
					// }
				}
				$scope.changeDocumentType = function(documentType){
					_disabledContractor(documentType);
				}

		}])
		.factory('loaderEnelBandeja', ['bandejaFactory', '$q', function(bandejaFactory, $q){
			var _tipoDocs;
			function initTipoDocumentos(){
				var deferred = $q.defer();
				bandejaFactory.getTipoDocumento(true).then(function(response) {
					// console.log('Tipos de documentos... ', response);
					if (response.length > 0) {
						_tipoDocs = response;
						deferred.resolve(_tipoDocs);
					}
				}, function (error){
					deferred.reject(error.statusText);
				});
				return deferred.promise; 
			}

			return {
				initTipoDocumentos: function(){
					if (_tipoDocs) return $q.resolve(_tipoDocs);
					return initTipoDocumentos();
				}
			}

		}])

	});
