'use strict';

define([
  'angular',
  'seguroviajeFactory',
  'seguroviajeService',
  'coveragesComponent'
  ], function(ng) {

  SeguroviajeCotizarStepFourController.$inject = [
    '$scope',
    '$timeout',
    '$state',
    '$rootScope',
    'seguroviajeFactory',
    'seguroviajeService',
    'mModalAlert',
    'gaService',
    'proxyGeneral'
  ];

  function SeguroviajeCotizarStepFourController($scope, $timeout, $state, $rootScope, seguroviajeFactory, seguroviajeService, mModalAlert, gaService, proxyGeneral) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.currentStep = $state.params.step;
      vm.formData = seguroviajeFactory.getFormData();
      if(ng.isUndefined(vm.formData[2]) || !vm.formData[2].stepThreeFinish){
        $state.go('.',{
          step: 3
        });
      }
      else if(!seguroviajeFactory.isEqualBonus(seguroviajeFactory.getBonusCopy(), seguroviajeFactory.setBonusBody(vm.formData))){
        mModalAlert.showWarning('Se realizó una edición. Por favor volver a calcular la prima','')
        .then(function(data){
          if(data){
            $state.go('.', { step: 3 });
          }
        })
      }
      else{
        vm.saveQuotation = saveQuotation;
        getCoverages(vm.formData[1].producto.codeProduct, vm.formData[1].producto.codeSubProduct, vm.formData[1].producto.codeModality, vm.formData[1].producto.codePlan, vm.formData[1].producto.namePlan);

        getEncuesta();
      }
    }

    function getEncuesta(){
      var codCia = constants.module.polizas.segurviaje.companyCode;
      var codeRamo = 670;

      proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
        if(response.OperationCode == constants.operationCode.success){
          if (Object.keys(response.Data.Pregunta).length > 0){
            $scope.encuesta = response.Data;
            $scope.encuesta.CodigoCompania = codCia;
            $scope.encuesta.CodigoRamo = codeRamo;
          }else{
            $scope.encuesta = {};
            $scope.encuesta.mostrar = 0;
          }
        }
      }, function(error){
        console.log('Error en getEncuesta: ' + error);
      })
    }

    // Metodo que convoca el listado de coverturas, dada la informacion del producto
    function getCoverages(codeProduct, codeSubProduct, codeModality, codePlan, namePlan){
      seguroviajeService.getCoverages(codeProduct, codeSubProduct, codeModality, codePlan, true)
      .then(function(response){
        if(response.operationCode == 200){
          vm.coverturas = response.data.sort(seguroviajeFactory.compareValues('mca_Principal', 'desc'));
          $rootScope.$broadcast('coverturas', {
            coverturas : vm.coverturas,
            nameProduct : vm.formData[1].producto.nameProduct,
            prima : vm.formData[2].prima,
            namePlan: namePlan
          })
        }
      })
    }
    // Metodo que convoca el servicio para guardar la cotización
    function saveQuotation(){
      gaService.add({ gaCategory: 'Emisa - Segurviaje', gaAction: 'MPF - Cotización', gaLabel: 'Botón: Cotizar' });
      seguroviajeService.saveQuotation(seguroviajeFactory.setQuotationBody(vm.formData), true)
      .then(function(response){
        if(response.operationCode == 200){
          mModalAlert.showSuccess('Se ha guardado la cotización satisfactoriamente.', 'Cotización')
          .then(function(data){
            if(data){
              seguroviajeFactory.setNewFormData({});
              seguroviajeFactory.saveBonusCopy({});
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = response.data;
                $state.go('seguroviajeGuardada', {numeroDoc : response.data, encuesta: $scope.encuesta});
              }else{
                $state.go('seguroviajeGuardada', {numeroDoc : response.data});
              }
            }
          })
        }
        else{
          mModalAlert.showWarning('Error en el proceso de cotización, comunicarse con un ejecutivo Mapfre','ERROR')
        }
      })
    }
  }

  return ng.module('appSeguroviaje')
  .controller('SeguroviajeCotizarStepFourController', SeguroviajeCotizarStepFourController)
  .component('seguroviajeCotizarStepFourComponent', {
    templateUrl: '/polizas/app/seguroviaje/cotizar/steps/stepFour/seguroviaje-cotizar-p4.html',
    controller: 'SeguroviajeCotizarStepFourController as vm',
    binding: {}
  })
});
