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
      GetDocumentType: GetDocumentType
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
  }
  return ng.module(coreConstants.ngCommonModule, []).factory('CommonFactory', CommonFactory);
});