(function($root, deps, action){
		define(deps, action)
})(this, ['angular',
'constants',
'helper',
'/polizas/app/sctr/emitir/service/sctrEmitFactory.js',
'modalSendEmail'],
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrDocumentosController',
			['$scope', 'oimPrincipal', '$window', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', '$uibModal', 'claims', '$sce',
			function($scope, oimPrincipal, $window, $state, $timeout, $rootScope, sctrEmitFactory, $uibModal, claims, $sce){

				 var vm = this;
				vm.$onInit = function() {
					$scope.formData = $rootScope.formData || {};
					$scope.formData.TipoRol = '';

					if (claims){
						$scope.formData.claims = {
							codigoUsuario:  claims[2].value.toUpperCase(),
							rolUsuario:     claims[12].value,
							nombreAgente:   claims[6].value.toUpperCase(),
							codigoAgente:   claims[7].value
						};

						$scope.userRoot = ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente !== '');

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
						if (response.OperationCode === constants.operationCode.success){
							$scope.estadoData = response.Data;
						}
					});

					$scope.mPagination = 1;

	        sctrEmitFactory.getTipoDocumento().then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.tipoDocumentos = response.Data;
							$scope.mNumDoc = '';
							$scope.mNumDocSCTR = '';

							if(typeof $scope.mEstado === 'undefined'){
								$scope.mEstado = {
									Codigo: '0'
								}
							}

							if(typeof $scope.mTipoProducto === 'undefined'){
								$scope.mTipoProducto = {
									Codigo: ''
								}
							}

							if(typeof $scope.mFiltroAgente === 'undefined'){
								$scope.mFiltroAgente = {
									codigoAgente: 0
								}
							}
							$scope.mFrecDeclaracion = {Codigo:0, Descripcion:"-- TODOS --"};

							$scope.paramsReporte = {
								TipoDocumento : $scope.mTipoDocumento  && $scope.mTipoDocumento.Codigo || '',
								NumeroDocumento : $scope.mNumDoc,
								FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),
								FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),
								TipoPeriodo : $scope.mTipoProducto.Codigo,
								FormaPago : $scope.mFrecDeclaracion.Codigo || '',
								CodigoEstado : $scope.mEstado.Codigo,
								CodigoAgente : $scope.mFiltroAgente.codigoAgente,
								NumeroSolicitud: 0,
								CantidadFilasPorPagina: 10,
								PaginaActual: 1,
								TipoRol: $scope.formData.TipoRol
							}
						}
					});

					sctrEmitFactory.getFrecuenciaDoc(1, false).then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.frecDeclaracionData = response.Data;
						}
					});

					$scope.excelURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/solicitud/exportar/EXCEL');
					$scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/solicitud/exportar/PDF');

					sctrEmitFactory.showAgent().then(function (res) {
						$scope.isNotAgent = res;
					})

				}


      $scope.$watch('formData.mRole', function(nv)
	    {
	    	if(typeof $scope.formData.mRole !== 'undefined')
	      	$scope.formData.TipoRol = $scope.formData.mRole.codigo;
	    });

      /*########################
      # Tipo de producto
      ########################*/
      $scope.seleccionarTipo = function(tipo){
      	$rootScope.formData = {};
        if(tipo===1){//periodo corto
          $state.go('sctrEmitir.steps', {tipo: constants.module.polizas.sctr.periodoCorto.TipoPeriodo, quotation: 0, step: 1});
        }else{//periodo largo
          $state.go('sctrEmitir.steps', {tipo: constants.module.polizas.sctr.periodoNormal.TipoPeriodo, quotation: 0, step: 1});
        }

      };

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
      };

      /*########################
      # Frecuencia
      ########################*/

	    $scope.changeProducto = function(){
	    	$scope.mFrecDeclaracion = {Codigo:0,Descripcion:"-- TODOS --"};
	    	if($scope.mTipoProducto.Codigo===constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
	 				sctrEmitFactory.getFrecuenciaDoc(1, false).then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.frecDeclaracionData = response.Data;
						}
					});
	       }else if($scope.mTipoProducto.Codigo===constants.module.polizas.sctr.periodoNormal.TipoPeriodo){
					sctrEmitFactory.getFrecuenciaDoc(2, false).then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.frecDeclaracionData = response.Data;
						}
					});
	      }else{
	      		sctrEmitFactory.getFrecuenciaDoc(0, false).then(function(response){
						if (response.OperationCode === constants.operationCode.success){
							$scope.frecDeclaracionData = response.Data;
						}
					});
        }

        $scope.paramsReporte.TipoPeriodo = $scope.mTipoProducto.Codigo;
	    };

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
	      initDate: $scope.mConsultaDesde,
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
	    };
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
	      if($scope.currentPage !== page){
	        $scope.searchOptions.pageActive = {number:page, active:true};
	        if(((desde instanceof Date) && (hasta instanceof Date))) {
	          $scope.lastPage = page + 1;

	          $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
						$scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha(hasta);
						$scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
						$scope.paramsReporte.PaginaActual = page;
						buscarCotizacion($scope.paramsReporte);

	        }else{
						$scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
						$scope.paramsReporte.FechaVencimientoPoliza = $scope.hoy;
						$scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
						$scope.paramsReporte.PaginaActual = page;
						buscarCotizacion($scope.paramsReporte);
	        }
	      }else{
					 $scope.paramsReporte.FechaEfectivoPoliza = $scope.hoy;
						$scope.paramsReporte.FechaVencimientoPoliza = $scope.hoy;
						$scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
						$scope.paramsReporte.PaginaActual = page;
						buscarCotizacion($scope.paramsReporte);

	      }
	    };

	    $scope.consultaDocumentosPrev = function(nombre, desde, hasta, page){
	      if($scope.currentPage !== page && page >0){
	        if(page>=0){
	          $scope.lastPage = page - 1;
	          $scope.searchOptions.pageActive = {number:page, active:true};
	          if(((desde instanceof Date) && (hasta instanceof Date))) {

              $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
              $scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha(hasta);
              $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
              $scope.paramsReporte.PaginaActual = page;
              buscarCotizacion($scope.paramsReporte);

	          }else{

              $scope.paramsReporte.FechaEfectivoPoliza = $scope.hoy;
              $scope.paramsReporte.FechaVencimientoPoliza = $scope.hoy;
              $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
              $scope.paramsReporte.PaginaActual = page;
              buscarCotizacion($scope.paramsReporte);

	          }
	        }
	      }

	    };
	    $scope.consultaDocumentosNext = function(nombre, desde, hasta, page){
	      if($scope.currentPage !== page){
	        if(page<$scope.CantidadTotalPaginas){
	          $scope.lastPage = page - 1;
	          $scope.searchOptions.pageActive = {number:page, active:true};
	          if(((desde instanceof Date) && (hasta instanceof Date))) {

              $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
              $scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha(hasta);
              $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
              $scope.paramsReporte.PaginaActual = page;
              buscarCotizacion($scope.paramsReporte);

	          }else{

              $scope.paramsReporte.FechaEfectivoPoliza = $scope.hoy;
              $scope.paramsReporte.FechaVencimientoPoliza = $scope.hoy;
              $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
              $scope.paramsReporte.PaginaActual = page;
              buscarCotizacion($scope.paramsReporte);

	          }
	        }
	      }

	    };

	    $scope.consultaDocumentosIni = function(nombre, desde, hasta){
	      if(((desde instanceof Date) && (hasta instanceof Date))) {

          $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
          $scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha(hasta);
          $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
          $scope.paramsReporte.PaginaActual = $scope.mPagination;
          buscarCotizacion($scope.paramsReporte);

	      }else{

          $scope.paramsReporte.FechaEfectivoPoliza = $scope.hoy;
          $scope.paramsReporte.FechaVencimientoPoliza = s$scope.hoy;
          $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
          $scope.paramsReporte.PaginaActual = $scope.mPagination;
          buscarCotizacion($scope.paramsReporte);

	      }
	    };

	    $scope.consultaDocumentosFin = function(nombre, desde, hasta){
	      if(((desde instanceof Date) && (hasta instanceof Date))) {

          $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha(desde);
          $scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha(hasta);
          $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
          $scope.paramsReporte.PaginaActual = $scope.mPagination;
          buscarCotizacion($scope.paramsReporte);

	      }else{

          $scope.paramsReporte.FechaEfectivoPoliza = $scope.hoy;
          $scope.paramsReporte.FechaVencimientoPoliza = $scope.hoy;
          $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
          $scope.paramsReporte.CantidadFilasPorPagina = $scope.CantidadTotalPaginas;
          $scope.paramsReporte.PaginaActual = $scope.mPagination;
          buscarCotizacion($scope.paramsReporte);
	      }
	    };


	    /*########################
      # Filtrar
      ########################*/

      function buscarCotizacion(paramsReporte){
				paramsReporte.CodigoProcedencia = $scope.mOrigen.Codigo; 
				paramsReporte.CodigoAgente = $scope.mFiltroAgente.codigoAgente;

				sctrEmitFactory.getReportes(paramsReporte, true).then(function(response){
					if (response.OperationCode === constants.operationCode.success){
            	$scope.CantidadTotalPaginas = response.Data.CantidadTotalPaginas;
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

    	function _filter(currentPage){
        $scope.noResult = false;

        $scope.paramsReporte.FechaEfectivoPoliza = sctrEmitFactory.formatearFecha($scope.mConsultaDesde);
        $scope.paramsReporte.FechaVencimientoPoliza = sctrEmitFactory.formatearFecha($scope.mConsultaHasta);
        $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
        $scope.paramsReporte.CantidadFilasPorPagina = 10;
        $scope.paramsReporte.PaginaActual = currentPage;
        buscarCotizacion($scope.paramsReporte);

      }

      $scope.filter = function(currentPage){
        $scope.mPagination = currentPage;
        _filter(currentPage);
      };
      /*########################
      # Filter x page
      ########################*/
      $scope.pageChanged = function(page){
        _filter(page);
      };

      $scope.getNumber = function(num) {
	      if(num===0 || num==null){$scope.showCotizaciones = false;}else{
	        $scope.showCotizaciones = true;
	        return new Array(num);
	      }
	    };

			$scope.filtrar = function(number) {

				if(typeof $scope.mEstado !== 'undefined'){
          $scope.totalItems = 0;
          $scope.paramsReporte.FechaEfectivoPoliza = (sctrEmitFactory.formatearFecha($scope.mConsultaDesde)) ? sctrEmitFactory.formatearFecha($scope.mConsultaDesde) : sctrEmitFactory.formatearFecha(new Date());
          $scope.paramsReporte.FechaVencimientoPoliza = (sctrEmitFactory.formatearFecha($scope.mConsultaHasta)) ? sctrEmitFactory.formatearFecha($scope.mConsultaHasta) : sctrEmitFactory.formatearFecha(new Date());
          $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR ? parseInt($scope.mNumDocSCTR) : '';
          $scope.paramsReporte.CantidadFilasPorPagina = 10;
          $scope.paramsReporte.PaginaActual = number;
					$scope.mPagination = 1;
					buscarCotizacion($scope.paramsReporte);
				}

			};

	    /*########################
      # Limpiar
      ########################*/
			$scope.limpiar = function() {
	        $scope.mNumDoc = '';
	        $scope.mNumDocSCTR = '';
	        $scope.mConsultaDesde = '';
	        $scope.mConsultaHasta = '';
	        $scope.mConsultaDesde = sctrEmitFactory.formatearFecha(new Date());
					$scope.mConsultaHasta = sctrEmitFactory.formatearFecha(new Date());

	    };

	   	/*########################
      # Descarga
      ########################*/
			$scope.downloadExcel = function() {

				if(typeof $scope.mFiltroAgente === 'undefined'){
					$scope.mFiltroAgente = {
						codigoAgente: 0
					}
				}

				$scope.excelData = {
					CodigoProcedencia: $scope.mOrigen.Codigo,
					TipoDocumento : ($scope.mTipoDocumento && $scope.mTipoDocumento.Codigo) ? $scope.mTipoDocumento.Codigo : '',
					NumeroDocumento : $scope.mNumDoc ? $scope.mNumDoc : '',
					NumeroSolicitud : $scope.mNumDocSCTR ? parseInt($scope.mNumDocSCTR) : 0,
					FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),
					FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),
					TipoPeriodo : $scope.mTipoProducto.Codigo,
					FormaPago : !$scope.mFrecDeclaracion.Codigo || $scope.mFrecDeclaracion.Codigo === '0' ? '' : $scope.mFrecDeclaracion.Codigo,
					CodigoEstado : $scope.mEstado.Codigo,
					CodigoAgente : parseInt($scope.mFiltroAgente.codigoAgente)
				};
				$window.setTimeout(function(){
	        document.getElementById('frmDownloadExcel').submit();
	     	});
			};

			$scope.downloadPDF = function() {

				if(typeof $scope.mFiltroAgente === 'undefined'){
					$scope.mFiltroAgente = {
						codigoAgente: 0
					}
				}

				$scope.pdfData = {
					CodigoProcedencia: $scope.mOrigen.Codigo,
					TipoDocumento : ($scope.mTipoDocumento && $scope.mTipoDocumento.Codigo) ? $scope.mTipoDocumento.Codigo : '',
					NumeroDocumento : $scope.mNumDoc ? $scope.mNumDoc : '',
					NumeroSolicitud : $scope.mNumDocSCTR ? parseInt($scope.mNumDocSCTR) : 0,
					FechaEfectivoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaDesde),
					FechaVencimientoPoliza : sctrEmitFactory.formatearFecha($scope.mConsultaHasta),
					TipoPeriodo : $scope.mTipoProducto.Codigo,
					FormaPago : !$scope.mFrecDeclaracion.Codigo || $scope.mFrecDeclaracion.Codigo === '0' ? '' : $scope.mFrecDeclaracion.Codigo,
					CodigoEstado : $scope.mEstado.Codigo,
					CodigoAgente : parseInt($scope.mFiltroAgente.codigoAgente)
				};
				$window.setTimeout(function(){
	        document.getElementById('frmDownloadPDF').submit();
	     	});

			};

			/*#######################################
		 	# SEND EMAIL
		 	#######################################*/
	    $scope.sendEmail = function(numeroSolicitud){
	      $scope.emailData ={
          numeroSolicitud: numeroSolicitud
	      };

	      //Modal
	      $scope.optionSendEmail = constants.modalSendEmail.sctr;
	      $uibModal.open({
	        backdrop: true, // background de fondo
	        backdropClick: true,
	        dialogFade: false,
	        keyboard: true,
	        scope: $scope,
	        template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
	        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
	          //CloseModal
	          $scope.close = function () {
	            $uibModalInstance.close();
	          };
	        }]
	      });
	    };

	    $scope.pagado = function(reporte){
	    	return true;
	    };

			$scope.buscarCoti = function(nroCotizacion){

				var paramsCoti = {

						NumeroSolicitud: nroCotizacion,
	  				Tipo: 1,
	  				TipoRol: ''

					};

				sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

						if (response.OperationCode === constants.operationCode.success){
							$scope.cotizacion = response.Data;
							//tipo de seguro
							if($scope.cotizacion.length===2){
								$scope.salud = true;
								$scope.pension = true;
							}else if($scope.cotizacion[0].CodigoCompania===3){
								$scope.salud = true;

							}else if($scope.cotizacion[0].CodigoCompania===2){
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

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER' || $scope.cotizacion[0].Solicitud.CodigoEstado=='CT'){
								// $scope.paso3 = true;

								// irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='SC' || $scope.cotizacion[0].Solicitud.CodigoEstado=='AS' || $scope.cotizacion[0].Solicitud.CodigoEstado=='RS'){
								$scope.paso3 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);
							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ST'){
								$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER' || $scope.cotizacion[0].Solicitud.CodigoEstado=='AT'){
								$scope.paso4 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 4, nroCotizacion);

							}else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){
								//$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 5, nroCotizacion);
							}
							else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EP'){
								$scope.paso5 = true;
								irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 5, nroCotizacion);
							}

						}
					});
			};

			function irACotizar(tipo, paso, nroCotizacion){
				$rootScope.formData = {};
        $state.go('sctrEmitir.steps', {tipo: tipo, quotation:nroCotizacion, step: paso});
      }

      $scope.updateTipoDocumento = function () {
        $scope.paramsReporte.TipoDocumento = $scope.mTipoDocumento.Codigo || '';
      }

      $scope.updateNroDocumento = function () {
        $scope.paramsReporte.NumeroDocumento = $scope.mNumDoc;
      }

      $scope.updateNroDocumento = function () {
        $scope.paramsReporte.NumeroSolicitud = $scope.mNumDocSCTR;
      }

      $scope.updateFormaPago = function () {
        $scope.paramsReporte.FormaPago = $scope.mFrecDeclaracion.Codigo || '';
      }

      $scope.updateCodigoEstado= function () {
        $scope.paramsReporte.CodigoEstado = $scope.mEstado.Codigo;
      }

      $scope.updateCodigoAgente= function (value) {
				$scope.mFiltroAgente = value;
        $scope.paramsReporte.CodigoAgente = $scope.mFiltroAgente.codigoAgente;
      }

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
	        var w = angular.element($window);
	        function showFilterBox(){
	          scope.isFilterVisible = false;
	          var isDesktop = $window.innerWidth > 991;
	          var heightDevice = $window.innerHeight;
	          if (isDesktop) {
							element.css('top', 'auto');
	          } else {
	          	element.css('top', heightDevice - 70 + 'px');
	          }
	          scope.toggleFilter = function(){
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
	          var isDesktop = $window.innerWidth > 991;
	          var heightDevice = $window.innerHeight;
	          if (isDesktop) {
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
