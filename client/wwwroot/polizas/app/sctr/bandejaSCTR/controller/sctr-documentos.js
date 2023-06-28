(function($root, deps, action){
		define(deps, action)
})(this, ['angular',
'constants',
'helper',
'/polizas/app/sctr/emitir/service/sctrEmitFactory.js',
'seguroviajeService',
'modalSendEmail'],
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('bandejaSCTRController',
			['$scope', 'oimPrincipal', '$window', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', 'mModalAlert', '$uibModal', 'claims', '$sce', '$stateParams',
			function($scope, oimPrincipal, $window, $state, $timeout, $rootScope, sctrEmitFactory, mModalAlert, $uibModal, claims, $sce, $stateParams){

      (function onLoad(){

				$scope.orders = [{Codigo:"Asc", Descripcion:"Ascendente"},{Codigo:"Desc", Descripcion:"Descendente"}]
				$scope.formData = $rootScope.formData || {};
				document.title = 'OIM - Pólizas SCTR - Documentos SCTR';
        $scope.formData.TipoRol = '';

        $scope.mFrecDeclaracion = {Codigo: 0,Descripcion:"-- TODOS --"};
				$scope.mEstado = {Codigo: 0,Descripcion:"-- TODOS --"};

				sctrEmitFactory.getTipoDocumento().then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.tipoDocumentos = response.Data;
					}
				});
      	 if (claims){
          $scope.formData.claims = {
            codigoUsuario:  claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
            rolUsuario:     claims[12].value, //'ADMIN'
            nombreAgente:   claims[6].value.toUpperCase(),
            codigoAgente:   claims[7].value //Ejm: 9808 //agendid en el claim
          }
          $scope.userRoot = false;
          if ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente != ''){
            $scope.userRoot = true;
          }

          $scope.mAgente = {
            codigoAgente: $scope.formData.claims.codigoAgente,
            codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
            importeAplicarMapfreDolar:0,
            mcamapfreDolar:"",
            codigoEstadoCivil:0,
            codigoUsuario: $scope.formData.claims.codigoUsuario,
            rolUsuario: $scope.formData.claims.rolUsuario
          };
        }

				sctrEmitFactory.getEstados('T', false).then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.estadoData = response.Data;
					}
				});

				$scope.mPagination = 1;

	        sctrEmitFactory.getTipoDocumento().then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.tipoDocumentos = response.Data;
							$scope.mNumDoc = '';
							$scope.mNumDocSCTR = '';

							if(typeof $scope.mEstado == 'undefined'){
								$scope.mEstado = {
									Codigo: '1'
								}
							}

							if(typeof $scope.mTipoProducto == 'undefined'){
								$scope.mTipoProducto = {
									Codigo: ''
								}
							}

							if(typeof $scope.mFiltroAgente == 'undefined'){
								$scope.mFiltroAgente = {
									codigoAgente: 0
								}
							}

							var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),//'01/08/2016',
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),//'08/09/2016',
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: ($stateParams.documentNumber) ? $stateParams.documentNumber : 0,
								CantidadFilasPorPagina: 10,
								PaginaActual: 1,
								TipoRol: $scope.formData.TipoRol,
								McaVigente : $scope.vigente && $scope.noVigente ? '': $scope.vigente ? 'S':  $scope.noVigente? "N":'',
								OrderBy: $scope.mOrdenarPor && $scope.mOrdenarPor.Codigo ?  $scope.mOrdenarPor.Codigo.toUpperCase() : 'ASC'
							}

							//descomentar luego en prod
							if ($stateParams.documentNumber)
								buscarCotizacion(paramsReporte);

							sctrEmitFactory.getFrecuenciaDoc(0, false).then(function(response){
								if (response.OperationCode == constants.operationCode.success){
									$scope.frecDeclaracionData = response.Data;
								}
							});
						}
					});

				$scope.excelURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/solicitud/exportar/EXCEL');
				$scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/solicitud/exportar/PDF');
				
				sctrEmitFactory.getOrigen().then(function(response){
					$scope.origenData = [];
					if (response.OperationCode == constants.operationCode.success){
						response.Data.forEach(function(data) {
							var preparedData = {
								Codigo: data.CodigoProcedencia,
								Descripcion: data.CodigoProcedencia
							};
							$scope.origenData.push(preparedData);
						});
						$scope.mOrigen = {
							Codigo: "EMISA"
						};
					}
				});
								
				sctrEmitFactory.showAgent().then(function (res) {
					$scope.isNotAgent = res;
				})

      })();

      $scope.$watch('formData.mRole', function(nv)
	    {
	    	if(typeof $scope.formData.mRole != 'undefined')
	      	$scope.formData.TipoRol = $scope.formData.mRole.codigo;
	    })

      /*########################
      # Tipo de producto
      ########################*/
      $scope.seleccionarTipo = function(tipo){
      	$rootScope.formData = {};
        if(tipo==1){//periodo corto
          $state.go('sctrEmitir.steps', {tipo: constants.module.polizas.sctr.periodoCorto.TipoPeriodo, quotation: 0, step: 1});
        }else{//periodo largo
          $state.go('sctrEmitir.steps', {tipo: constants.module.polizas.sctr.periodoNormal.TipoPeriodo, quotation: 0, step: 1});
        }

      }

      /*########################
      # Tipo de producto
      ########################*/
      $scope.tipoProductoData = [{"Codigo": "","Descripcion":"Todos"},{"Codigo": "PC","Descripcion":"Periodo Corto"}, {"Codigo":"PN","Descripcion":"Periodo Normal"}];

     	/*########################
      # Tipo de documento
      ########################*/
      $scope.gLblTipoDocumento = {
      	label: 'Tipo de Doc.',
      	required: false
      };

      $scope.gLblNumeroDocumento = {
      	label: 'Nro. Documento',
      	required: false
      }

	    /*########################
      # Vigencia
      ########################*/
			$scope.mConsultaDesde = new Date();
			$scope.mConsultaHasta = new Date();

	    $scope.dateOptions = {
	      initDate: new Date(),
	      maxDate: new Date()
	    };

	    $scope.dateOptions2 = {
	      initDate: $scope.mConsultaDesde,//new Date(),//mConsultaDesde,
	      minDate: new Date(),
	      maxDate: new Date()
	    };

	    $scope.errorCotizacionesVigentes = [];

	    $scope.$watch('mConsultaDesde', function(nv)
	    {
	      $scope.dateOptions2.minDate = $scope.mConsultaDesde;
	    });

	    /*########################
	    # Calendar
	    ########################*/
	    $scope.inputCalendar = [
	      { label: 'Desde',
	        required: false,
	        error1: '* Este campo es obligatorio',
	        datepickerPopup: 'dd-MM-yyyy'
	      },
	      { label: 'Hasta',
	        required: false,
	        error1: '* Este campo es obligatorio',
	        datepickerPopup: 'dd-MM-yyyy'
	      }
	    ];

	    $scope.searchOptions = {};

	    $scope.searchOptions.filterNumbers = {
	      'filterIni': 10
	    }
	    $scope.searchOptions.limitRow = $scope.searchOptions.filterNumbers.filterIni;   // Máximo número de registros por página

	    $scope.searchOptions.pageLimit = 5;
	    $scope.searchOptions.pageIni = {number:1, active:true};
	    $scope.searchOptions.pageLast = $scope.searchOptions.pageLimit;

	    $scope.consultaDesde = $scope.inputCalendar[0];
	    $scope.consultaHasta = $scope.inputCalendar[1];

	    $scope.format = 'dd/MM/yyyy';
	    $scope.altInputFormats = ['M!/d!/yyyy'];
	    $scope.dt = new Date();
    	$scope.hoy = sctrEmitFactory.formatearFecha($scope.dt);

	    $scope.popup1 = {
	        opened: false
	    };
	    $scope.popup2 = {
	        opened: false
	    };

	    $scope.open1 = function() {
	        $scope.popup1.opened = true;
	    };

	    $scope.open2 = function() {
	        $scope.popup2.opened = true;
	    };

	    $scope.setDate = function(year, month, day) {
	        $scope.dt = new Date(year, month, day);
	    };

	    $scope.listarCotizacionesVigentes = function(nombre, desde, hasta, page){
	      if(page==null){page=$scope.currentPage;}
	      if($scope.currentPage != page){
	        $scope.searchOptions.pageActive = {number:page, active:true};
	        if(((desde instanceof Date) && (hasta instanceof Date))) {
	          $scope.lastPage = page + 1;

	          var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),//'01/08/2016',
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha(hasta),//'08/09/2016',
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);

	        }else{

			var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),//'01/08/2016',
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	        }
	      }else{
	        var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : $scope.hoy,
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	      }
	    };

	    $scope.consultaDocumentosPrev = function(nombre, desde, hasta, page){

	      if($scope.currentPage != page && page >0){
	        if(page>=0){
	          $scope.lastPage = page - 1;
	          $scope.searchOptions.pageActive = {number:page, active:true};
	          if(((desde instanceof Date) && (hasta instanceof Date))) {

			var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),//'01/08/2016',
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha(hasta),//'08/09/2016',
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	          }else{

			var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : $scope.hoy,
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	          }
	        }
	      }

	    }
	    $scope.consultaDocumentosNext = function(nombre, desde, hasta, page){
	      if($scope.currentPage != page){
	        if(page<$scope.CantidadTotalPaginas){
	          $scope.lastPage = page - 1;
	          $scope.searchOptions.pageActive = {number:page, active:true};
	          if(((desde instanceof Date) && (hasta instanceof Date))) {

			var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha(hasta),
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	          }else{

			var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : $scope.hoy,
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: page,
								TipoRol: $scope.formData.TipoRol
							}

	            buscarCotizacion(paramsReporte);
	          }
	        }
	      }

	    }

	    $scope.consultaDocumentosIni = function(nombre, desde, hasta){
	      if(((desde instanceof Date) && (hasta instanceof Date))) {

		var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha(hasta),
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: $scope.mPagination,
								TipoRol: $scope.formData.TipoRol
							}

	        buscarCotizacion(paramsReporte);
	      }else{

		var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : $scope.hoy,
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: $scope.mPagination,
								TipoRol: $scope.formData.TipoRol
							}

	        buscarCotizacion(paramsReporte);
	      }
	    }

	    $scope.consultaDocumentosFin = function(nombre, desde, hasta){
	      if(((desde instanceof Date) && (hasta instanceof Date))) {

		var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha(desde),
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha(hasta),
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: 10,
								PaginaActual: $scope.mPagination,
								TipoRol: $scope.formData.TipoRol
							}

	        buscarCotizacion(paramsReporte);
	      }else{

		var paramsReporte = {
								TipoDocumento : '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : $scope.hoy,
								FechaVencimientoPoliza : $scope.hoy,
								TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
								FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
								NumeroSolicitud: $scope.mNumDocSCTR,
								CantidadFilasPorPagina: $scope.CantidadTotalPaginas,
								PaginaActual: $scope.mPagination,
								TipoRol: $scope.formData.TipoRol
							}

	        buscarCotizacion(paramsReporte);
	      }
	    }

	    /*########################
      # Filtrar
      ########################*/

      function buscarCotizacion(paramsReporte){
				
				paramsReporte.CodigoProcedencia = $scope.mOrigen.Codigo;
				paramsReporte.CodigoAgente = $scope.mFiltroAgente.codigoAgente;

				sctrEmitFactory.getListBandejaPage(paramsReporte, true).then(function(response){
					if (response.OperationCode == constants.operationCode.success){
						$scope.CantidadTotalPaginas = response.Data.CantidadTotalPaginas; //empezando en 0
						$scope.totalItems = parseInt($scope.CantidadTotalPaginas) * 10;
            $scope.CantidadTotalFilas = response.Data.CantidadTotalFilas;
            $scope.reportes = response.Data.Lista;

            if($scope.CantidadTotalFilas==null){$scope.showCotizaciones = false;$scope.vacio=false;}else{$scope.showCotizaciones = true;$scope.vacio=true;}

						if (response.Data.Lista.length > 0){
							$scope.noResult = false;
						}else{
							$scope.noResult = true;
						}
          }else if (response.Message.length > 0){
          	$scope.noResult = true;
            $scope.errorCotizacionesVigentes.value = true;
            $scope.errorCotizacionesVigentes.description = response.Message;
          }
					}, function(error){
	          $scope.noResult = true;
	      }, function(defaultError){
	          $scope.noResult = true;
	     });
      }

			function getResponse(byId){
				var paramsReporte = null
				if (byId != undefined && byId != null){
					if (byId == 0)
						paramsReporte = {
							NumeroSolicitud: $scope.mNumDocSCTR,
							OrderBy: $scope.mOrdenarPor && $scope.mOrdenarPor.Codigo ?  $scope.mOrdenarPor.Codigo.toUpperCase() : 'ASC'

						}
					else
						paramsReporte = {
							TipoDocumento : $scope.mTipoDocumento && $scope.mTipoDocumento.Codigo ? $scope.mTipoDocumento.Codigo:"",
							NumeroDocumento : $scope.mNumDoc,
							OrderBy: $scope.mOrdenarPor && $scope.mOrdenarPor.Codigo ?  $scope.mOrdenarPor.Codigo.toUpperCase() : 'ASC'
						}
				}
				else{
					paramsReporte = {

						FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),//'01/08/2016',
						FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),//'08/09/2016',
						TipoPeriodo : ($scope.mTipoProducto.Codigo == undefined) ? $scope.mTipoProducto : $scope.mTipoProducto.Codigo,//'',
						McaVigente : $scope.vigente && $scope.noVigente ? '': $scope.vigente ? 'S':  $scope.noVigente? "N":'',
						FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
						CodigoEstado : $scope.mEstado.Codigo,
						CodigoAgente : $scope.mFiltroAgente.codigoAgente,//$scope.mAgente.codigoAgente,
						CantidadFilasPorPagina: 10,
						TipoRol: $scope.formData.TipoRol,
						OrderBy: $scope.mOrdenarPor && $scope.mOrdenarPor.Codigo ?  $scope.mOrdenarPor.Codigo.toUpperCase() : 'ASC'
					}
				}
				return paramsReporte;
			}
			function orderBySearch(){
				_filter($scope.mPagination, false, 	$scope.isFilter === undefined || $scope.isFilter  ? undefined: $scope.typeSearch );
			}
			$scope.orderBySearch = orderBySearch;
    	function _filter(currentPage, reset, byId){
				$scope.noResult = false;
				if (reset)
					$scope.totalItems = 0;
				var paramsReporte = getResponse(byId);
				paramsReporte.PaginaActual = currentPage;
        paramsReporte.CantidadFilasPorPagina = 10
				$scope.mPagination = currentPage;

				buscarCotizacion(paramsReporte);
      }
			$scope.search = function(){

				_filter(1, true, $scope.typeSearch);
				$scope.isFilter = false;
			}
      $scope.filter = function(currentPage){
        $scope.mPagination = currentPage;
				_filter(currentPage, true);
				$scope.isFilter  = true;
      };
      /*########################
      # Filter x page
      ########################*/
      $scope.pageChanged = function(page){
				_filter(page, false, 	$scope.isFilter === undefined || $scope.isFilter  ? undefined: $scope.typeSearch );
      };

      $scope.getNumber = function(num) {
	      if(num==0 || num==null){$scope.showCotizaciones = false;}else{
	        $scope.showCotizaciones = true;
	        return new Array(num);
	      }
	    }

	    /*########################
      # Limpiar
      ########################*/
			$scope.limpiar = function() {
				$scope.mFrecDeclaracion = {Codigo: 0,Descripcion:"-- TODOS --"};
				$scope.mEstado = {Codigo: 0,Descripcion:"-- TODOS --"};

				$scope.vigente = false
				$scope.noVigente = false
        $scope.mConsultaDesde = new Date();
				$scope.mConsultaHasta = new Date();
				$scope.mTipoProducto = undefined;
			  $scope.vigente = true;
			  $scope.mTipoProducto = "";
			};
			$scope.cleanSearch = function(){
				$scope.mNumDoc = '';
				$scope.mNumDocSCTR = '';
				$scope.mTipoDocumento = {}
				$scope.typeSearch =  0;

			}
			$scope.changePeri  =function(){
				var t = $scope.mTipoProducto=='PC'?1:
								 $scope.mTipoProducto=='PN'?2: null;
				sctrEmitFactory.getFrecuenciaDoc(t, true).then(function(response){
						if (response.OperationCode == constants.operationCode.success){
							$scope.mFrecDeclaracion = null
							$scope.frecDeclaracionData = response.Data;
						}
					});
			}
			$scope.cleanSearch();
			$scope.limpiar();
	   	/*########################
      # Descarga
      ########################*/
			$scope.downloadExcel = function() {

				if(typeof $scope.mFiltroAgente == 'undefined'){
					$scope.mFiltroAgente = {
						codigoAgente: 0
					}
				}
				var r = getResponse(isFilter?$scope.typeSearch:undefined);
				delete r.CantidadFilasPorPagina;
				delete r.PaginaActual;

				$scope.excelData = {
					CodigoProcedencia: $scope.mOrigen.Codigo,
					TipoDocumento : '',
					NumeroDocumento : $scope.mNumDoc,
					FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),
					FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),
					TipoPeriodo : $scope.mTipoProducto.Codigo,
					FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
					CodigoEstado : $scope.mEstado.Codigo,
					CodigoAgente : parseInt($scope.mFiltroAgente.codigoAgente)
				}

				$window.setTimeout(function(){
	        document.getElementById('frmDownloadExcel').submit();
	     	});
			}

			$scope.downloadPDF = function() {

				if(typeof $scope.mFiltroAgente == 'undefined'){
					$scope.mFiltroAgente = {
						codigoAgente: 0
					}
				}

				$scope.pdfData = {
					CodigoProcedencia: $scope.mOrigen.Codigo,
					TipoDocumento : '',
					NumeroDocumento : $scope.mNumDoc,
					FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),
					FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),
					TipoPeriodo : $scope.mTipoProducto.Codigo,//'',
					FormaPago : ($scope.mFrecDeclaracion.Codigo == 0) ? '' : $scope.mFrecDeclaracion.Codigo,
					CodigoEstado : $scope.mEstado.Codigo,
					CodigoAgente : parseInt($scope.mFiltroAgente.codigoAgente)
				}

				$window.setTimeout(function(){
	        document.getElementById('frmDownloadPDF').submit();
	     	});

			}

			/*#######################################
		 	# SEND EMAIL
		 	#######################################*/
	    $scope.sendEmail = function(numeroSolicitud){
	      $scope.emailData ={
          numeroSolicitud: numeroSolicitud
	      };

	      //Modal
	      $scope.optionSendEmail = constants.modalSendEmail.sctr;
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
	    }

	    $scope.pagado = function(reporte){
	    	// if((reporte.Pagado == 'S' && reporte.TipoPeriodo == 'PERIODO CORTO') || !(reporte.TipoPeriodo == 'PERIODO CORTO')){
	    	// 	return true;
	    	// }else{
	    	// 	return false;
	    	// }
	    	return true;
	    }

			$scope.buscarCoti = function(nroCotizacion){

				var paramsCoti = {

						NumeroSolicitud: nroCotizacion,
	  				Tipo: 1,
	  				TipoRol: ''

					};

				sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

						if (response.OperationCode == constants.operationCode.success){
							$scope.cotizacion = response.Data;
							//tipo de seguro
							if($scope.cotizacion.length==2){
								$scope.salud = true;
								$scope.pension = true;
							}else if($scope.cotizacion[0].CodigoCompania==3){
								$scope.salud = true;

							}else if($scope.cotizacion[0].CodigoCompania==2){
								$scope.pension = true;

							}
							//paso
							if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg==2){
								$scope.paso2 = true;

								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 2, nroCotizacion);

							}

							if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
								$scope.paso3 = true;
								$scope.tasasAceptadas = true;

								//si rol es admin mostrar tasas

								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='RT' && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
								$scope.paso3 = true;
								$scope.tasasAceptadas = false;

								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='AT'){
								$scope.paso4 = true;

								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 4, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER' || $scope.cotizacion[0].Solicitud.CodigoEstado=='CT'){
								// $scope.paso3 = true;

								// irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='SC'){
								$scope.paso3 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}
							else if($scope.cotizacion[0].Solicitud.CodigoEstado=='DS' || $scope.cotizacion[0].Solicitud.CodigoEstado=='ST'){
								$scope.paso3 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='AS'){
								$scope.paso3 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='RS'){
								$scope.paso3 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ST'){
								$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER'){
								$scope.paso4 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 4, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){
								//$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 5, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EP'){
								$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 5, nroCotizacion);

							}
						}
					});
			};

			function irACotizar(tipo, paso, nroCotizacion){

				$rootScope.formData = {};

				if(tipo==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){//periodo corto
	        $state.go('sctrEmitir.steps', {tipo: tipo, quotation:nroCotizacion, step: paso});
	      }else{//periodo largo
	        $state.go('sctrEmitir.steps', {tipo: tipo, quotation:nroCotizacion, step: paso});
	      }
			}

			function funDocNumMaxLength(documentType){
	      switch(documentType) {
	        case constants.documentTypes.dni.Codigo:
	          $scope.docNumMaxLength = 8;
	          break;
	        case constants.documentTypes.ruc.Codigo:
	          $scope.docNumMaxLength = 11;
	          break;
	        default:
	          $scope.docNumMaxLength = 13;
	      }
	    }

	    $scope.showNaturalPerson = function(item){
	      if(item){
	        $scope.mNumDoc = '';
	        funDocNumMaxLength(item.Codigo);
	      }
			}
			
			$scope.updateCodigoAgente= function (value) {
				$scope.mFiltroAgente = value;
      }

    }])
		.factory('loaderSctrDocumentosQuoteController', ['sctrEmitFactory', '$q', 'mpSpin', function(sctrEmitFactory, $q, mpSpin){
      var claims;
      //Claims
      function getClaims(){
       var deferred = $q.defer();
        sctrEmitFactory.getClaims().then(function(response){
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getClaims: function(){
          if(claims) return $q.resolve(claims);
          return getClaims();
        }
      }

    }])
    .directive('showFilter', ['$window', '$timeout', function($window,$timeout){
	    // Runs during compile
	    return {
	      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
	      link: function(scope, element, attrs) {
	        // console.log('Llamando directiva... ');
	        var w = angular.element($window);
	        function showFilterBox(){
	          // console.log($window.innerWidth);
	          scope.isFilterVisible = false;
	          var isDesktop = $window.innerWidth > 991;
	          var heightDevice = $window.innerHeight;
	          if (isDesktop) {
							element.css('top', 'auto');
	          } else {
	          	element.css('top', heightDevice - 70 + 'px');
	          }
	          scope.toggleFilter = function(){
	            // console.log('Activando filtro... '+ $window.innerWidth + 'x' + $window.innerHeight);
	            var isDesktop = $window.innerWidth > 991;
	            var filterBox = document.getElementsByClassName('g-col-filter__box');
	            filterBox[0].style.height = heightDevice - 105 + 'px';

	            if (isDesktop) {
                document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
	              return;
	            } else {
	              scope.isFilterVisible = !scope.isFilterVisible;
	              if (scope.isFilterVisible) {
                  document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
	              } else {
                  document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
	              }
	            }
	          }
	        }
	        $timeout(init, false);
	        function init(){ showFilterBox(); }
	        // **************************************************
	        // Script cuando pasa de portrait a layout en Tablet
	        // **************************************************
	        w.bind('resize', function(){
	          // console.log('Resize... ', $window.innerWidth);
	          var isDesktop = $window.innerWidth > 991;
	          var heightDevice = $window.innerHeight;
	          if (isDesktop) {
	            // console.log('Es desktop... ');
	            // scope.isFilterVisible = false;
	            element.css('top', 'auto');
              document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
	            return;
	          } else {
	          	element.css('top', heightDevice - 70 + 'px');
	            if (scope.isFilterVisible) {
                document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
	            }
	          }
	        });
	      }
	    };
	  }]);
});
