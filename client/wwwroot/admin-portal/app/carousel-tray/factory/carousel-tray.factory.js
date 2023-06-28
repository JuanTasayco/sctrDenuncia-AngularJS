'use strict';

define(['angular', 'coreConstants', 'lodash', 'carouselTrayUtils', 'endpointsConstants'], function(
  ng,
  coreConstants,
  _,
  carouselTrayUtils,
  endpointsConstants
) {
  CarouselTrayFactory.$inject = ['httpData', '$stateParams'];
  function CarouselTrayFactory(httpData, $stateParams) {
    var domain = endpointsConstants.default;

    return {
      GetListadoCarrusel: GetListadoCarrusel,
      GetParametrosGenerales: GetParametrosGenerales
    };

    function GetListadoCarrusel(queryReq, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/marketing/areaPrivada/carruseles',
          {
            params: _.assign(
              {
                codigoApp: $stateParams.codeApp
              },
              queryReq
            )
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {listaResultados: res.listaResultados.map(carouselTrayUtils.mapCarousel)});
        });
    }

    function GetParametrosGenerales(showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/generales/parametros',
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return ng.toJson(res);
        });
    }
  } // end factory

  return ng.module(coreConstants.ngCarouselTrayModule, []).factory('CarouselTrayFactory', CarouselTrayFactory);
});
