define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfFiltroDocumentosVidaLey', FiltroDocumentosVidaLeyDirective);

  FiltroDocumentosVidaLeyDirective.$inject = [];

  function FiltroDocumentosVidaLeyDirective() {
    var directive = {
      controller: FiltroDocumentosVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/filtro-documentos/filtro-documentos.template.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        ngLimpiarCallback: '&?ngLimpiar'
      }
    };

    return directive;
  }

  FiltroDocumentosVidaLeyDirectiveController.$inject = ['$scope', '$timeout', 'vidaLeyService', 'vidaLeyFactory', 'mModalAlert', '$stateParams'];
  function FiltroDocumentosVidaLeyDirectiveController($scope, $timeout, vidaLeyService, vidaLeyFactory, mModalAlert, $stateParams) {
    var vm = this;
    var filtrosDefault = { tipoDocumento: null, numeroDocumento: '', numeroCotizacion: '', agente: null, fechaInicial: new Date(), fechaFinal: new Date() };

    vm.filtros = {};
    vm.tiposDocumento = [];
    vm.format = constants.formats.dateFormat;
    vm.userRoot = false;
    vm.user = {};
    vm.pdfURL = '';
    vm.rol = '';

    vm.isSuscriptor = isSuscriptor;

    vm.buscarDocumentos = BuscarDocumentos;
    vm.limpiarFiltros = LimpiarFiltros;
    vm.showStates = ShowStates;
    vm.mostrarAgente = MostrarAgente;

    (function load_FiltroDocumentosVidaLeyDirectiveController() {
      vm.filtros = angular.extend({}, filtrosDefault);
      vm.userRoot = vidaLeyFactory.isUserRoot();
      vm.user = vidaLeyFactory.getUser();
      vm.rol = vidaLeyFactory.getUserActualRole();
      
      _loadDocumentTypes();
      _loadStates();

      $timeout(function () {
        BuscarDocumentos();
      }, 1000);
    })();

    function BuscarDocumentos() {
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
      if ($scope.ngLimpiarCallback) {
        $scope.ngLimpiarCallback();
      }
    }

    function _loadDocumentTypes() {
      vidaLeyService.getDocumentTypes(true).then(function (response) { vm.tiposDocumento = response.Data; });
    }

    function _loadStates() {
      vidaLeyService.getListParametroDetalleGeneral(25, true).then(function (response) { vm.estados = response.Data; });
    }

    function _validateFilterFields() {
      var validate = vm.filtros.tipoDocumento !== ''
        || vm.filtros.numeroDocumento !== ''
        || vm.filtros.numeroCotizacion !== ''
        || vm.filtros.agente !== ''
        || (vm.filtros.tipoDocumento && vm.filtros.tipoDocumento.Codigo !== null)
        || (vm.filtros.tipoEstado && vm.filtros.tipoEstado.Valor1 !== null)
        || vm.filtros.fechaInicial !== null
        || vm.filtros.fechaFinal !== null;

      return validate;
    }

    function _validateFilter() {
      if (_validateFilterFields()) {
        $scope.frmDocuments.markAsPristine();
        return $scope.frmDocuments.$valid;
      } else {
        mModalAlert.showWarning('Debe ingresar como mínimo un filtro', 'ALERTA', null, 3000);
        return false;
      }
    }

    function _transformFiltrosBuscar() {
      var params = {
        tipoDocumento: vm.filtros.tipoDocumento && vm.filtros.tipoDocumento.Codigo,
        numeroDocumento: vm.filtros.numeroDocumento,
        numeroCotizacion: vm.filtros.numeroCotizacion,
        codEstado: vm.filtros.tipoEstado && vm.filtros.tipoEstado.Valor1,
        agente: vm.filtros.agente && vm.filtros.agente.codigoAgente,
        fechaInicial: vidaLeyFactory.formatearFecha(vm.filtros.fechaInicial),
        fechaFinal: vidaLeyFactory.formatearFecha(vm.filtros.fechaFinal)
      };

      if($stateParams.parameter) {
        params.codEstado = 'RE';
      }

      return params;
    }

    function ShowStates(){

      return !$stateParams.parameter;
    }

    function isSuscriptor(){
      return vm.rol === 'SUS';
    }

    function MostrarAgente(){
      if(vm.userRoot) return false;
      if(vm.isSuscriptor()) return false;
      return true;
    }

  }

});
