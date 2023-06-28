'use strict';

define(['angular', 'constants'],
  function(ng) {
    payTaxesService.$inject = ['$http', '$q', 'httpData'];

    function payTaxesService($http, $q, httpData) {

      var baseUrl = constants.system.api.endpoints.restos;

      function postData(serviceUrl, body) {
        var url = baseUrl + serviceUrl;

        return httpData.post(
          url,
          body,
          undefined,
          true
        );
      }

      function uploadPaymentFile(file) {
        var url = baseUrl + 'wsRGrvTransaccional.svc/registrar_impuesto_masivo/';

        return httpData.post(
          url,
          {
            Archivo: file.base64,
            Extension: file.extension
          },
          undefined,
          true
        );

      }

      return {
        uploadPaymentFile: uploadPaymentFile
      };



    }

    return ng.module('appRestos')
      .service('payTaxesService', payTaxesService);
  }
);
