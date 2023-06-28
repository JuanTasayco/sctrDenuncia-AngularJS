'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appRestos = angular.module('appRestos');

    appRestos.service('statesService', ['$http', function($http) {

      var baseUrl = constants.system.api.endpoints.restos;

      function getStateDetails(stateInfo) {

        switch (stateInfo) {

          case 'Registrado':
          case 1:
            return {
              code: 1,
              description: 'Registrado',
              className: 'gBgcGreen1'
            };

          case 'Ingresado':
          case 2:
            return {
              code: 2,
              description: 'Ingresado',
              className: 'gBgcOrange2'
            };

          case 'Transferido':
          case 3:
            return {
              code: 3,
              description: 'Transferido',
              className: 'gBgcRed3'
            };

          case 'En subasta':
          case 4:
            return {
              code: 4,
              description: 'En subasta',
              className: 'gBgcBlue1'
            };

          case 'Adjudicado':
          case 5:
            return {
              code: 5,
              description: 'Adjudicado',
              className: 'gBgcGreen4'
            };

          case 'Vendido':
          case 6:
            return {
              code: 6,
              description: 'Vendido',
              className: 'gBgcGreen1'
            };

          case 'Terminado':
          case 7:
            return {
              code: 7,
              description: 'Terminado',
              className: 'gBgcGray3'
            };

          case 'Observado':
          case 8:
            return {
              code: 8,
              description: 'Observado',
              className: 'gBgcGreen6'
            };

          default:
            return {
              code: null,
              description: null,
              className: null
            };
        }
      }

      function getAllowedStates() {
        var url = baseUrl + 'wsRGrvMantenimiento.svc/estadosPorRol';

        return $http({
          method: 'GET',
          url: url
        }).then(function(response) {
          return response.data;
        });
      }
      return {
        getStateDetails: getStateDetails,
        getAllowedStates: getAllowedStates
      };

		}]);

});
