define([
  'angular', 'constants', 'constantsVidaLey', 'modalSendEmail'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('resumenReporteVidaLeyController', ResumenReporteVidaLeyController);

  ResumenReporteVidaLeyController.$inject = ['$scope', '$sce', '$state', '$window', '$uibModal', 'vidaLeyService', 'vidaLeyFactory', 'vidaLeyGeneralFactory'];

  function ResumenReporteVidaLeyController($scope, $sce, $state, $window, $uibModal, vidaLeyService, vidaLeyFactory, vidaLeyGeneralFactory) {
    var vm = this;

    vm.cotizacion = {};
    vm.infoEmision = {};
    vm.currency = constantsVidaLey.SIMBOLO_MONEDA;
    vm.excelURL = "";
    vm.base = constants.system.api.endpoints.policy;

    vm.downloadPdf = DownloadPdf;
    vm.enviarCorreo = EnviarCorreo;
    vm.totalResumenracionMensual = TotalResumenracionMensual;
    vm.getHrefNuevaCotizacion = GetHrefNuevaCotizacion;
    vm.getCoberturasRiesgo = GetCoberturasRiesgo;
    vm.getTotalTrabajadores = GetTotalTrabajadores;
    vm.getTotalPlanilla = GetTotalPlanilla;
    vm.openPopupListaAsegurados = OpenPopupListaAsegurados;
    vm.getNameFrecuencia = GetNameFrecuencia;
    vm.roundTasa = RoundTasa;
    vm.clearCotizacion = ClearCotizacion;

    (function load_ResumenReporteVidaLeyController() {
      _getCotizacion($state.params.documentoId);
      _getInfoEmision($state.params.documentoId);
      vm.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/vidaley/cotizacion/reporte/' + $state.params.documentoId);
    })();

    function DownloadPdf() {
      vidaLeyService.getDocument(vm.base + 'api/vidaley/cotizacion/reporte/' + $state.params.documentoId);
    }

    function TotalResumenracionMensual() {
      return vm.cotizacion.Riesgos && vm.cotizacion.Riesgos.reduce(function (importe, riesgo) { return importe + riesgo.ImportePlanilla; }, 0) || 0;
    }

    function EnviarCorreo() {
      var info = vm.cotizacion.Principal;
      $scope.emailData = {
        "emisor": "",
        "nombreEmisor": "",
        "reporteParam": {
          "NumeroPoliza": vm.cotizacion.Principal.NumPolizaTemp,
          "numDoc": vm.cotizacion.Principal.NumDoc,
          "cotizacion": vm.cotizacion
        },
        "asunto": info.TipDocCont + ' ' + info.NumDocCont + ' - COTIZACIÓN #' + info.NumCotizacion + ' - ' + info.UsuReg,
        "disabledAsunto": true
      }

      $scope.action = constants.modalSendEmail.vidaLey.action;
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

    function OpenPopupListaAsegurados(riesgo) {
      if (riesgo.McaMasivo === 'N') {
        $scope.data = { asegurados: vm.cotizacion.ListaAsegurado.filter(function (asegurado) { return asegurado.NumRiesgo === riesgo.NumRiesgo }) };
        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          size: 'lg',
          scope: $scope,
          template: '<mpf-popup-asegurados-vida-ley asegurados="data.asegurados" close="close()"></mpf-popup-asegurados-vida-ley>',
          controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
        });
      } else {
        _downloadExcel(riesgo.NumRiesgo)
      }

    }

    function GetHrefNuevaCotizacion() {
      return $state.href(constantsVidaLey.ROUTES.COTIZACION_STEPS, { step: constantsVidaLey.STEPS.COTIZACION.CONTRATANTE }, { reload: true, inherit: false });
    }

    function GetCoberturasRiesgo(riesgo) {
      return vm.cotizacion.Coberturas &&
        vm.cotizacion.Coberturas
          .filter(function (cobertura) { return cobertura.NumRiesgo === riesgo.NumRiesgo })
          .sort(function (a, b) { return a.Flag - b.Flag })
          .map(function (cobertura) {
            return cobertura.NomCobertura
          })
          .join(', ');
    }

    function GetTotalTrabajadores() {
      return vm.cotizacion.Riesgos &&
        vm.cotizacion.Riesgos.reduce(function (total, riesgo) { return total + riesgo.CantTrabajadores; }, 0) || 0;
    }

    function GetTotalPlanilla() {
      return vm.cotizacion.Riesgos &&
        vm.cotizacion.Riesgos.reduce(function (total, riesgo) { return total + riesgo.ImportePlanilla; }, 0) || 0;
    }

    function GetNameFrecuencia() {
      return vm.cotizacion.Principal && vidaLeyFactory.getNameFrecuencia(vm.cotizacion.Principal.FormaPago);
    }

    function RoundTasa(tasa) {
      return vidaLeyGeneralFactory.roundUp(tasa);
    }

    function ClearCotizacion() {
      vidaLeyFactory.clearCotizacion();
    }

    function _getCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.cotizacion = response.Data;
          }
        });
    }

    function _getInfoEmision(documentId) {
      vidaLeyService.getInfoEmisionDocumentoById(documentId)
        .then(function (response) {
          vm.infoEmision = response.Data;
        });
    }

    function _downloadExcel(numRiesgo) {
      vm.excelURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/vidaley/descarga/' + $state.params.documentoId + '/' + numRiesgo);
      $window.setTimeout(function () {
        document.getElementById('frmDownloadExcel').submit();
      });
    }
  }

});
