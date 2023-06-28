'use strict';

define(['angular', 'constants'],
  function(ng) {
    commentsService.$inject = ['$http'];

    function commentsService($http) {

      var baseUrl = constants.system.api.endpoints.restos;

      return {
        addComment: function(comment, idRequest) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/registrar_comentario/';
          return $http({
            method: 'POST',
            url: url,
            data: {
              CMNTRO: comment,
              CSLCTD: idRequest
            }
          }).then(function(res) {
            return res.data;
          });
        }
      };

    }

    return ng.module('appRestos')
      .service('commentsService', commentsService);
  }
);
