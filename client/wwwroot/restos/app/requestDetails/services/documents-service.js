'use strict';

define(['angular', 'constants'],
  function(ng) {
    documentsService.$inject = ['$http', 'httpData'];

    function documentsService($http, httpData) {

      var baseUrl = constants.system.api.endpoints.restos;

      return {
        getAllowedDocuments: function() {
          var url = baseUrl + 'wsRGrvMantenimiento.svc/docuRequeridosPorRol';
          return $http({
            method: 'GET',
            url: url
          }).then(function(res) {
            return res.data;
          });
        },
        downloadDocument: function(docType, idRequest) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/administrar_documentos/';
          return httpData.post(
            url,
            {
              TIPO_OPE: 'D',
              CSLCTD: idRequest,
              COD_TIPO: docType
            },
            undefined,
            true
          );
        },
        uploadDocument: function(content, docName, docType, idRequest) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/administrar_documentos/';
          return httpData.post(
            url,
            {
              TIPO_OPE: 'C',
              ARCHIVO: docName,
              CSLCTD: +idRequest,
              COD_TIPO: +docType,
              ArchivoBase64: content
            },
            undefined,
            true
          );
        }
      };

    }

    return ng.module('appRestos')
      .service('documentsService', documentsService);
  }
);
