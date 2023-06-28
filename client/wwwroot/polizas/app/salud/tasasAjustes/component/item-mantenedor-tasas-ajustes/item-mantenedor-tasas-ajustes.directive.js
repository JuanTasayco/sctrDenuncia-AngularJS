define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfItemMantenedorTasasAjustesSalud', ItemoMantenedorTasasAjustesSaludDirective);

    ItemoMantenedorTasasAjustesSaludDirective.$inject = [];

  function ItemoMantenedorTasasAjustesSaludDirective() {
    var directive = {
      controller: ItemMantenedorTasasAjustesaludDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/tasasAjustes/component/item-mantenedor-tasas-ajustes/item-mantenedor-tasas-ajustes.template.html',
      transclude: true,
      scope: {
        tasa: '=ngTasa',
        ngAccionCallback: '&?ngAccion'
      }
    };

    return directive;
  }

  ItemMantenedorTasasAjustesaludDirectiveController.$inject = ['$scope'];
  function ItemMantenedorTasasAjustesaludDirectiveController($scope) {
    var vm = this;
    
    vm.tasa = {};

    function init() {
      vm.tasa = $scope.tasa;
    };

    function accionItemTasa(accion) {
      if ($scope.ngAccionCallback) {
        $scope.ngAccionCallback({ '$event': { evento: accion, tasa: vm.tasa } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }

    vm.$onInit = init;
    vm.accionItemTasa = accionItemTasa;
  }
});
