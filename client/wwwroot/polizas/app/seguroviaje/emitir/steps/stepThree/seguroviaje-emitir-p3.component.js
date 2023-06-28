'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory',
  'seguroviajeService',
  'coveragesComponent'
  ], function(ng, _) {

  SeguroviajeEmitirStepThreeController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    '$rootScope',
    'seguroviajeFactory',
    'seguroviajeService',
    'mModalAlert',
    'proxyGeneral'
  ];

  function SeguroviajeEmitirStepThreeController($scope, $state,$timeout, $rootScope, seguroviajeFactory, seguroviajeService, mModalAlert, proxyGeneral) {
    var vm = this;
    vm.$onInit = onInit;
    function onInit(){
      if(_.isEmpty(seguroviajeFactory.getFormData())){
        $state.go('.', { step : 2 })
      }
      else{
        vm.formData = seguroviajeFactory.getFormData();
        vm.saveEmission = saveEmission;
        getCoverages(vm.formData.product.productCode, vm.formData.product.subProductCode, vm.formData.product.modalityCode, vm.formData.product.planCode);
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

    function getCoverages(codeProduct, codeSubProduct, codeModality, codePlan){
      seguroviajeService.getCoverages(codeProduct, codeSubProduct, codeModality, codePlan, true)
      .then(function(response){
        if(response.operationCode == 200){
          vm.coverturas = response.data;
          $rootScope.$broadcast('coverturas', {
            coverturas : vm.coverturas,
            nameProduct : vm.formData.product.planName,
            prima : vm.formData.separateConcepts.primaTotal,
            namePlan: vm.formData.product.planName
          })
        }
      })
    }
    function saveEmission(object){
      seguroviajeService.saveEmission(seguroviajeFactory.setEmissionBody(object, $state.params.numeroDoc), true)
      .then(function(response){
        if(response.operationCode == 200){
          mModalAlert.showSuccess('Se ha guardado la emisión satisfactoriamente.', 'Emisión')
          .then(function(data){
            if(data){
              seguroviajeFactory.setNewFormData({});
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = response.data.numeroDocumento;
                $state.go('seguroviajeEmitida', { numeroDoc : response.data.numeroDocumento, encuesta: $scope.encuesta})
              }else{
                $state.go('seguroviajeEmitida', { numeroDoc : response.data.numeroDocumento });
              }
            }
          })
        }
        else{
          mModalAlert.showWarning(response.data.descError ? response.data.descError : 'Error en el proceso de emisión, comunicarse con un ejecutivo Mapfre','ERROR')
        }
      })
      .catch(function(err){
        mModalAlert.showWarning('Error en el proceso de emisión, comunicarse con un ejecutivo Mapfre','ERROR')
      })
    }
  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeEmitirStepThreeController', SeguroviajeEmitirStepThreeController)
    .component('seguroviajeEmitirStepThreeComponent', {
      templateUrl: '/polizas/app/seguroviaje/emitir/steps/stepThree/seguroviaje-emitir-p3.html',
      controller: 'SeguroviajeEmitirStepThreeController as vm',
      binding: {}
    })
})
