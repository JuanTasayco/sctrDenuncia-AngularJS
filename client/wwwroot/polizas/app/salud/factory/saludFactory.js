'use strict';

define(['angular', 'constants', 'lodash'], function(angular, constants, _) {
  saludFactory.$inject = [
    '$http',
    '$q',
    '$state',
    '$window',
    'proxyProducto',
    'proxySalud',
    'proxyGeneral',
    'proxyPoliza',
    'proxyTipoDocumento',
    'proxyContratante',
    'proxyCotizacion',
    'proxyClinicaDigital',
    'proxyReporte',
    'proxyUbigeo',
    'httpData',
    'mModalAlert',
    'mainServices',
    'mpSpin',
    'oimPrincipal',
    'oimProxyPoliza',
    'proxyMail',
    'proxyEmision'
  ];
  function saludFactory(
    $http,
    $q,
    $state,
    $window,
    proxyProducto,
    proxySalud,
    proxyGeneral,
    proxyPoliza,
    proxyTipoDocumento,
    proxyContratante,
    proxyCotizacion,
    proxyClinicaDigital,
    proxyReporte,
    proxyUbigeo,
    httpData,
    mModalAlert,
    mainServices,
    mpSpin,
    oimPrincipal,
    oimProxyPoliza,
    proxyMail,
    proxyEmision
  ) {

    // Declaración de funcionalidades compartidas v2
    function spliceListPrimas(arr1, arr2) {
      if (arr1.length > arr2.length) {
        var i = 0;
        var dif = arr1.length - arr2.length;
        while (i < dif) {
          arr2.push({
            CodigoMoneda: '-',
            CodigoPlan: '-',
            CodigoProductoSalud: '-',
            CodigoSubProductoSalud: '-',
            Descripcion: '-',
            NumeroOrden: '-',
            SimboloMoneda: '-',
            Valor: '-'
          });
          i++;
        }
      }
    }

    // Declaración de Servicios
    function getProductsByUser(params, showSpin) {
      return proxyProducto.getListProductByUsuario(params, showSpin);
    }

    function getPlan(showSpin) {
      return proxySalud.GetPlan(showSpin);
    }

    function obtenerPolizaxNumero(codigoCia, codigoRamo, numeroPoliza, showSpin) {
      return proxyCotizacion.ObtenerCotizacionRenovacion(codigoCia, codigoRamo, numeroPoliza, showSpin);
    }

    function GetPolizaPorToken(token, showSpin) {
      return proxyPoliza.GetPolizaPorToken(token, showSpin);
    }

    function ObtenerContratos(codigoCia, numeroContrato, numeroSubContrato, prioridadActual, continuidadActual, showSpin){
      return proxySalud.ListarPlanMigracionPorContrato(codigoCia, numeroContrato,numeroSubContrato, prioridadActual, continuidadActual, showSpin);
    }

    function ListarPlanesMigracion(numRegistros, numPaginacion, numContrato, numSubContrato, continuidad, showSpin){
      return proxySalud.ListaPlanesMigrar(numRegistros, numPaginacion, numContrato, numSubContrato, continuidad, showSpin);
    }

    function ListarReglasAjuste(numRegistros, numPaginacion, numContrato, numSubContrato, showSpin){
      return proxySalud.ListaReglasAjuste(numRegistros, numPaginacion, numContrato, numSubContrato, showSpin);
    }

    function getPersonType(showSpin) {
      return proxySalud.Get_TipoPersona_ComboBox(showSpin);
    }

    function getFinancingType(showSpin) {
      return proxySalud.GetFinanciamiento(showSpin);
    }

    function getSexo(showSpin) {
      return proxyGeneral.GetSexo(showSpin);
    }

    function getDocumentType(showSpin) {
      return proxyTipoDocumento.getTipoDocumento(showSpin);
    }

    function getDataInsured(TipoDoc, NroDocumento, showSpin) {
      return proxyContratante.GetContratanteEquifaxByNroDocumento(TipoDoc, NroDocumento, showSpin);
    }

    function getCurrencyType(showSpin) {
      return proxyGeneral.GetListTipoMoneda(showSpin);
    }

    function getPrimaList(codigoCia, codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin) {
      return proxySalud.Get_PlanSaludPrima_Listar(codigoCia, codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, showSpin);
    }

    function postInsuredValidate(asegurado, showSpin) {
      return proxySalud.ValidarAsegurado(asegurado, showSpin);
    }

    function postQuotationSalud(cotizacion, showSpin) {
      const pathParams = {
				opcMenu: localStorage.getItem('currentBreadcrumb')
			};
      return httpData.post(
        oimProxyPoliza.endpoint + 'api/cotizacion/generar/salud?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
        cotizacion,
        undefined,
        showSpin
      );
    }

    function saveQuotationSalud(cotizacion, showSpin) {
      return proxyCotizacion.GuardarCotizacionSalud(cotizacion, showSpin);
    }

    function getQuotationSalud(numeroDocumento, showSpin) {
      return proxyCotizacion.ObtenerCotizacion(numeroDocumento, showSpin);
    }

    function getSaludPDF(numeroDocumento, showSpin) {
      return proxyReporte.ReporteCotizacionSalud(numeroDocumento, showSpin);
    }

    function DescargarDescripcionProducto(idProduct, planCode, showSpin){
      var vUrl = constants.system.api.endpoints.policy + 'api/salud/descargar/descripcionProducto/' + idProduct + '/' + planCode;
      var vResponseType = {
        responseType: 'arraybuffer'
      };
      return httpData['get'](vUrl, vResponseType, undefined, showSpin);
    }

    function getDetailPlan(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato) {
      return proxySalud.ObtenerArchivoPlan(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, false);
    }

    function getHistoryPlan(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato) {
      return proxySalud.ListarArchivoPlan(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, false);
    }

    function get_TipoPersona() {
      return proxySalud.Get_TipoPersona_ComboBox();
    }

    function getTipoPlan() {
      return proxySalud.GetListTipoPlanSalud();
    }

    function getTipoFraccionamiento() {
      return proxySalud.GetFinanciamientoTronSalud();
    }

    function insertarFraccionamientoSalud(financiamientoSalud) {
      return proxySalud.InsertarFraccionamientoSalud(financiamientoSalud, false);
    }

    function eliminarFraccionamientoSalud(financiamientoSalud) {
      return proxySalud.EliminarFraccionamientoSalud(financiamientoSalud, false);
    }

    function getFraccionamientoSalud(codigoCia, codigoRamo, numeroContrato, numeroSubContrato) {
      return proxySalud.GetFraccionamientoSalud(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, false);
    }

    function insertarValidaEdadSalud(validaEdad) {
      return proxySalud.InsertarValidaEdadSalud(validaEdad, false);
    }

    function eliminarValidaEdadSalud(validaEdad) {
      return proxySalud.EliminarValidaEdadSalud(validaEdad, false);
    }

    function getListaValidaEdadSalud(codigoCia, codigoRamo, numeroContrato, numeroSubContrato) {
      return proxySalud.GetListaValidaEdadSalud(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, false);
    }

    function getListEstadoProductoSalud() {
      return proxySalud.GetListEstadoProductoSalud(false);
    }

    function listarProductoTronPag(params) {
      return proxyProducto.ListarProductoTronPag(params, true);
    }

    function actualizarEstadoProductoSalud(params) {
      return proxyProducto.ActualizarEstadoProductoSalud(params, false);
    }

    function registrarProductoSalud(params) {
      return proxyProducto.RegistrarProductoSalud(params, false);
    }

    function listarProductoGlobal() {
      return proxyProducto.ListarProductoGlobal(true);
    }

    function obtenerProductoGlobal(codigoCia, codigoRamo, numeroContrato, numeroSubContrato) {
      return proxyProducto.ObtenerProductoGlobal(codigoCia, codigoRamo, numeroContrato, numeroSubContrato, true);
    }

    function formatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if (dd === 32) {
          dd = 1;
          mm = today.getMonth()+2;
        }

        if (dd<10) {
          dd='0'+dd
        }
        if (mm<10) {
          mm='0'+mm
        }

        var yyyy = today.getFullYear();
        return today = dd+'/'+mm+'/'+yyyy;
      }
    }

    function getProducts() {
      return proxyProducto.ListarProductoSalud(false);
    }

    function getListEstadoCivil(showSpin) {
      return proxyGeneral.GetListEstadoCivil(showSpin);
    }

    function getNacionalidad(showSpin) {
      return proxyUbigeo.GetListPais(showSpin);
    }

    function getListMotivoSalud(showSpin) {
      return proxyGeneral.GetListMotivoSolicitud(showSpin);
    }

    function getListSeguroSalud(showSpin) {
      return proxyGeneral.GetListSeguroSalud(showSpin);
    }

    function getSuscripcion(nroDocumento, showSpin) {
      return proxySalud.ObtenerSuscripcion(nroDocumento, showSpin);
    }

    function registrarSuscripcion(suscripcion, showSpin) {
      const pathParams = {
				opcMenu: localStorage.getItem('currentBreadcrumb')
			   };
      return httpData.post(
        oimProxyPoliza.endpoint + 'api/salud/suscripcion?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
        suscripcion,
        undefined,
        showSpin
      );
    }

    function getCuestionario(cod_cuestionario, showSpin) {
      return proxySalud.ObtenerPregntasSalud(cod_cuestionario, showSpin);
    }

    function getCuestionarioRespuestas(nro_cuestionario, showSpin) {
      return proxySalud.ObtenerRespuestasSalud(nro_cuestionario, showSpin);
    }

    function getInformacionDocumentos(value, showSpin) {
      return proxySalud.ObtenerListadoDocumentos2(value, showSpin);
    }
    function getInformacionDocumentos1(value, showSpin) {
      return proxySalud.ObtenerListadoDocumentos(value, showSpin);
    }

    function getInformacionDocumentosModal(params, showSpin) {
      return proxySalud.ListarDocumentos(params, showSpin);
    }

    function getReporteDocumentosModal(vParams, showSpin) {
      return httpData['post'](constants.system.api.endpoints.policies.suscripcionSalud + 'wcfSuscripciones/wsrSuscripcion.svc/GenerarReporte/', vParams, {skipAuthorization: true}, showSpin);
    }

    function actualizarDatosCotizacion(vParams, showSpin) {
      return httpData['post'](constants.system.api.endpoints.policies.suscripcionSalud + 'wcfSuscripciones/wsrSuscripcion.svc/Actualizar_Datos_cotizacion/', vParams, {skipAuthorization: true}, showSpin);
    }

    function obtenerPdfCuestionario(numeroDocumento, showSpin) {
      return proxySalud.GenerarDpsSalud(numeroDocumento, showSpin);
    }

    function generarPDF(params, vFileName) {
      mpSpin.start();
      $http.post(constants.system.api.endpoints.policy + 'api/reporte/salud/cotizacion/' + params, undefined, { responseType: "arraybuffer" }).success(
        function(data, status, headers) {
            mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
            mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        });
    }

    function isUserSubscription() {
      return _.contains(constants.module.polizas.salud.roles, oimPrincipal.get_role());
    }
    function PolizaDpsCuestionarioPreguntasEstado(){
      return proxySalud.PolizaDpsCuestionarioPreguntasEstado(false);
    }
    function ListarDpsCuestionarioPreguntas(estado){
      return proxySalud.ListarDpsCuestionarioPreguntas(estado,true);
    }
    function CreacionPregunta(operacion, rpPreguntas){
      return proxySalud.CreacionPregunta(operacion, rpPreguntas, true);
    }

    function ListarImc(showpin){
      return proxySalud.ListarImc(showpin);
    }
    function GrabarImc(imc){
      return proxySalud.GrabarImc(imc, true);
    }
    function ActualizaImc(imc){
      return proxySalud.ActualizaImc(imc, true);
    }
    function EliminaImc(codigoImc){
      return proxySalud.EliminaImc(codigoImc,true);
    }
    function ListarPlanClinicaDigital(){
      return proxyClinicaDigital.ListarPlan(false);
    }
    function ListarFinanciamientoClinicaDigital(codigoCompania, codigoRamo, numeroContrato, numeroSubContrato, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan){
      return proxyClinicaDigital.ListarFinanciamiento(codigoCompania, codigoRamo, numeroContrato, numeroSubContrato, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, true)
    }
    function RegistrarCotizacionClinicaDigital(quotationPost){
      return proxyClinicaDigital.RegistrarCotizacion(quotationPost, true);
    }
    function ObtenerCotizacionClinicaDigital(numeroDocumento, showSpin){
      return proxyClinicaDigital.ObtenerCotizacion(numeroDocumento, showSpin);
    }
    function clinicaDigitalGenerarPDF(params, vFileName) {
      mpSpin.start();
      $http.post(constants.system.api.endpoints.policy + 'api/clinicaDigital/descargar/' + params, undefined, { responseType: "arraybuffer" }).success(
        function(data, status, headers) {
          mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
          mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        });
    }
    function ListarPlanTronPagClinicaFigital(model){
      return proxyClinicaDigital.ListarPlanTronPag(model, true);
    }
    function ListarPlanEstadoClinicaFigital(){
      return proxyClinicaDigital.ListarPlanEstado(false);
    }
    function ActualizaPlanEstadoClinicaFigital(planes){
      return proxyClinicaDigital.ActualizaPlanEstado(planes, false);
    }
    function ObtennerPlanClinicaFigital(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan){
      return proxyClinicaDigital.ObtennerPlan(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, false);
    }
    function ListaFinanciamientoTronClinicaFigital(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan){
      console.log('pasando por factory')
      return proxyClinicaDigital.ListaFinanciamientoPlan(codigoCompania, codigoModalidad, codigoProducto, codigoSubProducto, codigoPlan, false);
    }
    function ActualizaFinanciamientoClinicaFigital(planes){
      return proxyClinicaDigital.ActualizaFinanciamiento(planes, false);
    }
    function EmisionClinicaDigital(dto, showSpin){
      return proxyClinicaDigital.Emision(dto, showSpin);
    }
    function GetEmisionClinicaFigital(numeroEmision, showSpin){
      return proxyClinicaDigital.GetEmision(numeroEmision, showSpin);
    }
    function DescargarPlanProductoClinicaFigital(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, codigoProducto, codigoSubProducto, codigoPlan, showSpin){
      return proxyClinicaDigital.DescargarPlanProducto(codigoRamo, codigoModalidad, numeroContrato, numeroSubContrato, codigoProducto, codigoSubProducto, codigoPlan, showSpin);
    }
    function ObtenerListadoDocumentosClinicaFigital(value, showSpin){
      return proxyClinicaDigital.ObtenerListadoDocumentos(value, showSpin);
    }

    function GetCompaniaSeguroSalud(showSpin) {
      return proxySalud.GetCompaniaSeguroSalud(showSpin);
    }
    function GetTipoCompaniaSeguroSalud(codigoCompania, showSpin) {
      return proxySalud.GetTipoCompaniaSeguroSalud(codigoCompania, showSpin);
    }
    function DeleteAttachFileDocument(numeroDocumento, nombreTemp, showSpin){
      return proxySalud.DeleteAttachFileDocument(numeroDocumento, nombreTemp, showSpin);
    }
    function UpdateDocumentState(suscripcion, showSpin){
      return proxySalud.UpdateDocumentState(suscripcion, showSpin);
    }

    function SetMigracion(dataMigracion) {
      factory.migracion = dataMigracion;
    }

    function GetMigracion(){
      return factory.migracion;
    }

    function GetTipoContrato(showSpin){
      return proxySalud.GetTipoContrato(showSpin);
    }

    function GetTipoSubContrato(tipoContrato, showSpin){
      return proxySalud.GetTipoSubContrato(tipoContrato, showSpin);
    }

    function SendEmail(email, showSpin){
      return proxyMail.SendMailSolicitudSalud(email, showSpin);
    }

    function CotizacionSaludMigracion(cotizacion, showSpin){
      return proxyCotizacion.CotizacionSolicitudMigracion(cotizacion, showSpin);
    }

    function GetAgente() {
      return oimPrincipal.getAgent();
    }

    function ObtenerCotizacionSalud(numeroDocumento, showSpin){
      return proxyCotizacion.ObtenerCotizacion(numeroDocumento, showSpin);
    }

    function GetListPolizas(showSpin){
      return  proxySalud.Get_TipoPolizaMigracion_ComboBox(showSpin);
    }

    function GenerarEmisionPoliza(solicitud, showSpin){
      return proxyEmision.generarEmisionPoliza(solicitud, showSpin);
    }

    function CreacionPlanesMigrar(planMigracion, showSpin){
      return proxySalud.CreacionPlanesMigrar(planMigracion, showSpin);
    }

    function ActualizacionPlanesMigrar(planMigracion, showSpin){
      return proxySalud.ActualizacionPlanesMigrar(planMigracion, showSpin);
    }

    function AgregarPlanesMigrar(planMigracion, showSpin){
      return proxySalud.CreacionPlanesMigrar(planMigracion, showSpin);
    }

    function EliminarPlanesMigrar(codigoPlanMigracion, mcaInh, showSpin){
      return proxySalud.EliminarPlanesMigrar(codigoPlanMigracion, mcaInh, showSpin);
    }

    function ActualizacionReglasAjuste(reglasAjuste, showSpin){
      return proxySalud.ActualizacionReglasAjuste(reglasAjuste, showSpin);
    }

    function EliminarReglasAjuste(idRenovSaludCriterRenovacMpe, mcaInh ,showSpin){
      return proxySalud.EliminarReglasAjuste(idRenovSaludCriterRenovacMpe, mcaInh, showSpin);
    }

    function listarClases() {
      return proxySalud.GetClases('', true);
    }

    function buscarTasasAjustes(filtros, showSpin) {
      return proxySalud.BuscartasaAjustes(filtros, showSpin);
    }

    function registrarTasaAjuste(data, showSpin) {
      return proxySalud.RegistrartasaAjuste(data, showSpin);
    }

    function obtenerTasaAjuste(tasaAjusteId, showSpin) {
      return proxySalud.ObtenertasaAjuste(tasaAjusteId, showSpin);
    }

    function actualizarTasasAjustes(tasaAjusteId, tipo, data, showSpin) {
      return proxySalud.ModificartasaAjuste(tasaAjusteId, tipo, data, showSpin);
    }

    function getListMotivosObservacion(showSpin) {
      return proxySalud.GetMotivosRechazo(showSpin);
    }

    function getListEstadosSolicitud(showSpin) {
      return proxySalud.GetEstadosCotizacion(showSpin);
    }

    function descargarReporteDiagnostico(tipoFormato, fechaInicio, fechaFin, showSpin) {
      return proxySalud.ObtenerdiagnosticosDeclarados(tipoFormato, fechaInicio, fechaFin, showSpin);
    }

    function CargarPlantilla(file) {
      var deferred = $q.defer();
      var formData = new FormData();
      formData.append('file', file);
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
      $http.post(urlBase + 'api/salud/reglasAjuste/creacion', formData, parametros)
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

    function GenerarPdfMigracion(params){
      const urlRequest = oimProxyPoliza.endpoint + 'api/salud/migracion/cotizacion/' + params;
      mpSpin.start();
      $http.get(urlRequest, undefined, { responseType: "arraybuffer"}).success(
        function(res) {
         mainServices.fnDownloadFileBase64(res.mensajeRespuesta, 'pdf', 'Resumen_cotizacion.pdf', false);
          mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        });
    }

    function DiferenciaMeses(fecha1, fecha2) {
      var months;
      months = (fecha2.getFullYear() - fecha1.getFullYear()) * 12;
      months -= fecha1.getMonth();
      months += fecha2.getMonth();
      return months <= 0 ? 0 : months;
    }

    function GenerarCuestionarioFile(quotation, fileName) {
      mpSpin.start();
      $http.get(oimProxyPoliza.endpoint + 'api/salud/dps/' + quotation, undefined, { responseType: "arraybuffer"}).success(
        function(data, status, headers) {
          mainServices.fnDownloadFileBase64(data, 'pdf', fileName, true);
          mpSpin.end();
        },
        function(data, status) {
          mpSpin.end();
          mModalAlert.showError("Error al descargar el documento", 'ERROR');
        }
      );
    }

    var factory = {
      spliceListPrimas: spliceListPrimas,
      getProductsByUser: getProductsByUser,
      getPlan: getPlan,
      getPersonType: getPersonType,
      getFinancingType: getFinancingType,
      getSexo: getSexo,
      getDocumentType: getDocumentType,
      getDataInsured: getDataInsured,
      getCurrencyType: getCurrencyType,
      getPrimaList: getPrimaList,
      postInsuredValidate: postInsuredValidate,
      postQuotationSalud: postQuotationSalud,
      saveQuotationSalud: saveQuotationSalud,
      getQuotationSalud: getQuotationSalud,
      getSaludPDF: getSaludPDF,
      DescargarDescripcionProducto: DescargarDescripcionProducto,
      getDetailPlan: getDetailPlan,
      get_TipoPersona: get_TipoPersona,
      getHistoryPlan: getHistoryPlan,
      getTipoPlan: getTipoPlan,
      getTipoFraccionamiento: getTipoFraccionamiento,
      getFraccionamientoSalud: getFraccionamientoSalud,
      insertarFraccionamientoSalud: insertarFraccionamientoSalud,
      eliminarFraccionamientoSalud: eliminarFraccionamientoSalud,
      insertarValidaEdadSalud: insertarValidaEdadSalud,
      eliminarValidaEdadSalud: eliminarValidaEdadSalud,
      getListaValidaEdadSalud: getListaValidaEdadSalud,
      getListEstadoProductoSalud: getListEstadoProductoSalud,
      listarProductoTronPag: listarProductoTronPag,
      actualizarEstadoProductoSalud: actualizarEstadoProductoSalud,
      registrarProductoSalud: registrarProductoSalud,
      listarProductoGlobal: listarProductoGlobal,
      obtenerProductoGlobal: obtenerProductoGlobal,
      obtenerPolizaxNumero: obtenerPolizaxNumero,
      GetPolizaPorToken: GetPolizaPorToken,
      obtenerContratos: ObtenerContratos,
      formatearFecha: formatearFecha,
      getProducts: getProducts,
      getListEstadoCivil: getListEstadoCivil,
      getNacionalidad: getNacionalidad,
      getListMotivoSalud: getListMotivoSalud,
      getListSeguroSalud: getListSeguroSalud,
      getSuscripcion: getSuscripcion,
      registrarSuscripcion: registrarSuscripcion,
      getCuestionario: getCuestionario,
      getCuestionarioRespuestas: getCuestionarioRespuestas,
      getInformacionDocumentos: getInformacionDocumentos,
      getInformacionDocumentosModal: getInformacionDocumentosModal,
      getReporteDocumentosModal: getReporteDocumentosModal,
      actualizarDatosCotizacion: actualizarDatosCotizacion,
      obtenerPdfCuestionario: obtenerPdfCuestionario,
      generarPDF: generarPDF,
      isUserSubscription: isUserSubscription,
      PolizaDpsCuestionarioPreguntasEstado: PolizaDpsCuestionarioPreguntasEstado,
      ListarDpsCuestionarioPreguntas: ListarDpsCuestionarioPreguntas,
      CreacionPregunta : CreacionPregunta,
      ListarImc: ListarImc,
      GrabarImc: GrabarImc,
      ActualizaImc: ActualizaImc,
      EliminaImc: EliminaImc,
      ListarPlanClinicaDigital: ListarPlanClinicaDigital,
      ListarFinanciamientoClinicaDigital: ListarFinanciamientoClinicaDigital,
      RegistrarCotizacionClinicaDigital:RegistrarCotizacionClinicaDigital,
      ObtenerCotizacionClinicaDigital:ObtenerCotizacionClinicaDigital,
      clinicaDigitalGenerarPDF: clinicaDigitalGenerarPDF,
      ListarPlanTronPagClinicaFigital: ListarPlanTronPagClinicaFigital,
      ListarPlanEstadoClinicaFigital: ListarPlanEstadoClinicaFigital,
      ActualizaPlanEstadoClinicaFigital: ActualizaPlanEstadoClinicaFigital,
      ObtennerPlanClinicaFigital: ObtennerPlanClinicaFigital,
      ListaFinanciamientoTronClinicaFigital: ListaFinanciamientoTronClinicaFigital,
      ActualizaFinanciamientoClinicaFigital: ActualizaFinanciamientoClinicaFigital,
      EmisionClinicaDigital: EmisionClinicaDigital,
      GetEmisionClinicaFigital: GetEmisionClinicaFigital,
      DescargarPlanProductoClinicaFigital: DescargarPlanProductoClinicaFigital,
      ObtenerListadoDocumentosClinicaFigital: ObtenerListadoDocumentosClinicaFigital,
      GetCompaniaSeguroSalud: GetCompaniaSeguroSalud,
      GetTipoCompaniaSeguroSalud: GetTipoCompaniaSeguroSalud,
      DeleteAttachFileDocument: DeleteAttachFileDocument,
      UpdateDocumentState: UpdateDocumentState,
      getInformacionDocumentos1:getInformacionDocumentos1,
      getTipoContrato: GetTipoContrato,
      getTipoSubContrato: GetTipoSubContrato,
      listarPlanesMigracion: ListarPlanesMigracion,
      listarReglasAjuste: ListarReglasAjuste,
      sendEmail: SendEmail,
      generarPdfMigracion: GenerarPdfMigracion,
      cotizacionSaludMigracion: CotizacionSaludMigracion,
      getAgente: GetAgente,
      obtenerCotizacionSalud: ObtenerCotizacionSalud,
      migracion: {},
      setMigracion: SetMigracion,
      getMigracion: GetMigracion,
      getListPolizas: GetListPolizas,
      generarEmisionPoliza: GenerarEmisionPoliza,
      creacionPlanesMigrar: CreacionPlanesMigrar,
      actualizacionPlanesMigrar: ActualizacionPlanesMigrar,
      eliminarPlanesMigrar: EliminarPlanesMigrar,
      actualizacionReglasAjuste: ActualizacionReglasAjuste,
      eliminarReglasAjuste: EliminarReglasAjuste,
      cargarPlantilla: CargarPlantilla,
      agregarPlanesMigrar: AgregarPlanesMigrar,

      listarClases: listarClases,
      buscarTasasAjustes: buscarTasasAjustes,
      registrarTasaAjuste: registrarTasaAjuste,
      obtenerTasaAjuste: obtenerTasaAjuste,
      actualizarTasasAjustes: actualizarTasasAjustes,

      getListMotivosObservacion: getListMotivosObservacion,
      getListEstadosSolicitud: getListEstadosSolicitud,
      descargarReporteDiagnostico: descargarReporteDiagnostico,

      DiferenciaMeses: DiferenciaMeses,
      GenerarCuestionarioFile: GenerarCuestionarioFile
    };

    return factory;
  }

  return angular.module('appSalud').factory('saludFactory', saludFactory);
});
