define([
  'angular', 'constants', 'constantsVidaLey', 'modalSendEmail'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('emisionResumenController', EmisionResumenController);

  EmisionResumenController.$inject = ['$state', 'vidaLeyService', '$uibModal', '$scope'];

  function EmisionResumenController($state, vidaLeyService, $uibModal, $scope) {
    var vm = this;
    vm.cotizacion = {};
    vm.getPDFDocument = getPDFDocument;
    vm.sendEmail = EnviarCorreo;
    vm.downloadAll = downloadAll;
    vm.getTotalTrabajadores = GetTotalTrabajadores;
    vm.getTotalPlanilla = GetTotalPlanilla;
    vm.documents = constantsVidaLey.DOCUMENTS;

    vm.base = constants.system.api.endpoints.policy;

    (function load_EmisionResumenController() {
      _getData();
      _getEmision();
    })();


    function _getData() {
      vidaLeyService.getCotizacion($state.params.documentoId, true)
        .then(function (response) {
          vm.cotizacion = response.Data;
          vm.documentData = response.Data;
        });
    }

    function _getEmision() {
      vidaLeyService.getInfoEmisionDocumentoById($state.params.documentoId, true)
        .then(function (response) {
          vm.emitData = response.Data;
        });
    }

    function GetTotalTrabajadores() {
      return vm.documentData && vm.documentData.Riesgos.reduce(function (total, riesgo) { return total + riesgo.CantTrabajadores; }, 0) || 0;
    }

    function GetTotalPlanilla() {
      return vm.documentData && vm.documentData.Riesgos.reduce(function (total, riesgo) {
        if (riesgo.ImportePlanilla) {
          return total + riesgo.ImportePlanilla;
        }
        if (riesgo.ImportePlanillaReal) {
          return total + riesgo.ImportePlanillaReal;
        }
        return total + riesgo.ImpPlanilla;
      }, 0) || 0;
    }

    function getPDFDocument(tipooperacion) {

      vidaLeyService.getDocument(vm.base + 'api/vidaley/emision/' + $state.params.documentoId + '/archivo?tipooperacion=' + tipooperacion);
    }

    function downloadAll() {

      vidaLeyService.getZIPDocument(vm.base + 'api/vidaley/emision/' + $state.params.documentoId + '/archivo');
    }

    function EnviarCorreo() {
      var info = vm.cotizacion.Principal;
      $scope.emailData = {
        "emisionVidaLey": true,
        "asunto": "Póliza emitida vida ley, NRO: " + vm.emitData.NumeroPoliza,
        "reporteParam": {
          "numDoc": vm.cotizacion.Principal.NumDoc,
          "cotizacion": vm.cotizacion
        },
        "archivos": [
          {name: "RECIBO", checked: true},
          {name: "POLIZA", checked: true},
          {name: "CONSTANCIA", checked: true},
          {name: "CONDICION", checked: true},
          {name: "CERTIFICADO", checked: true}
        ],
        "documentos":[],
        "disabledAsunto": true
      }

      $scope.action = constants.modalSendEmail.vidaLeyEmision.action;
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mpf-modal-send-email action="action"  data="emailData" close="close()"></mpf-modal-send-email>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
    }


  }

});