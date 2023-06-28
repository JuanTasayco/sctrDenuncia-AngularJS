define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('bandejaReportesVidaLeyController', BandejaReportesVidaLeyController);

  BandejaReportesVidaLeyController.$inject = ['$state', 'vidaLeyService', 'vidaLeyFactory', 'oimClaims', 'mainServices'];

  function BandejaReportesVidaLeyController($state, vidaLeyService, vidaLeyFactory, oimClaims, mainServices) {
    var vm = this;

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

    vm.buscarReportesVidaLey = BuscarReportesVidaLey;
    vm.limpiarResultados = LimpiarResultados;
    vm.pageChanged = PageChanged;
    vm.irCotizacion = IrCotizacion;
    vm.isAgent = isAgent;
    vm.exportarExcel = ExportarExcel;

    (function load_BandejaCotizacionVidaLeyController() {
      vidaLeyFactory.setClaims(oimClaims);
    })();

    function BuscarReportesVidaLey(filtros) {
      vm.limpiarResultados();
      _setRequestBuscarReportes(filtros);
      _buscarReportesVidaLey();
    }

    function PageChanged(currentPage) {
      vm.parametrosReporte.PaginaActual = currentPage;
      _buscarReportesVidaLey();
    }

    function IrCotizacion($event) {
      $state.go(constantsVidaLey.ROUTES.REPORTE.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
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

    function _buscarReportesVidaLey() {
      vidaLeyService.busquedaReportes(vm.parametrosReporte).then(_buscarReportesVidaLeyResponse);
    }

    function _setRequestBuscarReportes(filtros) {
      vm.parametrosReporte = {
        CodigoAgente: (filtros && filtros.agente) || '',
        NombreOficinaComercial: (filtros && filtros.nombreOficinaComercial) || '',
        NumeroDocumento: (filtros && filtros.numeroDocumento) || '',
        NombreCliente: (filtros && filtros.nombreCliente) || '',
        NombreUsuario: (filtros && filtros.nombreUsuario) || '',
        CodigoEstado: (filtros && filtros.codEstado) || '',
        NumeroSolicitud: (filtros && filtros.numeroSolicitud) || '',
        Periodo: (filtros && filtros.periodo) || '',
        FechaInicio: filtros && filtros.fechaInicial,
        FechaFin: filtros && filtros.fechaFinal,
        CanalOrigen: (filtros && filtros.canalOrigen) || '',
        CantidadFilasPorPagina: vm.pagination.maxSize,
        PaginaActual: vm.pagination.currentPage,
      };
    }

    function _buscarReportesVidaLeyResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.totalItems = parseInt(response.Data.CantidadTotalPaginas) * vm.pagination.maxSize;
      vm.pagination.items = response.Data.Lista;
      vm.pagination.noResult = response.Data.Lista.length === 0;
    }

    function isAgent(){
      return true;
    }

    function ExportarExcel() {
      vidaLeyService.getListReporteExcel(vm.parametrosReporte)
    }

  }

});
