'use strict';

define(['angular', 'constants', 'helper', 'decesoFactory', 'modalSendEmail'], function(
  angular, constants, helper) {

  cotizacionGuardadaDecesoController.$inject = [
    '$scope', '$window', '$state', '$uibModal', 'mModalAlert', 'mainServices', 'decesoFactory', '$stateParams', 'oimAbstractFactory', 'mpSpin', 'decesoAuthorize'
  ];

  function cotizacionGuardadaDecesoController($scope, $window, $state, $uibModal, mModalAlert, mainServices, decesoFactory, $stateParams, oimAbstractFactory, mpSpin, decesoAuthorize) {
    var vm = this;
    $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;

    $scope.validate = function(itemName){
          return decesoAuthorize.menuItem($scope.codeModule, itemName);
    }

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
      decesoFactory.ObtenerCotizacion(numDoc, true).then(function(res) {
        if (res.OperationCode === 200) {
          $scope.saludQuotation = res.Data;
          $scope.numQuotation = $scope.saludQuotation.NumeroCotizacion;
          $scope.asegurados = $scope.saludQuotation.Asegurados;
          $scope.contratante = $scope.saludQuotation.Contratante;
          $scope.cuotas = $scope.saludQuotation.Cuotas;
          $scope.primaListFirstTable = $scope.saludQuotation.Primas;
          $scope.paso = $scope.saludQuotation.Paso;
          $scope.paramsSignature = $scope.getParamsSignature();
          $scope.paramsPdf = $scope.getParamsPdf();
        } else {
          console.log("error");
        }
      })
    }

    function eventInfo(){
      mModalAlert.showInfo('', 'Debe ingresar un asegurado');
    }

    $scope.onSeeDetail = function() {
      //saludFactory.seeDetailsProduct($scope.productCode, $scope.planCode);
    };

    $scope.quoteNewPolicy = function() {
      $state.go('cotizadorDeceso', {reload: true, inherit: false});
    };

    $scope.reporteCotizacion = function () {
      var vFileName = 'OIM_COTIZACION_DECESO_' + $stateParams.numDoc + '.pdf';
      mpSpin.start();
      decesoFactory.DescargarCotizacion($stateParams.numDoc, false).then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          mainServices.fnDownloadFileBase64(response.Data.FileBase64, 'pdf', 'OIM_COTIZACION_DECESO_' + response.Data.FileName + '.pdf', false);
          mpSpin.end();
        }
      }, function(error){
        mpSpin.end();
        mModalAlert.showError("Error al descargar el documento", 'ERROR');
      }, function(defaultError){
        mpSpin.end();
        mModalAlert.showError("Error al descargar el documento", 'ERROR');
      });;
    };
    
    $scope.irEmision = function () {
      $state.go('decesoEmision.steps', {
        quotationNumber: $stateParams.numDoc, step: 1
      });
    };

    $scope.sendEmail = function(){
      $scope.emailData = {
        reporteParam: {
          CodigoDocumento: $stateParams.numDoc
        }
      };
      decesoFactory.SendMailCotizacionDeceso($scope.emailData, true).then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          mModalAlert.showSuccess('Se envio el correo con éxito', 'Éxito');
        }
      }, function(error){
        mModalAlert.showError("Error al enviar  el correo", 'ERROR');
      }, function(defaultError){
        mModalAlert.showError("Error al enviar el correo", 'ERROR');
      });;

      }

      $scope.irASuscripcion = function(){
        $state.go('emisionDecesos.steps', {quotationNumber: $stateParams.numDoc, step: 1});
      }

      //firma
      $scope.getParamsSignature = function () {
        return {
          tipoFirma: 1,
          tipoPoliza: "SALUD",
          numeroRamo: $scope.saludQuotation.Ramo.CodigoRamo,
          numeroCompania: 1,
          numeroModalidad: $scope.saludQuotation.Modalidad.CodigoModalidad,
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
  return angular.module('appDeceso')
    .controller('cotizacionGuardadaDecesoController', cotizacionGuardadaDecesoController)
});
