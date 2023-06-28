'use strict';

define(['angular', 'coreConstants', 'endpointsConstants', 'lodash', 'carouselModificationUtils'], function(
  ng,
  coreConstants,
  endpointsConstants,
  _,
  carouselModificationUtils
) {
  CarouselModificationFactory.$inject = ['httpData', '$stateParams'];
  function CarouselModificationFactory(httpData, $stateParams) {
    var domain = endpointsConstants.default;

    return {
      GetCarousel: GetCarousel,
      GetBannersExistentes: GetBannersExistentes,
      AssignBanner: AssignBanner,
      UpdateCarousel: UpdateCarousel,
      GetBanners: GetBanners,
      RemoveBanner: RemoveBanner,
      UpdateBanner: UpdateBanner
    };

    function GetCarousel(idCarousel, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/carruseles/' + idCarousel;
      return httpData
        .get(
          domain + path,
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {
            lblActivateBtn: res.activo ? 'DESACTIVAR CARRUSEL' : 'ACTIVAR CARRUSEL',
            listaBanners: res.listaBanners.map(carouselModificationUtils.mapBanner)
          });
        });
    }

    function GetBannersExistentes(queryReq, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/banners/nopaging';
      return httpData
        .get(
          domain + path,
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp,
              busqueda: queryReq.busqueda,
              idCarrusel: queryReq.idCarrusel
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return res;
        });
    }

    function AssignBanner(queryReq, showSpin) {
      return httpData
        .post(
          domain + 'api/v1/cms/marketing/areaPrivada/banner/duplicar',
          {},
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp,
              idCarrusel: queryReq.idCarrusel,
              idBanner: queryReq.idBanner
            })
          },
          showSpin
        )
        .then(function(res) {
          return res;
        });
    }

    function UpdateCarousel(carousel, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/carruseles/' + carousel.idCarrusel;
      return httpData
        .put(
          domain + path,
          carousel,
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp
            })
          },
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }

    function GetBanners(queryReq, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/banners/';
      return httpData
        .get(
          domain + path,
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
          return _.assign(res, {
            lblActivateBtn: res.activo ? 'DESACTIVAR CARRUSEL' : 'ACTIVAR CARRUSEL',
            listaBanners: res.listaBanners.map(carouselModificationUtils.mapBanner)
          });
        });
    }

    function RemoveBanner(idBanner, queryReq, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/banners/' + idBanner;
      return httpData
        .delete(
          domain + path,
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
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }

    function UpdateBanner(bannerList, queryReq, showSpin) {
      var path = 'api/v1/cms/marketing/areaPrivada/banners/';
      return httpData
        .put(
          domain + path,
          bannerList,
          {
            params: _.assign(
              {
                codigoApp: $stateParams.codeApp
              },
              queryReq
            )
          },
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }
  } // end factory

  return ng
    .module(coreConstants.ngCarouselModificationModule, [])
    .factory('CarouselModificationFactory', CarouselModificationFactory);
});
