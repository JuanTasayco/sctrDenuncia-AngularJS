define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfResumenCotizacionImportes', ResumenCotizacionImportesDirective);

  ResumenCotizacionImportesDirective.$inject = [];

  function ResumenCotizacionImportesDirective() {
    var directive = {
      controller: ResumenCotizacionImportesDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/resumen-cotizacion-importes/resumen-cotizacion-importes.template.html',
      scope: {
        data: '=ngData',
      }
    };

    return directive;
  }

  ResumenCotizacionImportesDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert'];
  function ResumenCotizacionImportesDirectiveController($scope, saludFactory, mModalAlert) {

    var vm = this;

    vm.data = {};
    vm.migracion = {};

    (function load_ResumenCotizacionImportesDirectiveController() {
      vm.data = $scope.data;
      vm.migracion = saludFactory.getMigracion();
    })();

    var listenData = $scope.$watch('data', function(nv){
      vm.data = nv;
    });

    $scope.$on('$destroy', function(){
      listenData();
    });

  }

});
