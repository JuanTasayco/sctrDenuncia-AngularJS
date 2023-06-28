'use strict'

define([
  'angular', 'constants'
], function(angular, constants) {

  var appControls = angular.module('mapfre.controls');
  appControls.factory('ubigeoFactory', ['$http', '$q', function($http, $q) {

    var base = constants.system.api.endpoints.policy;

    function getDepartamentos() {
      var deferred = $q.defer();
      $http({
          method : 'GET',
          url : base + 'api/general/ubigeo/departamento',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          deferred.reject(error.statusText);
        }
      );
      return deferred.promise;
    }

    function getProvincias(idDepartamento) {
      var deferred = $q.defer();
      $http({
          method : 'GET',
          url : base + 'api/general/ubigeo/provincia/' + idDepartamento,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          deferred.reject(error.statusText);
        }
      );
      return deferred.promise;
    }

    function getDistritos(idProvincia) {
      var deferred = $q.defer();
      $http({
          method : 'GET',
          url : base + 'api/general/ubigeo/distrito/' + idProvincia,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          deferred.reject(error.statusText);
        }
      );
      return deferred.promise;
    }

    return{
      getDepartamentos: getDepartamentos,
      getProvincias: getProvincias,
      getDistritos: getDistritos
    };
  }]);
});
