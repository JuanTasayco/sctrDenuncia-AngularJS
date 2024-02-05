define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appSoat')
    .directive('mpfItemRestriccionesSoat', ItemRestriccionesSoatDirective);

  ItemRestriccionesSoatDirective.$inject = [];

  function ItemRestriccionesSoatDirective() {
    var directive = {
      controller: ItemRestriccionesSoatDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/soat/restriction/component/item-restricciones/item-restricciones.html',
      transclude: true,
      scope: {
        restriccion: '=ngRestriccion',
        ngAccionCallback: '&?ngAccion',
      }
    };

    return directive;
  }

  ItemRestriccionesSoatDirectiveController.$inject = ['$scope'];
  function ItemRestriccionesSoatDirectiveController($scope) {
    var vm = this;

    vm.restriccion = {};

    vm.accionItemRestriction = accionItemRestriction;

    (function load_ItemRestriccionesSoatDirectiveController() {
      vm.restriccion = $scope.restriccion;
    })();

    function accionItemRestriction(accion) {
      if ($scope.ngAccionCallback) {
        $scope.ngAccionCallback({ '$event': { evento: accion, restriccion: vm.restriccion } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }
  }
});
