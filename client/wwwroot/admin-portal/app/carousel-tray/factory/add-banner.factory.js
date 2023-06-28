'use strict';

define(['angular', 'coreConstants', 'endpointsConstants', 'lodash', 'addBannerUtils'], function(
  ng,
  coreConstants,
  endpointsConstants,
  _,
  addBannerUtils
) {
  AddBannerFactory.$inject = ['$q', 'httpData', '$log', 'mpSpin', '$stateParams'];
  function AddBannerFactory($q, httpData, $log, mpSpin, $stateParams) {
    var domain = endpointsConstants.default;

    return {
      GetOptions: GetOptions,
      UploadImage: UploadImage,
      CreateBanner: CreateBanner,
      UpdateBanner: UpdateBanner,
      GetBannerDetail: GetBannerDetail,
      setForm: setForm,
      getObjFotoDoc: getObjFotoDoc,
      getFotoConB64: getFotoConB64
    };

    function GetOptions(showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/marketing/areaPrivada/carruseles/opcionesBanner',
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return res.map(addBannerUtils.mapBannerOption);
        });
    }

    function UploadImage(file) {
      var apiPath = domain + 'api/v1/cms/marketing/areaPrivada/banners/subidaImagen';
      var params = {imagen: file};
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

    function CreateBanner(bodyReq, showSpin) {
      return httpData
        .post(
          domain + 'api/v1/cms/marketing/areaPrivada/banners',
          bodyReq,
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

    function UpdateBanner(bodyReq, idCarrusel, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/marketing/areaPrivada/banner',
          bodyReq,
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp,
              idCarrusel: idCarrusel
            })
          },
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }

    function GetBannerDetail(req, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/marketing/areaPrivada/banner/parametros',
          {
            params: _.assign({
              codigoApp: $stateParams.codeApp,
              id: req.idBanner
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return res.map(addBannerUtils.mapBannerOption);
        });
    }

    function setForm() {
      var endDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

      return {
        campaignName: '',
        addressLink: '',
        bannerDescription: '',
        startDate: new Date(),
        endDate: endDate,
        carouselList: [],
        fotosBanners: []
      };
    }

    function getObjFotoDoc(resp, photoData) {
      return {
        nombreFisico: resp.rutaTemporal,
        nombreImagen: photoData.name
      };
    }

    function getFotoConB64(resp, photoData) {
      return _.assign({}, getObjFotoDoc(resp, photoData), {srcImg: photoData.photoBase64});
    }

    // private

    function _buildReqUpload(apiPath, params) {
      var deferred = $q.defer();
      var fd = new FormData();
      var keyParams = _.keys(params);
      _.forEach(keyParams, function pFe(item) {
        fd.append(item, params[item]);
      });
      mpSpin.start();
      httpData
        .post(apiPath, fd, {
          transformRequest: ng.identity,
          headers: {
            'Content-Type': undefined
          },
          uploadEventHandlers: {
            progress: function(ev) {
              $log.log('UploadProgress total: ' + ev.total);
            }
          }
        })
        .then(function(response) {
          mpSpin.end();
          deferred.resolve(response);
        })
        .catch(function ucsErrHttp(err) {
          mpSpin.end();
          $log.error('Falló la carga de fotos', err);
        });

      return deferred.promise;
    }
  } // end factory

  return ng.module(coreConstants.ngAddBannerModule, []).factory('AddBannerFactory', AddBannerFactory);
});
