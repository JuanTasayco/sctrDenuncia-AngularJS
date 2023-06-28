'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appRestos = angular.module('appRestos');

  appRestos.service('allowedActionsService', ['$http', function($http) {

    var baseUrl = constants.system.api.endpoints.restos;

    function getAllowedActions() {
      var url = baseUrl + 'wsRGrvMantenimiento.svc/accionesPorRol';

      return $http({
        method: 'GET',
        url: url
      }).then(function(response) {
        return response.data;
      });
    }
    return {
      getAllowedActions: getAllowedActions
    };

  }]);

});
