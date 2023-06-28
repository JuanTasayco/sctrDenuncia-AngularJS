'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appRestos = angular.module('appRestos');

  appRestos.service('vehicleLocationService', ['$http',
    function($http) {


      return {

        getFreeLocations: function() {
          var url = constants.system.api.endpoints.restos + 'wsRGrvMantenimiento.svc/ubicacion_combo';
          return $http({
            method: 'GET',
            url: url,
            params: {
              CSLCTD: 1
            }
          }).then(function (response) {
            return response.data;
          });
        },

        getFreePositions: function(idLocation) {
          var url = constants.system.api.endpoints.restos + 'wsRGrvMantenimiento.svc/posicion_combo';
          return $http({
            method: 'GET',
            url: url,
            params: {
              CUBCN: idLocation
            }
          }).then(function (response) {
            return response.data;
          });
        }
      };

    }]);

});
