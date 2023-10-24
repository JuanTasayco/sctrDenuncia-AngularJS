'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  GeneralAdminMapfreTecuidamosFactory.$inject = ['httpData','mpSpin','$log', '$stateParams', 'CommonFactory', '$q'];
  function GeneralAdminMapfreTecuidamosFactory(httpData, mpSpin, $log, $stateParams, CommonFactory, $q) {
    var domain = endpointsConstants.default;

    return {
      GetSection: GetSection,
      GetParams: GetParams,
      getSectionListContent: getSectionListContent,
      updateSection: updateSection,
      saveCardSection: saveCardSection,
      updateCardSection: updateCardSection,
      deleteCardSection: deleteCardSection,
      UploadImage: UploadImage
    };

    function GetSection(showSpin) {
      return CommonFactory.GetSection(coreConstants.codigoAppMassAdm, 237, showSpin);
    }

    function GetParams(showSpin) {
      return CommonFactory.GetGeneralParams(coreConstants.codigoApp,30, showSpin);
    }

    function getSectionListContent(seccionId, idProducto, codTipo, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido',
          {
            params: _.assign({
              codigoApp: coreConstants.codigoApp,
              idProducto: idProducto,
              codTipo: codTipo
            })
          },
          undefined,
          showSpin
        )
        .then(function (res) {
          res.contenido = _.map(res.contenido, function (p, indice) {
            return {
              dataService: p,
              active: p.activo,
              contentId: p.contenidoId,
              codType: p.codTipo,
              modificationDateLabel: CommonFactory.getFormatDateLong(p.fechaModificacion),
              idProduct: p.idProducto,
              icon: p.icono,
              order: p.orden,
              lastModification: p.ultimaModificacion,
              orderUp: indice === 0 ? false: true,
              orderDown: indice === (res.contenido.length-1) ? false: true,
            }
          })
          return _.assign(res);
        });
    }

    function updateSection( seccionId, idProducto, body, codTipo, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId,
          body,
          {
            params: _.assign({
              codigoApp: coreConstants.codigoApp,
              idProducto: idProducto,
              codTipo: codTipo
            })
          },
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function updateCardSection(seccionId, idProducto, contenidoId, body, codTipo, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/'+contenidoId,
          body,
          {
            params: _.assign({
              codigoApp: coreConstants.codigoApp,
              idProducto: idProducto,
              codTipo: codTipo
            })
          },
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function saveCardSection(seccionId, idProducto, body, codTipo, showSpin) {
      return httpData
        .post(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/',
          body,
          {
            params: _.assign({
              codigoApp: coreConstants.codigoApp,
              idProducto: idProducto,
              codTipo: codTipo
            })
          },
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function deleteCardSection( seccionId, idProducto, contenidoId, showSpin) {
      return httpData
        .delete(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/'+contenidoId,
          {
            params: _.assign({
              codigoApp: coreConstants.codigoApp,
              idProducto: idProducto,
            })
          },
          undefined,
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function UploadImage(file) {
      var apiPath = domain + 'api/v1/cms/marketing/areaPrivada/banners/subidaImagen';
      var params = {imagen: file};
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

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

  return ng.module(coreConstants.ngGeneralAdminMapfreTecuidamosModule, []).factory('GeneralAdminMapfreTecuidamosFactory', GeneralAdminMapfreTecuidamosFactory);
});
