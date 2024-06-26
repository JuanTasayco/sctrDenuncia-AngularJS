define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .factory('riesgosGeneralesService', riesgosGeneralesService);

  riesgosGeneralesService.$inject = ['$q', 'proxyCotizacionRg', 'proxyParametro', 'proxyEmisionRg', 'proxyGeneral', '$http', 'mpSpin', 'mainServices'];

  function riesgosGeneralesService($q, proxyCotizacionRg, proxyParametro, proxyEmisionRg, proxyGeneral, $http, mpSpin, mainServices) {
    var service = {
      getProxyProductos: GetProxyProductos,
      getProxyPametros: GetProxyPametros,
      getCurrencyType: GetCurrencyType,
      cargaCotizacion: CargaCotizacion,
      resumen: Resumen,
      cargarTrabajadoresMasivo: CargarTrabajadoresMasivo,
      dowloadPdf: dowloadPdf,
      giroNegocio: giroNegocio,
      emision: emision,
      primas: primas,
      parametroCabecera: ParametroCabecera,
      listParametrobyProducto: ListParametrobyProducto,
      tablaParametrobyProducto: TablaParametrobyProducto,
      tipoDocumento: tipoDocumento,
      tipoDocumental: tipoDocumental,
      fraccionamiento: fraccionamiento,
      sendSuscriptor: sendSuscriptor,
      productosClonados: productosClonados,
      gestionClonacion: gestionClonacion,
      filterCotizacion: filterCotizacion,
      agenteSuscripcion:agenteSuscripcion,
      agente:agente,
      validacionFecha:validacionFecha,
      getRestriccionUbigeo: getRestriccionUbigeo,
      getProxyProductosByUser: getProxyProductosByUser,
      cotizacionError: cotizacionError,
      
    };

    return service;
    function GetProxyProductos() {
      return proxyParametro.getListProductos(true);
    }
    function GetProxyPametros(codProd, codParam) {
      return proxyParametro.getListaParametrosProdPorGrupo(codProd, codParam, true);
    }
    function GetCurrencyType(showSpin) {
      return proxyGeneral.GetListTipoMoneda(showSpin);
    }
    function CargaCotizacion(request, producto) {
      var api;
      if (producto === constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS
        || producto === constantsRiesgosGenerales.GRUPO.DEMOLICIONES
        || producto === constantsRiesgosGenerales.GRUPO.EVENTOS)
        api = proxyCotizacionRg.CotizacionResponsabilidadCivil(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.TREC)
        api = proxyCotizacionRg.CotizacionEquipoContratista(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.HIDROCARBURO)
        api = proxyCotizacionRg.CotizacionTransporteTerrestre(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.CAR || producto === constantsRiesgosGenerales.GRUPO.CARLITE)
        api = proxyCotizacionRg.CotizacionConstruccion(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.VIGLIMP)
        api = proxyCotizacionRg.CotizacionDeshonestidad(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.TRANSPORTE)
        api = proxyCotizacionRg.CotizacionTransporteMaritimoAereo(request, true);
      return api;
    }
    function Resumen(nroTramite, productoGrupo) {
      var api;
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS
        || productoGrupo === constantsRiesgosGenerales.GRUPO.DEMOLICIONES
        || productoGrupo === constantsRiesgosGenerales.GRUPO.EVENTOS)
        api = proxyCotizacionRg.ResumenResponsabilidadCivil(nroTramite, productoGrupo, true);
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.TREC)
        api = proxyCotizacionRg.ResumenEquipoContratista(nroTramite, productoGrupo, true);
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.HIDROCARBURO)
        api = proxyCotizacionRg.ResumenTransporteTerrestre(nroTramite, productoGrupo, true);
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.CAR || productoGrupo === constantsRiesgosGenerales.GRUPO.CARLITE)
        api = proxyCotizacionRg.ResumenCotizacionConstruccion(nroTramite, productoGrupo, true);
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.VIGLIMP)
        api = proxyCotizacionRg.ResumenCotizacionDeshonestidad(nroTramite, productoGrupo, true)
      if (productoGrupo === constantsRiesgosGenerales.GRUPO.TRANSPORTE)
        api = proxyCotizacionRg.ResumenCotizacionTransporteMaritimoAereo(nroTramite,productoGrupo, true)
      return api;
    }

    
    function dowloadPdf(nroTramite, producto, reintentos) {
      var exito = false;
      mpSpin.start();
      $http({
        url: constants.system.api.endpoints.policy + 'api/rrgg/emision/exportar/pdf/' + nroTramite + "/" + producto,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 40000
      }).success(
        function (data, status, headers) {
          exito = true;
          data.Data.forEach(function (element) {
            mainServices.fnDownloadFileBase64(element.MessageResult, 'pdf', element.NombreArchivo, false);
            mpSpin.end();
          });
        },
        function (data, status) {
          exito = true;
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        }).finally(function (){
          if (!exito){
            if (reintentos > 1){
              reintentos = reintentos - 1;
              dowloadPdf(nroTramite, producto, reintentos);
              return;
            }
            mpSpin.end();
          }
        });
    }
    function giroNegocio() {
      return proxyParametro.getListaParametrosGiroNegocio(true);
    }
    function emision(request, producto) {
      var api;
      if (producto === constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS
        || producto === constantsRiesgosGenerales.GRUPO.DEMOLICIONES
        || producto === constantsRiesgosGenerales.GRUPO.EVENTOS)
        api = proxyEmisionRg.EmisionRobotResponsabilidadcivil(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.TREC)
        api = proxyEmisionRg.EmisionRobotEquipoContratista(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.HIDROCARBURO)
        api = proxyEmisionRg.EmisionRobotTransporteTerrestre(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.CAR || producto === constantsRiesgosGenerales.GRUPO.CARLITE)
        api = proxyEmisionRg.EmisionRobotConstruccion(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.VIGLIMP)
        api = proxyEmisionRg.EmisionRobotDeshonestidad(request, true);
      if (producto === constantsRiesgosGenerales.GRUPO.TRANSPORTE)
        api = proxyEmisionRg.EmisionRobotTransporteMaritimoAereo(request, true)
      return api;
    }
    function primas(request) {
      return proxyCotizacionRg.CalculosHidrocarburos(request, true);
    }
    function validacionFecha(fecha, codProducto) {
      codProducto = codProducto || 0;
      return proxyCotizacionRg.ValidarFechaInicial(fecha, codProducto, false);
    }
    function ParametroCabecera(producto) {
      return proxyParametro.getListaParametrosCabePorGrupo(producto, true);
    }
    function ListParametrobyProducto(producto, param) {
      return proxyParametro.getListaParametrosProdPorGrupo(producto, param, true);
    }
    function TablaParametrobyProducto(producto, param, moneda) {
      return proxyParametro.getListaParametrosTablaProdPorGrupo(producto, param, moneda, true)
    }
    function tipoDocumento() {
      return proxyParametro.getListaTipoDocumentoEmision();
    }
    function tipoDocumental() {
      return proxyParametro.getListaTipoDocumentalEmision();
    }
    function fraccionamiento() {
      return proxyParametro.getListaTipoFraccionamiento();
    }
    function productosClonados() {
      return proxyCotizacionRg.getListProductosClonados(true);
    }
    function gestionClonacion(request) {
      return proxyCotizacionRg.ClonacionProducto(request, true);
    }
    function filterCotizacion(request) {
      return proxyCotizacionRg.getListBandeja(request, true);
    }
    function cotizacionError(numeroTramite, request) {
      return proxyCotizacionRg.CotizacionError(numeroTramite, request, true);
    }
    function agenteSuscripcion(codAgente) {
      return proxyParametro.getDevolverAgenteSuscripcion(codAgente,true);
    }
    function agente(codAgente) {
      return proxyParametro.getDevolverAgente(codAgente,true);
    }
    function CargarTrabajadoresMasivo(file,typefile) {
      var deferred = $q.defer();
      var formData = new FormData();
      formData.append("dato", JSON.stringify({ TipoArchivo: typefile }));
      formData.append("fieldNameHere", file);
      var parametros = {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        eventHandlers: {
          progress: function (c) { }
        },
        uploadEventHandlers: {
          progress: function (e) {
            mpSpin.start();
          }
        }
      };
      var urlBase = constants.system.api.endpoints.policy
      $http.post(urlBase + 'api/rrgg/emision/leer-archivo/masiva', formData, parametros)
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        }, function (error) {
          mpSpin.end();
          deferred.reject(error);
        });
      mpSpin.end();
      return deferred.promise;
    }
    function sendSuscriptor(file, request) {
      var deferred = $q.defer();
      var formData = new FormData();
      formData.append("json", JSON.stringify(request));
      if (file) {
        Object.values(file).forEach(function (element, i) {
          formData.append("fieldNameHere" + i, element);
        });
      }
      var parametros = {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        eventHandlers: {
          progress: function (c) { }
        },
        uploadEventHandlers: {
          progress: function (e) {
            mpSpin.start();
          }
        }
      };
      var urlBase = constants.system.api.endpoints.policy
      $http.post(urlBase + 'api/rrgg/emision/suscriptor', formData, parametros)
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        }, function (error) {
          mpSpin.end();
          deferred.reject(error);
        });
      mpSpin.end();
      return deferred.promise;
    }

    function getRestriccionUbigeo(producto, departamento, provincia, distrito) { 
      return proxyParametro.GetRestriccionUbicacion(producto, departamento, provincia, distrito) 
    }

    function getProxyProductosByUser() {
      return proxyParametro.GetListProductosByUser(true);
    }
  }

});
