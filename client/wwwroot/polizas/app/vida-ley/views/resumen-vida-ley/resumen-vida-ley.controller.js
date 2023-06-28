define([
  'angular', 'constants', 'constantsVidaLey', 'modalSendEmail',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('resumenVidaLeyController', ResumenVidaLeyController);

  ResumenVidaLeyController.$inject = ['$scope', '$sce', '$state', '$window', '$uibModal', 'vidaLeyService', 'vidaLeyFactory', 'vidaLeyGeneralFactory', 'mModalConfirm', 'mModalAlert','proxyReferido'];

  function ResumenVidaLeyController($scope, $sce, $state, $window, $uibModal, vidaLeyService, vidaLeyFactory, vidaLeyGeneralFactory, mModalConfirm, mModalAlert,proxyReferido) {
    var vm = this;

    vm.cotizacion = {};
    vm.currency = constantsVidaLey.SIMBOLO_MONEDA;
    vm.excelURL = "";
    vm.hoy = new Date();
    vm.mostrarBotonEditarPoliza = false;
    vm.disabledBotonEmitir = false;
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
    vm.gotToEmit = GotToEmit;
    vm.showModalAceptarEditar = ShowModalAceptarEditar;
    $scope.formData = {};
    $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;

    if ($state.params.encuesta) {
      $scope.encuesta = $state.params.encuesta;
      if ($scope.encuesta.mostrar == 1) {
        mostrarEncuesta();
      }
    }

    (function load_ResumenVidaLeyController() {
      vm.userRoot = vidaLeyFactory.isUserRoot(true);
      _getCotizacion($state.params.documentoId);
      vm.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/vidaley/cotizacion/reporte/' + $state.params.documentoId);
    })();

    function mostrarEncuesta() {
      console.log("$scope.encuesta", $scope.encuesta);
      $scope.encuesta.tipo = 'C';
      $scope.dataConfirmation = {
        save: false,
        valor: 0,
        encuesta: $scope.encuesta
      };
      var vModalConfirmation = $uibModal.open({
        backdrop: 'static', // background de fondo
        keyboard: false,
        scope: $scope,
        // size: 'lg',
        template: '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalConfirmation.result.then(function () {
      }, function () {
      });
    }

    function DownloadPdf() {
      vidaLeyService.getDocument(vm.base + 'api/vidaley/cotizacion/reporte/' + $state.params.documentoId);
    }

    function TotalResumenracionMensual() {
      return vm.cotizacion.Riesgos && vm.cotizacion.Riesgos.reduce(function (importe, riesgo) {
        return importe + riesgo.ImportePlanilla; 
      }, 0) || 0;
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

    function GotToEmit() {
      if($scope.formData.numReferido && !vm.userRoot){
        _validateReferredNumber(false);
        
        setTimeout(function() {
        if($scope.numReferidoIsValid){
          $state.go('emisionPolizaVidaLey.steps', { quotation: vm.cotizacion.Principal.NumDoc, step: 1 })
          }
        }, 1000);
      }
      else{
        $state.go('emisionPolizaVidaLey.steps', { quotation: vm.cotizacion.Principal.NumDoc, step: 1 })
      }  
    }

    function OpenPopupListaAsegurados(riesgo) {
      if (riesgo.McaMasivo === 'N') {
        $scope.data = {
          asegurados: vm.cotizacion.ListaAsegurado.filter(function (asegurado) {
            return asegurado.NumRiesgo === riesgo.NumRiesgo
          })
        };
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
      return $state.href(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: constantsVidaLey.STEPS.COTIZACION.CONTRATANTE }, {
        reload: true,
        inherit: false
      });
    }

    function _validateReferredNumber(onload) {
      if($scope.formData.numReferido){

        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", vm.cotizacion.Principal.CodAgente,vm.userRoot, true)              
        .then(function(response){
            if(response.data == "F1" || response.data == "F2" || response.data == "F3" ){
              if(!onload){mModalAlert.showWarning(response.mensaje, '')}
              $scope.numReferidoIsValid = false;
              $scope.formData.msjReferidoValidate = response.mensaje;
            }
            else{
              $scope.numReferidoIsValid = true;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
    }

    function GetCoberturasRiesgo(riesgo) {
      return vm.cotizacion.Coberturas &&
        vm.cotizacion.Coberturas
          .filter(function (cobertura) {
            return cobertura.NumRiesgo === riesgo.NumRiesgo
          })
          .sort(function (a, b) {
            return a.Flag - b.Flag
          })
          .map(function (cobertura) {
            return cobertura.NomCobertura
          })
          .join(', ');
    }

    function GetTotalTrabajadores() {
      return vm.cotizacion.Riesgos &&
        vm.cotizacion.Riesgos.reduce(function (total, riesgo) {
          return total + riesgo.CantTrabajadores;
        }, 0) || 0;
    }

    function GetTotalPlanilla() {
      return vm.cotizacion.Riesgos &&
        vm.cotizacion.Riesgos.reduce(function (total, riesgo) {
          if (riesgo.ImportePlanilla) {
            return total + riesgo.ImportePlanilla;
          }
          
          if (riesgo.ImportePlanillaReal > riesgo.ImportePlanillaTopado) {
            return total + riesgo.ImportePlanillaTopado;
          } else {
            if (riesgo.ImportePlanillaReal) {
              return total + riesgo.ImportePlanillaReal;
            }
          }
          return total + riesgo.ImpPlanilla;
        }, 0) || 0;
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

    function ShowModalAceptarEditar() {
      mModalConfirm
        .confirmInfo('', '¿Estás seguro de editar la cotización?')
        .then(function () {
          vm.clearCotizacion();
          vidaLeyFactory.setCotizacion(vm.cotizacion, 1);
          $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: 1 });
        }).catch(function () {
        });
    }

    function _getCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.cotizacion = response.Data;
            if(!vm.userRoot){
               _validateReferredNumber(true);
            }
            _validarCotizacionRegistradaDias(vm.cotizacion.Principal.CodEstado, vm.cotizacion.Principal.FecReg);
          }
        });
    }

    function _downloadExcel(numRiesgo) {
      vm.excelURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/vidaley/descarga/' + $state.params.documentoId + '/' + numRiesgo);
      $window.setTimeout(function () {
        document.getElementById('frmDownloadExcel').submit();
      });
    }

    function _validarCotizacionRegistradaDias(estado, fecha) {
      if (estado === constantsVidaLey.COTIZACION_REGISTRADA) {
        var parseFecha = _stringToDate(fecha);
        var restaDias = vm.hoy.getTime() - parseFecha.getTime();
        var redondearRestaDias = Math.round(restaDias / (1000 * 60 * 60 * 24));
        _funcionalidadXdias(redondearRestaDias);
      }
    }

    function _funcionalidadXdias(dias) {
      vm.mostrarBotonEditarPoliza = true;
      if (dias > 30) {
        _showMensajeVigencia();
        vm.disabledBotonEmitir = true;
      }
    }

    function _showMensajeVigencia(){
      mModalAlert.showWarning('', 'Debe actualizar la fecha de vigencia para continuar con la cotización');
    }

    function _stringToDate(stringFecha) {
      var fechaYhora = stringFecha.split(' ');
      var fecha = fechaYhora[0];
      var hora = 'T' + fechaYhora[1] + ':00';

      var fechaSplit = fecha.split('/').reverse().join('-') + hora;
      var parseFecha = new Date(fechaSplit);

      return parseFecha;
    }
  }

});
