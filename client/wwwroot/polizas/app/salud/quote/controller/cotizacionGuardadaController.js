'use strict';

define(['angular', 'constants', 'helper', 'saludFactory', 'modalSendEmail',
'/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
], function(
  angular, constants, helper) {

  cotizacionGuardadaController.$inject = [
    '$scope', '$window', '$state', '$uibModal', 'mModalAlert', 'saludFactory', '$stateParams', 'oimAbstractFactory'
  ];

  function cotizacionGuardadaController($scope, $window, $state, $uibModal, mModalAlert, saludFactory, $stateParams, oimAbstractFactory) {
    var vm = this;

    vm.$onInit = function () {
      $scope.verDetalleStyle = {
        'position': 'absolute',
        'top': '5px',
        'right': '15px',
        'font-size': '13px',
        'text-decoration': 'none'
      };
      $scope.isMyDream = oimAbstractFactory.isMyDream();
      $scope.isMobile = helper.isMobile();

      // Al terminar de firmar
      $scope.onSignature = function (data) { }

      $scope.numeroDocumento = $stateParams.numDoc;
      searchInfo($stateParams.numDoc);

      if($stateParams.encuesta){
        $scope.encuesta = $stateParams.encuesta;
        if($scope.encuesta.mostrar == 1){
          mostrarEncuesta();
        }
      }
    };

    $scope.fnShowAlert3 = eventInfo;

    function mostrarEncuesta(){
      $scope.encuesta.tipo = 'C';
      // $scope.encuesta.CodigoCompania = constants.module.polizas.salud.companyCode;
      // $scope.encuesta.CodigoRamo = constants.module.polizas.salud.codeRamo;
      $scope.dataConfirmation = {
        save:false,
        valor: 0,
        encuesta: $scope.encuesta
      };
      var vModalConfirmation = $uibModal.open({
        backdrop: 'static', // background de fondo
        keyboard: false,
        scope: $scope,
        // size: 'lg',
        template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalConfirmation.result.then(function(){
      },function(){
      });
    }

    function searchInfo(numDoc) {
      saludFactory.getQuotationSalud(numDoc, true).then(function(res) {
        if (res.OperationCode === 200) {
          $scope.saludQuotation = res.Data;
          $scope.numQuotation = $scope.saludQuotation.NumeroCotizacion;
          $scope.asegurados = $scope.saludQuotation.Asegurados;
          $scope.cuotas = $scope.saludQuotation.Cuotas;
          $scope.productCode = $scope.saludQuotation.Producto.CodigoProducto;
          $scope.productName = $scope.saludQuotation.Producto.NombreProducto;
          $scope.planCode = $scope.saludQuotation.Producto.CodigoPlan;
          $scope.primaListFirstTable = $scope.saludQuotation.Primas;
          $scope.primaListSecondTable = $scope.primaListFirstTable.splice(7);
          $scope.paso = $scope.saludQuotation.Paso;
          saludFactory.spliceListPrimas($scope.primaListFirstTable, $scope.primaListSecondTable);

          $scope.paramsSignature = $scope.getParamsSignature();
          $scope.paramsPdf = $scope.getParamsPdf();
        } else {
          console.log("error");
          console.log(res);
        }
      })
    }

    function eventInfo(){
      mModalAlert.showInfo('', 'Debe ingresar un asegurado');
    }

    $scope.onSeeDetail = function() {
      saludFactory.seeDetailsProduct($scope.productCode, $scope.planCode);
    };

    $scope.quoteNewPolicy = function() {
      $state.go('cotizadorSalud', {reload: true, inherit: false});
    };

    $scope.reporteCotizacion = function () {
      var vFileName = 'OIM_COTIZACION_' + $stateParams.numDoc + '.pdf';
      saludFactory.generarPDF($stateParams.numDoc, vFileName);
    };

    $scope.sendEmail = function(){
      $scope.emailData = {
        reporteParam: {
          CodigoDocumento: $stateParams.numDoc
        },
        mensaje: '',
        receptor: '',
        asunto: ''
      };

      //Modal
      $scope.optionSendEmail = constants.modalSendEmail.salud.action;
      var vModalSendEmail = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
          template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
      });
        vModalSendEmail.result.then(function(){
          //Action after CloseButton Modal
        },function(){
          //Action after CancelButton Modal
        });
      //
      }
    $scope.sendEmail2 = function(){
      $scope.emailData = {
        reporteParam: {
          CodigoDocumento: $stateParams.numDoc
        },
        mensaje: '',
        receptor: '',
        asunto: ''
      };

      //Modal
      $scope.optionSendEmail = 'salud2';
      var vModalSendEmail = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
          template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]
      });
        vModalSendEmail.result.then(function(){
          //Action after CloseButton Modal
        },function(){
          //Action after CancelButton Modal
        });
      //
      }
      $scope.irASuscripcion = function(){
        if($scope.saludQuotation.EstadoEmision == "VIGENTE"){
          saludFactory.UpdateDocumentState({
            "NumeroDocumentoEncript": $stateParams.numDoc
          }, true).then( function (res) {
            if (res.OperationCode == 200) {
              $state.go('suscripcionSalud.steps', {quotationNumber: $stateParams.numDoc, step: $scope.paso});
            } else {
              mModalAlert.showError("Error al actualizar estado", 'Error');
            }
          });
        }else{
          $state.go('suscripcionSalud.steps', {quotationNumber: $stateParams.numDoc, step: $scope.paso});
        }
        
      }

      //firma
      $scope.getParamsSignature = function () {
        return {
          tipoFirma: 1,
          tipoPoliza: "SALUD",
          numeroRamo: $scope.saludQuotation.Producto.CodigoRamo,
          numeroCompania: 1,
          numeroModalidad: $scope.saludQuotation.Producto.CodigoModalidad,
          numeroCotizacion: 0,
          numeroPoliza: 0,
          numeroDocumento: $scope.numeroDocumento,
          agrupador: $scope.numQuotation,
          firma: ''
        };
      }

      $scope.getParamsPdf = function () {
        return {
          url: 'api/reporte/salud/cotizacion',
          data: $scope.numeroDocumento
        }
      }

  }
  return angular.module('appSalud')
    .controller('cotizacionGuardadaController', cotizacionGuardadaController)
});
