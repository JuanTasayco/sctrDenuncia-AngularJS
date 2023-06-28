'use strict';

define([
  'angular', 'constants'
], function(angular, constants) {

  var appAutos = angular.module('appAutos');

  appAutos.factory('sctrUploadTasas', ['httpData', function(httpData) {

    function fnConvertFormData(params){
      var fd = new FormData();
      angular.forEach(params, function(value, key) {
        fd.append(key, value);
      });
      return fd;
    }

    function fnServiceUploadPromise(params, showSpin){
      var vConfig = {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      };
      var vParams = fnConvertFormData(params);
      return httpData['post'](
        constants.system.api.endpoints.policy + 'api/sctr/poliza/tasa/cargar',
        vParams,
        vConfig,
        showSpin);
    }

    return {
     uploadFile: fnServiceUploadPromise
    };

  }]);
});
