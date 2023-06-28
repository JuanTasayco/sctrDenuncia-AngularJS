'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appAccidentes = angular.module('appAccidentes');

  // appAccidentes.factory('accidentesFactory', ['$http', '$q', '$window', function($http, $q, $window){
    appAccidentes.factory('accidentesFactory', ['proxyAgente', 'proxyGeneral', 'proxyTipoDocumento', 'proxyContratante', 'proxyClaims', 'proxyAccidente', 'proxyCotizacion', 'proxyEmision', '$http', '$q', '$window','httpData', 'oimProxyPoliza',function(proxyAgente, proxyGeneral, proxyTipoDocumento, proxyContratante, proxyClaims, proxyAccidente, proxyCotizacion, proxyEmision, $http, $q, $window, httpData, oimProxyPoliza){

    // var base = constants.system.api.endpoints.policy;
    // var base2 = constants.system.api.endpoints.security;

    // function concatenateUrl(params){
    //   var url = '';
    //   angular.forEach(params, function(value, key) {
    //     url += '/' + value;
    //   });
    //   url ? url : url = '/';
    //   return url;
    // }

    // function getData(url, params){
    //   var newUrl = url + concatenateUrl(params)
    //   var deferred = $q.defer();
    //   $http({
    //     method : 'GET',
    //     url : base + newUrl,
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then( function(response) {
    //       deferred.resolve(response.data);
    //     }
    //   );
    //   return deferred.promise;
    // }

    // function getData2(url, params){
    //   var newUrl = url + concatenateUrl(params)
    //   var deferred = $q.defer();
    //   $http({
    //     method : 'GET',
    //     url : base2 + newUrl,
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then( function(response) {
    //       deferred.resolve(response.data);
    //     }
    //   );
    //   return deferred.promise;
    // }

    // function postData(url, params){
    //   var deferred = $q.defer();
    //   $http({
    //     method : 'POST',
    //     url : base + url,
    //     data: params,
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then( function(response) {
    //       deferred.resolve(response.data);
    //     }
    //   );
    //   return deferred.promise;
    // }

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

    function formatearFecha(fecha){
      if(fecha!=null){
        var dd = fecha.getDate();
        var mm = fecha.getMonth()+1; //January is 0!

        if(dd === 32){
          dd = 1;
          mm = today.getMonth()+2;
        }

        var yyyy = fecha.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return dd+'/'+mm+'/'+yyyy;
      }
    }

    function getActividades(params, showSpin){
      // return postData('api/accidente/ocupacion/lista', params);
      return proxyAccidente.GetListAutoOcupacion(params, showSpin);
    }

    function getTipoExpo(params, showSpin){
      //return getData('api/Accidente/Exposicion/Listar/0', '');
      return proxyAccidente.GetExposicionListarByCodigoYNombreExposicion(params.CodigoExposicion, '', showSpin);
    }

    function getDocumentTypes(){
      //return getData('/api/general/tipodoc/nacional');
      return proxyTipoDocumento.getTipoDocumento();
    }

    function getClausulas(params, showSpin){
      //return getData('api/Accidente/Clausula/Listar/0', '');
      return proxyAccidente.GetClausulaListarByCodigoNombreClausula(params.CodigoClausula, '', showSpin);
    }

    function getCoberturas(params, showSpin){
      //return getData('api/Accidente/Cobertura/Listar/0', '');
      return proxyAccidente.GetCoberturaListarByCodigoNombreCobertura(params.CodigoCobertura, '', showSpin);
    }

    function getGestor(params, showSpin){
      //return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode, params.codAgente);
      return proxyGeneral.GetGestorOficina(params.codCia, params.codAgente, showSpin);
    }

    function getDatosContratante(params, showSpin){
      //return getData('api/contratante/tercero/' + constants.module.polizas.autos.companyCode + '/' + params.documentType + '/' + params.documentNumber, '');
      return proxyContratante.GetContratanteByNroDocumento(params.codeEnterprise, params.documentType, params.documentNumber, showSpin);
    }

    function getAgente(params, showSpin){
      //return getData('api/agente/buscar?codigoNombre=' + params, '');
      return proxyAgente.buscarAgente(params, showSpin);
    }

    function getClaims(){
      return proxyClaims.GetClaims();
    }

    function cotizarRiesgo(params, showSpin){
      //return postData('api/cotizacion/accidente/cotizar', params);
      return proxyCotizacion.GetCotizacionAccidente(params, showSpin);
    }

    function ListarRiesgoAccidente(nroDoc, showSpin){
      //return postData('api/cotizacion/accidente/cotizar', params);
      return proxyCotizacion.GetRiesgoAccidenteGrabado(nroDoc, showSpin);
    }

    function guardarCotizacion(params, showSpin){
      //return postData('api/cotizacion/accidente/grabar', params);
      const pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
      return httpData.post(
        oimProxyPoliza.endpoint + 'api/cotizacion/grabar/accidente?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
        params, 
        undefined, 
        showSpin
      );
    }

    function getCurrencyTypes(showSpin){
      //return getData('/api/general/tipodoc/nacional');
      return proxyGeneral.GetListTipoMoneda();
    }

    function getFranquicia(params, showSpin){
      return proxyAccidente.GetListFranquicia(params, showSpin);
    }

    function getCurrencyTypes(showSpin){
      //return getData('/api/general/tipodoc/nacional');
      return proxyAccidente.PcCargarPlanillaP4();
    }

    function emitirAccidente(params, showSpin){
      const pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
      return httpData.post(
        oimProxyPoliza.endpoint + 'api/emision/grabar/accidente?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
        params, 
        undefined, 
        showSpin
      );
    }

    function deleteRiesgoCotizacion(paramsRiesgoDel, showSpin){
      return proxyAccidente.DeleteRiesgoCotizacion(paramsRiesgoDel, showSpin);
    }

    function agregarMes(fecha, meses){
      var currentMonth = fecha.getMonth();
      fecha.setMonth(fecha.getMonth() + meses)

      if (fecha.getMonth() != ((currentMonth + meses) % 12)){
          fecha.setDate(0);
      }
      return fecha;
    }

    return {
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      getActividades: getActividades,
      getTipoExpo: getTipoExpo,
      getDocumentTypes: getDocumentTypes,
      getClausulas: getClausulas,
      getCoberturas: getCoberturas,
      formatearFecha: formatearFecha,
      getGestor: getGestor,
      getDatosContratante: getDatosContratante,
      getAgente: getAgente,
      getClaims: getClaims,
      cotizarRiesgo: cotizarRiesgo,
      ListarRiesgoAccidente: ListarRiesgoAccidente,
      guardarCotizacion: guardarCotizacion,
      getCurrencyTypes: getCurrencyTypes,
      getFranquicia: getFranquicia,
      emitirAccidente: emitirAccidente,
      deleteRiesgoCotizacion: deleteRiesgoCotizacion,
      agregarMes: agregarMes

    };
  }]);

  appAccidentes.service('fileAccidentesUpload', ['$http', '$q', 'mpSpin', function ($http, $q, mpSpin) {
    this.uploadAccidentesFileToUrl = function(file, paramsFile){
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("numeroRiesgo", paramsFile.numeroRiesgo);
      fd.append("numeroDocumento", paramsFile.numeroDocumento);
      fd.append("codigoUsuario", paramsFile.codigoUsuario);

      if(file===null) {
       // fd.append("fieldNameHere", null);
      }else{
        fd.append("fieldNameHere", file);
      }

       var deferred = $q.defer();



      $http.post(constants.system.api.endpoints.policy + 'api/accidente/asegurado/cargar', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
                progress: function(c) {
                    console.log('Progress -> ' + c);
                    console.log(c);
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    mpSpin.start();
                    console.log('UploadProgress -> ' + e);
                    console.log(e);
                    console.log('loaded: ' + e);
                    console.log('total: ' + e);
                }
            }
      })
      .success(function(response){
        mpSpin.end();
        deferred.resolve(response);
       // return response;
      })
      .error(function(response){
        mpSpin.end();
        deferred.reject(response);
      });
      mpSpin.end();
      return deferred.promise;
    }

  }]);

});