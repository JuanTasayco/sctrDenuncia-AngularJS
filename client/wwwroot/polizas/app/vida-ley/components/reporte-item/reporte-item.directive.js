define([
  'angular', 'constants'
], function (angular, constants) {

  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfReporteItemVidaLey', ReporteItemVidaLeyDirective);

  ReporteItemVidaLeyDirective.$inject = [];

  function ReporteItemVidaLeyDirective() {
    var directive = {
      controller: ReporteItemVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/reporte-item/reporte-item.template.html',
      transclude: true,
      scope: {
        documento: '=ngDocumento',
        ngSeleccionadoCallback: '&?ngSeleccionado',
        ngAccionCallback: '&?ngAccion',
      }
    };

    return directive;
  }

  ReporteItemVidaLeyDirectiveController.$inject = ['$scope'];
  function ReporteItemVidaLeyDirectiveController($scope) {
    var vm = this;

    vm.documento = {};

    vm.verCotizacion = VerCotizacion;
    vm.updateListArray = UpdateListArray;
    (function load_ReporteItemVidaLeyDirectiveController() {
      vm.documento = _transformScopeDocument($scope.documento);
    })();

    function VerCotizacion() {
      if ($scope.ngAccionCallback) {
        $scope.ngAccionCallback({ '$event': { evento: 'resumen', documento: vm.documento } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }

    function UpdateListArray(value, idItem) {

      if ($scope.ngSeleccionadoCallback) {
        $scope.ngSeleccionadoCallback({ '$event': { evento: idItem } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-seleccionado');
      }
    };

    function _transformScopeDocument(document) {
      return {
        NumeroDocumento: document && document.NumeroSolicitud,
        FechaRegistro: document && document.Fecha,
        Estado: document && document.Estado,
        Agente: document && document.Agente,
        Usuario: document && document.Usuario,
        NumeroAsegurados: document && document.NumeroAsegurados,
        RazonSocial: document && document.RazonSocial
      };
    }
  }

});
