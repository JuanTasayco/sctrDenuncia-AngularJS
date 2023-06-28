define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfDuracionDeclaracionSeguro', DuracionDeclaracionSeguroDirective);

  DuracionDeclaracionSeguroDirective.$inject = [];

  function DuracionDeclaracionSeguroDirective() {
    var directive = {
      controller: DuracionDeclaracionSeguroDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/duracion-declaracion-seguro/duracion-declaracion-seguro.template.html',
      scope: {
        duracion: '=?ngModel',
        form: '=?form',
        disabled: '=?ngDisabled'
      }
    };

    return directive;
  }

  DuracionDeclaracionSeguroDirectiveController.$inject = ['$scope', 'vidaLeyFactory', 'vidaLeyService'];
  function DuracionDeclaracionSeguroDirectiveController($scope, vidaLeyFactory, vidaLeyService) {
    var vm = this;
    var date = new Date();

    vm.duracion = {};
    vm.frecuencia = []
    vm.duracionCoberturaData = [];
    vm.validadores = {
      minStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
      maxDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      minDate: new Date(date.getFullYear(), date.getMonth(), 1),
      minStartDateFormat: vidaLeyFactory.formatearFecha(new Date(date.getFullYear(), date.getMonth(), 1))
    }

    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date(date.getFullYear(), date.getMonth() + 2, 0),
      minDate: new Date(date.getFullYear(), date.getMonth(), 1)
    };
    $scope.popup = {
      opened: false
    };

    $scope.open = function() {
        $scope.popup.opened = true;
    };
    $scope.format = 'dd/MM/yyyy';

    vm.cambioFrecuenciaDeclaracion = CambioFrecuenciaDeclaracion;
    vm.validControlForm = ValidControlForm;
    vm.validDate = ValidDate;

    (function load_DuracionDeclaracionSeguroDirectiveController() {
      vidaLeyFactory.setDuracionDeclaracion($scope.duracion);
      vidaLeyService.getFrecuencia().then(function (response) { vm.frecuencia = response.Data; });
      vm.duracionCoberturaData = vidaLeyFactory.getDuracionCobertura();
      vm.duracion = vidaLeyFactory.cotizacion.duracion;
      vm.cambioFrecuenciaDeclaracion(vm.duracion.modelo.mFrecuenciaDuracion)
    })();

    function CambioFrecuenciaDeclaracion(frecuenciaDeclaracion) {
      vm.duracionCoberturaData = vidaLeyFactory.getDuracionCobertura(frecuenciaDeclaracion && frecuenciaDeclaracion.CodigoRegistro);
      if (angular.isUndefined(frecuenciaDeclaracion)) {
        vm.duracion.modelo.mDuracionCobertura = (void 0);
      }
    }

    function ValidControlForm(controlName) {
      return $scope.form && vidaLeyFactory.validControlForm($scope.form, controlName);
    }

    function ValidDate(controlName) {
      return $scope.form && $scope.form[controlName] && !$scope.form[controlName].$error.required && $scope.form[controlName].$invalid && !$scope.form[controlName].$pristine;
    }
  }

});
