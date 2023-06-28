define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appReno')
    .factory('renovacionBandejaService', RenovacionBandejaService);
  RenovacionBandejaService.$inject = ['proxyRenovacionPoliza', 'proxyRenovacionAuto', 'httpData', 'oimProxyRenovacion'];

  function RenovacionBandejaService(proxyRenovacionPoliza, proxyRenovacionAuto, httpData, oimProxyRenovacion) {

    var service = {
      obtenerProcesosPoliza: ObtenerProcesosPoliza,
      obtenerPolizaId: ObtenerPolizaId,
      obtenerParametros: ObtenerParametros,
      procesoPreRenovar: ProcesoPreRenovar,
      procesoRenovar: ProcesoRenovar,
      procesoAnular: ProcesoAnular,
      obtenerAgente: ObtenerAgente,
      obtenerOficina: ObtenerOficina,
      validarCliente: ValidarCliente,
      generarPdf: GenerarPdf,
      generarPdfPreRenovacion: GenerarPdfPreRenovacion,
      enviarCorreoRenovacion: EnviarCorreoRenovacion,
      obtenerParametrosFiltrados: ObtenerParametrosFiltrados,
      enviarCorreoPreRenovacion: EnviarCorreoPreRenovacion,
    };

    return service;
    function ObtenerProcesosPoliza(payload, numeroPagina, cantidadPorPagina, limite) {
      return proxyRenovacionPoliza.BuscarPolizas(payload, numeroPagina, cantidadPorPagina, limite, true);
    }

    function GenerarPdf(documento, polizaID) {
      return proxyRenovacionPoliza.GenerarDocumentoPoliza(documento, polizaID, true);
    }

    function GenerarPdfPreRenovacion(documento, polizaID) {
      return proxyRenovacionPoliza.GenerarDocumentoPreRenovacion(documento, polizaID, true);
    }

    function ObtenerPolizaId(id) {
      return proxyRenovacionPoliza.ConsultarPoliza(id, true);
    }

    function ObtenerParametros() {
      return proxyRenovacionPoliza.ObtenerParametros(true);
    }

    function ObtenerParametrosFiltrados(body) {
      return proxyRenovacionPoliza.ObtenerParametrosFiltrados(body, true);
    }

    function ObtenerAgente(objAgenteBE) {
      if (oimProxyRenovacion.endpoint.includes('oim_renovacionpoliza')) {
        var urlPoliza = oimProxyRenovacion.endpoint.replace('oim_renovacionpoliza', 'oim_polizas')
        return httpData['post'](urlPoliza + 'api/deceso/agente',
          objAgenteBE, undefined, true)
      } else {
        return httpData['post']('http://10.160.120.216/oim_polizas/' + 'api/deceso/agente',
          objAgenteBE, undefined, true)
      }
    }

    function ObtenerOficina(body) {
      if (oimProxyRenovacion.endpoint.includes('oim_renovacionpoliza')) {
        var urlPoliza = oimProxyRenovacion.endpoint.replace('oim_renovacionpoliza', 'oim_polizas')
        return httpData['post'](urlPoliza + 'api/sctr/suscriptor/oficina/listar',
          body, undefined, true)
      } else {
        return httpData['post']('http://10.160.120.216/oim_polizas/' + 'api/sctr/suscriptor/oficina/listar',
          body, undefined, true)
      }
    }

    function ProcesoPreRenovar(body, id) {
      return proxyRenovacionAuto.PreRenovarPoliza(body, id, true);
    }

    function ProcesoRenovar(body, id) {
      return proxyRenovacionAuto.RenovarPoliza(body, id, true);
    }

    function ProcesoAnular(body, id) {
      return proxyRenovacionPoliza.AnularPoliza(body, id, true)
    }

    function ValidarCliente(body) {
      return proxyRenovacionPoliza.CategorizarCliente(body, true);
    }

    function EnviarCorreoRenovacion(body, id) {
      return proxyRenovacionPoliza.NotificarRenovacionPoliza(body, id, true);
    }
    function EnviarCorreoPreRenovacion(body, id) {
      return proxyRenovacionPoliza.NotificarPreRenovacionPoliza(body, id, true);
    }

  }
});
