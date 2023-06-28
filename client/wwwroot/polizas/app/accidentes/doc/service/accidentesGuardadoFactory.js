'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appAccidentes = angular.module('appAccidentes');

  appAccidentes.factory('accidentesGuardadoFactory', ['$http', '$q', '$window', 'proxyReporte', 'proxyDocumento', 'proxyProducto', 'proxyClaims',
    function($http, $q, $window, proxyReporte, proxyDocumento, proxyProducto, proxyClaims){

    var base = constants.system.api.endpoints.policy;
    var base2 = constants.system.api.endpoints.security;

    function concatenateUrl(params){
      var url = '';
      angular.forEach(params, function(value, key) {
        url += '/' + value;
      });
      url ? url : url = '/';
      // console.log(url);
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

    function postData(url, params){
      var deferred = $q.defer();
      $http({
        method : 'POST',
        url : base + url,
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );
      return deferred.promise;
    }

    function getClaims(){
      return proxyClaims.GetClaims();
    }

    function getGestorOficina(params){
      return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode + '/' + params, '');
    }

    function buscarDocumento(params){
      //return getData('api/documento/documentoBuscar/' + constants.module.polizas.autos.companyCode + '/' + params + '/' + constants.module.polizas.accidentes.codeRamo , '');
      return proxyDocumento.GetDocumentoByNumber(constants.module.polizas.autos.companyCode , params, constants.module.polizas.accidentes.codeRamo, true);
    }

    function getQuotePDF(params){
      proxyReporte.ReporteCotizacionAccidente(params, true);
      // if (params !== '') { URL += '/';}
      // $window.open(base + 'api/documento/descargarPDF/' + constants.module.polizas.autos.companyCode + '/' +  params + '/0/0/0/N');
    }

    var addVariableSession = function(key, newObj) {
      var mydata = newObj;
      $window.sessionStorage.setItem(key, JSON.stringify(mydata));
    };

    var getVariableSession = function(key){
     var mydata = $window.sessionStorage.getItem(key);
      if (mydata) {
        mydata = JSON.parse(mydata);
      }
      return mydata || [];
    };

    var eliminarVariableSession = function(key) {
      $window.sessionStorage.removeItem(key);
    };

    function getCotizaciones(params){
      // return postData('api/accidente/bandeja/listar' , params);
      return postData('api/accidente/bandejapaginado' , params);
    }

    function getProductsByRamo(companyCode, codeRamo, showSpin){
       return proxyProducto.GetListProductoBandejaxCiaRamo(companyCode, codeRamo, showSpin);
    }

    return {
      getClaims: getClaims,
      getGestorOficina: getGestorOficina,
      buscarDocumento: buscarDocumento,
      getQuotePDF:getQuotePDF,
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      getCotizaciones: getCotizaciones,
      getProductsByRamo: getProductsByRamo
    };
  }]);

});

