define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module("appSepelio")
    .factory('campoSantoService', campoSantoService);

  campoSantoService.$inject = ['$q', '$http', '$window', 'httpData', 'mainServices', 'mModalAlert', 'mpSpin', 'proxyGeneral', 'proxyEmpresa', 'proxyDomicilio', 'proxyUbigeo',
    'proxyCampoSanto','proxyPersonForm','campoSantoFactory'];

  function campoSantoService($q, $http, $window, httpData, mainServices, mModalAlert, mpSpin, proxyGeneral, proxyEmpresa, proxyDomicilio, proxyUbigeo,
    proxyCampoSanto, proxyPersonForm,campoSantoFactory) {
    var base = constants.system.api.endpoints.policy;
    var service = {
      getProxyCamposanto: GetProxyCamposanto,
      getProxyTipoContrato: GetProxyTipoContrato,
      getProxyModalidad: GetProxyModalidad,
      getProxyProducto: GetProxyProducto,
      getProxiListEstadoCivil: GetProxiListEstadoCivil,
      getProxyGradoIntruccion: GetProxyGradoIntruccion,
      getProxyEdad: GetProxyEdad,
      generarEvelacuion: GenerarEvelacuion,
      getCategoriaProducto: GetCategoriaProducto,
      getTipologiaFinanciamiento: GetTipologiaFinanciamiento,
      productoAgrupamiento: ProductoAgrupamiento,
      guardarOperacion: GuardarOperacion,
      getTipoProductoFiltro: GetTipoProductoFiltro,
      enviarCorreoExepcional: EnviarCorreoExepcional,
      getMotivosCotizacion: GetMotivosCotizacion,
      cerrarCotizacion: CerrarCotizacion,
      informacionEquifaxCamposanto: InformacionEquifaxCamposanto,
      bandejaCotizaciones: BandejaCotizaciones,
      getEstadoCotizacionXRol: GetEstadoCotizacionXRol,
      cotizarXOrquestador: CotizarXOrquestador,
      getFraccionamiento: GetFraccionamiento,
      getDocumentos: GetDocumentos,
      descargarCotizacionPDF: DescargarCotizacionPDF,
      uploadDocuments: uploadDocuments,
      deleteDocument: deleteDocument,
      leeDocuments: leeDocuments,
      getSexo: getSexo,
      getOcupacion: getOcupacion,
      getProfesionesAll: getProfesionesAll,
      getListPais: getListPais,
      getListTipo: getListTipo,
      getListInterior: getListInterior,
      getNumeracionDomicilio: getNumeracionDomicilio,
      getListZona: getListZona,
      getDepartamento: getDepartamento,
      getProvincia: getProvincia,
      getDistrito: getDistrito,
      guardarPreEmision: guardarPreEmision,
      leerTomador: leerTomador,
      leerBeneficiario: leerBeneficiario,
      leerAval: leerAval,
      simulador: simulador,
      getSedeFunerarias: GetSedeFunerarias,
      getDatosAdicionales: GetDatosAdicionales,
      getFraccionamientoProducto401: getFraccionamientoProducto401,
      getCotizacion: GetCotizacion,
      getDocumentTypes: getDocumentTypes,
      getSedes:getSedes,
      getBandejaEmisores: getBandejaEmisores,
      insertEmisorAgenteSede: insertEmisorAgenteSede,
      updateEmisorAgenteSede: updateEmisorAgenteSede,
      getListCorreosExcepcional: getListCorreosExcepcional,
      insertCorreoExcepcional: insertCorreoExcepcional,
      updateCorreoExcepcional: updateCorreoExcepcional,
      updateProductoCategoria: updateProductoCategoria,
      getListTipologiasFinancimientos: getListTipologiasFinancimientos,
      updateTipologiaFinancimiento: updateTipologiaFinancimiento,
      getListTiposDocumentos: getListTiposDocumentos,
      getListGestionDocumentos: getListGestionDocumentos,
      insertGestionDocumento: insertGestionDocumento,
      getFraccionamientoProducto401 : getFraccionamientoProducto401,
      getCotizacion : GetCotizacion,
      getDocumentTypes: getDocumentTypes,
      listaParentesco: listaParentesco,
      getFechaVencimiento: GetFechaVencimiento,
      descargarArchivo:DescargarArchivo,
      updateGestionDocumento: updateGestionDocumento,
      getListAgencias: GetListAgencias,
      getListVendedores: GetListVendedores,
      generarNumeroPoliza: GenerarNumeroPoliza,
      guardarEmision: GuardarEmision,
      guardarFechaEfectoCotizacion: guardarFechaEfectoCotizacion,
      getDatosPersona: GetDatosPersona
      
    };

    return service;

    function GetDatosPersona(tipoDocumento, numeroDocumento) {
      var request = {
        applicationCode: 'FUNERARIAS',
        tipoDocumento: tipoDocumento,
        codigoDocumento: numeroDocumento
      };
      return proxyPersonForm.getPersonEquifax(request, false);
    }


    function GetProxyCamposanto(codRamo) {
      return proxyCampoSanto.getCampoSanto(codRamo, true)
    }

    function GetProxyTipoContrato(codRamo) {
      return proxyCampoSanto.getTipoContrato(codRamo, true)
    }

    function GetListAgencias(filtro){
      return proxyCampoSanto.GetListAgencias(filtro, 2, 10, 1, true)
    }

    function GetListVendedores(filtro){
      return proxyCampoSanto.GetListVendedores(filtro, 2, 10, 1, true)
    }

    function GenerarNumeroPoliza(idRamo, idTipoContrato, idCampoSanto, numeroContrato){
      return proxyCampoSanto.GenerarNumeroPoliza(idRamo, idTipoContrato, idCampoSanto, numeroContrato, true)
    }

    function GuardarEmision(emision){
      return proxyCampoSanto.GuardarEmision(emision, true)
    }

    function GetProxyModalidad(codRamo,idTipoContrato, idCampoSanto) {
      return proxyCampoSanto.GetModalidad(codRamo,idTipoContrato,idCampoSanto, true)
    }

    function GetProxyProducto(codRamo, codModalidad, codCamposanto, codPrima, codContrato, numContratoRelacionado) {
      return proxyCampoSanto.GetProductos(codRamo, codModalidad, codCamposanto, codPrima, codContrato, numContratoRelacionado, true)
    }

    function GetProxyGradoIntruccion() {
      return proxyCampoSanto.getGrado(true)
    }

    function GetProxyEdad() {
      return proxyCampoSanto.getEdad(true)
    }

    function GetProxiListEstadoCivil(showSpin) {
      return proxyGeneral.GetListEstadoCivil(true);
    }

    function GenerarEvelacuion(data) {
      return proxyCampoSanto.Evaluacion(data, true)
    }

    function GetCategoriaProducto() {
      return proxyCampoSanto.getTipologiaProductos(true)
    }

    function GetTipologiaFinanciamiento() {
      return proxyCampoSanto.getTipologiaFinanciamientos(true)
    }

    function ProductoAgrupamiento(codRamo, nombreCampoSanto, codProducto, nombreProducto, codCategoria, cantidadFilasPorPagina, paginaActual) {
      return proxyCampoSanto.GetListProductos(codRamo, nombreCampoSanto, codProducto, nombreProducto, codCategoria, cantidadFilasPorPagina, paginaActual, true)
    }

    function GetTipoProductoFiltro(data) {
      return proxyCampoSanto.getBusquedaAternativas(data, true)
    }

    function GuardarOperacion(data, page) {
      data.paginaActual = page;
      
      return proxyCampoSanto.GuardarCotizacion(campoSantoFactory.ConvertJsonValueToUpper(data), true)
    }

    function EnviarCorreoExepcional(data) {
      return proxyCampoSanto.enviarCorreoExcepcional(data, true)
    }
    function GetMotivosCotizacion(tipo) {
      return proxyCampoSanto.getMotivo(tipo, true);
    }
    function CerrarCotizacion(data) {
      return proxyCampoSanto.CerrarCotizacion(data, true)
    }

    function InformacionEquifaxCamposanto(dni) {
      return proxyCampoSanto.GetPersonEquifax(dni, true)
    }

    function BandejaCotizaciones(data) {
      return proxyCampoSanto.GetCotizaciones(data, true)
    }

    function GetEstadoCotizacionXRol(rol) {
      return proxyCampoSanto.getEstado(rol, true)
    }

    function CotizarXOrquestador(data) {
      return $http.post("https://api.pre.mapfreperu.com/internal/novida/wsfuneraria/cotizacion", data, { headers: { 'Content-Type': 'application/json' } });
    }

    function GetFraccionamiento(codRamo) {
      return proxyCampoSanto.getFraccionamiento(codRamo, true)
    }
    function GetDocumentos(codRamo, tipoContrato, cotizacion) {
      return proxyCampoSanto.getDocumento(codRamo, tipoContrato, cotizacion, true)
    }

    function DescargarCotizacionPDF(id, numeroCotizacion) {
      $http.get(base + "api/camposanto/DescargarCotizacionPDF/" + id)
        .then(function (response) {
          mainServices.fnDownloadFileBase64(response.data.Data, "pdf", 'cotizacion_' + numeroCotizacion + '.pdf', false);
        });

    }
    function uploadDocuments(data) {
      return proxyCampoSanto.altaDocumento(data, true)
    }
    function deleteDocument(documento, codRamo, cotizacion, tipoContrato) {
      return proxyCampoSanto.EliminarDocumento(documento, codRamo, cotizacion, tipoContrato, true)
    }
    function leeDocuments(codigoGestorDocumental) {
      return proxyCampoSanto.getArchivoDocumento(codigoGestorDocumental, true)
    }
    function getSexo() {
      return proxyGeneral.GetSexo(true);
    }
    function getOcupacion() {
      return $http.get(base + 'api/general/ocupacion', undefined, undefined, true);
    }
    function getProfesionesAll() {
      return proxyEmpresa.GetProfesionesAll(true);
    }
    function getListPais() {
      return proxyUbigeo.GetListPais(true);
    }
    function getListTipo() {
      return proxyDomicilio.GetListTipo(true);
    }
    function getListInterior() {
      return proxyDomicilio.GetListInterior(true);
    }
    function getNumeracionDomicilio() {
      return proxyDomicilio.getNumeracionDomicilio(true);
    }
    function getListZona() {
      return proxyDomicilio.GetListZona(true);
    }
    function getDepartamento(codPais) {
      return proxyUbigeo.getDepartamento(codPais, true);
    }
    function getProvincia(id, codPais) {
      if (!id) return [];
      return proxyUbigeo.getProvincia(id, codPais, true);
    }
    function getDistrito(id, codPais) {
      if (!id) return [];
      return proxyUbigeo.getDistrito(id, codPais, true);
    }
    function guardarPreEmision(request, tipo, idCotizacion) {
      if (tipo == 'GuardarBeneficiario') {
        return proxyCampoSanto.GuardarBeneficiario(request, idCotizacion, false);
      } else {
        return $http.post(base + "api/camposanto/" + tipo, request, { headers: { 'Content-Type': 'application/json' } });
      }

    }
    function leerTomador(cotizacion) {
      return proxyCampoSanto.GetTomador(cotizacion, true)
    }
    function leerBeneficiario(cotizacion) {
      return proxyCampoSanto.GetListBeneficiarios(cotizacion, true)
    }
    function leerAval(cotizacion) {
      return proxyCampoSanto.GetAval(cotizacion, true)
    }
    function simulador(request) {
      return proxyCampoSanto.Simular(request, true);
    }
    function getFraccionamientoProducto401(idModalidad, idCampoSanto, idProducto, idTipoContrato) {
      return proxyCampoSanto.GetFraccionamientoProducto(idModalidad, idCampoSanto, idProducto, idTipoContrato, true);
    }

    function GetSedeFunerarias(texto) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: base + "api/camposanto/Sedes/coincidencia/" + texto.substring(0, 60),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }

    function GetDatosAdicionales(idCotizacion) {
      return proxyCampoSanto.GetDatoAdicional(idCotizacion, true);
    }
    function GetCotizacion(idCotizacion) {
      return proxyCampoSanto.GetCotizacion(idCotizacion, false);
    }
    function getDocumentTypes(params) {
      return httpData['get'](base + 'api/form/person/TipoDoc', { params: params }, undefined, false);
    }
    function getSedes() {
      return proxyCampoSanto.getSedes(false);
    }
    function getBandejaEmisores(data) {
      return proxyCampoSanto.GetListEmisorAgenteSede(data.CodEmisor, data.CodAgente, data.idCampoSanto, data.CodRamo,data.cantidadFilasPorPagina,data.paginaActual, true)
    }
    function insertEmisorAgenteSede (data) {
      return proxyCampoSanto.InsertEmisorAgenteSede(data, true)
    }
    function updateEmisorAgenteSede (data) {
      return proxyCampoSanto.UpdateEmisorAgenteSede(data, true)
    }
    function getListCorreosExcepcional (data) {
      return proxyCampoSanto.GetListCorreosExcepcional(data.FechaCreacion, data.CodRamo, data.Correo, data.NombreCampoSanto, data.cantidadFilasPorPagina, data.paginaActual, true)
    }
    function insertCorreoExcepcional (data) {
      return proxyCampoSanto.InsertCorreoExcepcional(data, true)
    }
    function updateCorreoExcepcional (data) {
      return proxyCampoSanto.UpdateCorreoExcepcional(data, true)
    }
    function updateProductoCategoria (data) {
      return proxyCampoSanto.UpdateProducto(data, true)
    }
    function getListTipologiasFinancimientos(){
      return proxyCampoSanto.GetListTipologiasFinancimientos(true)
    }
    function updateTipologiaFinancimiento (data) {
      return proxyCampoSanto.UpdateTipologiaFinancimiento(data, true)
    }
    function getListTiposDocumentos () {
      return proxyCampoSanto.GetListTiposDocumentos(true)
    }
    function getListGestionDocumentos () {
      return proxyCampoSanto.GetListGestionDocumentos(true)
    }
    function insertGestionDocumento (data) {
    return proxyCampoSanto.InsertGestionDocumento(data,true)
    }
    function listaParentesco () {
      return proxyCampoSanto.ListaParentesco(false);
    }

    function GetFechaVencimiento(cotizacion) {
     return proxyCampoSanto.GetFechaVencimiento(cotizacion.idFraccionamiento, cotizacion.idTipoProducto, cotizacion.fecEfec, cotizacion.idRamo, true);
    }

    function DescargarArchivo(idCotizacion,tipoOperacion) {
      return proxyCampoSanto.DescargarArchivo(idCotizacion,tipoOperacion,true);
    }
    function updateGestionDocumento (data) {
      return proxyCampoSanto.UpdateGestionDocumento(data, true)
    }

    function guardarFechaEfectoCotizacion (data) {
      return proxyCampoSanto.GuardarFechaEfectoCotizacion(data, true)
    }

  }
});
