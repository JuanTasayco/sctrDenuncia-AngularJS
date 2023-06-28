'use strict';

define(['angular', 'constants'], function(angular, constants) {
  alarmFactory.$inject = ['proxyHogar'];

  function alarmFactory(proxyHogar) {
    var factory = {
      getAlarmType: getAlarmType,
      getComunicationType: getComunicationType,
      getPackageType: getPackageType
    };

    return factory;

    // SERVICES
    function getAlarmType() {
      var codCia = constants.module.polizas.hogar.codeCia;
      var codRamo = constants.module.polizas.hogar.codeRamo;
      return proxyHogar.GetAlarmaMonitoreo(codCia, codRamo);
    }

    function getComunicationType(codModalidad, alertCode) {
      var codCia = constants.module.polizas.hogar.codeCia;
      var codRamo = constants.module.polizas.hogar.codeRamo;
      return proxyHogar.GetComunicationType(codCia, codRamo, codModalidad, alertCode)
    }

    function getPackageType(comunicationTypeId, showSpin) {
      return proxyHogar.GetPackageType(comunicationTypeId, showSpin);
    }
  }

  return angular.module('mapfre.controls').factory('alarmFactory', alarmFactory);
});
