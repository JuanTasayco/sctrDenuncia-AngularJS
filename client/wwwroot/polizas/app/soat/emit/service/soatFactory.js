'use strict'

define([
  'angular', 'constants', 'lodash', 'proxyPoliza'
], function(angular, constants, _){

  var appSoat = angular.module('appSoat');

  appSoat.factory('soatFactory', ['$http', '$q', '$window', 'proxyClaims', 'proxySoat', 'proxyProducto', 'httpData', 'proxyEmision', 'proxyAgente',
    function($http, $q, $window, proxyClaims, proxySoat, proxyProducto, httpData, proxyEmision, proxyAgente){

    var base = constants.system.api.endpoints.policy;
    var CODE_RUBRO = {
      TIPO_SERVICIO: 40,
      TURNO: 41,
      RANGO_DELIVERY: 42,
      FORMA_PAGO: 52,
      TIPO__LAMADA: 63,
      TIPO_POLIZA: 111
    };
    var CODE_DELIVERY = 187;
    var anhoActual = (new Date()).getFullYear();
    var ANHOS = _.times(5, function(idx) {
      return {CodItem: anhoActual - idx + '', DesItem: anhoActual - idx + ''};
    });
    var MES = [
      {CodItem: '01', DesItem: 'Enero'},
      {CodItem: '02', DesItem: 'Febrero'},
      {CodItem: '03', DesItem: 'Marzo'},
      {CodItem: '04', DesItem: 'Abril'},
      {CodItem: '05', DesItem: 'Mayo'},
      {CodItem: '06', DesItem: 'Junio'},
      {CodItem: '07', DesItem: 'Julio'},
      {CodItem: '08', DesItem: 'Agosto'},
      {CodItem: '09', DesItem: 'Septiembre'},
      {CodItem: '10', DesItem: 'Octubre'},
      {CodItem: '11', DesItem: 'Noviembre'},
      {CodItem: '12', DesItem: 'Diciembre'}
    ];

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
        }, function (response) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    function getResponse(url){
      var newUrl = url;
      var deferred = $q.defer();
      $http({
        method : 'GET',
        url : base + newUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }, function (response) {
          deferred.reject(response);
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
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          deferred.reject(response);
        }
      ).catch(function(err){
        console.error(err);
        return err;
      });
      return deferred.promise;
    }

    function getFechaDDMMYYYY(fecha){
      if (!fecha) {
        return '';
      }
      var fechaC = fecha;
      var dd = fechaC.getDate();
      var mm = fechaC.getMonth()+1;

      if(dd==32){
        dd = 1;
        mm = fechaC.getMonth()+2;
      }

      var yyyy = fechaC.getFullYear();
      if(dd < 10){
        dd = '0' + dd
      }
      if(mm<10){
        mm = '0' + mm
      }
      return dd+'/'+mm+'/'+yyyy;
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

    function buscarPlacaChasisMotor(params){
      return postData('api/emision/riesgocasco', params);
    }

    function buscarDuplicidad(params){
      return postData('/api/soat/validar/psc', params);
    }

    function getTypesUse(params){
      return getData('api/soat/tipouso/' + constants.module.polizas.autos.companyCode + '/' + constants.module.polizas.soat.codeRamo , params);
    }

    function getTipoVehiculo(params){
      return getData('api/soat/tipovehiculo/' + constants.module.polizas.autos.companyCode , params);
    }

    function getMarcaModelo(params){

      var deferred = $q.defer();
      $http({
        method : 'POST',
        url : base + 'api/soat/marcamodelo',
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

    function getMarca(params){
      return getData('api/soat/marca/' + constants.module.polizas.autos.companyCode , params);
    }

    function getModelo(params){
      return getData('api/soat/modelo/' + constants.module.polizas.autos.companyCode , params);
    }

    function getSubmodelo(params){
      return getData('api/automovil/submodelo/' + constants.module.polizas.autos.companyCode , params);
    }

    function getProducts(params){
      return postData('api/producto/usuario', params);
    }

    function getGroupPolize(params){
      return getData('api/automovil/poliza', params);
    }

    function calcularPrima(params){
      return postData('api/cotizacion/cotizar/soatvehiculo', params);
    }

    function emitirSOAT(params){

      const pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
        };
      const urlRequest = base + 'api/emision/grabar/soat'+'?COD_OBJETO=36&OPC_MENU='+pathParams.opcMenu;
      return httpData.post(
        urlRequest,
        params,
        undefined,
        true
      );
    }

    function getPolizaManual(params){
      return getData('api/soat/polizamanual/' +  params, '');
    }

    function getDatosContratante(params){
      return getData('api/contratante/datos/soat/' + constants.module.polizas.autos.companyCode, params);
    }

    function buscarDocumento(params){
      return getData('api/documento/documentoBuscar/' + constants.module.polizas.autos.companyCode + '/' + params + '/' + constants.module.polizas.soat.codeRamo , '');
    }

    function getObservacion(params){
      return getData('api/automovil/gps/' + params, '');
    }

    function getClaims(){
      return proxyClaims.GetClaims();
    }

    function getTipoCambio(params){
      return postData('api/general/tipocambio', params);
    }

    function getPolizaGrupoByAgent(params){
      return getResponse('api/general/table?field=EMISA_PG_SOAT_' + params);
    }

    function formatearFecha(fecha){
      if(fecha!=null){
        var fechaC = fecha;
        var dd = fechaC.getDate();
        var mm = fechaC.getMonth()+1; //January is 0!

        if(dd==32){
          dd = 1;
          mm = fechaC.getMonth()+2;
        }

        var yyyy = fechaC.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

        return dd + '/' + mm + '/' + yyyy;
      }
    }

    function maxFecha(fecha){
      return new Date(fecha.getTime() + 89*24*60*60*1000);
    }

    function GetListDelivery(params, showSpin) {
      return proxySoat.GetListDelivery(params, showSpin);
    }

    function GetProductDescription(codigoProducto){
      return proxyProducto.GetProductDescription(codigoProducto, false);
    }

    function GetProductPolizaManual(){
      return proxySoat.GetListPolizaManual(false);
    }

    function validarFormatoPlaca(params){
      return proxyEmision.validarFormatoPlaca(params, true);
    }

    function buscarAgente(params, showSpin) {
      return proxyAgente.buscarAgente(params, showSpin);
    }

    function buscarUsuario(params, showSpin) {
      return proxySoat.UsuarioPorNombre(params, showSpin)
    }

    function listarRestricciones(params, showSpin) {
      return proxySoat.Restricciones(params.agent, params.user, params.vehicleType, params.items, params.pages, showSpin);
    }

    function registrarRestriccion(params, showSpin) {
      return proxySoat.RegistrarRestricciones(params, showSpin);
    }

    function editarRestriccion(params, showSpin) {
      return proxySoat.ActualizarRestricciones(params, params.state, showSpin);
    }

    function eliminarRestriccion(params, showSpin) {
      return proxySoat.ActualizarRestricciones(params, 'S', showSpin);
    }

    function listarMensajes(showSpin) {
      return proxySoat.GetMessageSoat(showSpin);
    }

    function editarMensajes(params, user, showSpin) {
      return proxySoat.ActualizarMensajesSoat(params, user, showSpin);
    }

    function getValueString(obj, key) {
      return (obj && obj[key]) || '';
    }

    function validateSearchText(wilcar) {
      return wilcar && wilcar.length >= 3;
    }

    return {
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      buscarPlacaChasisMotor: buscarPlacaChasisMotor,
      buscarDuplicidad: buscarDuplicidad,
      getTypesUse: getTypesUse,
      getTipoVehiculo: getTipoVehiculo,
      getMarca: getMarca,
      getModelo: getModelo,
      getMarcaModelo: getMarcaModelo,
      getSubmodelo: getSubmodelo,
      getProducts: getProducts,
      getGroupPolize: getGroupPolize,
      calcularPrima: calcularPrima,
      getDatosContratante: getDatosContratante,
      emitirSOAT: emitirSOAT,
      buscarDocumento: buscarDocumento,
      getPolizaManual: getPolizaManual,
      getObservacion: getObservacion,
      getClaims: getClaims,
      getTipoCambio: getTipoCambio,
      formatearFecha: formatearFecha,
      getPolizaGrupoByAgent: getPolizaGrupoByAgent,
      maxFecha: maxFecha,
      GetListDelivery: GetListDelivery,
      CODE_RUBRO: CODE_RUBRO,
      ANHOS: ANHOS,
      MES: MES,
      getFechaDDMMYYYY: getFechaDDMMYYYY,
      CODE_DELIVERY: CODE_DELIVERY,
      GetProductDescription: GetProductDescription,
      GetProductPolizaManual: GetProductPolizaManual,
      validarFormatoPlaca: validarFormatoPlaca,

      buscarAgente: buscarAgente,
      buscarUsuario: buscarUsuario,
      listarRestricciones: listarRestricciones,
      registrarRestriccion: registrarRestriccion,
      editarRestriccion: editarRestriccion,
      eliminarRestriccion: eliminarRestriccion,
      listarMensajes: listarMensajes,
      editarMensajes: editarMensajes,
      getValueString: getValueString,
      validateSearchText: validateSearchText
    };
  }]);

});