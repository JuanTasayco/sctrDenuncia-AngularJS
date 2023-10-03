'use strict';

define([
  'angular',
  'coreConstants',
  'endpointsConstants',
  'lodash',
], function(ng, coreConstants, endpointsConstants, _) {
  CommonFactory.$inject = ['$q', '$stateParams', 'httpData', '$log', 'mpSpin'];

  function CommonFactory($q, $stateParams, httpData, $log, mpSpin) {
    var domain = endpointsConstants.default;

    return {
      getFormatDateLong: getFormatDateLong,
      GetDocumentType: GetDocumentType,
      GetSection: GetSection,
      GetAdditionalServices: GetAdditionalServices,
      GetGeneralParams: GetGeneralParams
    };

    function getFormatDateLong(textDate) {
      var currentDate = new Date();
      var newDate = new Date(textDate);
      
      var years = currentDate.getFullYear() - newDate.getFullYear();
      var months = currentDate.getMonth() - newDate.getMonth();
      var days = currentDate.getDate() - newDate.getDate();
      var hours = newDate.getHours();
      var minutes = newDate.getMinutes();
      
      var result = "";
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (days < 0) {
        months--;
        var lastMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
        days += lastMonth.getDate();
      }
      
      if (years != 0) {
        result = years + "a - ";
      }
      if (months != 0) {
        result = result + months + "m - ";
      }
      if (days != 0) {
        result = result + days + "d - ";
      }
      
      return result + hours + ":" + minutes;
    }

    function GetDocumentType(codeApp, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/generales/documentType',
          {
              params: _.assign({
                  codigoApp: codeApp
              })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }


    function GetSection(codeApp, idSection, showSpin,params) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/secciones/grupoSeccion/'+ idSection,
          {
              params: _.assign({params,
                  codigoApp: codeApp
              })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          var array = _.map(res, function(p) {
            return { name: p.descripcion, code: p.seccionId , url: p.seccionId};
          })

          return _.assign(array);
        });
    }

    function GetAdditionalServices(codeApp, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/serviciosFunerarios',
          {},
          undefined,
          showSpin
        )
        .then(function(res) {
          var array = _.map(res, function(p , index) {
            return { 
              id: p.id,
              name: p.nombre, 
              code: p.seccionId , 
              url: '/images/ico-ramos/' + p.icono,
              active: p.activo,
              subServices: p.subServicios,
              selected: index ? false : true
            };
          })

          return _.assign(array);
        });
    }

    function GetGeneralParams(codeApp,codigoGrupo,showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/generales/parametros/'+ codigoGrupo,
          {
            params: _.assign({
              codigoApp: codeApp
            })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return _.map(res, function (p){
            return {
              code: p.valor,
              lbl: p.descripcion
            };
          })
        });
    }
    
  }

  

  return ng.module(coreConstants.ngCommonModule, []).factory('CommonFactory', CommonFactory);
});