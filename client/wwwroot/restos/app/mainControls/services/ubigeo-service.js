'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appRestos = angular.module('appRestos');

  appRestos.service('ubigeoService', ['$http',
    function($http) {

      var baseUrl = constants.system.api.endpoints.policy + 'api/general/ubigeo/';

      function getData(url) {
        return $http({
          method: 'GET',
          url: url
        }).then(function(response) {
          return response.data;
        });
      }

      function getDepartamentos() {
        var url = baseUrl + 'departamento';
        return getData(url);
      }

      function getProvincias(idDepartamento) {
        var url = baseUrl + 'provincia/' + idDepartamento;
        return getData(url);
      }

      function getDistritos(idProvincia) {
        var url = baseUrl + 'distrito/' + idProvincia;
        return getData(url);
      }

      return {
        getDepartamentos: getDepartamentos,
        getProvincias: getProvincias,
        getDistritos: getDistritos
      };

    }]);

});
