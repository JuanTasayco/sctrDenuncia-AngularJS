define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular.module(constants.module.polizas.fola.moduleName).factory('folaCotizadorFactory', FolaCotizadorFactory);

  FolaCotizadorFactory.$inject = ['$http', '$q', '$rootScope', 'oimPrincipal', 'mainServices'];

  function FolaCotizadorFactory($http, $q, $rootScope, oimPrincipal, mainServices) {
    var factory = {
      setClaims: SetClaims,
      setAgenteCotizacion: SetAgenteCotizacion,
      clearCotizacion: ClearCotizacion,
      initCotizacion: InitCotizacion,
      setCotizacion: SetCotizacion,
      formatearFecha: FormatearFecha,
      validControlForm: ValidControlForm,
      getValidParametrosBuscarPersona: GetValidParametrosBuscarPersona,
      auth: {},
      cotizacion: {}
    };

    return factory;

    function SetClaims(claims) {
      factory.auth = claims;
    }
    function ClearCotizacion() {
      factory.cotizacion = {};
    }
    function InitCotizacion() {
      if (!!factory.cotizacion.init) return void 0;
      factory.cotizacion = {
        init: false,
        claims: {},
        poliza: {},
        contratante: {},
        riesgos: []
      };
      _setClaimsCotizacion(factory.auth);
      _setDefaultCotizacionAgente(factory.auth);
    }
    function SetCotizacion(cotizacion) {
      factory.initCotizacion();
      factory.cotizacion.init = true;
    }
    function SetAgenteCotizacion(agente) {
      factory.cotizacion.claims.codigoAgente = agente.codigoAgente;
      factory.cotizacion.poliza.agente.codigoNombre = agente.codigoNombre;
      factory.cotizacion.poliza.agente.codigoAgente = agente.codigoAgente;
    }
    function GetValidParametrosBuscarPersona(tipoDocumento, numeroDocumento, validadores) {
      // var existCexCipPex = factory.getExistCexCipPex(tipoDocumento);
      var documento = numeroDocumento || '';
      return (
        !!documento &&
        !!validadores &&
        (documento.length === validadores.maxNumeroDoc ||
          (documento.length <= validadores.maxNumeroDoc && documento.length >= validadores.minNumeroDoc))
      );
    }
    function FormatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        return (today = ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy);
      }
      return fecha;
    }
    function ValidControlForm(form, controlName) {
      var control = form[controlName];
      return control && control.$error.required && !control.$pristine;
    }
    // utils
    function _setClaimsCotizacion(auth) {
      factory.cotizacion.claims = {
        codigoUsuario: auth && auth.loginUserName,
        rolUsuario: auth && auth.roleCode,
        nombreAgente: auth && auth.agentName,
        codigoAgente: auth && auth.agentID
      };
    }
    function _setDefaultCotizacionAgente(auth) {
      factory.cotizacion.poliza.agente = {
        codigoAgente: auth && auth.agentID,
        codigoNombre: (auth && auth.agentID) + '-' + (auth && auth.agentName)
      };
    }
  }
});
