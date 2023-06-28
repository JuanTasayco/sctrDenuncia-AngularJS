'use strict';

define(['angular', 'constants', 'helper', 'saludFactory', 'modalSendEmail'], function(
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
    };

    $scope.fnShowAlert3 = eventInfo;

    function searchInfo(numDoc) {
      saludFactory.ObtenerCotizacionClinicaDigital(numDoc, true).then(function(res) {
        
        if (res.OperationCode == 200 && res.Data && res.Data.NumeroCotizacion ){
          $scope.saludQuotation = res.Data;
          $scope.numQuotation = $scope.saludQuotation.NumeroCotizacion;
          $scope.asegurados = $scope.saludQuotation.Asegurados;
          $scope.cuotas = $scope.saludQuotation.Cuotas;
          $scope.productCode = $scope.saludQuotation.Producto.CodigoProducto;
          $scope.productName = $scope.saludQuotation.Producto.NombreProducto;
          $scope.planCode = $scope.saludQuotation.Producto.CodigoPlan;
          $scope.paso = $scope.saludQuotation.Paso;

          $scope.paramsSignature = $scope.getParamsSignature();
          $scope.paramsPdf = $scope.getParamsPdf();

        }else{
          mModalAlert.showError(res.message, 'No se encontraron datos para este documento');
          $state.go("clinicaDigitalDocuments");
        }
      }).catch(function(err){
        mModalAlert.showError(err.message, 'Error');
      });     
    }
    $scope.irASuscripcion = function(){
      $state.go('emisionClinicDigital.steps', {quotationNumber: $stateParams.numDoc, step: 1});
    }
    function eventInfo(){
      mModalAlert.showInfo('', 'Debe ingresar un asegurado');
    }

    $scope.onSeeDetail = function() {
      saludFactory.seeDetailsProduct($scope.productCode, $scope.planCode);
    };

    $scope.quoteNewPolicy = function() {
      $state.go('cotizadorClinicaDigital', {reload: true, inherit: false});
    };

    $scope.reporteCotizacion = function () {
      var vFileName = 'OIM_COTIZACION_' + $stateParams.numDoc + '.pdf';
      saludFactory.clinicaDigitalGenerarPDF($stateParams.numDoc, vFileName);
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
      $scope.optionSendEmail = 'clinicaDigital';
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
  return angular.module('appClinicaDigital')
    .controller('cotizacionGuardadaController', cotizacionGuardadaController)
});
