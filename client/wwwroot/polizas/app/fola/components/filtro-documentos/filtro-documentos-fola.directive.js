define(['angular', 'constants'], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.fola.moduleName)
    .directive('mpfFiltroDocumentosFola', FiltroDocumentosFolaDirective);

  FiltroDocumentosFolaDirective.$inject = [];

  function FiltroDocumentosFolaDirective() {
    var directive = {
      controller: FiltroDocumentosFolaDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/fola/components/filtro-documentos/filtro-documentos-fola.template.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        isConsultaDocumento: '&?ngConsultaDocumento',
        ngLimpiarCallback: '&?ngLimpiar'
      }
    };

    return directive;
  }

  FiltroDocumentosFolaDirectiveController.$inject = ['$scope', '$timeout', 'folaFactory', 'mModalAlert'];
  function FiltroDocumentosFolaDirectiveController($scope, $timeout, folaFactory, mModalAlert) {
    var vm = this;
    var date = new Date();
    var filtrosDefault = {
      tipoDocumento: null,
      numeroDocumento: '',
      numeroCotizacion: '',
      numeroPoliza: '',
      contratante: '',
      fechaInicial: new Date(date.getFullYear(), date.getMonth(),1),
      fechaFinal: new Date(date.getFullYear(), date.getMonth()+1,0),
      estado: ''
    };
    // Propiedades
    vm.filtros = {};
    vm.tiposDocumento = [];
    vm.format = constants.formats.dateFormat;
    vm.userRoot = false;
    vm.user = {};
    vm.pdfURL = '';
    vm.estado = '';
    vm.isConsultaDocumento = !!$scope.isConsultaDocumento;
    vm.cotizado = true;
    vm.emitido = vm.isConsultaDocumento;
    vm.expirado = vm.isConsultaDocumento;

    // Funciones
    vm.buscarDocumentos = BuscarDocumentos;
    vm.limpiarFiltros = LimpiarFiltros;
    vm.statusDocuments = StatusDocuments;

    (function load_FiltroDocumentosFolaDirectiveController() {
      vm.filtros = angular.extend({}, filtrosDefault);
      StatusDocuments();
      // Iniciamos busqueda apenas carga
      $timeout(function () {
        BuscarDocumentos();
      }, 1000);
    })();

    function BuscarDocumentos() {
      if ($scope.ngBuscarCallback) {
        if (_validateFilter()) {
          $scope.ngBuscarCallback({$event: _transformFiltrosBuscar()});
        }
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-buscar');
      }
    }

    function LimpiarFiltros() {
      vm.filtros = angular.extend({}, filtrosDefault);
      // _setDefaultAgente();
      StatusDocuments()
      if ($scope.ngLimpiarCallback) {
        $scope.ngLimpiarCallback();
      }
    }

    function StatusDocuments() {
      vm.estado = '';
      if (vm.emitido) {
        vm.estado = vm.estado + ', ' + 'EMITIDO';
      }
      if (vm.cotizado) {
        vm.estado = vm.estado + ', ' + 'COTIZADO';
      }
      if (vm.expirado) {
        vm.estado = vm.estado + ', ' + 'EXPIRADO';
      }
      vm.estado = vm.estado.substring(2);
      vm.filtros.estado = vm.estado;
    }

    // funciones privadas
    function _validateFilterFields() {
      var validate = vm.filtros.fechaInicial !== null || vm.filtros.fechaFinal !== null;
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
      return {
        numeroDocumento: vm.filtros.numeroDocumento,
        fechaInicio: folaFactory.formatearFecha(vm.filtros.fechaInicial),
        fechaFinal: folaFactory.formatearFecha(vm.filtros.fechaFinal),
        contratante: vm.filtros.contratante,
        estado: vm.filtros.estado,
        numeroPoliza: vm.filtros.numeroPoliza,
        ramo: 116,
        cantidadFilasPorPagina: 10,
        paginaActual: 1
      };
    }
  }
});
