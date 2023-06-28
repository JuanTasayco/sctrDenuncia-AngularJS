define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfResumenCotizacionPoliza', ResumenCotizacionPolizaDirective);

  ResumenCotizacionPolizaDirective.$inject = [];

  function ResumenCotizacionPolizaDirective() {
    var directive = {
      controller: ResumenCotizacionPolizaDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/resumen-cotizacion-poliza/resumen-cotizacion-poliza.template.html',
      scope: {
        data: '=ngData',
      }
    };

    return directive;
  }

  ResumenCotizacionPolizaDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert'];
  function ResumenCotizacionPolizaDirectiveController($scope, saludFactory, mModalAlert) {

    var vm = this;

    vm.data = {};

    (function load_ResumenCotizacionPolizaDirectiveController() {
      vm.data = $scope.data;
    })();

    var listenData = $scope.$watch('data', function(nv){
      vm.data = nv;
    });

    $scope.$on('$destroy', function(){
      listenData();
    });


  }

});
