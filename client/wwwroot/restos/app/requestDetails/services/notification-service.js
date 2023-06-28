'use strict';

define(['angular', 'constants'],
  function(ng) {
    notificationService.$inject = ['httpData'];

    function notificationService(httpData) {

      var baseUrl = constants.system.api.endpoints.restos;

      function notify(idRequest, notificationCode) {
        var url = baseUrl + 'wsRGrvTransaccional.svc/enviar_notificaciones/';
        return httpData.post(
          url,
          {
            "CTNTFCCN": notificationCode,
            "CSLCTD": idRequest
          },
          undefined,
          true
        );
      }

      return {
        notifyPickLetter: function(idRequest) {
          return notify(idRequest, 1);
        },
        notifyAuction: function(idRequest) {
          return notify(idRequest, 2);
        },
        notifyInventoryDifferences: function(idRequest) {
          return notify(idRequest, 4);
        }
      };

    }

    return ng.module('appRestos')
      .service('notificationService', notificationService);
  }
);
