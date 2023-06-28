'use strict';

define(['angular', 'constants'],
  function(ng) {
    requestDetailsService.$inject = ['$http', 'httpData'];

    function requestDetailsService($http, httpData) {

      var baseUrl = constants.system.api.endpoints.restos;

      function parseInventory(list) {
        return list.reduce(function(groupedList, item) {
          var groupIndex = item.COD_GRUPO - 1;

          item.MCA_ENTRDA = item.MCA_ENTRDA === 'S';
          item.MCA_SALDA = item.MCA_SALDA === 'S';
          item.MCA_DFRNCIA = item.MCA_DFRNCIA === 'S';

          if (groupedList[groupIndex]) {
            groupedList[groupIndex].items.push(item);
          } else {
            groupedList[groupIndex] = {
              id: item.COD_GRUPO,
              name: item.DESC_GRUPO,
              items: [item]
            };
          }

          return groupedList;
        }, []);
      }

      return {
        getDetails: function(idRequest) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/obtener_solicitud_edit';
          return $http({
            method: 'GET',
            url: url,
            params: {
              CSLCTD: idRequest
            }
          }).then(function(res) {
            res.data.Resultado.Inventario.grupos = parseInventory(res.data.Resultado.Inventario.lista);
            return res.data;
          });
        },

        getHistory: function(idRequest) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/listar_movimientos';
          return $http({
            method: 'GET',
            url: url,
            params: {
              CSLCTD: idRequest
            }
          }).then(function(res) {
            return res.data;
          });
        },

        getAllowedStatesToUpdate: function() {
          var url = baseUrl + 'wsRGrvMantenimiento.svc/estadosModiPorRol';
          return $http({
            method: 'GET',
            url: url
          }).then(function(res) {
            return res.data;
          });
        },

        updateRequest: function(request, newState) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/modificar_solicitud/';
          var data = {
            CSLCTD: request.DatosGenerales.CSLCTD,
            DatosGenerales: request.DatosGenerales,
            Vehiculo: request.Vehiculo
          };

          if (newState) {
            data.DatosGenerales.ESTDO_SLCTD = newState;
          }

          return httpData.post(
            url,
            data,
            undefined,
            true
          );
        },
      };

    }

    return ng.module('appRestos')
      .service('requestDetailsService', requestDetailsService);
  }
);
