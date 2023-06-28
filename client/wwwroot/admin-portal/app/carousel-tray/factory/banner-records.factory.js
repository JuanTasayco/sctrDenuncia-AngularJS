'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function(
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  BannerRecordsFactory.$inject = ['httpData', '$stateParams'];
  function BannerRecordsFactory(httpData, $stateParams) {
    var domain = endpointsConstants.default;

    return {
      GetListadoBanners: GetListadoBanners
    };

    function GetListadoBanners(queryReq, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/marketing/areaPrivada/bannersall',
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
          return res;
        });
    }
  } // end factory

  return ng.module(coreConstants.ngBannerRecordsModule, []).factory('BannerRecordsFactory', BannerRecordsFactory);
});
