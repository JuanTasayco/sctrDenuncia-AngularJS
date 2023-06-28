'use strict';

define(['angular', 'constants'],
  function(ng) {
    requestTrayService.$inject = ['httpData', 'mainServices'];

    function requestTrayService(httpData, mainServices) {

      var baseUrl = constants.system.api.endpoints.restos;

      function getData(serviceUrl, params) {
        var url = baseUrl + serviceUrl;

        return httpData.get(
          url,
          {params: params},
          undefined,
          true
        );
      }

      function postData(serviceUrl, body) {
        var url = baseUrl + serviceUrl;

        return httpData.post(
          url,
          body,
          undefined,
          true
        );
      }

      function parseFilters(filters) {

        function valuesManipulation(property, value) {
          var filtersToManipulate = {
            FEC_DESDE: parseDate,
            FEC_HASTA: parseDate
          };

          function parseDate(date) {
            var dd = ('' + date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate(),
              mm = ('' + date.getMonth()).length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
              yyyy = date.getFullYear();

            return dd + '-' + mm + '-' + yyyy;
          }

          return filtersToManipulate[property] ? filtersToManipulate[property](value) : value;
        }

        return Object.keys(filters).reduce(function(parsedFilters, filter) {
          if (!filters[filter]) {
            return parsedFilters;
          }
          var filterValue = valuesManipulation(filter, filters[filter]);
          parsedFilters[filter] = filterValue;

          return parsedFilters;
        }, {});
      }

      function getList(filters, page, itemsPerPage) {

        filters = parseFilters(filters);

        var params = {};
        params.tam = itemsPerPage || 10;
        params.pag = page || 1;

        for (var filter in filters) {
          if (filters.hasOwnProperty(filter) && filters[filter]) {
            params[filter] = filters[filter];
          }
        }

        return getData('wsRGrvTransaccional.svc/listarSolicitudes', params);
      }

      function exportList(filters) {
        filters = parseFilters(filters);
        var params = {};
        params.Parametros = {};
        params.CRPRTE = 4;

        for (var filter in filters) {
          if (filters.hasOwnProperty(filter) && filters[filter]) {
            params.Parametros[filter] = filters[filter];
          }
        }
        
        var pathParams = {
          opcMenu: localStorage.getItem('currentBreadcrumb')
        };
        const dataJsonRequest = JSON.stringify(params);
        const urlRequest = baseUrl + 'wsRGrvTransaccional.svc/generar_reportes' +'/?COD_OBJETO=.&OPC_MENU='+pathParams.opcMenu;
       return httpData.postDownload(
          urlRequest,
          dataJsonRequest,
          { headers: { 'Content-Type': 'application/json'}},
          true
          ).then(function(data){
            const route = data.file.Resultado.Ruta;
                  const regx = /Seguimiento[a-z0-9_.]+/i;
                  const matchName  = route.match(regx);
                  const defaultFileName = matchName[0];
            mainServices.fnDownloadFileBase64(data.file.Resultado.Base64, 'excel', defaultFileName, false);
          });
      }

      return {
        getList: getList,
        exportList: exportList
      };



    }

    return ng.module('appRestos')
      .service('requestTrayService', requestTrayService);
  }
);
