"use strict";

define(["angular", "constants"], function(angular, constants) {
  angular.module("appAutos").factory("autosCotizarFactory", [
    "$http",
    "$q",
    "$window",
    "proxyProducto",
    "proxyAutomovil",
    "proxyGeneral",
    'proxyClaims',
    'httpData',
    function($http, $q, $window, proxyProducto, proxyAutomovil, proxyGeneral, proxyClaims, httpData) {
      var base = constants.system.api.endpoints.policy;
      var base2 = constants.system.api.endpoints.security;

      function concatenateUrl(params) {
        var url = "";
        angular.forEach(params, function(value, key) {
          url += "/" + value;
        });
        url ? url : (url = "/");
        return url;
      }

      function getData(url, params) {
        var newUrl = "";
        if (params !== "") {
          newUrl = url + concatenateUrl(params);
        }
        newUrl = url;
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: base + newUrl,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      }

      function getData2(url, params) {
        var newUrl = url + concatenateUrl(params);
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: base2 + newUrl,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      }

      function postData(url, params) {
        var deferred = $q.defer();
        $http({
          method: "POST",
          url: base + url,
          data: params,
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(response) {
            deferred.reject(response);
          });
        return deferred.promise;
      }

      function getMarcaModelo(params) {
        var base = constants.system.api.endpoints.policy;
        var deferred = $q.defer();
        $http({
          method: "POST",
          url: base + "api/automovil/marcamodelo",
          data: params,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          deferred.resolve(response.data);
        });

        return deferred.promise;
      }

      function getSubmodelo(params) {
        return getData("api/automovil/submodelo/" + constants.module.polizas.autos.companyCode + params, "");
      }

      function getYearFabric(params) {
        return getData("api/automovil/anofabricacion/" + params, "");
      }

      function getObservacion(params) {
        return getData("api/automovil/gps/" + params, "");
      }

      function getValorVehiculo(params) {
        return getData("api/automovil/valorsugerido/" + constants.module.polizas.autos.companyCode + params, "");
      }

      function getProductsXMarca(params) {
        return getData("api/producto/marca/" + params, "");
      }

      function getProducts(params) {
        return proxyProducto.getListProductoPorVehiculo(params, true);
      }

      function getProductsRel(params) {
        return getData("api/producto/relacionado/" + params, "");
      }

      function getTypesUse(params) {
        return getData("api/automovil/tipouso/" + constants.module.polizas.autos.codeRamo + params, "");
      }

      function getMapfreDolares(params) {
        return getData("api/contratante/tercero/" + constants.module.polizas.autos.companyCode + params, "");
      }
      function getContratante(params) {
        return getData("api/contratante/multiempresa/" + params.tipo + "/" + params.numero, "");
      }

      function getPolizaGrupoNombre(params) {
        return getData("api/automovil/poliza/" + params, "");
      }

      function validarExcepcion(params) {
        return postData("api/automovil/validar/excepcion", params);
      }

      function calcularPrima(params) {
        return postData("api/cotizacion/calcularprima2/vehiculo", params);
      }

      function calcularPrimaProducto(params) {
        return postData("api/cotizacion/cotizar/vehiculo", params);
      }

      function grabarVehiculo(params) {
        const pathParams = {
          opcMenu: localStorage.getItem('currentBreadcrumb')
          };
          const urlRequest = base + "api/cotizacion/grabar/vehiculo"+'?COD_OBJETO=4&OPC_MENU='+pathParams.opcMenu;
        return httpData.post(
						urlRequest,
						params,
            undefined,
            true
					);
      }

      function getAgente(params) {
        return getData("api/agente/buscar?codigoNombre=" + params, "");
      }

      function getClaims() {
        return proxyClaims.GetClaims();
      }

      function getDescComision(params) {
        return postData("api/automovil/descuento/comision", params);
      }

      function getDatosAutoCCCPorToken(params) {
        return getData("api/poliza/token/" + params);
      }

      var addVariableSession = function(key, newObj) {
        var mydata = newObj;
        $window.sessionStorage.setItem(key, JSON.stringify(mydata));
      };

      var getVariableSession = function(key) {
        var mydata = $window.sessionStorage.getItem(key);
        if (mydata) {
          mydata = JSON.parse(mydata);
        }
        return mydata || [];
      };

      var eliminarVariableSession = function(key) {
        $window.sessionStorage.removeItem(key);
      };

      function getListTypeProducto() {
        return proxyProducto.getListTypeProducto();
      }

      function formatearFecha(fecha) {
        if (fecha instanceof Date) {
          var today = fecha;
          var dd = today.getDate();
          var mm = today.getMonth() + 1; //January is 0!

          if (dd === 32) {
            dd = 1;
            mm = today.getMonth() + 2;
          }

          if (dd < 10) {
            dd = "0" + dd;
          }
          if (mm < 10) {
            mm = "0" + mm;
          }

          var yyyy = today.getFullYear();
          return (today = dd + "/" + mm + "/" + yyyy);
        }
      }

      function getTipoVehiculo() {
        return proxyAutomovil.GetListTipoVehiculo(constants.module.polizas.autos.companyCode, false);
      }

      function obtenerDctontegralidad(codigoCompania, codigoAgente, codigoRamo, tipoDocumento, numeroDocumento) {
        return proxyGeneral.ObtenerDescuentoIntegralidad(
          codigoCompania,
          codigoAgente,
          codigoRamo,
          tipoDocumento,
          numeroDocumento,
          true
        );
      }

      return {
        getMarcaModelo: getMarcaModelo,
        getSubmodelo: getSubmodelo,
        getYearFabric: getYearFabric,
        getObservacion: getObservacion,
        getValorVehiculo: getValorVehiculo,
        getProductsXMarca: getProductsXMarca,
        getProducts: getProducts,
        getProductsRel: getProductsRel,
        getTypesUse: getTypesUse,
        getMapfreDolares: getMapfreDolares,
        getContratante: getContratante,
        getPolizaGrupoNombre: getPolizaGrupoNombre,
        validarExcepcion: validarExcepcion,
        calcularPrima: calcularPrima,
        calcularPrimaProducto: calcularPrimaProducto,
        grabarVehiculo: grabarVehiculo,
        getAgente: getAgente,
        getClaims: getClaims,
        getDescComision: getDescComision,
        addVariableSession: addVariableSession,
        getVariableSession: getVariableSession,
        eliminarVariableSession: eliminarVariableSession,
        getListTypeProducto: getListTypeProducto,
        formatearFecha: formatearFecha,
        getTipoVehiculo: getTipoVehiculo,
        getDatosAutoCCCPorToken: getDatosAutoCCCPorToken,
        obtenerDctontegralidad: obtenerDctontegralidad
      };
    }
  ]);
});