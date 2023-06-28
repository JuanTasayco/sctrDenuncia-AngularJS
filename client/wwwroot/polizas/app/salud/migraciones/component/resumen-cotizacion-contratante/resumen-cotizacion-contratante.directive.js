define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfResumenCotizacionContratante', ResumenCotizacionContratanteDirective);

  ResumenCotizacionContratanteDirective.$inject = [];

  function ResumenCotizacionContratanteDirective() {
    var directive = {
      controller: ResumenCotizacionContratanteDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/resumen-cotizacion-contratante/resumen-cotizacion-contratante.template.html',
      scope: {
        contratante: '=ngContratante',
        producto: '=ngProducto',
      }
    };

    return directive;
  }

  ResumenCotizacionContratanteDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert'];
  function ResumenCotizacionContratanteDirectiveController($scope, saludFactory, mModalAlert) {

    var vm = this;

    vm.contratante = {};
    vm.producto = {};

    (function load_ResumenCotizacionContratanteDirectiveController() {
      vm.contratante = $scope.contratante;
      vm.producto = $scope.producto;

      var listenProducto = $scope.$watch('producto', function(nv){
       vm.producto = nv;
      });

      $scope.$on('$destroy', function(){
        listenProducto();
      });

    })();



  }

});
