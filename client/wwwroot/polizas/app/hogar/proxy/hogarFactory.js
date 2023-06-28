'use strict';

define(['angular', 'constants'], function(angular, constants) {
  var appAutos = angular.module('appAutos');

  appAutos.factory('hogarFactory', [
    'proxyClaims',
    'proxyHogar',
    'proxyTipoDocumento',
    'proxyContratante',
    'proxyCotizacion',
    'proxyDocumento',
    'proxyEmision',
    'proxyGeneral',
    'proxyMail',
    '$http',
    '$q',
    'httpData',
    function(
      proxyClaims,
      proxyHogar,
      proxyTipoDocumento,
      proxyContratante,
      proxyCotizacion,
      proxyDocumento,
      proxyEmision,
      proxyGeneral,
      proxyMail,
      $http,
      $q,
      httpData
    ) {
      var base = constants.system.api.endpoints.policy;

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
        });

        return deferred.promise;
      }

      function getClaims(showSpin) {
        return proxyClaims.GetClaims(showSpin);
      }

      function getProducts() {
        var codeCia = constants.module.polizas.hogar.codeCia;
        var codeRamo = constants.module.polizas.hogar.codeRamo;
        return proxyHogar.GetModalidadHogarModalidad2(codeCia, codeRamo);
      }

      function getDocumentTypes() {
        return proxyTipoDocumento.getTipoDocumento();
      }

      function getConstructionYears() {
        return proxyHogar.GetAnioInmueble();
      }

      function getCategory() {
        var codCia = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyHogar.GetCategoriaConstruccion(codCia, codRamo);
      }

      function getMonitoringAlarm() {
        var codCia = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyHogar.GetAlarmaMonitoreo(codCia, codRamo);
      }

      function getContractor(params, showSpin) {
        return proxyContratante.GetContratanteByNroDocumento(
          params.codeCompany,
          params.documentType,
          params.documentNumber,
          showSpin
        );
      }

      function getFinancing(params, showSpin) {
        return proxyCotizacion.listarFinanciamientoCotizaHogar(params, showSpin);
      }

      function getCoverage(params, showSpin) {
        return proxyCotizacion.listarComparativoCotizaHogar(params, showSpin);
      }

      function getDeducible(params, showSpin) {
        return proxyCotizacion.listarComparativoCotizaHogar(params, showSpin);
      }

      function saveQuotation(params, showSpin) {
        const opcMenu = localStorage.getItem('currentBreadcrumb');
        return httpData.post(
          base + 'api/cotizacion/grabar/hogar?COD_OBJETO=.&OPC_MENU='+ opcMenu,
          params,
          undefined,
          showSpin
        );
      }

      function saveQuotationComparativo(params, showSpin) {
        return proxyCotizacion.grabarCotizacionHogarBulk(params, showSpin);
      }

      function getQuotation(quotationNumber, showSpin) {
        var codeCompany = constants.module.polizas.hogar.codeCompany;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyDocumento.GetDocumentoByNumber(codeCompany, quotationNumber, codRamo, showSpin);
      }

      function downloadPDFGeneratedLetter(quotationNumber) {
        var paramsPDF = {
          codeCompany: constants.module.polizas.hogar.codeCompany,
          quotationNumber: quotationNumber,
          codeRamo: constants.module.polizas.hogar.codeRamo
        };
        return (
          constants.system.api.endpoints.policy +
          'api/reporte/hogar/cotizacion/' +
          paramsPDF.codeCompany +
          '/' +
          paramsPDF.quotationNumber +
          '/' +
          paramsPDF.codeRamo
        );
      }

      function validateGoEmit(params, showSpin) {
        return proxyGeneral.GetValidaLugarAltoRiesgo(params, showSpin);
      }

      //Emit
      function getFinancingType(params, showSpin) {
        return proxyHogar.GetListFinanciamiento(params, showSpin);
      }

      function getEndorsee() {
        return proxyContratante.GetListEndosatario();
      }

      function getTypes(codModalidad) {
        var codCia = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyHogar.GetTipoInmueble(codCia, codRamo, codModalidad);
      }

      function getMaterials(codModalidad) {
        var codCia = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyHogar.GetMaterialConstruccion(codCia, codRamo, codModalidad);
      }

      function saveEmission(params, showSpin) {
        const opcMenu = localStorage.getItem('currentBreadcrumb');
        return httpData.post(
          base + 'api/emision/grabar/hogar?COD_OBJETO=.&OPC_MENU='+ opcMenu,
          params, 
          undefined, 
          showSpin
        );
      }

      function getEmission(emissionNumber, showSpin) {
        var codeCompany = constants.module.polizas.hogar.codeCompany;
        var codRamo = constants.module.polizas.hogar.codeRamo;
        return proxyDocumento.GetDocumentoByNumber(codeCompany, emissionNumber, codRamo, showSpin);
      }

      function downloadPDFEmission(policyNumber) {
        return constants.system.api.endpoints.policy + 'api/documento/descargardocumento/' + policyNumber;
      }

      function detailEmitted(documentNumber, showSpin) {
        return proxyDocumento.GetDetalleEmisión(documentNumber, showSpin);
      }

      function getCurrencyList(showSpin) {
        return proxyGeneral.GetListTipoMoneda(showSpin);
      }

      function getComunicationType(codigoCompania, codigoRamo, showSpin) {
        return proxyGeneral.GetListTipoComunicacion(codigoCompania, codigoRamo, showSpin);
      }

      function getPackageType(comunicationTypeId, showSpin) {
        return proxyHogar.GetPackageType(comunicationTypeId, showSpin);
      }

      function quote(request, showSpin) {
        const opcMenu = localStorage.getItem('currentBreadcrumb');
        return httpData.post(
          base  + 'api/hogar/Quotation?COD_OBJETO=.&OPC_MENU='+ opcMenu,
          request, 
          undefined, 
          showSpin
        );
      }

      function quoteCompare(request, showSpin) {
        return proxyHogar.QuotationCompare(request, showSpin);
      }

      function getCotizaciones(paramsCotizacionesVigentes){
        return postData('api/documento/listardocumentopag/codigoproceso', paramsCotizacionesVigentes);
      }

      function getPrimaMensual(request, showSpin) {
        return proxyHogar.InsuranceCost(request, showSpin);
      }

      function getEndosatarioByRuc(data, showSpin) {
        return proxyContratante.GetEndosatarioTerceroByRuc(data, showSpin);
      }

      function getTipoCambio(tipoCambio, showSpin) {
        return proxyGeneral.GetTipoCambio(tipoCambio, showSpin);
      }

      function listarDocumentos(model, showSpin) {
        return proxyDocumento.ListarDocumentoPag(model, showSpin);
      }

      function listarAbonado(tipoDocumento, numeroDocumento, showSpin) {
        return proxyContratante.GetListAbonado(tipoDocumento, numeroDocumento, showSpin);
      }

      function descargarPDFCotizacion(params) {
        return postData('api/reporte/hogar/cotizacion', params);
      }

      function sendEmailEmit(email, showSpin) {
        return proxyMail.SendMailDocumento(email, showSpin);
      }

      return {
        getClaims: getClaims,
        getProducts: getProducts,
        getDocumentTypes: getDocumentTypes,
        getConstructionYears: getConstructionYears,
        getCategory: getCategory,
        getMonitoringAlarm: getMonitoringAlarm,
        getContractor: getContractor,
        getFinancing: getFinancing,
        getCoverage: getCoverage,
        getDeducible: getDeducible,
        saveQuotation: saveQuotation,
        saveQuotationComparativo: saveQuotationComparativo,
        downloadPDFGeneratedLetter: downloadPDFGeneratedLetter,
        getQuotation: getQuotation,
        validateGoEmit: validateGoEmit,
        getFinancingType: getFinancingType,
        getEndorsee: getEndorsee,
        getTypes: getTypes,
        getMaterials: getMaterials,
        saveEmission: saveEmission,
        getEmission: getEmission,
        downloadPDFEmission: downloadPDFEmission,
        detailEmitted: detailEmitted,
        getCurrencyList: getCurrencyList,
        getComunicationType: getComunicationType,
        getPackageType: getPackageType,
        quote: quote,
        quoteCompare: quoteCompare,
        getCotizaciones: getCotizaciones,
        getPrimaMensual: getPrimaMensual,
        getEndosatarioByRuc: getEndosatarioByRuc,
        getTipoCambio: getTipoCambio,
        listarDocumentos: listarDocumentos,
        listarAbonado: listarAbonado,
        descargarPDFCotizacion: descargarPDFCotizacion,
        sendEmailEmit: sendEmailEmit
      };
    }
  ]);
});