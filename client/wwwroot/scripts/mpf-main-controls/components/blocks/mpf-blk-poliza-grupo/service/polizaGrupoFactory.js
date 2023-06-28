'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

    var appComponents = angular.module('mapfre.components',[]);
    
    // appComponents.factory('ubigeoFactory', ['oimHttpSrv', function(oimHttpSrv){
    appComponents.factory('ubigeoFactory', ['$http', '$q', function($http, $q){
      
      var base = constants.system.api.url;

      function getPolizaGrupo(){
        var deferred = $q.defer();
        $http({
            method : 'GET',
            url : base + 'api/automovil/poliza'
          }).then( function(response) {
            deferred.resolve(response.data);
          }, function (error) {
            deferred.reject(response.statusText);
          }
        );
        return deferred.promise;
      }

      return{
        getPolizaGrupo: getPolizaGrupo
      };

    }]);

});
