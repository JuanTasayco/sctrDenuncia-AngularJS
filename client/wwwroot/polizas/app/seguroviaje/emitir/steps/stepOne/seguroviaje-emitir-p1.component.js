'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory'
  ], function(ng, _) {

  SeguroviajeEmitirStepOneController.$inject = [
    '$scope',
    '$state',
    '$rootScope',
    'mModalAlert',
    'seguroviajeFactory',
    'seguroviajeService'
  ];

  function SeguroviajeEmitirStepOneController($scope, $state, $rootScope, mModalAlert, seguroviajeFactory, seguroviajeService) {
    var vm = this;
    vm.$onInit = onInit;
    function onInit(){
      vm.currentStep = $state.params.step;
      if($state.params.numeroDoc){
        setSummary($state.params.numeroDoc)        
      }
      else{
        $state.go('homePolizasSeguroviaje')
      }
    }
    function setSummary(numeroDoc){
      if(seguroviajeFactory.getFormData().quotationNumber && seguroviajeFactory.getFormData().documentNumber == numeroDoc){
        vm.formData = seguroviajeFactory.getFormData();
      }
      else{
        seguroviajeService.getQuotationSummary(numeroDoc, true)
        .then(function(response){
          vm.formData = response.data;
          seguroviajeFactory.setNewFormData(vm.formData)
        })
        .catch(function(){
          mModalAlert.showWarning('Ha ocurrido un error al cargar la información','')
          .then(function(data){
            if(data){
              $state.go('seguroviajeCotizaciones');
            }
          })
        })
      }
    }
  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeEmitirStepOneController', SeguroviajeEmitirStepOneController)
    .component('seguroviajeEmitirStepOneComponent', {
      templateUrl: '/polizas/app/seguroviaje/emitir/steps/stepOne/seguroviaje-emitir-p1.html',
      controller: 'SeguroviajeEmitirStepOneController as vm',
      binding: {}
    })
})
