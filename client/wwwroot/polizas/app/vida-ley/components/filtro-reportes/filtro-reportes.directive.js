define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfFiltroReportesVidaLey', FiltroReportesVidaLeyDirective);

  FiltroReportesVidaLeyDirective.$inject = [];

  function FiltroReportesVidaLeyDirective() {
    var directive = {
      controller: FiltroReportesVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/filtro-reportes/filtro-reportes.template.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        ngLimpiarCallback: '&?ngLimpiar'
      }
    };

    return directive;
  }

  FiltroReportesVidaLeyDirectiveController.$inject = ['$scope', '$timeout', 'vidaLeyService', 'vidaLeyFactory', 'mModalAlert'];
  function FiltroReportesVidaLeyDirectiveController($scope, $timeout, vidaLeyService, vidaLeyFactory, mModalAlert) {
    var vm = this;
    var filtrosDefault = {
      agente: null, nombreOficinaComercial: null, numeroDocumento: '', nombreCliente: '',
      nombreUsuario: '', tipoEstado: null, numeroSolicitud: '',
      periodo: null, fechaInicial: new Date(), fechaFinal: new Date(), canalOrigen: ''
    };

    vm.filtros = {};
    vm.tiposEstadoSolicitud = [];
    vm.format = constants.formats.dateFormat;
    vm.userRoot = false;
    vm.user = {};
    vm.pdfURL = '';
    vm.showMoreFilters = false;

    vm.buscarReportes = BuscarReportes;
    vm.limpiarFiltros = LimpiarFiltros;


    (function load_FiltroReportesVidaLeyDirectiveController() {
      vm.filtros = angular.extend({}, filtrosDefault);
      vm.userRoot = vidaLeyFactory.isUserRoot();
      console.log(vm.user)
      vm.user = vidaLeyFactory.getUser();
      vm.searchOficina = searchOficina;

      _loadStates();
      _loadPeriodos();
    })();

    function _loadStates() {
      vidaLeyService.getListParametroDetalleGeneral(25, true).then(function (response) { vm.estados = response.Data; });
    }

    function _loadPeriodos() {
      vidaLeyService.getListParametroDetalleGeneral(27, true).then(function (response) {
        vm.periodos = response.Data;
        /** valor por defecto al filtro periodo */
        _setDefaultPeriodo();
        BuscarReportes();
      });
    }

    function _setDefaultPeriodo() {
      vm.filtros.periodo = vm.periodos.find(function (periodo) {
        return periodo.Valor1 === 'PRS';
      });
    }

    function searchOficina(query) {
      var params = {
        CodigoOficina: 0,
        NombreOficina: query,
        CantidadFilasPorPagina: 20,
        PaginaActual: 1
      };
      return vidaLeyService.getListSuscriptorOficina(params.CodigoOficina, params.NombreOficina, params.CantidadFilasPorPagina, params.PaginaActual)
        .then(function (response) {
          const data = response.Data.Lista ? response.Data.Lista : [];
          return data;
        });

    }

    function BuscarReportes() {
      if ($scope.ngBuscarCallback) {
        if (_validateFilter()) {
          $scope.ngBuscarCallback({ '$event': _transformFiltrosBuscar() });
        }
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-buscar');
      }
    }

    function LimpiarFiltros() {
      vm.filtros = angular.extend({}, filtrosDefault);
      _setDefaultPeriodo();
      if ($scope.ngLimpiarCallback) {
        $scope.ngLimpiarCallback();
      }
    }

    function _validateFilter() {
      if (_validateFilterFields()) {
        $scope.frmReports.markAsPristine();
        return $scope.frmReports.$valid;
      } else {

        mModalAlert.showWarning('Debe ingresar como mínimo un filtro', 'ALERTA', null, 3000);
        return false;
      }
    }

    function _validateFilterFields() {

      var validate = vm.filtros.agente !== '' ||
        vm.filtros.nombreOficinaComercial !== '' ||
        vm.filtros.numeroDocumento !== '' ||
        vm.filtros.numeroSolicitud !== '' ||
        vm.filtros.nombreCliente !== '' ||
        vm.filtros.nombreUsuario !== '' ||
        (vm.filtros.periodo && vm.filtros.periodo.Valor1 !== null) ||
        vm.filtros.canalOrigen !== '' ||
        (vm.filtros.tipoEstado && vm.filtros.tipoEstado.Valor1 !== null) ||
        vm.filtros.fechaInicial !== null ||
        vm.filtros.fechaFinal !== null;

      return validate;
    }

    function _transformFiltrosBuscar() {
      return {
        agente: vm.filtros.agente && vm.filtros.agente.codigoAgente,
        nombreOficinaComercial: vm.filtros.nombreOficinaComercial && vm.filtros.nombreOficinaComercial.NombreOficina,
        numeroDocumento: vm.filtros.numeroDocumento,
        numeroSolicitud: vm.filtros.numeroSolicitud,
        nombreCliente: vm.filtros.nombreCliente,
        nombreUsuario: vm.filtros.nombreUsuario,
        periodo: vm.filtros.periodo && vm.filtros.periodo.Valor1,
        canalOrigen: vm.filtros.canalOrigen,
        codEstado: vm.filtros.tipoEstado && vm.filtros.tipoEstado.Valor1,
        fechaInicial: vidaLeyFactory.formatearFecha(vm.filtros.fechaInicial),
        fechaFinal: vidaLeyFactory.formatearFecha(vm.filtros.fechaFinal)
      };
    }

  }
});
