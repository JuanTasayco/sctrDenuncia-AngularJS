'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appSoat = angular.module('appSoat');

  appSoat.factory('soatGuardadoFactory',
  ['$http', '$q', '$window', 'proxyClaims', 'mModalAlert', 'mpSpin', '$httpParamSerializerJQLike', 'mainServices',
  function($http, $q, $window, proxyClaims, mModalAlert, mpSpin, $httpParamSerializerJQLike, mainServices){

    var base = constants.system.api.endpoints.policy;
    var base2 = constants.system.api.endpoints.security;

    function concatenateUrl(params){
      var url = '';
      angular.forEach(params, function(value, key) {
        url += '/' + value;
      });
      url ? url : url = '/';
      return url;
    }

    function getData(url, params){
      var newUrl = url + concatenateUrl(params)
      var deferred = $q.defer();
      $http({
        method : 'GET',
        url : base + newUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );
      return deferred.promise;
    }

    function getData2(url, params){
      var newUrl = url + concatenateUrl(params)
      var deferred = $q.defer();
      $http({
        method : 'GET',
        url : base2 + newUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );
      return deferred.promise;
    }

    function getClaims(params){
      return proxyClaims.GetClaims();
    }

    function getGestorOficina(params){
      return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode + '/' + params, '');
    }

    function buscarDocumento(params){
      return getData('api/documento/documentoBuscar/' + constants.module.polizas.autos.companyCode + '/' + params + '/' + constants.module.polizas.soat.codeRamo , '');
    }

    function getPDF(params){
      if (params !== '') { URL += '/';}
      $window.open(base + 'api/documento/descargarPDF/' + constants.module.polizas.autos.companyCode + '/' +  params + '/0/0/0/N');
    }

    var addVariableSession = function(key, newObj) {
      var mydata = newObj;
      $window.sessionStorage.setItem(key, JSON.stringify(mydata));
    };

    var getVariableSession = function(key){
     var mydata = $window.sessionStorage.getItem(key);
      if (mydata && mydata !== 'undefined') {
          mydata = JSON.parse(mydata);
      }
      return mydata || [];
    };

    var eliminarVariableSession = function(key) {
      $window.sessionStorage.removeItem(key);
    };
    
    function generarPDF(params, vFileName) {
			mpSpin.start();
      $http({
        url: constants.system.api.endpoints.policy + 'api/reporte/soat/cotizacion',
        method: 'POST',
        data: $httpParamSerializerJQLike({json: JSON.stringify(params)}),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          responseType: 'arraybuffer'
        }
        
      }).success(
        function(data, status, headers) {
          mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
          mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        });
        
		}

    return {
      getClaims: getClaims,
      getGestorOficina: getGestorOficina,
      buscarDocumento: buscarDocumento,
      getPDF:getPDF,
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      generarPDF: generarPDF
    };
  }]);

});
