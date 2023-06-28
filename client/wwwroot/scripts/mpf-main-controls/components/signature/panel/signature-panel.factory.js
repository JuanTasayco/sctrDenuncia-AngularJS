'use strict';
/* eslint-disable new-cap */

define(['angular'], function(
  ng
) {
  signaturePanelFactory.$inject = [
    '$http',
    'mpSpin',
    'mainServices'
  ];

  function signaturePanelFactory(
    $http,
    mpSpin,
    mainServices
  ) {
   
    var factory = {
      generarPDF: generarPDF
    };

    return ng.extend({}, factory);

    function generarPDF(url, params) {
      var vFileName = 'OIM_COTIZACION_' + params + '.pdf';
      mpSpin.start();
      $http.post(url + params, undefined, { responseType: "arraybuffer" }).success(
        function(data, status, headers) {
          mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
          mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        });
      }

  } // end factory

  return ng.module('mapfre.controls').factory('signaturePanelFactory', signaturePanelFactory);
});
