define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('emisionAseguradosVidaLeyController', EmisionAseguradosVidaLeyController);

  EmisionAseguradosVidaLeyController.$inject = ['$scope', '$state', '$uibModal', 'mModalConfirm', 'mModalAlert', 'vidaLeyService', 'vidaLeyFactory'];

  function EmisionAseguradosVidaLeyController($scope, $state, $uibModal, mModalConfirm, mModalAlert, vidaLeyService, vidaLeyFactory) {
    var vm = this;

    vm.cotizacion = {};
    vm.categorias = [];
    vm.isMultiriesgo = false;
    vm.currency = constantsVidaLey.SIMBOLO_MONEDA;
    vm.getTotalTrabajadores = GetTotalTrabajadores;
    vm.getTotalPlanilla = GetTotalPlanilla;

    vm.agregarRiesgo = AgregarRiesgo;
    vm.grabarEmision = GrabarEmision;

    (function load_CotizacionAseguradosVidaLeyController() {
      _getCotizacion($state.params.quotation);
      vm.personData = vidaLeyFactory.getStep1Emit();
      vm.riesgos = vidaLeyFactory.getRiesgos();
      vm.mCentroRiesgo = vidaLeyFactory.getRiskCenter()
    })();

    function _getCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if(response.OperationCode === constants.operationCode.success) {
            vm.cotizacion = response.Data;
          }
        });
    }

    function AgregarRiesgo() {
      vidaLeyFactory.agregarRiesgo();
      _setCategoriaRiesgoDefault();
    }

    function GrabarEmision() {
      if(!vm.isEmpty(vm.mCentroRiesgo)){
        vidaLeyFactory.setStep2Emit(vm.mCentroRiesgo);
        vidaLeyService.grabarEmision(constantsVidaLey.STEPS.EMISION.RESULTADOS, vidaLeyFactory.getStep2Emit())
          .then(function (response) {
            if (response.OperationCode !== 500 && response.OperationCode !== 900) {
              _goStepResultados();
            } else {
              mModalAlert.showError(response.Message, "¡Error!")
            }
          })
          .catch(function (error) {
            mModalAlert.showError(error.Message, "¡Error!")
          });
      }
    }

    function _goStepResultados() {
      $state.go(constantsVidaLey.ROUTES.EMISION_RESUMEN.url, { documentoId: $state.params.quotation });
    }

    function GetTotalTrabajadores() {
      return vm.riesgos
        .reduce(function (total, riesgo) { return total + riesgo.CantTrabajadores; }, 0) || 0;
    }

    function GetTotalPlanilla() {
      return vm.riesgos
        .reduce(function (total, riesgo) {
          if (riesgo.ImportePlanilla) {
            return total + riesgo.ImportePlanilla;
          }
          if (riesgo.ImportePlanillaReal > riesgo.ImportePlanillaTopado) {
            return total + riesgo.ImportePlanillaTopado;
          }else {
            if (riesgo.ImportePlanillaReal) {
              return total + riesgo.ImportePlanillaReal;
            }
          }
          return total + riesgo.ImpPlanilla;
          }, 0) || 0;
    }

    vm.isEmpty = function(value) {
      return !value;
    }


  }

});
