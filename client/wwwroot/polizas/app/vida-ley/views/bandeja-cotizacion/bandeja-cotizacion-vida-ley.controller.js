define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('bandejaCotizacionVidaLeyController', BandejaCotizacionVidaLeyController);

  BandejaCotizacionVidaLeyController.$inject = ['$state', 'vidaLeyService', 'vidaLeyFactory', 'oimClaims', 'mModalConfirm', 'mModalAlert', '$stateParams', 'mainServices'];

  function BandejaCotizacionVidaLeyController($state, vidaLeyService, vidaLeyFactory, oimClaims, mModalConfirm, mModalAlert, $stateParams, mainServices) {
    var vm = this;

    vm.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: false
    };
    vm.listArray = [];
    vm.parametrosReporte = {};
    vm.pdfURL = '';

    vm.buscarDocumentosVidaLey = BuscarDocumentosVidaLey;
    vm.limpiarResultados = LimpiarResultados;
    vm.pageChanged = PageChanged;
    vm.irCotizacion = IrCotizacion;
    vm.itemSeleccionado = ItemSeleccionado;
    vm.anularCotizaciones = AnularCotizaciones;

    (function load_BandejaCotizacionVidaLeyController() {
      vidaLeyFactory.setClaims(oimClaims);
      vm.rol = vidaLeyFactory.getCurrentUserPermissions(oimClaims.rolesCode);
    })();

    function BuscarDocumentosVidaLey(filtros) {
      vm.limpiarResultados();
      _setRequestBuscarDocumentos(filtros);
      _buscarDocumentosVidaLey();
    }

    function PageChanged(currentPage) {
      vm.parametrosReporte.PaginaActual = currentPage;
      _buscarDocumentosVidaLey();
    }

    function ItemSeleccionado($event){

      vm.indexArray = vm.listArray.indexOf($event.evento);
      if (vm.indexArray !== -1) {
        vm.listArray.splice(vm.indexArray, 1);
      } else {
        vm.listArray.push($event.evento);
      }
    }

    function AnularCotizaciones(){
      mModalConfirm
        .confirmInfo('', '¿Estás seguro de anular la cotización?')
        .then(function(){
            _anularCotizacionDesdeServicio();
        }).catch(function(){
      });
    }

    function _anularCotizacionDesdeServicio(){
      vidaLeyService.anularCotizacionMasiva(vm.listArray)
        .then(function(response){
          mModalAlert.showSuccess('', 'Cotizacion Anulada exitosamente')
            .then(function(){
              vm.listArray = [];
              _buscarDocumentosVidaLey();
            });
        }).catch(function(error){
      });
    }

    function IrCotizacion($event) {
      if ($event.evento === 'edit') {
        vidaLeyService.getCotizacion($event.documento.NumeroDocumento)
          .then(function (response) {
            if(response.OperationCode === constants.operationCode.success) {
              vidaLeyFactory.clearCotizacion();
              vidaLeyFactory.setCotizacion(response.Data, $event.documento.Secuencia);
              
              if(_vigenciaMayorMes(response.Data)){
                $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: 1 });
              } else {
                if($event.documento.Secuencia > 4) {
                  $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: 4 });
                } else {
                  $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: $event.documento.Secuencia });
                }
              }
            }
          });
      } else {
        $state.go(constantsVidaLey.ROUTES.RESUMEN.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
      }
    }

    function _vigenciaMayorMes(cotizacion){
      return mainServices.date.fnDiff(cotizacion.Principal.FecReg, new Date(), 'D') > 30;
    }

    function LimpiarResultados() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }

    function _buscarDocumentosVidaLey() {
      vidaLeyService.busquedaDocumentos(vm.parametrosReporte).then(_buscarDocumentosVidaLeyResponse);
    }

    function _setRequestBuscarDocumentos(filtros) {
      vm.parametrosReporte = {
        NumDoc: (filtros && filtros.numeroCotizacion) || '',
        CodAgt: (filtros && filtros.agente) || '',
        TipDocCont: (filtros && filtros.tipoDocumento) || '',
        NumDocCont: (filtros && filtros.numeroDocumento) || '',
        CodEstado: (filtros && filtros.codEstado) || '',
        FecIni: filtros && filtros.fechaInicial,
        FecFin: filtros && filtros.fechaFinal,
        CantidadFilasPorPagina: vm.pagination.maxSize,
        PaginaActual: vm.pagination.currentPage,
        ColumnaOrden: ''
      };
    }

    function _buscarDocumentosVidaLeyResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.totalItems = parseInt(response.TotalPaginas) * vm.pagination.maxSize;
      vm.pagination.items = response.Data;
      vm.pagination.noResult = response.Data.length === 0;
    }

  }

});
