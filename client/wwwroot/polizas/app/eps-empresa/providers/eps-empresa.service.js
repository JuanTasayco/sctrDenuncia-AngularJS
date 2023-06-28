define([
    'angular', 'constants', 'constantsEpsEmpresa'
  ], function (angular, constants, constantsEpsEmpresa) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .factory('epsEmpresaService', EpsEmpresaService);
  
    EpsEmpresaService.$inject = ['proxyEpsEmpresa', 'proxyUbigeo'];
  
    function EpsEmpresaService( proxyEpsEmpresa, proxyUbigeo) {
      var service = {
        getListParametros: GetListParametros,
        getListTarifas: GetListTarifas,
        getListDepartamentos: GetListDepartamentos,
        getListProvincias: GetListProvincias,
        getListDistritos: GetListDistritos,
        getListSolicitudes: GetListSolicitudes,
        addSolicitud: AddSolicitud,
        getBase64PdfSolicitud: GetBase64PdfSolicitud,
        addParametro: AddParametro,
        getParametro: GetParametro,
        putParametro: PutParametro,
        addTarifa: AddTarifa,
        getTarifa: GetTarifa,
        putTarifa: PutTarifa,
        deleteTarifa: DeleteTarifa,
        getEmpresaByRuc: GetEmpresaByRuc,
        parameters: (void 0),
        tarifas: (void 0)
      };
  
      return service;
  
      function GetListParametros(cantidadPorPagina, grupo, numeroPagina) {
        cantidadPorPagina = cantidadPorPagina || 0;
        grupo = grupo || "";
        numeroPagina = numeroPagina || 0;
        var limite = 0;
        //var data = { "cantidadPorPagina": cantidadPorPagina, "grupo": grupo, "numeroPagina": numeroPagina };
        return proxyEpsEmpresa.ObtenerParametros(numeroPagina, cantidadPorPagina, limite, grupo, true);
      }

      function GetListTarifas(cantidadPorPagina, numeroPagina, limite) {
        cantidadPorPagina = cantidadPorPagina || 20;
        numeroPagina = numeroPagina || 1;
        limite = limite || 0;
        //var data = { "cantidadPorPagina": cantidadPorPagina, "numeroPagina": numeroPagina, "limite": limite };
        return proxyEpsEmpresa.ObtenerTarifas(numeroPagina, cantidadPorPagina, limite, true);
      }

      function AddTarifa(request) {
        return proxyEpsEmpresa.CrearTarifa(request, false);
      }

      function GetTarifa(tarifaId) {
        return proxyEpsEmpresa.ObtenerTarifa(tarifaId, true);
      }

      function GetListDepartamentos() {
        return proxyUbigeo.getDepartamento('PE',true);
      }

      function GetListProvincias(codDepartamento) {
        return proxyUbigeo.getProvincia(codDepartamento,'PE', true);
      }

      function GetListDistritos(codProvincia) {
        return proxyUbigeo.getDistrito(codProvincia,'PE', true);
      }

      function AddSolicitud(request) {
        return proxyEpsEmpresa.CrearProforma(request, false);
      }

      function GetListSolicitudes(numeroPagina, cantidadPorPagina, fechaDesde, fechaHasta, ruc, empresa, estado, limite){//(url) {
        return proxyEpsEmpresa.ObtenerProformas(numeroPagina, cantidadPorPagina, fechaDesde, fechaHasta, ruc, empresa, estado, limite, true);//(url, true);
      }

      function GetBase64PdfSolicitud(idSolicitud){
        return proxyEpsEmpresa.ObtenerInforme(idSolicitud, true);
      }

      function AddParametro(request) {
        return proxyEpsEmpresa.CrearParametro(request, false);
      }

      function GetParametro(parametroId) {
        return proxyEpsEmpresa.ObtenerParametro(parametroId, true);
      }

      function PutParametro(parametroId, data) {
        return proxyEpsEmpresa.ActualizarParametro(data,parametroId, true);
      }

      function PutTarifa(tarifaId, data) {
        return proxyEpsEmpresa.ActualizarTarifa(data,tarifaId, true);
      }

      function DeleteTarifa(tarifaId) {
        return proxyEpsEmpresa.EliminarTarifa(tarifaId, true);
      }

      function GetEmpresaByRuc(ruc){
        return proxyEpsEmpresa.ObtenerEntidadJuridcaNatural(ruc, true);
      }
    }
  });
  