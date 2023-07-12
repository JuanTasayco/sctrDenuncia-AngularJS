'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  GeneralAdminRamoFactory.$inject = ['httpData', '$stateParams'];
  function GeneralAdminRamoFactory(httpData, $stateParams) {
    var domain = endpointsConstants.default;

    return {
      GetSectionListContent: GetSectionListContent,
      UpdateStatusSection: UpdateStatusSection
    };

    function GetSectionListContent(codeApp, seccionId, idProducto, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId + '/contenido',
          {
            params: _.assign({
              codigoApp: codeApp,
              idProducto: idProducto,
            })
          },
          undefined,
          showSpin
        )
        .then(function (res) {
          res.contenido = _.map(res.contenido, function (p) {
            return {
              active: p.activo,
              contentId: p.contenidoId,
              modificationDate: p.fechaModificacion,
              idProduct: p.idProducto,
              link: p.link,
              internalLink: p.linkInterno,
              order: p.orden,
              title: p.titulo,
              lastModification: p.ultimaModificacion
            };
          })

          return _.assign(res);
        });
    }

    function UpdateStatusSection(codeApp, seccionId, idProducto, body, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/areaPrivada/seccion/' + seccionId,
          body,
          {
            params: _.assign({
              codigoApp: codeApp,
              idProducto: idProducto,
            })
          },
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

  } // end factory

  return ng.module(coreConstants.ngGeneralAdminRamoModule, []).factory('GeneralAdminRamoFactory', GeneralAdminRamoFactory);
});
