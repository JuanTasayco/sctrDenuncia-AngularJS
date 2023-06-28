'use strict';

define(['angular', 'constants'],
  function(ng) {
    paymentsService.$inject = ['$http', 'httpData'];

    function paymentsService($http, httpData) {

      var baseUrl = constants.system.api.endpoints.restos;

      function parseData(data) {
        function valuesManipulation(property, value) {
          var propertiesToManipulate = {
            ANIO: parseInt,
            FEC_PAGO: dateToString,
            NRO_VOCHR: pFloat
          };

          function parseInt(value) {
            return +value;
          }

          function pFloat(value) {
            return parseFloat(value);
          }

          function dateToString(date) {
            var dd = ('' + date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate(),
              mm = ('' + date.getMonth()).length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
              yyyy = date.getFullYear();

            return dd + '-' + mm + '-' + yyyy;
          }

          return propertiesToManipulate[property] ? propertiesToManipulate[property](value) : value;
        }

        return Object.keys(data).reduce(function(parsedData, prop) {

          if (!data[prop]) {
            return parsedData;
          }

          parsedData[prop] = valuesManipulation(prop, data[prop]);

          return parsedData;
        }, {});

      }

      return {
        listPayments: function(plateNumber) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/listar_impuestos';
          return $http({
            method: 'GET',
            url: url,
            params: {
              NUM_PLCA: plateNumber
            }
          }).then(function(res) {
            return res.data;
          });
        },
        addPayment: function(data) {
          var url = baseUrl + 'wsRGrvTransaccional.svc/registrar_impuesto/';
          return httpData.post(
            url,
            parseData(data),
            undefined,
            true
          );
        }
      };

    }

    return ng.module('appRestos')
      .service('paymentsService', paymentsService);
  }
);
