'use strict';

/**
  @param: pen-color: color del trazado. Por defecto #999
  @param: bg-color: color de fondo. Por defecto #FFF
  @param: label: etiqueta, p.e. Firma del Cliente
  @param: imageFormat: formato de la imagen resultante. Puede ser png, svg o jpg/jpeg. Por defecto png
  @param: signatureImage: callback base64 de la imagen
**/

define(['angular'], function (ng) {
  SignatureController.$inject = [];
  function SignatureController() {

    var ctrl = this;

    ctrl.$onInit = function () {
      if (!ctrl.bgColor) { ctrl.bgColor = '#FFF'; }
      if (!ctrl.penColor) { ctrl.penColor = '#000'; }
    }

    ctrl.$postLink = function () {
      ctrl.canvas = document.getElementById('signature-pad');
      ctrl.ctx = ctrl.canvas.getContext('2d');
      ctrl.signaturePad = new SignaturePad(ctrl.canvas, {
        backgroundColor: ctrl.bgColor,
        penColor: ctrl.penColor,
        onEnd: ctrl.onEnd
      });
    };

    ctrl.$onDestroy = function () {
      ctrl.signaturePad.off();
    };

    // Save signature
    ctrl.onAcceptSignature = function () {
      if (ctrl.signatureData) {
        ctrl.signatureImage({ $event: { data: ctrl.signatureData } });
      }
    };

     // Borrar pad
     ctrl.onClearSignature = function () {
      ctrl.signaturePad.clear();
    };

    // Asignar imagen
    ctrl.onEnd = function () {
      var signatureData;
      if (ctrl.imageFormat == 'jpg' || ctrl.imageFormat == 'jpeg') {
        signatureData = ctrl.signaturePad.toDataURL('image/jpeg');
      } else if (ctrl.imageFormat == 'svg') {
        signatureData = ctrl.signaturePad.toDataURL('image/svg+xml');
      } else {
        signatureData = ctrl.signaturePad.toDataURL();
      }
      ctrl.signatureData = signatureData;
    };
  } // end

  return ng
    .module('mapfre.controls')
    .controller('SignatureController', SignatureController)
    .component('signature', {
      templateUrl: '/scripts/mpf-main-controls/components/signature/pad/signature.html',
      controller: 'SignatureController',
      controllerAs: 'signature',
      bindings: {
        label: '@?',
        bgColor: '@?',
        penColor: '@?',
        imageFormat: '@?',
        signatureImage: '&?'
      }
    });
});

