'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  MassesAndResponsesFactory.$inject = ['httpData', '$stateParams','CommonFactory','GeneralAdditionalServiceFactory'];
  function MassesAndResponsesFactory(httpData, $stateParams,CommonFactory,GeneralAdditionalServiceFactory) {
    var domain = endpointsConstants.default;

    var listSubsChangeSubService = [];
    var listComponentsReady = [];

    var serviceSelected = null;
    var subServiceSelected = null;
    var serviceParameters = [];

    return {

      emitComponentsReady : emitComponentsReady,
      subsComponentsReady : subsComponentsReady,

      unsubscribeChangeSubService : unsubscribeChangeSubService,
      emitChangeSubService : emitChangeSubService,
      subsChangeSubService : subsChangeSubService,

      updateServiceSection : updateServiceSection,
      getServiceParameters : getServiceParameters,
      saveSubServiceRangesAndDate : saveSubServiceRangesAndDate,
      getSubServiceRangesAndDate : getSubServiceRangesAndDate,

      setServiceSelected : setServiceSelected,
      getServiceSelected : getServiceSelected,
      setSubServiceSelected : setSubServiceSelected,
      getSubServiceSelected : getSubServiceSelected,
      setServiceParameters : setServiceParameters,
      getCamposantos : getCamposantos,
      getCeremonyRange : getCeremonyRange,
      getSector : getSector,

      getDays : getDays,
      getMonths : getMonths,
      getAnios : getAnios,

    };

    function emitComponentsReady() {
      for (var index = 0; index < listComponentsReady.length; index++) {
        listComponentsReady[index]();
      }
    }

    function subsComponentsReady(fn) {
      listComponentsReady.push(fn);
    }
    
    function unsubscribeChangeSubService() {
      listSubsChangeSubService = [];
    }

    function emitChangeSubService(item) {
      for (var index = 0; index < listSubsChangeSubService.length; index++) {
        listSubsChangeSubService[index](item);
      }
    }

    function subsChangeSubService(fn) {
      listSubsChangeSubService.push(fn);
    }

    function updateServiceSection(seccionId, idProducto, contenidoId, body) {
      return GeneralAdditionalServiceFactory.updateServiceSection(coreConstants.codigoAppMassAdm, seccionId, idProducto, contenidoId , body ,true);
    }

    function getServiceParameters(servicioId) {
      return GeneralAdditionalServiceFactory.getServiceParameters(servicioId, true);
    }

    function saveSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId, body) {
      return GeneralAdditionalServiceFactory.saveSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId, body, true);
    }

    function getSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId) {
      return GeneralAdditionalServiceFactory.getSubServiceRangesAndDate(camposantoId, subServiceRangesAndDateId, true);
    }

    function setServiceSelected (service) {
      serviceSelected = service;
    }

    function getServiceSelected () {
      return serviceSelected;
    }

    function setSubServiceSelected (subService) {
      return subServiceSelected = subService;
    }

    function getSubServiceSelected () {
      return subServiceSelected;
    }

    function setServiceParameters(params) {
      return serviceParameters = params;
    }

    function getCamposantos() {
      return _.map(serviceParameters.campoSanto, function (p, i){
        return {
          code: p.codigo,
          lbl: p.valor
        };
      });
    }

    function getCeremonyRange() {
      return _.map(serviceParameters.tiempoCeremonia, function (p, i){
    return {
          code: p.codigo,
          description: p.valor
        };
      });
    }

    function getSector(campoSantoId) {

      var filters = _.filter(serviceParameters.secciones, function (sector) {
        if (sector.campoSantoId === campoSantoId) {
          return sector;
        }
      });

      return _.map(filters, function (p, i){
        return {
          code: p.codigo,
          name: p.valor
    };
      });

    }

    function getDays(year, month){
      var lastDay = new Date(year, month, 0).getDate();
      var dayOfMonth = [];
      for (var day = 1; day <= lastDay; day++) {
        dayOfMonth.push({code: day, name: day < 10 ? "0" + day : "" + day});
      }
      return dayOfMonth;
    }

    function getMonths(){
      var meses = [
        { code: 1, name: "Enero" },
        { code: 2, name: "Febrero" },
        { code: 3, name: "Marzo" },
        { code: 4, name: "Abril" },
        { code: 5, name: "Mayo" },
        { code: 6, name: "Junio" },
        { code: 7, name: "Julio" },
        { code: 8, name: "Agosto" },
        { code: 9, name: "Septiembre" },
        { code: 10, name: "Octubre" },
        { code: 11, name: "Noviembre" },
        { code: 12, name: "Diciembre" }
      ];

      return meses;
    }

    function getAnios() {
      var year = new Date().getFullYear();
      return [{ code: year, name: year }, { code: year + 1, name: year + 1 }];
    }

  } // end factory

  return ng.module(coreConstants.ngMassesAndResponsesModule, []).factory('MassesAndResponsesFactory', MassesAndResponsesFactory);
});
