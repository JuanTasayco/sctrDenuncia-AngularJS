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

    return {
      getAdditionalServices : getAdditionalServices,
      updateServiceSection : updateServiceSection,
      getServiceParameters : getServiceParameters,
      getServiceProducto : getServiceProducto,
      updateProduct : updateProduct,
      saveSubServiceRangesAndDate : saveSubServiceRangesAndDate,
      getSubServiceRangesAndDate : getSubServiceRangesAndDate
    };

    function getAdditionalServices() {
      return CommonFactory.GetAdditionalServices(coreConstants.codigoAppMassAdm, true);
    }

    function getSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/camposanto/' + camposantoId + '/servicioFunerario/' + subServiceRangesAndDateId,
          {},
          undefined,
          showSpin
        )
        .then(function (x) {
          x = {
            id: x.servicioId,
            days: _.map(x.dias, function (y) {
              return {
                id: y.id,
                name: y.nombre,
                active: y.activo,
                rangeHours: _.map(y.rangoHorario || [], function (z) {
                  return {
                    initHour: z.horaInicio,
                    endHour: z.horaFin
                  };
                })
              };
            }),
            ceremonyRangeId: x.tiempoCeremoniaId,
            cancellationDays: _.map(x.feriados || [], function (y) {
              return {
                sectorId: y.sectorId,
                date: y.fecha
              };
            })
          };

          return _.assign(x);
        });
    }

    function getServiceParameters(servicioId, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/servicioFunerario/' + servicioId + '/parametros',
          {},
          undefined,
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function getServiceProducto(servicioId, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/servicioFunerario/' + servicioId + '/producto',
          {},
          undefined,
          showSpin
        )
        .then(function (res) {
          var x = {
            title : res.titulo,
            description : res.descripcion,
            detailNotice : res.avisoDetalle,
            images : res.imagenes,
            servicioId : res.servicioId,
            activeNotice : res.avisoActivo,
            modificationDateLabel: CommonFactory.getFormatDateLong(res.fechaModificacion),
            lastModification: res.ultimaModificacion
          }
          return _.assign(x);
        });
    }

    function updateProduct(servicioId, body, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/areaPrivada/servicioFunerario/' + servicioId + '/producto',
          body,
          {},
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function updateServiceSection(servicioId, body, showSpin) {
      return httpData
        .put(
          domain + 'api/v1/cms/areaPrivada/servicioFunerario/' + servicioId,
          body,
          {},
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

    function saveSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId, body, showSpin) {
      return httpData
        .post(
          domain + 'api/v1/cms/areaPrivada/camposanto/'+camposantoId+'/servicioFunerario/'+subServiceRangesAndDateId,
          body,
          {},
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }


  } // end factory

  return ng.module(coreConstants.ngGeneralAdditionalServiceModule, []).factory('GeneralAdditionalServiceFactory', GeneralAdditionalServiceFactory);
});
