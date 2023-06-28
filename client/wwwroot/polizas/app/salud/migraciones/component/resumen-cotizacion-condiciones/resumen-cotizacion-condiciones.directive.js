define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfResumenCotizacionCondiciones', ResumenCotizacionCondicionesDirective);

  ResumenCotizacionCondicionesDirective.$inject = [];

  function ResumenCotizacionCondicionesDirective() {
    var directive = {
      controller: ResumenCotizacionCondicionesDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/resumen-cotizacion-condiciones/resumen-cotizacion-condiciones.template.html',
      scope: {
        data: '=ngData',
      }
    };

    return directive;
  }

  ResumenCotizacionCondicionesDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert'];
  function ResumenCotizacionCondicionesDirectiveController($scope, saludFactory, mModalAlert) {

    var vm = this;

    vm.data = {};
    vm.migracion = {};

    (function load_ResumenCotizacionCondicionesDirectiveController() {
      vm.data = $scope.data;
      vm.migracion = saludFactory.getMigracion();
      vm.resumenCondicionesFechaFinal = vm.migracion.McaEstado === 'XX' ? vm.migracion.FechaUltimoReciboPagado : vm.migracion.FechaVigenciaHasta;
    })();

    var listenData = $scope.$watch('data', function(nv){
      vm.data = nv;
    });

    $scope.$on('$destroy', function(){
      listenData();
    });


  }

});
