'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appRestos = angular.module('appRestos');

  appRestos.service('vehicleBrandService', ['$http',
    function($http) {

      var baseUrl = constants.system.api.endpoints.policy + 'api/automovil/';
      var baseUrl2 = constants.system.api.endpoints.restos;

      function getData(url) {
        return $http({
          method: 'GET',
          url: url
        }).then(function(response) {
          return response.data;
        });
      }

      function getBrands() {
        var url = baseUrl + 'marca';
        return getData(url);
      }

      function getModels(idBrand) {
        var url = baseUrl + 'modelo/' + idBrand;
        return getData(url);
      }

      /*
      function getSubmodels(idBrand, idModel) {
        var url = baseUrl + 'submodelo/1/' + idBrand + '/' + idModel;
        return getData(url);
      }
      */

      function getSubmodel(idBrand, idModel, idType) {
        var url = baseUrl2 +  'wsRGrvMantenimiento.svc/subModelo/find/' + idBrand + '/' + idModel + '/' + idType;
        return getData(url);
      }

      function getTypes(idBrand, idModel, idSubmodel) {
        // var url = baseUrl + 'tipovehiculo/1/' + idBrand + '/' + idModel + '/' + idSubmodel;
        var url = baseUrl + 'tipovehiculo/1/';
        return getData(url);
      }

      return {
        getBrands: getBrands,
        getModels: getModels,
        /* getSubmodels: getSubmodels, */
        getSubmodel: getSubmodel,
        getTypes: getTypes
      };

    }]);

});
