define([
  'angular', 'constantsRiesgosGenerales', 'constants'
], function (angular, constantsRiesgosGenerales, constants) {
  'use strict';

  angular
    .module("appRrgg")
    .factory('riesgosGeneralesFactory', riesgosGeneralesFactory);

  riesgosGeneralesFactory.$inject = ['httpData', 'mainServices', '$filter'];

  function riesgosGeneralesFactory(httpData, mainServices, $filter) {
    var base = constants.system.api.endpoints.policy;
    var factory = {
      setClaims: SetClaims,
      initCotizacion: InitCotizacion,
      validControlForm: ValidControlForm,
      getSmsError: GetSmsError,
      calculaSumaAsegurada: CalculaSumaAsegurada,
      setCotizacionProducto: SetCotizacionProducto,
      getModelTrabajosEspecificos: GetModelTrabajosEspecificos,
      getModelTrec: GetModelTrec,
      getModelHidrocarburo: GetModelHidrocarburo,
      getModelCar: GetModelCar,
      getModelVigLimp: GetModelVigLimp,
      getModelDemoliciones: GetModelDemoliciones,
      getModelTransporte: GetModelTransporte,
      getModelEventos: GetModelEventos,
      formatearFecha: FormatearFecha,
      FormatearFechaMes: FormatearFechaMes,
      getTramite: GetTramite,
      getEditarCotizacion: GetEditarCotizacion,
      getSourceNumeroEquipos: GetSourceNumeroEquipos,
      getSourceNumeroEndosatario: GetSourceNumeroEndosatario,
      getModelEmision: GetModelEmision,
      currencyType: currencyType,
      setValidadores: setValidadores,
      getModelPrimas: GetModelPrimas,
      getModelSuscriptor: GetModelSuscriptor,
      getModelClonacion: GetModelClonacion,
      ValidateVehiculosHidro: ValidateVehiculosHidro,
      cambiarFormatoDate: cambiarFormatoDate,
      cambiarFormatoDatetime:_cambiarFormatoDatetime,
      convertMiles: convertMiles,
      auth: {},
      parametros: {},
      cotizacion: {},
      tiposDocumento: []
    };
    return factory;
    function InitCotizacion() {
      factory.cotizacion = {
        step: { '1': false, '2': false, '3': false },
        claims: {},
        producto: {},
        emision: {},
        clonar: {},
        form: {},
        tramite: {},
        editar: false
      };
      _setClaimsCotizacion(factory.auth);
    }
    function SetClaims(claims) {
      factory.auth = claims;
    }
    // funciones privadas
    function _setClaimsCotizacion(auth) {
      factory.cotizacion.claims = {
        codigoUsuario: auth && auth.loginUserName,
        rolUsuario: auth && auth.roleCode,
        nombreAgente: auth && auth.agentName,
        codigoAgente: auth && auth.agentID
      }
    }
    function ValidControlForm(form, controlName) {
      var control = form[controlName];
      return control && control.$error.required && !control.$pristine;
    }
    function SetCotizacionProducto(cotizacion) {
      factory.initCotizacion();
      factory.cotizacion = angular.extend({}, factory.cotizacion, cotizacion);
    }
    function FormatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        return today = ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy;
      }
      return fecha;
    }
    function FormatearFechaMes(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        return today = ('0' + mm).substr(-2) + '/' + ('0' + dd).substr(-2) + '/' + yyyy;
      }
      return fecha;
    }
    function GetSourceNumeroEquipos() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return { Descripcion: ('0' + n).substr(-2), Valor: n }; });
    }
    function GetSourceNumeroEndosatario() {
      return [1, 2].map(function (n) { return { Descripcion: ('0' + n).substr(-2), Valor: n }; });
    }
    function convertMiles(monto) {
      var amount = parseFloat(monto)
      return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    function GetSmsError(monto, data) {
      var vSmsMonto;
      var simboloMoneda = data.simboloMoneda ? data.simboloMoneda : "US$ "
      var valorMonto = data.currency ? convertMiles(monto) : monto;
      if (data.moneda) {
        var smsText = parseInt(data.moneda.Codigo) === 2 ? ". " : "";
      }
      if (constantsRiesgosGenerales.VAL_CONTRATO === data.tipoContrato)
        vSmsMonto = 'El monto supera el VC máximo: ' + simboloMoneda + " " + valorMonto + smsText;
      if (constantsRiesgosGenerales.RAMO.RESPON_CIVIL === data.tipoContrato)
        vSmsMonto = 'El monto supera la suma asegurada máxima: ' + simboloMoneda + " " + valorMonto + smsText;
      if (constantsRiesgosGenerales.RAMO.DESHONESTIDAD === data.tipoContrato)
        vSmsMonto = 'El límite de suma asegurada para Deshonestidad es de: ' + simboloMoneda + " " + valorMonto + smsText;
      if (data.canEquipos === constantsRiesgosGenerales.DATOS.EQUIPOS.ONE)
        vSmsMonto = 'El límite máximo por máquina es de: ' + simboloMoneda + " " + convertMiles(parseFloat(data.montoMaxTwo)) +
          ' (>2 máquinas), Para asegurar una máquina el límite es ' + simboloMoneda + " " + convertMiles(parseFloat(data.montoMaxOne)) + smsText;
      if (data.canEquipos >= constantsRiesgosGenerales.DATOS.EQUIPOS.TWO)
        vSmsMonto = 'El límite máximo por máquina es de: ' + simboloMoneda + " " + convertMiles(parseFloat(data.montoMaxTwo)) + smsText;
      if (data.validator === constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD)
        vSmsMonto = 'El límite permitido de Descuento es de ' + valorMonto + '%, por favor volver a ingresar el descuento. ';
      if(data.producto === constantsRiesgosGenerales.GRUPO.CARLITE){
        vSmsMonto = vSmsMonto +  " Para montos mayores, utilizar el producto CAR";
      }else{
        vSmsMonto = vSmsMonto + " Para montos mayores, SOLICITAR VoBo al Área de Suscripción.";
      }
      return vSmsMonto;
    }
    function CalculaSumaAsegurada(data) {
      var totalEquipo = factory.cotizacion.producto.modelo.ValorEquipos;
      var SumaTope = data.montoMaxOne;
      var calc = 0.3 * totalEquipo
      var SumaAsegurada = calc <= SumaTope ? calc : SumaTope
      return parseFloat(SumaAsegurada).toFixed(2);
    }
    function currencyType(moneda) {
      var type = "";
      if (moneda == constantsRiesgosGenerales.MONEDA.SOLES) type = "S/ "
      if (moneda == constantsRiesgosGenerales.MONEDA.DOLARES) type = "US$ "
      return type
    }
    function _cambiarFormatoDatetime(fecha) {
      var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'yyyy-MM-dd') : fecha;
      return fechaModificada;
    }
    function cambiarFormatoDate(fecha) {
      var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
      return fechaModificada;
    }
    function setValidadores(documento) {
      var tipoDoc = documento.TipDoc.Valor || documento.TipDoc.TipoDocumento
      if (!!tipoDoc) {
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, tipoDoc, 1);
        documento.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        documento.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
      }
    }
    function GetModelTrabajosEspecificos() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "CodTipoTrabajo": '',
        "CodRamo": factory.cotizacion.producto.modelo.Ramo.Codigo,
        "CantTrabajadores": parseInt(factory.cotizacion.producto.modelo.CantTrabajadores),
        "Ubicacion": factory.cotizacion.producto.modelo.Ubicacion,
        "ObraRealizar": factory.cotizacion.producto.modelo.ObraRealizar,
        "ValorContrato": factory.cotizacion.producto.modelo.ValorContrato,
        "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAsegurada || 0,
        "SumaAseguradaDesh": factory.cotizacion.producto.modelo.SumaAseguradaDesh || 0,
        "FechaDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaDesde),
        "FechaHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaHasta),
        "RcPatronal": factory.cotizacion.producto.modelo.RcPatronal,
        "RcContractual": factory.cotizacion.producto.modelo.RcContractual,
        "AdicionarTercero": factory.cotizacion.producto.modelo.AdicionarTercero,
        "NombreTercero": factory.cotizacion.producto.modelo.NombreTercero,
        "EndosarDeshonestidad": factory.cotizacion.producto.modelo.EndosarDeshonestidad,
        "NombreEndosarDeshonestidad": factory.cotizacion.producto.modelo.NombreEndosarDeshonestidad || "",
        "Ingresatrabajadores": factory.cotizacion.producto.modelo.Ingresatrabajadores,
      };
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function GetModelTrec() {
      var globalParameter = _getModelGeneralDTO();
      var parameterTrec = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "CodTipoTrabajo": factory.cotizacion.producto.modelo.TipoTrabajo.Codigo,
        "ObraRealizar": factory.cotizacion.producto.modelo.ObraRealizar,
        "Ubicacion": factory.cotizacion.producto.modelo.Ubicacion,
        "EndosaDeshonestidad": parseInt(factory.cotizacion.producto.modelo.EndosaDeshonestidad),
        "NombreEndosaDeshonestidad": factory.cotizacion.producto.modelo.NombreEndosaDeshonestidad,
        "CantidadElementos": parseInt(factory.cotizacion.producto.modelo.CantidadElementos.Valor),
        "listaEquipos": _getEquiposDTO(factory.cotizacion.producto.modelo.listaEquipos),
        "ValorEquipos": factory.cotizacion.producto.modelo.ValorEquipos,
        "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAsegurada || 0,
        "SumaAseguradaAux": factory.cotizacion.producto.modelo.SumaAseguradaAux || 0,
        "CodTipoEquipo": factory.cotizacion.producto.modelo.TipoTrabajo.Codigo,
        "TrabajaGoldfields": factory.cotizacion.producto.modelo.TrabajaGoldfields.Codigo,
        "CodVigencia": factory.cotizacion.producto.modelo.Vigencia.Codigo,
        "AseguraAdicional": parseInt(factory.cotizacion.producto.modelo.AseguraAdicional),
        "NombreAseguraAdicional": factory.cotizacion.producto.modelo.NombreAseguraAdicional || "",
        "UnEquipo": factory.cotizacion.producto.modelo.UnEquipo ? factory.cotizacion.producto.modelo.UnEquipo.Codigo : "",
        "ContrataRc": factory.cotizacion.producto.modelo.ContrataRc.Codigo,
        "ContrataNac": factory.cotizacion.producto.modelo.ContrataNac.Codigo,
        "ContrataMed": factory.cotizacion.producto.modelo.ContrataMed.Codigo,
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterTrec);
      return parameterProducto
    }
    function GetModelHidrocarburo() {
      var globalParameter = _getModelGeneralDTO();
      var parameterHidrocarburo = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "CodCobertura": factory.cotizacion.producto.Cobertura.Codigo,
        "CodGiro": factory.cotizacion.producto.modelo.Giro.Codigo,
        "TipoAseguramiento": factory.cotizacion.producto.modelo.TipoAseguramiento.Codigo,
        "AseguraAdicional": factory.cotizacion.producto.modelo.AseguraAdicional,
        "NombreAseguraAdicional": factory.cotizacion.producto.modelo.NombreAseguraAdicional,
        "IsVehiculoOrLocal": factory.cotizacion.producto.modelo.IsVehiculoOrLocal,
        "CantidadUit": parseInt(factory.cotizacion.producto.modelo.CantidadUit),
        "CantidadUitCalculada": parseInt(factory.cotizacion.producto.modelo.CantidadUitCalculada),
        "ValorUit": factory.cotizacion.producto.modelo.ValorUit,
        "SumaAseguradaSoles": factory.cotizacion.producto.modelo.SumaAseguradaSoles,
        "SumaAseguradaDolares": factory.cotizacion.producto.modelo.SumaAseguradaDolares,
        "PrimaNeta": factory.cotizacion.producto.modelo.PrimaNeta,
        "PrimaTotal": factory.cotizacion.producto.modelo.PrimaTotal,
        "listaVehiculos": factory.cotizacion.producto.modelo.listaVehiculos ? _getVehiculosDTO(factory.cotizacion.producto.modelo.listaVehiculos) : "",
        "listaUbicaciones": factory.cotizacion.producto.modelo.listaUbicaciones ? _getLocalesDTO(factory.cotizacion.producto.modelo.listaUbicaciones) : "",
        "SumaAseguradaAMT": _getOnlyAMT() ? factory.cotizacion.producto.modelo.SumaAseguradaAMT.Dato : 0,
        "NroUnidadesAMT": _getOnlyAMT() ? factory.cotizacion.producto.modelo.NumeroUnidades : 0,
        "PrimaNetaAMT": _getOnlyAMT() ? factory.cotizacion.producto.modelo.PrimaNetaAmt : 0,
        "PrimaTotalAMT": _getOnlyAMT() ? factory.cotizacion.producto.modelo.PrimaTotalAmt : 0,
        "CantidadElementos": factory.cotizacion.producto.modelo.IsVehiculoOrLocal === constantsRiesgosGenerales.DATOS.VEHICULOS ? parseInt(factory.cotizacion.producto.modelo.NumeroUnidades) : parseInt(factory.cotizacion.producto.modelo.CantidadElementos),
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterHidrocarburo);
      return parameterProducto
    }
    function GetModelCar() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "TipoProyecto": factory.cotizacion.producto.modelo.TipoProyecto.Codigo,
        "Obra": factory.cotizacion.producto.modelo.Obra,
        "Lugar": factory.cotizacion.producto.modelo.Lugar,
        "Endosatorio": factory.cotizacion.producto.modelo.Endosatorio,
        "EndosadoA": factory.cotizacion.producto.modelo.EndosadoA,
        "MontoObra": factory.cotizacion.producto.modelo.MontoObra,
        "DuracionDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionDesde),
        "DuracionHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionHasta),
        "AseguradoAdicional": factory.cotizacion.producto.modelo.AseguradoAdicional,
        "NombreAseguradoAdicional": factory.cotizacion.producto.modelo.NombreAseguradoAdicional,
      };
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function GetModelVigLimp() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "Ramo": factory.cotizacion.producto.modelo.Ramo.Codigo,
        "ActividadRealizar": factory.cotizacion.producto.modelo.ActividadRealizar.Codigo,
        "Ubicacion": factory.cotizacion.producto.modelo.Ubicacion,
        "UsasArmas": factory.cotizacion.producto.modelo.UsasArmas,
        "SumaAseguradaRC": factory.cotizacion.producto.modelo.SumaAseguradaRC,
        "SumaAseguradaDesh": factory.cotizacion.producto.modelo.SumaAseguradaDesh,
        "MasUbicaciones": factory.cotizacion.producto.modelo.MasUbicaciones,
        "Ingresatrabajadores": factory.cotizacion.producto.modelo.Ingresatrabajadores,
        "CantidadUbicaciones": parseInt(factory.cotizacion.producto.modelo.CantidadUbicaciones) || 0,
        "CantidadTrabajadores": parseInt(factory.cotizacion.producto.modelo.CantidadTrabajadores) || 0,
        "DuracionDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionDesde),
        "DuracionHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionHasta),
        "AdicionarTercero": factory.cotizacion.producto.modelo.AdicionarTercero,
        "NombreTercero": factory.cotizacion.producto.modelo.NombreTercero,
        "EndosaDeshonestidad": factory.cotizacion.producto.modelo.EndosaDeshonestidad,
        "NombreEndosaDeshonestidad": factory.cotizacion.producto.modelo.NombreEndosaDeshonestidad,
        "NumeroDocumento": factory.cotizacion.producto.modelo.NumeroDocumento
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function GetModelDemoliciones() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "CodRamo": factory.cotizacion.producto.modelo.Ramo.Codigo,
        "NombreAsegurado": factory.cotizacion.producto.modelo.NombreAsegurado,
        "ObraRealizar": factory.cotizacion.producto.modelo.ObraRealizar,
        "Ubicacion": factory.cotizacion.producto.modelo.Ubicacion,
        "FechaDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaDesde),
        "FechaHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaHasta),
        "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAsegurada
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function GetModelTransporte() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "CodigoRamo": factory.cotizacion.producto.modelo.Ramo.Codigo,
        "CodigoRadio": factory.cotizacion.producto.modelo.CodigoRadio ? factory.cotizacion.producto.modelo.CodigoRadio.Codigo : "",
        "CodigoEmbalaje": factory.cotizacion.producto.modelo.Embalaje.Codigo,
        "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAsegurada,
        "RadioAccionDesde": factory.cotizacion.producto.modelo.RadioAccionDesde,
        "RadioAccionHasta":factory.cotizacion.producto.modelo.RadioAccionHasta,
        "DuracionDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionDesde),
        "DuracionHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.DuracionHasta),
        "MateriaAsegurada": factory.cotizacion.producto.modelo.MateriaAsegurada,
        "NombreCliente": factory.cotizacion.producto.modelo.NombreCliente,
        "Direccion": factory.cotizacion.producto.modelo.Direccion,
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function GetModelEventos() {
      var globalParameter = _getModelGeneralDTO();
      var parameterEspecificos = {
        "NombreContratante": factory.cotizacion.producto.modelo.NombreContratante,
        "FechaDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaDesde),
        "FechaHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaHasta),
        "CodRamo": factory.cotizacion.producto.modelo.Ramo.Codigo,
        "NombreAsegurado": factory.cotizacion.producto.modelo.NombreAsegurado,
        "ObraRealizar": factory.cotizacion.producto.modelo.ObraRealizar,
        "Ubicacion": factory.cotizacion.producto.modelo.Ubicacion,
        "FechaEventoDesde": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaEventoDesde),
        "FechaEventoHasta": _cambiarFormatoDatetime(factory.cotizacion.producto.modelo.FechaEventoHasta),
        "Aforo": parseInt(factory.cotizacion.producto.modelo.Aforo),
        "Seguridad": factory.cotizacion.producto.modelo.Seguridad,
        "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAsegurada,
      }
      var parameterProducto = angular.extend({}, globalParameter, parameterEspecificos);
      return parameterProducto;
    }
    function _getModelGeneralDTO() {
      return {
        "TipoProducto": factory.cotizacion.producto.CodigoRiesgoGeneral,
        "CodigoGrupoProducto": factory.cotizacion.producto.Grupo,
        "NumeroTramite": factory.getTramite().NroTramite || 0,
        "FechaCotizacion": _cambiarFormatoDatetime(new Date()),
        "CodigoAgente": parseInt(factory.cotizacion.claims.codigoAgente),
        "NombreCorredor": factory.cotizacion.producto.modelo.NombreCorredor,
        "CodigoMoneda": parseInt(factory.cotizacion.producto.modelo.Moneda.Codigo),
        "TipoCambio": parseFloat(factory.cotizacion.tipoCambio),
        "DescuentoDirector": parseFloat(factory.cotizacion.producto.modelo.DescuentoDirector) || 0
      }
    }
    function GetModelEmision() {
      return {
        "CodigoGrupoProducto": factory.cotizacion.emision.modelo.tramite.Grupo,
        "Ruc": factory.cotizacion.emision.modelo.Ruc,
        "CodigoAgente": factory.cotizacion.emision.modelo.tramite.CodigoAgente,
        "FormaPago": factory.cotizacion.emision.modelo.FormaPago.Codigo,
        "NumeroTramite": parseInt(factory.cotizacion.emision.modelo.tramite.NroTramite),
        "CodigoPais": factory.cotizacion.emision.modelo.Pais,
        "CodigoEstado": factory.cotizacion.emision.modelo.Estado.Codigo,
        "IdPlataformaRC": parseInt(factory.cotizacion.emision.modelo.IdPlataforma),
        "IdPlataformaDesh": parseInt(factory.cotizacion.emision.modelo.IdPlataformaDesh),
        "CantidadEndosatarios": factory.cotizacion.emision.modelo.endosatarios ? factory.cotizacion.emision.modelo.endosatarios.length : 0,
        "ListEndosatorio": factory.cotizacion.emision.modelo.endosatarios ? _getEndosatarioDTO(factory.cotizacion.emision.modelo.endosatarios) : [],
        "CodTipoEquipo": factory.cotizacion.emision.modelo.TipoEquipo ? factory.cotizacion.emision.modelo.TipoEquipo.Codigo : "",
        "InicioVigencia": _cambiarFormatoDatetime(factory.cotizacion.emision.modelo.FechaDesde),
        "FinVigencia": _cambiarFormatoDatetime(factory.cotizacion.emision.modelo.FechaHasta),
        "CodigoProducto": parseInt(factory.cotizacion.emision.modelo.tramite.IdProducto),
        "ListTrabajador": factory.cotizacion.emision.modelo.listaPlanillas[0].listaTrabajador ? _getTrabajadorDTO(factory.cotizacion.emision.modelo.listaPlanillas[0].listaTrabajador) : [],
        "ListaUbicaciones": factory.cotizacion.emision.modelo.listaPlanillas[1] && factory.cotizacion.emision.modelo.listaPlanillas[1].listaUbicaciones
          ? _getUbicacionesDTO(factory.cotizacion.emision.modelo.listaPlanillas[1].listaUbicaciones) : [],
        "TipoDocumentoEndosatorio": factory.cotizacion.emision.modelo.endosatarios.length ? factory.cotizacion.emision.modelo.endosatarios[0].TipDocumento.Valor : "",
        "DocumentoEndosatorio": factory.cotizacion.emision.modelo.endosatarios.length ? factory.cotizacion.emision.modelo.endosatarios[0].NroDocumento : "",
        "ValorEndosado": factory.cotizacion.emision.modelo.endosatarios.length ? factory.cotizacion.emision.modelo.endosatarios[0].ValorEndoso : "",
        "TipoProyecto": factory.cotizacion.emision.modelo.TipoProyecto ? factory.cotizacion.emision.modelo.TipoProyecto.Codigo : "",
        "CodigoMoneda": factory.cotizacion.emision.modelo.Moneda ? factory.cotizacion.emision.modelo.Moneda.Codigo : "",
        "CodigoTransporte": factory.cotizacion.emision.modelo.tipoTransporte ? factory.cotizacion.emision.modelo.tipoTransporte.Codigo : "",
        "CodigoMateriaAsegurada": factory.cotizacion.emision.modelo.materiaAsegurada ? factory.cotizacion.emision.modelo.materiaAsegurada.Codigo : "",
        "CodigoEmbalaje": factory.cotizacion.emision.modelo.embalaje ? factory.cotizacion.emision.modelo.embalaje.Codigo : "",
        "CodigoValuacion": factory.cotizacion.emision.modelo.valuacionMer ? factory.cotizacion.emision.modelo.valuacionMer.Codigo : "",
        "CodigoSuscripcion": factory.cotizacion.emision.modelo.TipSucripcion ? factory.cotizacion.emision.modelo.TipSucripcion.Codigo : "",
        "NroGuiaFacturaProforma": factory.cotizacion.emision.modelo.guia || factory.cotizacion.emision.modelo.tramite.guia,
        "UserEmail": factory.cotizacion.emision.modelo.tramite.userEmail,
        "CodigoRamo": factory.cotizacion.emision.modelo.tramite.ResCotizacion.Ramo ? factory.cotizacion.emision.modelo.tramite.ResCotizacion.Ramo.ValorRamo :
          factory.cotizacion.emision.modelo.tramite.ResCotizacion.Cobertura.ValorCobertura
      }
    }
    function GetModelSuscriptor() {
      return {
        "CodProducto": factory.cotizacion.emision.modelo.tramite.IdProducto,
        "CodigoGrupoProducto": factory.cotizacion.emision.modelo.tramite.Grupo,
        "numeroTramite": factory.cotizacion.emision.modelo.tramite.NroTramite,
        "CodigoUsr": factory.cotizacion.emision.modelo.tramite.loginUserName,
        "CodigoAgente": parseInt(factory.cotizacion.emision.modelo.tramite.CodigoAgente),
        "NombreAgente": factory.cotizacion.emision.modelo.tramite.ResCotizacion.Agente.Descripcion,
        "TipoDocumento": factory.cotizacion.emision.modelo.TipDoc.TipoDocumento,
        "NumeroDocumento": factory.cotizacion.emision.modelo.NumeroDoc,
        "NombreCliente": factory.cotizacion.emision.modelo.Nombres,
        "CodigoMoneda": parseInt(factory.cotizacion.emision.modelo.Moneda.Codigo),
        "CodTipoFracc": parseInt(factory.cotizacion.emision.modelo.Fraccionamiento.Codigo),
        "ListaCorreos": _getListCorreosDTO(factory.cotizacion.emision.modelo.emails),
        "ListaComentarios": _getComentariosDTO(factory.cotizacion.emision.modelo.documentacion),
        "ListaDocumentos": factory.cotizacion.emision.modelo.documentacionAll ? _getDocumentosDTO(Object.values(factory.cotizacion.emision.modelo.documentacionAll)) : []
      }
    }
    function GetModelPrimas() {
      return {
        "TipoProducto": factory.cotizacion.producto.CodigoRiesgoGeneral,
        "CodigoGrupoProducto": factory.cotizacion.producto.Grupo,
        "FechaCotizacion": _cambiarFormatoDatetime(new Date()),
        "DescuentoDirector": factory.cotizacion.producto.modelo.DescuentoDirector,
        "SumaAseguradaAMT": _getOnlyAMT() ? factory.cotizacion.producto.modelo.SumaAseguradaAMT.Dato : 0,
        "CodigoCobertura": factory.cotizacion.producto.Cobertura.Codigo,
        "CodigoMoneda": parseInt(factory.cotizacion.producto.modelo.Moneda.Codigo),
        "TipoCambio": parseFloat(factory.cotizacion.tipoCambio),
        "CodGiro": factory.cotizacion.producto.modelo.Giro.Codigo,
        "TipoAseguramiento": factory.cotizacion.producto.modelo.TipoAseguramiento.Codigo,
        "IsVehiculoOrLocal": factory.cotizacion.producto.modelo.IsVehiculoOrLocal,
        "CantidadUit": parseInt(factory.cotizacion.producto.modelo.CantidadUit),
        "ValorUit": parseInt(factory.cotizacion.producto.modelo.ValorUit),
        "listaVehiculos": Array.isArray(factory.cotizacion.producto.modelo.listaVehiculos) ? _getVehiculosDTO(factory.cotizacion.producto.modelo.listaVehiculos) : "",
        "listaUbicaciones": Array.isArray(factory.cotizacion.producto.modelo.listaUbicaciones) ? _getLocalesDTO(factory.cotizacion.producto.modelo.listaUbicaciones) : ""
      }
    }
    function GetModelClonacion() {
      return {
        "TipoRegistro": factory.cotizacion.clonar.TipoRegistro,
        "CodigoProducto": factory.cotizacion.clonar.CodigoRiesgoGeneral,
        "NombreNuevoProducto": factory.cotizacion.clonar.NombreProducto,
        "CodAgente": parseInt(factory.auth.userId)
      }
    }
    function _getOnlyAMT() {
      return factory.cotizacion.producto.Cobertura.Codigo === constantsRiesgosGenerales.COBERTURAS.RC_AMT && factory.cotizacion.producto.modelo.IsVehiculoOrLocal === constantsRiesgosGenerales.DATOS.VEHICULOS
    }
    function _getListCorreosDTO(emails) {
      return emails.map(function (item) {
        return {
          "Correo": item.email
        }
      })
    }
    function _getComentariosDTO(documentacion) {
      return documentacion.map(function (item) {
        return {
          "Texto": item.comentarios,
          "Fecha": new Date(),
          "TipoGrupo": item.TipoGrupo
        }
      })
    }
    function _getDocumentosDTO(documentos) {
      return documentos.map(function (item) {
        return {
          "NombreArchivo": item.name,
          "TipoDocumento": item.tipoDocumentoFile.TipoDocumento,
          "TipoGrupo": item.TipoGrupo
        }
      })
    }
    function _getEndosatarioDTO(endosa) {
      return endosa.map(function (endosa) {
        return {
          "TipDocumento": endosa.TipDocumento.Valor,
          "NroDocumento": endosa.NroDocumento,
          "ValorEndoso": endosa.ValorEndoso
        }
      })
    }
    function _getTrabajadorDTO(trabajador) {
      return trabajador.map(function (trabajador) {
        return {
          "Orden": trabajador.Orden,
          "NroDocumento": trabajador.NroDocumento,
          "NombreCompleto": trabajador.NombreCompleto,
        }
      })
    }
    function _getEquiposDTO(equipos) {
      return equipos.map(function (equipo) {
        return {
          "Orden": equipo.Orden,
          "ValorEquipo": equipo.ValorEquipo,
          "CodDescripcion": equipo.Descripcion.Codigo,
          "DetalleEquipo": equipo.DetalleEquipo,
          "MarcaEquipo": equipo.MarcaEquipo,
          "Anio": parseInt(equipo.Anio),
          "SerieMotor": equipo.SerieMotor
        };
      });
    }
    function _getVehiculosDTO(vehiculos) {
      return vehiculos.map(function (vehiculo) {
        return {
          "Orden": vehiculo.Orden,
          "CodigoClase": vehiculo.CodigoClase,
          "MarcaEquipo": vehiculo.MarcaEquipo,
          "ModeloEquipo": vehiculo.ModeloEquipo,
          "PlacaEquipo": vehiculo.PlacaEquipo,
          "SerieMotor": vehiculo.SerieMotor,
          "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAseguradaAMT ? factory.cotizacion.producto.modelo.SumaAseguradaAMT.Dato : 0,
          "Uit": vehiculo.Uit || 0
        }
      });
    }
    function _getUbicacionesDTO(ubicaciones) {
      return ubicaciones.map(function (Ubicacion) {
        return {
          "Orden": Ubicacion.Orden,
          "Direccion": Ubicacion.Direccion
        }
      });
    }
    function _getLocalesDTO(locales) {
      return locales.map(function (local) {
        return {
          "Orden": local.Orden,
          "Direccion": local.Direccion,
          "SumaAsegurada": factory.cotizacion.producto.modelo.SumaAseguradaAMT ? factory.cotizacion.producto.modelo.SumaAseguradaAMT.Dato : 0,
          "Uit": local.Uit || 0
        }
      });
    }
    function GetTramite() {
      return {
        "NroTramite": factory.cotizacion.tramite ? parseInt(factory.cotizacion.tramite.NroTramite) : 0,
        "Grupo": factory.cotizacion.tramite ? factory.cotizacion.tramite.Grupo : '',
        "IdProducto": factory.cotizacion.tramite ? parseInt(factory.cotizacion.tramite.IdProducto) : 0,
        "CodigoAgente": factory.cotizacion.tramite ? parseInt(factory.cotizacion.tramite.CodigoAgente) : 0,
        "CantTrabajadores": factory.cotizacion.tramite ? parseInt(factory.cotizacion.tramite.CantTrabajadores) : 0,
        "TipoEmision": factory.cotizacion.tramite ? parseInt(factory.cotizacion.tramite.TipoEmision) : 0,
        "Cobertura": factory.cotizacion.tramite ? factory.cotizacion.tramite.Cobertura : "",
        "Moneda": factory.cotizacion.tramite ? factory.cotizacion.tramite.Moneda : "",
        "Vigencia": factory.cotizacion.tramite ? factory.cotizacion.tramite.Vigencia : "",
        "FechaCotizacion": factory.cotizacion.tramite ? factory.cotizacion.tramite.FechaCotizacion : "",
        "ResCotizacion": factory.cotizacion.tramite ? factory.cotizacion.tramite.ResCotizacion : ""
      }
    }
    function GetEditarCotizacion() {
      return factory.cotizacion.editar;
    }
    function ValidateVehiculosHidro() {
      var tracto = false;
      var noTracto = false;
      factory.cotizacion.producto.modelo.listaVehiculos.map(function (vehiculo) {
        switch (vehiculo.CodigoClase.Valor) {
          case "S0242":
            tracto = true;
            noTracto = true;
            break;
          case "S0240":
            tracto = true;
            break;
          case "S0241":
            noTracto = true;
            break;
        }
      });
      return tracto && noTracto;
    }
  }

});
