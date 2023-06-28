define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular.module(constants.module.polizas.fola.moduleName).factory('folaService', FolaService);

  FolaService.$inject = [
    '$http',
    '$q',
    'mpSpin',
    'proxyFola',
    'proxySctr',
    'proxyPersonForm',
    'httpData',
    'oimProxyPoliza',
    'proxyGenerateDeclarationPre'
  ];
  function FolaService(
    $http,
    $q,
    mpSpin,
    proxyFola,
    proxySctr,
    proxyPersonForm,
    httpData,
    oimProxyPoliza,
    proxyGenerateDeclarationPre
  ) {
    var service = {
      getDocuments: GetDocuments,
      getDocumentFola: GetDocumentFola,
      getTemplateFolaInsured: GetTemplateFolaInsured,
      getListOcupaciones: GetListOcupaciones,
      getPlanesActivos: GetPlanesActivos,
      getDatosPersona: GetDatosPersona,
      getParametrosFraccionamiento: GetParametrosFraccionamiento,
      getPlanes: GetPlanes,
      addPlan: AddPlan,
      updatePlan: UpdatePlan,
      guardarCotizacion: GuardarCotizacion,
      saveEmision: SaveEmision,
      getPolizaPDF: GetPolizaPDF,
      getCondicionadoGeneral: GetCondicionadoGeneral,
      getCondicionadoParticular: GetCondicionadoParticular,
      getCondicionados : GetCondicionados,
      deleteCondicionado : DeleteCondicionado,

      claims: void 0,
      parameters: void 0,
      coberturas: void 0,
      categories: void 0,
      frecuencias: void 0,
      tiposDocumentoContratante: void 0,
      tiposDocumentoAsegurado: void 0
    };

    return service;

    function GetPlanes(codCia, codRamo, request) {
      // return proxyFola.listarContratos(code, dominio, request, true);
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/contratos/'+codCia+'/'+codRamo+'?paginaActual='+request.paginaActual+'&cantidadFilas='+request.cantidadFilas,
        undefined,
        undefined,
        true
      );
    }
    function GetPlanesActivos(codCia, codRamo) {
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/contratos/'+codCia+'/'+codRamo+'?planesActivos=true',
        undefined,
        undefined,
        true
      );
    }
    function GetDocuments(request) {
      return proxyFola.listarDocumentos(request, false);
    }
    
    function GetListOcupaciones() {
      return proxyFola.listarOcupaciones(true);
    }
    function GetParametrosFraccionamiento(code, dominio) {
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/parametros?codigoApp='+code+'&dominio='+dominio,
        undefined,
        undefined,
        true
      );
    }
    
    function AddPlan(plan) {
      return proxyFola.registrarPlan(plan, true);
    }
    function UpdatePlan(plan) {
      return proxyFola.actualizarPlan(plan, true);
    }
    function GuardarCotizacion(request) {
      return proxyFola.cotizarPoliza(request, true);
    }
    function GetDatosPersona(tipoDocumento, numeroDocumento) {
      var request = {
        applicationCode: constantsFola.PERSONA.CODIGO_APLICACION,
        tipoDocumento: tipoDocumento,
        codigoDocumento: numeroDocumento
      };
      return proxyPersonForm.getPersonEquifax(request, false);
    }
    function GetDocumentFola(request) {
      return proxyFola.consultarDocumento(request, false);
    }

    function GetTemplateFolaInsured(request) {
      return proxyFola.consultarPlantillaAsegurados(request, false);
    }
    function GetPolizaPDF(numeroPoliza, codCia, codRamo) {
      return proxyFola.obtenerPoliza(numeroPoliza, codCia, codRamo, true);
    }
    function SaveEmision(request) {
      return proxyFola.emitirPoliza(request, false);
    }
    function GetCondicionadoGeneral(tipoCondicionado) {
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/documentos?tipoCondicionado='+tipoCondicionado,
        undefined,
        undefined,
        true
      );
    }
    function GetCondicionadoParticular(tipoCondicionado, idPlan) {
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/documentos?idPlan='+idPlan+'&tipoCondicionado='+tipoCondicionado,
        undefined,
        undefined,
        true
      );
    }
    function GetCondicionados(tipoCondicionado) {
      return httpData.get(
        oimProxyPoliza.endpoint + 'api/fola/documentos?tipoCondicionado='+tipoCondicionado,
        undefined,
        undefined,
        true
      );
    }
    function DeleteCondicionado(idCondicionado, tipoCondicionado) {
      return proxyFola.eliminarCondicionado(idCondicionado, tipoCondicionado, true);
    }
  }
});
