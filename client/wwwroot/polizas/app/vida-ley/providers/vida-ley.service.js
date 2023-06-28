define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .factory('vidaLeyService', VidaLeyService);

  VidaLeyService.$inject = ['$http', '$q', 'mpSpin', 'proxyVidaLey', 'proxySctr', 'proxyPersonForm', 'httpData', 'oimProxyPoliza', 'proxyGenerateDeclarationPre', 'proxyTronSistema', 'vidaLeyFactory', 'proxyGeneral', 'proxyTipoDocumento', 'mainServices'];

  function VidaLeyService($http, $q, mpSpin, proxyVidaLey, proxySctr, proxyPersonForm, httpData, oimProxyPoliza, proxyGenerateDeclarationPre, proxyTronSistema, vidaLeyFactory, proxyGeneral, proxyTipoDocumento, mainServices) {
    var service = {
      getDocumentTypes: GetDocumentTypes,
      getProxyTypeRiesgo: GetProxyTypeRiesgo,
      getDatosPersona: GetDatosPersona,
      getDatosPersonaEquifax: GetDatosPersonaEquifax,
      getFrecuencia: GetFrecuencia,
      busquedaDocumentos: BusquedaDocumentos,
      busquedaReportes: BusquedaReportes,
      getListCoberturas: GetListCoberturas,
      getListCategorias: GetListCategorias,
      getListParametros: GetListParametros,
      getCotizacion: GetCotizacion,
      getListOficina: GetListOficina,
      getListReporteExcel: GetListReporteExcel,
      getDocument: GetDocument,
      getZIPDocument: GetZIPDocument,
      getCotizarPrimas: GetCotizarPrimas,
      recalcularPrimas: RecalcularPrimas,
      grabarCotizacion: GrabarCotizacion,
      getInfoEmisionDocumentoById: GetInfoEmisionDocumentoById,
      cargarAseguradosMasivo: CargarAseguradosMasivo,
      cargarAseguradoXRiesgo: CargarAseguradoXRiesgo,
      cargarAseguradosIndividual: CargarAseguradosIndividual,
      getInfoAplication: GetInfoAplication,
      uploadFileToUrl: UploadFileToUrl,
      uploadXLSFilePC: UploadXLSFilePC,
      uploadXLSFilePN: UploadXLSFilePN,
      validacionContratante: ValidacionContratante,
      getListParametroDetalleGeneral: GetListParametroDetalleGeneral,
      anularCotizacionMasiva: AnularCotizacionMasiva,
      getListClausula: GetListClausula,
      saveClausula: SaveClausula,
      deleteClausula: DeleteClausula,
      getListSuscriptor: GetListSuscriptor,
      getUsuarioOim: GetUsuarioOim,
      saveSuscriptorOficina: SaveSuscriptorOficina,
      actividadEconomica: ActividadEconomica,
      getListActividadesEconomicas: GetListActividadesEconomicas,
      getListSuscriptorOficina: GetListSuscriptorOficina,
      getSctrListTipoDocumento: GetSctrListTipoDocumento,
      saveSuscriptor: SaveSuscriptor,
      updateSuscriptor: UpdateSuscriptor,
      getClausula: GetClausula,
      grabarEmision: GrabarEmision,
      isDeficit: IsDeficit,

      claims: (void 0),
      parameters: (void 0),
      coberturas: (void 0),
      categories: (void 0),
      frecuencias: (void 0),
      tiposDocumentoContratante: (void 0),
      tiposDocumentoAsegurado: (void 0),
    };

    return service;

    function BusquedaDocumentos(request) {
      return proxyVidaLey.GetListDocuments(request, true);
    }

    function BusquedaReportes(request) {
      return proxyVidaLey.GetListReporte(request, true);
    }

    function GetListOficina(params, showSpin) {
      return proxyVidaLey.GetListOficinas(params, showSpin);
    }

    function GetListReporteExcel(params) {
      return httpData.postDownload(
        oimProxyPoliza.endpoint + 'api/vidaley/cotizaciones/archivo',
        params,
        { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer' },
        true
      ).then(function (data) {
        mainServices.fnDownloadFileBase64(data.file, data.mimeType, 'Reporte_Vida_Ley.xlsx', true);
      });

    }

    function GetDocument(url) {
      return httpData.getDownload(
        url,
        { responseType: 'arraybuffer' },
        true
      ).then(function (data) {
        mainServices.fnDownloadFileBase64(data.file, "pdf", 'Document_Vida_Ley.pdf', true);
      });

    }

    function GetZIPDocument(url) {

      return httpData.getDownload(
        url,
        { responseType: 'arraybuffer' },
        true
      ).then(function (data) {
        mainServices.fnDownloadFileBase64(data.file, "zip", 'Document_Vida_Ley.zip', true);
      });

    }

    function GetInfoEmisionDocumentoById(id) {
      return proxyVidaLey.GetInfoEmisionDocumentoById(id, true);
    }

    function GetCotizacion(numero) {
      return proxyVidaLey.GetCotizacionById(numero, true);
    }

    function GetListCoberturas(canttrab) {
      return proxyVidaLey.GetListCoberturas(canttrab, true);
    }

    function GetCotizarPrimas(request) {
      return proxyVidaLey.CotizarPrimas(request, true);
    }

    function RecalcularPrimas(documentId, request) {
      const pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
      };
      return httpData.put(
        oimProxyPoliza.endpoint + 'api/vidaley/cotizacion/' + documentId + '/primas?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
        request,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        true
      );
    }

    function GrabarCotizacion(step, request) {
      var url;

      if (step === constantsVidaLey.STEPS.COTIZACION.CONTRATANTE) {
        url = 'api/vidaley/cotizar/paso1/contratante?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };
      if (step === constantsVidaLey.STEPS.COTIZACION.CONTRATANTE_UPDATE) {
        url = 'api/vidaley/cotizacion/paso1/contratante?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return update(request, url);

      };
      if (step === constantsVidaLey.STEPS.COTIZACION.POLIZA) {
        url = 'api/vidaley/cotizar/paso2?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };
      if (step === constantsVidaLey.STEPS.COTIZACION.ASEGURADOS) {
        url = 'api/vidaley/cotizacion/paso3?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };
      if (step === constantsVidaLey.STEPS.COTIZACION.RESULTADOS) {
        url = 'api/vidaley/cotizacion/paso4/agente?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };

      if (step === constantsVidaLey.STEPS.COTIZACION.SOLICITUDTASA) {
        url = 'api/vidaley/cotizacion/paso4/agente?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };

      if (step === constantsVidaLey.STEPS.COTIZACION.RECHAZARTASA) {
        url = 'api/vidaley/cotizacion/paso4/agente?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };

      if (step === constantsVidaLey.STEPS.COTIZACION.RECHAZARSOLICITUD) {
        url = 'api/vidaley/cotizacion/paso4/suscriptor?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };

      if (step === constantsVidaLey.STEPS.COTIZACION.ACEPTARSOLICITUD) {
        url = 'api/vidaley/cotizacion/paso4/suscriptor?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.COTIZAR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };
    }

    function GrabarEmision(step, request) {
      var url;

      if (step === constantsVidaLey.STEPS.EMISION.CONTACTO) {
        url = 'api/vidaley/emision/paso1?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.EMITIR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };

      if (step === constantsVidaLey.STEPS.EMISION.RESULTADOS) {
        url = 'api/vidaley/emision/paso2?COD_OBJETO=' + vidaLeyFactory.getCodObject(constantsVidaLey.SUBMENUS.EMITIR_VIDA_LEY) + '&OPC_MENU=' + localStorage.getItem('currentBreadcrumb');
        return grabar(request, url);

      };
    }


    function update(requestCotizacion, url) {
      var headers = {
        COD_APLI: constantsVidaLey.COD_APLI,
        IP_ORIGEN: localStorage.getItem('clientIp')
      };

      return httpData.put(
        oimProxyPoliza.endpoint + url,
        requestCotizacion,
        headers,
        true
      )
    };

    function grabar(requestCotizacion, url) {
      var headers = {
        COD_APLI: constantsVidaLey.COD_APLI,
        IP_ORIGEN: localStorage.getItem('clientIp')
      };

      return httpData.post(
        oimProxyPoliza.endpoint + url,
        requestCotizacion,
        headers,
        true
      )
    };

    function CargarAseguradosIndividual(request) {
      return proxyVidaLey.CargarAseguradosIndividual(request, true);
    }

    function CargarAseguradosMasivo(file, parametros) {
      var deferred = $q.defer();
      var formData = new FormData();
      formData.append("aseguradosJSON", JSON.stringify(parametros));
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
      var urlBase = constants.system.api.endpoints.policy;
      $http.post(urlBase + 'api/vidaley/cotizar/asegurado/masiva', formData, parametros)
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

    function CargarAseguradoXRiesgo(file, parametros) {
      var deferred = $q.defer();
      var formData = new FormData();
      formData.append("aseguradosJSON", JSON.stringify(parametros));
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
      var urlBase = constants.system.api.endpoints.policy;
      $http.post(urlBase + 'api/vidaley/cotizar/cargaaseguradoxriesgo', formData, parametros)
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
    function GetFrecuencia() {
      if (service.frecuencias) return $q.resolve(service.frecuencias);
      return _getFrecuencias();
    }

    function GetListCategorias() {
      if (service.categories) return $q.resolve(service.categories);
      return _getProxyListCategorias();
    }

    function GetListParametros() {
      if (service.parameters) return $q.resolve(service.parameters);
      return _getProxyListParametros();
    }

    function GetDatosPersona(tipoDocumento, numeroDocumento) {
      var request = { "applicationCode": constantsVidaLey.PERSONA.CODIGO_APLICACION, "tipoDocumento": tipoDocumento, "codigoDocumento": numeroDocumento };
      return proxyPersonForm.getPersonEquifax(request, false);
    }

    function GetDatosPersonaEquifax(tipoDocumento, numeroDocumento) {
      var request = { "tipoDocumento": tipoDocumento, "codigoDocumento": numeroDocumento };
      return proxyVidaLey.GetAseguradoEquifax(request, false);
    }

    function GetDocumentTypes(isContratante) {
      if (service.tiposDocumentoContratante && isContratante) return $q.resolve(service.tiposDocumentoContratante);
      if (service.tiposDocumentoAsegurado && !isContratante) return $q.resolve(service.tiposDocumentoAsegurado);
      return _getProxyDocumentTypes(isContratante);
    }

    function AnularCotizacionMasiva(arregloCotizaciones) {
      return _anularCotizacion(arregloCotizaciones);
    }

    function _anularCotizacion(arregloCotizaciones) {
      var deferred = $q.defer();

      proxyVidaLey.AnularCotizacionMasiva(arregloCotizaciones, true)
        .then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error.statusText);
        });
      return deferred.promise;
    }

    function _getFrecuencias() {
      var deferred = $q.defer();
      proxyTronSistema.GetListParametro(constants.module.polizas.description, constants.module.polizas.vidaLey.codeRamo, 'VIDALEY_FRECUENCIA', false)
        .then(function (response) {
          service.frecuencias = response;
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error.statusText);
        });
      return deferred.promise;
    }

    function _getProxyListCategorias() {
      var deferred = $q.defer();
      proxyVidaLey.GetListCategorias(true)
        .then(function (response) {
          service.categories = response;
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error.statusText);
        });
      return deferred.promise;
    }

    function _getProxyListParametros() {
      var deferred = $q.defer();
      proxyVidaLey.GetListParametros(true)
        .then(function (response) {
          service.parameters = response;
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error.statusText);
        });
      return deferred.promise;
    }

    function _getProxyDocumentTypes(isContratante) {
      var deferred = $q.defer();
      var formCode = isContratante ? constantsVidaLey.PERSONA.FORMULARIO_CONTRATANTE : constantsVidaLey.PERSONA.FORMULARIO_ASEGURADO;
      var urlBase = constants.system.api.endpoints.nsctr;
      $http.get(urlBase + 'api/common/lookup/documentType/' + formCode + '/' + constantsVidaLey.PERSONA.CODIGO_APLICACION)
        .then(function (response) {
          var responseReturn = { Data: _transformDataDocumentTypes(response.data.data) };
          if (isContratante) service.tiposDocumentoContratante = responseReturn;
          else service.tiposDocumentoAsegurado = responseReturn;
          deferred.resolve(responseReturn);
        }, function (error) {
          deferred.reject(error.statusText);
        });

      return deferred.promise;
    }
    function GetProxyTypeRiesgo() {
      return proxyGenerateDeclarationPre.GetRiskTypeList('')
    }

    function _transformDataDocumentTypes(documents) {
      return documents && documents.map(function (document) {
        return {
          Codigo: document.typeId,
          Descripcion: document.typeDescription
        }
      });
    }

    function GetInfoAplication(request) {
      return proxyVidaLey.GetInfoAplication(request, false);
    }

    function UploadFileToUrl(file, paramsFile) {
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("rolOrigen", paramsFile.rolOrigen);
      fd.append("usuarioOrigen", paramsFile.usuarioOrigen);
      fd.append("usuarioDestino", paramsFile.usuarioDestino);
      fd.append("asunto", paramsFile.asunto);
      fd.append("mensaje", paramsFile.mensaje);

      if (file) {
        for (var i = 0; i < file.length; i++) {
          fd.append("fieldNameHere", file[i]);
        }
      }

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/mensaje/grabar', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        eventHandlers: {
          progress: function (c) {
          }
        },
        uploadEventHandlers: {
          progress: function (e) {
            mpSpin.start();
          }
        }
      })
        .success(function () {
          mpSpin.end();
        })
        .error(function () {
          mpSpin.end();
        });
    }

    function UploadXLSFilePC(file, paramsFile) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("cantidadTrabajador", paramsFile.cantidadTrabajador);
      fd.append("sueldoTotal", paramsFile.sueldoTotal);
      fd.append("fieldNameHere", file);

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/poliza/p4/pc/cargar', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        eventHandlers: {
          progress: function (c) {
          }
        },
        uploadEventHandlers: {
          progress: function (e) {
            mpSpin.start();
          }
        }
      })
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        });
      mpSpin.end();

      return deferred.promise;
    }

    function UploadXLSFilePN(file, paramsFile) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("cantidadTrabajador", paramsFile.cantidadTrabajador);
      fd.append("sueldoTotal", paramsFile.sueldoTotal);
      fd.append("fieldNameHere", file);

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/poliza/p4/pN/cargar', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        eventHandlers: {
          progress: function (c) {
          }
        },
        uploadEventHandlers: {
          progress: function (e) {
            mpSpin.start();
          }
        }
      })
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        });
      mpSpin.end();

      return deferred.promise;
    }

    function ValidacionContratante(documento, params) {
      return proxyVidaLey.ValidacionContratante(documento, params, true);
    }

    function GetListParametroDetalleGeneral(request) {
      return proxySctr.GetListParametroDetalleGeneral(request, true);
    }
    function GetListClausula(filtro, codRamo) {
      return proxyGeneral.GetListClausula(filtro, codRamo, true);
    }

    function GetListSuscriptor(nombreCompleto, codigoUsuario, estado, cantidadFilasPorPagina, paginaActual) {
      return proxyGeneral.GetListSuscriptor(nombreCompleto, codigoUsuario, estado, cantidadFilasPorPagina, paginaActual, true);
    }

    function GetUsuarioOim(sctrSuscriptorDTO) {
      return proxySctr.GetUsuarioOim(sctrSuscriptorDTO, true);
    }
    function SaveClausula(request) {
      return proxyGeneral.SaveClausula(request, true);
    }

    function DeleteClausula(idClausula) {
      return proxyGeneral.DeleteClausula(idClausula, true);
    }

    function ActividadEconomica(filtro, codPeriodo, tipoActividad, numeropagina, tamanioPagina) {
      return proxyVidaLey.GetListActividadesEconomicas(filtro, codPeriodo, tipoActividad, numeropagina, tamanioPagina, true);
    }

    function GetListActividadesEconomicas(filtro, codPeriodo, tipoActividad, codAgente, nroPagina, tamaniPagina, showSpin) {
      return proxyVidaLey.GetListActividadesEconomicas(filtro, codPeriodo, tipoActividad, codAgente, nroPagina, tamaniPagina, showSpin);
    }

    function SaveSuscriptor(request) {
      return proxyGeneral.SaveSuscriptor(request, true);
    }

    function UpdateSuscriptor(codigoSuscriptor, genericSuscriptorDTO) {
      return proxyGeneral.UpdateSuscriptor(codigoSuscriptor, genericSuscriptorDTO, true);
    }

    function GetListSuscriptorOficina(codigoOficina, nombreOficina, cantidadFilasPorPagina, paginaActual) {
      return proxyGeneral.GetListSuscriptorOficina(codigoOficina, nombreOficina, cantidadFilasPorPagina, paginaActual, true);
    }
    function SaveSuscriptorOficina(codigoSuscriptor, request) {
      return proxyGeneral.SaveSuscriptorOficina(codigoSuscriptor, request, true);
    }

    function GetSctrListTipoDocumento() {
      return proxyTipoDocumento.getSctrListTipoDocumento(true);
    }
    function GetClausula(idClausula) {
      return proxyGeneral.GetClausula(0, constants.module.polizas.vidaLey.codeRamo, idClausula);
    }

    function IsDeficit(documento, params) {
      return ValidacionContratante(documento, params);
    }
  }

});
