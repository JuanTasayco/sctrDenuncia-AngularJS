'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  GeneralAdditionalServiceFactory.$inject = ['httpData', '$stateParams', 'CommonFactory'];
  function GeneralAdditionalServiceFactory(httpData, $stateParams, CommonFactory) {
    var domain = endpointsConstants.default;
    var serviceSelected = null;

    return {
      getAdditionalServices : getAdditionalServices,
      setServiceSelected : setServiceSelected,
      getServiceSelected : getServiceSelected,

    };

    function getAdditionalServices() {
      return CommonFactory.GetAdditionalServices(coreConstants.codigoAppMassAdm, true);
    }

    function setServiceSelected (service) {
      serviceSelected = service;
    }

    function getServiceSelected (service) {
      return serviceSelected;
    }

    // function getSectionListContent(codeApp, seccionId, idProducto, showSpin) {
    //   return httpData
    //     .get(
    //       domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido',
    //       {
    //         params: _.assign({
    //           codigoApp: codeApp,
    //           idProducto: idProducto,
    //         })
    //       },
    //       undefined,
    //       showSpin
    //     )
    //     .then(function (res) {
    //       res.contenido = _.map(res.contenido, function (p, indice) {
    //         return {
    //           dataService: p,
    //           active: p.activo,
    //           contentId: p.contenidoId,
    //           modificationDateLabel: CommonFactory.getFormatDateLong(p.fechaModificacion),
    //           idProduct: p.idProducto,
    //           order: p.orden,
    //           lastModification: p.ultimaModificacion,
    //           orderUp: indice === 0 ? false: true,
    //           orderDown: indice === (res.contenido.length-1) ? false: true,
    //         }
    //       })
    //       return _.assign(res);
    //     });
    // }

    // function updateStatusSection(codeApp, seccionId, idProducto, body, showSpin) {
    //   return httpData
    //     .put(
    //       domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId,
    //       body,
    //       {
    //         params: _.assign({
    //           codigoApp: codeApp,
    //           idProducto: idProducto,
    //         })
    //       },
    //       showSpin
    //     )
    //     .then(function (res) {
    //       return _.assign(res);
    //     });
    // }

    // function updateCardSection(codeApp, seccionId, idProducto, contenidoId, body, showSpin) {
    //   return httpData
    //     .put(
    //       domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/'+contenidoId,
    //       body,
    //       {
    //         params: _.assign({
    //           codigoApp: codeApp,
    //           idProducto: idProducto,
    //         })
    //       },
    //       showSpin
    //     )
    //     .then(function (res) {
    //       return _.assign(res);
    //     });
    // }

    // function saveCardSection(codeApp, seccionId, idProducto, body, showSpin) {
    //   return httpData
    //     .post(
    //       domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/',
    //       body,
    //       {
    //         params: _.assign({
    //           codigoApp: codeApp,
    //           idProducto: idProducto,
    //         })
    //       },
    //       showSpin
    //     )
    //     .then(function (res) {
    //       return _.assign(res);
    //     });
    // }

    // function deleteCardSection(codeApp, seccionId, idProducto, contenidoId, showSpin) {
    //   return httpData
    //     .delete(
    //       domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido/'+contenidoId,
    //       {
    //         params: _.assign({
    //           codigoApp: codeApp,
    //           idProducto: idProducto,
    //         })
    //       },
    //       undefined,
    //       showSpin
    //     )
    //     .then(function (res) {
    //       return _.assign(res);
    //     });
    // }

  } // end factory

  return ng.module(coreConstants.ngGeneralAdditionalServiceModule, []).factory('GeneralAdditionalServiceFactory', GeneralAdditionalServiceFactory);
});
