define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfPopupAseguradosVidaLey', PopupAseguradosVidaLeyDirective);

  PopupAseguradosVidaLeyDirective.$inject = [];

  function PopupAseguradosVidaLeyDirective() {
    var directive = {
      require: '^ngModel',
      controller: PopupAseguradosVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/popup-asegurados/popup-asegurados-vida-ley.template.html',
      scope: {
        asegurados: '=',
        close: '&'
      }
    };

    return directive;
  }

  PopupAseguradosVidaLeyDirectiveController.$inject = ['$scope'];
  function PopupAseguradosVidaLeyDirectiveController($scope) {
    var vm = this;

    vm.asegurados = [];
    
    vm.close = Close;

    (function load_PopupAseguradosVidaLeyDirectiveController() {
      vm.asegurados = $scope.asegurados;
    })();

    function Close() {
      if ($scope.close) {
        $scope.close();
      }
    }
  }

});
