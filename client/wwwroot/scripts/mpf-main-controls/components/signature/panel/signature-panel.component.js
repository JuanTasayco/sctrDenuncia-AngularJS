'use strict';

/**
  @param:
**/

define(['angular', 'signature-panel.factory'], function (ng) {
  SignaturePanelController.$inject = [ 'mModalAlert', 'proxyPolicies', 'signaturePanelFactory'];
  function SignaturePanelController(mModalAlert, proxyPolicies, signaturePanelFactory) {

    var ctrl = this;
    ctrl.showSignaturePad = false;
    ctrl.successSign = false;

    ctrl.$onInit = function () { }

    ctrl.$postLink = function () {
      setTimeout(function() {
        ctrl.verifySigned();
      }, 500);
    }

    ctrl.$onDestroy = function () { }

    ctrl.saveSignature = function (data) {
      if (!data) { return; }
      var dataClean = data.split(',');
      var params = JSON.parse(ctrl.paramsSignature);
      params.firma = dataClean[1] || data;
      proxyPolicies
      .IntegrateSignature(params, true)
      .then(function(response) {
        if (response) {
          if (response.operationCode == constants.operationCode.success) {
            ctrl.showSignaturePad = false;
            ctrl.successSign = true;
          } else {
            mModalAlert.showError("No se ha podido guardar la firma, intente más tarde", "¡Error al firmar!");
          }
        }
      })
      .catch(function(error) {
        mModalAlert.showError('Error en guardar firma: ' +  (error.data && error.data.message || ''), 'Error');
      });
    }

    // Mostrar PDF
    ctrl.viewQuote = function () {
      
      if (ctrl.successSign) { // firmado
        signaturePanelFactory.generarPDF(constants.system.api.endpoints.mydream + 'api/policies/opendocumentsignature/', ctrl.documentNumber);
      } else {  // sin firmar
        
        var dataDocument = JSON.parse(ctrl.paramsPdf);
        signaturePanelFactory.generarPDF(constants.system.api.endpoints.policy + dataDocument.url + '/', dataDocument.data);
        
      }
    }

    // Verifica si el documento está firmado
    ctrl.verifySigned = function () {
      if (!ctrl.documentNumber) { return; }
      proxyPolicies
      .GetDocumentSignature(ctrl.documentNumber, true)
      .then(function(response) {
        if (response) {
          if (response.operationCode == constants.operationCode.success) {
            ctrl.successSign = response.data.flagFirma;
          } else {
            mModalAlert.showError("No se ha podido verificar la firma, intente más tarde", "¡Error al verificar firma!");
          }
        }
      })
      .catch(function(error) {
        mModalAlert.showError('Error al verificar firma: ' + (error.data && error.data.message || ''), 'Error');
      });
    }
    
  } // end

  return ng
    .module('mapfre.controls')
    .controller('SignaturePanelController', SignaturePanelController)
    .component('signaturePanel', {
      templateUrl: '/scripts/mpf-main-controls/components/signature/panel/signature-panel.html',
      controller: 'SignaturePanelController',
      controllerAs: 'panel',
      bindings: {
        label: '@?',
        text: '@?',
        documentNumber: '@?',
        paramsSignature: '@?',
        paramsPdf: '@?',
        onEnd: '&?',
        baseUrl: '@?'
      }
    });
});
