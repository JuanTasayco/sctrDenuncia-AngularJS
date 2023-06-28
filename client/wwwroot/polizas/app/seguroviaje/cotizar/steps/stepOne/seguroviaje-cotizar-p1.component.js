'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory'
  ], function(ng, _) {

  SeguroviajeCotizarStepOneController.$inject = [
    '$scope',
    '$state',
    '$rootScope',
    'seguroviajeFactory'
  ];

  function SeguroviajeCotizarStepOneController($scope, $state, $rootScope, seguroviajeFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.currentStep = $state.params.step;
      vm.formData = checkFormData();
      vm.saveForm = saveForm;
      vm.onChangeInitDate = changeInitDate;
    }
    // Metodo que verifica si existe un formulario guardado, si no genera un objeto vacio
    function checkFormData(){
      if(_.isEmpty(seguroviajeFactory.getFormData()) || seguroviajeFactory.getFormData().quotationNumber){
        return seguroviajeFactory.setEmptyFormData();
      }
      else{
        return ng.copy(seguroviajeFactory.getFormData());
      }
    }
    // Metodo que valida el formulario, para compararlo con la copia y guardarlo para el paso siguiente
    function saveForm() {
      $scope.stepOneForm.markAsPristine()
      if($scope.stepOneForm.$valid){
        vm.formData[0].numViajeros = parseInt(vm.formData[0].numViajeros);       
        vm.formData[0].stepOneFinish = true;
        seguroviajeFactory.setNewFormData(vm.formData);

        $scope.$emit('numViajeros', vm.formData[0].numViajeros);// Para actualizar el objeto de viajeros del paso 3
        $state.go('.',{
          step: 2
        });
      }
    }

    function changeInitDate(date) {
      if (date) {
        var minDate = new Date(date);
        var maxDate = new Date(date);
        minDate.setDate(date.getDate() + 3);
        maxDate.setDate(date.getDate() + 365);

        vm.formData[0].fechaFin = '';
        vm.minEndDate = minDate;
        vm.maxEndDate = maxDate;
      }
    }
  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeCotizarStepOneController', SeguroviajeCotizarStepOneController)
    .component('seguroviajeCotizarStepOneComponent', {
      templateUrl: '/polizas/app/seguroviaje/cotizar/steps/stepOne/seguroviaje-cotizar-p1.html',
      controller: 'SeguroviajeCotizarStepOneController as vm',
      binding: {}
    })
})
