define(['angular', 'constants'], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.fola.moduleName)
    .controller('emisorPolizaFolaController', EmisorPolizaFolaController);

  EmisorPolizaFolaController.$inject = ['$state', 'folaService', 'mpSpin'];
  function EmisorPolizaFolaController($state, folaService, mpSpin) {
    var vm = this;
    // Propiedades
    vm.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: false
    };
    vm.parametrosReporte = {};
    vm.pdfURL = '';

    // Funciones:
    vm.buscarDocumentosFola = BuscarDocumentosFola;
    vm.limpiarResultados = LimpiarResultados;
    vm.pageChanged = PageChanged;
    vm.irCotizacion = IrCotizacion;

    function BuscarDocumentosFola(filtros) {
      vm.limpiarResultados();
      _setRequestBuscarDocumentos(filtros);
      _buscarDocumentosFola();
    }
    function PageChanged(currentPage) {
      vm.parametrosReporte.paginaActual = currentPage;
      _buscarDocumentosFola();
    }
    function IrCotizacion($event) {
      if ($event.documento.Estado === 'COTIZADO') {
        $state.go(
          'emisionFola.steps', 
          {
            documentoId: $event.documento.NumeroDocumento, 
            step: 1
          }
        );
      }
      if ($event.documento.Estado === 'EMITIDO') {
        $state.go(
          constantsFola.ROUTES.RESUMEN_BANDEJA_DOCUMENTOS,
          {documentoId: $event.documento.NumeroDocumento},
          {reload: true, inherit: false}
        );
      }
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
    // Funciones privadas
    function _buscarDocumentosFola() {
      mpSpin.start();
      folaService.getDocuments(vm.parametrosReporte).then(
        function (response) {
          _buscarDocumentosFolaResponse(response);
          mpSpin.end();
        },
        function (error) {
          $state.go('errorInternoFola',{}, { reload: true, inherit: false });
          console.log('error', error);
          mpSpin.end();
        }
      );
    }
    function _setRequestBuscarDocumentos(filtros) {
      vm.parametrosReporte = {
        numeroDocumento: (filtros && filtros.numeroDocumento) || '',
        fechaInicio: filtros && filtros.fechaInicio,
        fechaFinal: filtros && filtros.fechaFinal,
        contratante: (filtros && filtros.contratante) || '',
        estado: (filtros && filtros.estado) || '',
        ramo: (filtros && filtros.ramo) || 116,
        cantidadFilasPorPagina: vm.pagination.maxSize,
        paginaActual: vm.pagination.currentPage
      };
    }
    function _buscarDocumentosFolaResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.totalItems = parseInt(response.data.cantidadTotalPaginas) * vm.pagination.maxSize;
      vm.pagination.items = response.data.documentos;
      vm.pagination.noResult = response.data.documentos.length === 0;
    }
  }
});
