define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfFiltroMantenedorTasasAjustesSalud', FiltroMantenedorTasasAjustesSaludDirective);

  FiltroMantenedorTasasAjustesSaludDirective.$inject = [];

  function FiltroMantenedorTasasAjustesSaludDirective() {
    var directive = {
      controller: FiltroMantenedorTasasAjustesSaludDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/tasasAjustes/component/filtro-mantenedor-tasas-ajustes/filtro-mantenedor-tasas-ajustes.template.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        ngLimpiarCallback: '&?ngLimpiar'
      }
    };

    return directive;
  }

  FiltroMantenedorTasasAjustesSaludDirectiveController.$inject = ['$scope', 'saludFactory'];
  function FiltroMantenedorTasasAjustesSaludDirectiveController($scope, saludFactory) {
    var vm = this;
    var filtrosDefault = { contrato: null, clase: null };

    vm.filtros = {};

    function init() {
      vm.filtros = angular.extend({}, filtrosDefault);
      _loadContratos();
      _loadClases();
      
      buscarTasas();
    };

    // Cargar combo de contratos
    function _loadContratos() {
      saludFactory.getProducts().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.contratos = response.Data;
        } else {
          vm.contratos = [];
        }
      });
    }

    // Cargar combo de clases
    function _loadClases() {
      saludFactory.listarClases().then(function(response) {
        if(response.OperationCode == 200) {
          vm.clases = response.Data;
        } else {
          vm.clases = [];
        }
      });
    }

    // Buscar tasas
    function buscarTasas() {
      if ($scope.ngBuscarCallback) {
        $scope.ngBuscarCallback({ '$event': _transformFiltrosBuscar() });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-buscar');
      }
    }

    // Limpiar filtros
    function limpiarFiltros() {
      vm.filtros = angular.extend({}, filtrosDefault);
      if ($scope.ngLimpiarCallback) {
        $scope.ngLimpiarCallback();
      }
    }

    // Parsear datos a objeto para ws
    function _transformFiltrosBuscar() {
      return {
        clase: vm.filtros.clase && vm.filtros.clase.descripcionClase,
        contrato: vm.filtros.contrato && vm.filtros.contrato.NumeroContrato,
        subContrato: vm.filtros.contrato && vm.filtros.contrato.NumeroSubContrato
      };
    }

    vm.$onInit = init();
    vm.buscarTasas = buscarTasas;
    vm.limpiarFiltros = limpiarFiltros;
  }
});
