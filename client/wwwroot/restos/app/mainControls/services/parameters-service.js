'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appRestos = angular.module('appRestos');

  appRestos.service('parametersService', ['$http',
    function($http) {

      var baseUrl = constants.system.api.endpoints.restos;

      function getParams(group, type) {
        var url = baseUrl + 'wsRGrvMantenimiento.svc/grupoDetalle_combo';

        return $http({
          method: 'GET',
          url: url,
          params: {
            CGRPO: group,
            tipo: type || 1
          }
        }).then(function(response) {
          return response.data;
        });
      }

      return {
        getStates: function() { return getParams(1); },
        getIdTypes: function() { return getParams(2, 2); },
        // getDocumentTypes: function() { return getParams(3); },
        getGenders: function() { return getParams(4, 2); },
        getDamageTypes: function() { return getParams(5); },
        getMaritalStatus: function() { return getParams(6, 2); },
        getCurrencies: function() { return getParams(7); },
        getSteeringWheelTypes: function() { return getParams(15); },
        getTransmissionTypes: function() { return getParams(16); },
        getOrigins: function() { return getParams(17); },
        getEngineTypes: function() { return getParams(18); },
        getWheelDriveTypes: function() { return getParams(19); },
        getColors: function() { return getParams(26); }
      };

    }]);

});
