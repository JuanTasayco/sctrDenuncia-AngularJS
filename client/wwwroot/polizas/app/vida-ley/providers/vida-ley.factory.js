define([
  'angular', 'lodash', 'constants', 'constantsVidaLey'
], function (angular, _, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .factory('vidaLeyFactory', VidaLeyFactory);

  VidaLeyFactory.$inject = ['$http', '$q', '$rootScope', 'oimPrincipal', 'mainServices', 'proxyVidaLey'];

  function VidaLeyFactory($http, $q, $rootScope, oimPrincipal, mainServices, proxyVidaLey) {
    var factory = {
      getControllerNameStep: GetControllerNameStep,
      getTemplateStep: GetTemplateStep,
      getControllerNameStepEmision: GetControllerNameStepEmision,
      getTemplateStepEmision: GetTemplateStepEmision,
      setClaims: SetClaims,
      isUserRoot: IsUserRoot,
      setParametros: SetParametros,
      getUser: GetUser,
      clearCotizacion: ClearCotizacion,
      initCotizacion: InitCotizacion,
      setCotizacion: SetCotizacion,
      setCompleteStep: SetCompleteStep,
      getCompleteStepQuote: GetCompleteStepQuote,
      getCompleteStepEmit: GetCompleteStepEmit,
      setDuracionDeclaracion: SetDuracionDeclaracion,
      setAgenteCotizacion: SetAgenteCotizacion,
      initiliceRiesgos: InitiliceRiesgos,
      agregarRiesgo: AgregarRiesgo,
      getCoberturas: GetCoberturas,
      getNameFrecuencia: GetNameFrecuencia,
      getValorFrecuencia: GetValorFrecuencia,
      getDuracionCobertura: GetDuracionCobertura,
      validStepContratante: ValidStepContratante,
      validStepContratanteNew: ValidStepContratanteNew,
      validStepPoliza: ValidStepPoliza,
      validStepRiesgos: ValidStepRiesgos,
      validStepResultados: ValidStepResultados,
      getTotalCompletadoAseguradosRiesgo: GetTotalCompletadoAseguradosRiesgo,
      setParametrosContratante: SetParametrosContratante,
      getParametrosContratante: GetParametrosContratante,
      setActivity: SetActivity,
      getParametrosContacto: GetParametrosContacto,
      setRespuestaContratante: SetRespuestaContratante,
      getParametrosRiesgo: GetParametrosRiesgo,
      getParametrosGrabarPoliza: GetParametrosGrabarPoliza,
      getParametrosGrabarCotizacion: GetParametrosGrabarCotizacion,
      getParametrosSolicitudRechazada: GetParametrosSolicitudRechazada,
      getParametrosSolicitudAceptada: GetParametrosSolicitudAceptada,
      getParametrosSolicitudAceptada2: getParametrosSolicitudAceptada2,
      getParametrosAseguradosIndividual: GetParametrosAseguradosIndividual,
      getParametrosAseguradosMasivo: GetParametrosAseguradosMasivo,
      getParametrosCalcularPrima: GetParametrosCalcularPrima,
      getParametrosCalcularPrimaFlujoAlterno: GetParametrosCalcularPrimaFlujoAlterno,
      getParametrosReCalcularPrima: GetParametrosReCalcularPrima,
      setSolicitudCotizacion: SetSolicitudCotizacion,
      setNumMovimientoCarga: SetNumMovimientoCarga,
      setCalcularPrima: SetCalcularPrima,
      cotizacionObservable: CotizacionObservable,
      formatearFecha: FormatearFecha,
      validControlForm: ValidControlForm,
      isUndefinedOrNullOrEmpty: IsUndefinedOrNullOrEmpty,
      isMultiriesgo: IsMultiriesgo,
      getCategoriaDefault: GetCategoriaDefault,
      getSourceNumeroAsegurados: GetSourceNumeroAsegurados,
      getFechaMaximaAdulto: GetFechaMaximaAdulto,
      getExistCexCipPex: GetExistCexCipPex,
      getValidParametrosBuscarPersona: GetValidParametrosBuscarPersona,
      getParametrosPoliza: GetParametrosPoliza,
      setInfoAplicacion: SetInfoAplicacion,
      getInfoAplicacion: GetInfoAplicacion,
      auth: {},
      parametros: {},
      cotizacion: {},
      emision: {},
      principal: {},
      tiposDocumento: [],
      getCodObject: getCodObject,
      setParametrosContacto: SetParametrosContacto,
      setResumeStep1Emit: SetResumeStep1Emit,
      setStep1Emit: SetStep1Emit,
      getPersonData: GetPersonData,
      setStep2Emit: SetStep2Emit,
      setRiskCenter: SetRiskCenter,
      getRiskCenter: GetRiskCenter,
      getStep1Emit: GetStep1Emit,
      getStep2Emit: GetStep2Emit,
      paramsStep1Emit: ParamsStep1Emit,
      setParamsStep1Emit: SetParamsStep1Emit,
      getRiesgos: GetRiesgos,
      getCurrentUserPermissions: GetCurrentUserPermissions,
      getClausulaAutomatica: GetClausulaAutomatica,
      getUserActualRole: GetUserActualRole,
      setRiesgoMontoTopado: setRiesgoMontoTopado,
      setRiegosAC: SetRiegosAC,
      getRiegosAC: GetRiegosAC,
      FormatRiegoManual: FormatRiegoManual,
      agregarRiesgoAC: AgregarRiesgoAC,
      storageVidaLey: storageVidaLey
    };

    const MAXDAYS = 30;
    var baseView = '/polizas/app/vida-ley/views';
    var duracionDefault = { fechaInicial: '', fechaFinal: '', tipoDeclaracionDesc: '', tipoDeclaracion: '', duracion: 0, modelo: {} };
    var estructuraRiesgoDefault = { tipo: 0, numRiesgo: 0, numMovimiento: '', codigoCategoria: '', nomCategoria: '', numeroTrabajadores: 0, montoTrabajadores: 0, montoTopado: 0, montoTrabajadoresReal: 0, montoPrimaNeta: 0, asegurados: [], errorFile: 2, fileName: '', planilla: (void 0), coberturas: [], modelo: {} };

    return factory;

    function ClearCotizacion() {
      factory.cotizacion = {};
    }

    function InitCotizacion() {
      if (!!factory.cotizacion.init) return (void 0);
      factory.cotizacion = {
        init: false,
        step: { '1': false, '2': false, '3': false },
        claims: {},
        modelo: {},
        contratante: {},
        riesgos: [],
        riesgosAC: [],
        duracion: {},
        solicitudCotizacion: {},
        prima: {},
        numDoc: '',
        codProd: '',
        numeroPoliza: '',
        fecEfecRecibo: "",
        fecVctoRecibo: "",
        montoTopado: 0,
        infoAplicacion: {},
        CodTipDeclara: 0
      };

      _setClaimsCotizacion(factory.auth);
      _setDefaultCotizacionAgente(factory.auth);
      _setContratante();

      factory.cotizacion.duracion = angular.copy(duracionDefault);
    }

    function SetRiegosAC(riegosAC) {
      factory.cotizacion.riesgosAC = riegosAC;
    }

    function GetRiegosAC() {
      return factory.cotizacion;
    }


    function SetCotizacion(cotizacion, secuencia) {
      factory.initCotizacion();
      _setSecuencia(secuencia);
      factory.cotizacion.init = true;
      factory.cotizacion.clausulaManual = cotizacion.Actividad.DescripcionClausulaManual;
      factory.cotizacion.codActividad = cotizacion.Actividad.CodActividad;
      factory.cotizacion.codEstado = cotizacion.Principal.CodEstado;
      factory.cotizacion.numeroPoliza = cotizacion.Principal.NumPolizaTemp || factory.cotizacion.numeroPoliza;
      factory.cotizacion.numDoc = cotizacion.Principal.NumDoc;
      factory.cotizacion.montoTopado = cotizacion.MontoTopado;
      factory.cotizacion.codProd = cotizacion.CodProd;
      factory.cotizacion.fecEfecRecibo = cotizacion.Principal.FecIniPoliza;
      factory.cotizacion.fecVctoRecibo = cotizacion.Principal.FecFinPoliza;
      factory.cotizacion.FecIniVig = cotizacion.Principal.FecIniVig;
      factory.cotizacion.FecReg = cotizacion.Principal.FecReg;
      factory.cotizacion.diffDays = mainServices.date.fnDiff(cotizacion.Principal.FecReg, new Date(), 'D')
      factory.cotizacion.esMayorDe1Mes = factory.cotizacion.diffDays > 30;
      factory.cotizacion.ListaAsegurado = cotizacion.ListaAsegurado;
      factory.cotizacion.McaMasivo = cotizacion.Riesgos && cotizacion.Riesgos.length && cotizacion.Riesgos[0].McaMasivo;
      factory.cotizacion.Coberturas = cotizacion.Coberturas;
      factory.cotizacion.NumCotizacion = cotizacion.Principal.NumCotizacion;
      factory.cotizacion.modelo.agente.codigoAgente = cotizacion.Principal.CodAgente;
      factory.cotizacion.modelo.agente.codigoNombre = cotizacion.Principal.CodAgente + "-" + cotizacion.Principal.NomAgente;
      factory.cotizacion.montoRecibo = cotizacion.Principal.MontoRecibo;
      _setContratante({
        tipoDocumento: cotizacion.Principal.TipDocCont,
        numeroDocumento: cotizacion.Principal.NumDocCont,
        nombreCompleto: cotizacion.Principal.RazonSocial,
        telefono: cotizacion.Principal.Telefono,
        correo: cotizacion.Principal.Correo
      });

      _verificarSetearActividad(cotizacion);
      _verificarSetearPoliza(cotizacion);


      factory.cotizacion.NumMovCarga = cotizacion.Principal.NroMovimiento;

      factory.cotizacion.riesgos = cotizacion.Riesgos.map(function (riesgo) {
        return {
          tipo: riesgo.McaMasivo === 'S' ? 0 : 1,
          numRiesgo: riesgo.NumRiesgo,
          numMovimiento: cotizacion.Principal.NroMovimiento,
          codigoCategoria: riesgo.CodCategoria,
          nomCategoria: riesgo.NomCategoria,
          numeroTrabajadores: riesgo.CantTrabajadores,
          montoTopado: riesgo.ImportePlanillaTopado,
          montoTrabajadores: riesgo.ImportePlanilla,
          montoTrabajadoresReal: riesgo.ImportePlanillaReal,
          montoPrimaNeta: 0,
          asegurados: cotizacion.ListaAsegurado
            .filter(function (asegurado) { return asegurado.NumRiesgo === riesgo.NumRiesgo; })
            .sort(function (a, b) { return a.Fila - b.Fila })
            .map(function (asegurado) {

              return {
                tipoDocumento: asegurado.TipDocum,
                numeroDocumento: asegurado.CodDocum,
                nombres: asegurado.Nombre,
                apellidoPaterno: asegurado.ApePaterno,
                apellidoMaterno: asegurado.ApeMaterno,
                nombresCompleto: asegurado.Nombre || asegurado.NombreCompleto,
                fechaNacimiento: asegurado.FecNacimiento,
                ocupacion: asegurado.Ocupacion,
                sueldo: asegurado.ImpSalario,
                modelo: {
                  mTipoDocumento: { Codigo: asegurado.TipDocum },
                  mFechaNacimiento: mainServices.date.fnStringToDate(asegurado.FecNacimiento)
                },
                validadores: {
                  maxNumeroDoc: 999,
                  minNumeroDoc: 0,
                  typeNumeroDoc: '',
                  typeNumeroDocDisabled: true
                }
              }
            }),
          errorFile: riesgo.McaMasivo === 'S' ? 0 : 2,
          fileName: riesgo.McaMasivo === 'S' ? 'planilla_excel_asegurados.xls' : '',
          planilla: (void 0),
          coberturas: [
            cotizacion.Coberturas
              .filter(function (cobertura) { return cobertura.NumRiesgo === riesgo.NumRiesgo; })
              .sort(function (a, b) { return a.Flag - b.Flag })
              .map(function (cobertura) {
                return {
                  CodCia: cotizacion.CodCia,
                  CodCobertura: cobertura.CodCobertura,
                  CodRamo: cotizacion.CodRamo,
                  NombreCobertura: cobertura.NomCobertura,
                  NroSueldos: cobertura.NumSueldos,
                  MontoMax: cobertura.MontoMax,
                  flag: cobertura.Flag,
                  optional: "",
                  checked: true
                }
              })
          ],
          modelo: {
            mNumeroTrabajadores: { Descripcion: ('0' + riesgo.CantTrabajadores).substr(-2), Valor: riesgo.CantTrabajadores },
            mCategoria: { CodCategoria: riesgo.CodCategoria, NomCategoria: riesgo.NomCategoria }
          }
        };
      });

      _verificarSetearAsegurados(cotizacion);

    }

    function SetCompleteStep(step) {
      factory.cotizacion.step[step] = true;
    }

    function GetCompleteStepQuote(step) {
      return factory.cotizacion.step[step];
    }

    function GetCompleteStepEmit(step) {
      return factory.emision.step[step];
    }

    function SetDuracionDeclaracion(duracion) {
      factory.cotizacion.duracion = angular.extend({}, factory.cotizacion.duracion, duracion);
    }

    function SetAgenteCotizacion(agente) {
      factory.cotizacion.claims.codigoAgente = agente.codigoAgente;
      factory.cotizacion.modelo.agente.codigoNombre = agente.codigoNombre;
      factory.cotizacion.modelo.agente.codigoAgente = agente.codigoAgente;
    }

    function SetSolicitudCotizacion(solicitudCotizacion) {
      factory.cotizacion.solicitudCotizacion = solicitudCotizacion;
    }

    function SetRespuestaContratante(response, tipActividad) {
      factory.cotizacion.responseContratante = response;
      factory.cotizacion.numeroPoliza = response.Poliza.NumPoliza || factory.cotizacion.numeroPoliza;
      factory.cotizacion.numDoc = response.NumDoc;
      factory.cotizacion.codProd = response.CodProd;
      factory.cotizacion.montoTopado = response.MontoTopado;
      factory.cotizacion.usuReg = response.UsuReg;
      factory.cotizacion.responseContratante = {
        actividad: {
          tipActividad: tipActividad,
          codActividad: factory.cotizacion.actividad.CodActividad,
          descripcionActividad: factory.cotizacion.actividad.Nombre,
          codClausula: factory.cotizacion.actividad.CodClausula,
          descripcionClausula: factory.cotizacion.actividad.DescripcionClausula
        }
      }

    }

    function SetNumMovimientoCarga(response, riesgo) {
      factory.cotizacion.NumMovCarga = response && response.nroMovimiento;
      if (riesgo && response && response.nroMovimiento) riesgo.numMovimiento = response.nroMovimiento;
      if (riesgo && response && response.canEmpleados) riesgo.numeroTrabajadores = response.canEmpleados;
      if (riesgo && response && response.sueldoTotal) riesgo.montoTrabajadoresReal = response.sueldoTotal;
      if (riesgo && response && response.sumMontoTopado) riesgo.montoTrabajadores = response.sumMontoTopado;
    }

    function SetCalcularPrima(responseCotizar) {
      factory.cotizacion.prima = responseCotizar;
      factory.cotizacion.fecEfecRecibo = responseCotizar.Recibos.Recibo[0].FecEfecRecibo;
      factory.cotizacion.fecVctoRecibo = responseCotizar.Recibos.Recibo[0].FecVctoRecibo;
      factory.cotizacion.montoRecibo = responseCotizar.Recibos.Recibo[0].impRecibo;
      factory.cotizacion.totalPrimaNeta = responseCotizar.Cotizacion.ConceptosDesglose.ImpPneta;
    }

    function InitiliceRiesgos() {
      if (factory.cotizacion && factory.cotizacion.riesgos && !factory.cotizacion.riesgos.length) {
        factory.agregarRiesgo();

        $rootScope.$emit('cotizacion-vida-ley-subscribe-event');
      }
    }

    function AgregarRiesgo() {
      var riesgo = angular.extend(estructuraRiesgoDefault, { numRiesgo: factory.cotizacion.riesgos.length + 1, montoTopado: factory.cotizacion.montoTopado });
      factory.cotizacion.riesgos.push(angular.copy(riesgo));
    }

    function AgregarRiesgoAC() {
      var riesgo = angular.extend(estructuraRiesgoDefault, { numRiesgo: factory.cotizacion.riesgos.length + 1, montoTopado: factory.cotizacion.montoTopado });
      riesgo.modelo.mCategoria = factory.cotizacion.riesgos[0].modelo.mCategoria
      return angular.copy(riesgo);
    }

    function FormatRiegoManual() {
      var riesgo = angular.extend(estructuraRiesgoDefault, { numRiesgo: factory.cotizacion.riesgos.length + 1, montoTopado: factory.cotizacion.montoTopado });
      if (factory.cotizacion && factory.cotizacion.riesgos && factory.cotizacion.riesgos.length) {
        var ListaAsegurado = factory.cotizacion.ListaAsegurado;
        factory.cotizacion.riesgos.map(function (riesgo, index) {
          riesgo.asegurados.map(function (asegurado) {
            return asegurado.TipoRiesgo = { name: ListaAsegurado[index].TipoRiesgo };
          });
        })
        var res = factory.cotizacion.riesgos.map(function (riesgo) {
          return riesgo.asegurados;
        })
        var aseguradosAC = _.flatten(res);
        riesgo.asegurados = aseguradosAC;
        riesgo.modelo = factory.cotizacion.riesgos[0].modelo;

        return [angular.copy(riesgo)];
      } else {
        riesgo.modelo.mCategoria = factory.cotizacion.riesgos[0].modelo.mCategoria
        return [angular.copy(riesgo)];
      }
    }


    function GetCoberturas(coberturas) {
      return coberturas.map(function (cobertura) {
        cobertura.checked = true;
        return cobertura
      });
    }

    function GetNameFrecuencia(frecuencia) {
      var frecuenciaValue = { 'MEN': 'MENSUAL', 'BIM': 'BIMENSUAL', 'TRI': 'TRIMESTRAL', 'CUA': 'CUATRIMESTRAL', 'SEM': 'SEMESTRAL', 'ANU': 'ANUAL' };
      return frecuenciaValue[frecuencia];
    }

    function GetValorFrecuencia(frecuencia) {
      var frecuenciaValue = { 'MEN': 1, 'BIM': 2, 'TRI': 3, 'CUA': 4, 'SEM': 6, 'ANU': 12 };
      return frecuenciaValue[frecuencia];
    }

    function GetDuracionCobertura(frecuencia) {
      var dataSouceDuracionCobertua = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (m) { return { "Codigo": m, "Descripcion": m + " MES" + (m > 1 ? "ES" : "") } });
      var frecuenciaValue = factory.getValorFrecuencia(frecuencia)
      return [{ "Descripcion": "--Seleccione--", "Codigo": null, "selectedEmpty": true }].concat(
        dataSouceDuracionCobertua.filter(function (duracionCobertura) {
          return frecuencia && duracionCobertura.Codigo % frecuenciaValue === 0;
        })
      );
    }

    function CotizacionObservable() {
      return {
        subscribe: function ($scope, callback) {
          var handler = $rootScope.$on('cotizacion-vida-ley-subscribe-event', callback);
          $scope.$on('$destroy', handler);
        }
      }
    }

    function IsUserRoot(isResumen) {
      if (isResumen) {
        if (factory.auth.roleName.includes("SUPERVISOR"))
          return true;
        else
          return false;
      }
      else {
        return oimPrincipal.isAdmin() && (factory.auth && factory.auth.agentName) !== '';
      }
    }
    function SetClaims(claims) {
      factory.auth = claims;
    }

    function SetParametros(parametros) {
      var valores = {};
      parametros.forEach(function (param) { valores[param.CodTexto] = param.ValTexto; });
      factory.parametros = valores;
    }

    function GetUser() {
      return {
        codigoUsuario: factory.auth && factory.auth.loginUserName,
        rolUsuario: factory.auth && factory.auth.roleCode,
        nombreAgente: factory.auth && factory.auth.agentName,
        codigoAgente: factory.auth && factory.auth.agentID
      };
    }

    function IsMultiriesgo() {
      return factory.parametros.MCA_MULTIRIESGO_OIM === 'S';
    }

    function GetCategoriaDefault() {
      return factory.parametros.CATEGORIA_GENERICA;
    }

    function GetSourceNumeroAsegurados() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return { Descripcion: ('0' + n).substr(-2), Valor: n }; });
    }

    function GetFechaMaximaAdulto() {
      return new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    }

    function GetExistCexCipPex(tipoDocumento) {
      return ['CEX', 'CIP', 'PEX'].filter(function (codigo) { return codigo === tipoDocumento }).length;
    }

    function GetValidParametrosBuscarPersona(tipoDocumento, numeroDocumento, validadores) {
      var existCexCipPex = factory.getExistCexCipPex(tipoDocumento);
      var documento = (numeroDocumento || '');
      return !!documento && !!validadores && (
        documento.length === validadores.maxNumeroDoc ||
        (
          (documento.length <= validadores.maxNumeroDoc && documento.length >= validadores.minNumeroDoc) && existCexCipPex
        )
      );
    }

    function GetControllerNameStep(step) {
      var controllers = [
        undefined,
        "cotizacionContratanteVidaLeyController",
        "cotizacionPolizaVidaLeyController",
        "cotizacionAseguradosVidaLeyController",
        "cotizacionResultadosVidaLeyController",
        "emisionContratanteVidaLeyController",
      ];
      return controllers[step];
    }

    function GetTemplateStep(step) {
      var templates = [
        undefined,
        "/cotizacion/cotizacion-pasos/cotizacion-contratante-vida-ley.template.html",
        "/cotizacion/cotizacion-pasos/cotizacion-poliza-vida-ley.template.html",
        "/cotizacion/cotizacion-pasos/cotizacion-asegurados-vida-ley.template.html",
        "/cotizacion/cotizacion-pasos/cotizacion-resultados-vida-ley.template.html",
        "/emision/emision-pasos/emision-contratante-vida-ley.template.html",
      ];

      var deferred = $q.defer();
      $http.get(baseView + templates[step]).success(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }


    function GetControllerNameStepEmision(step) {
      var controllers = [
        undefined,
        "emisionContratanteVidaLeyController",
        "emisionAseguradosVidaLeyController",
      ];
      return controllers[step];
    }

    function GetTemplateStepEmision(step) {
      var templates = [
        undefined,
        "/emision/emision-pasos/emision-contratante-vida-ley.template.html",
        "/emision/emision-pasos/emision-asegurados-vida-ley.template.html",
      ];

      var deferred = $q.defer();
      $http.get(baseView + templates[step]).success(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }

    function ValidStepContratante() {
      var contratante = factory && factory.cotizacion && factory.cotizacion.contratante || {};
      return !factory.isUndefinedOrNullOrEmpty(contratante.tipoDocumento) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.numeroDocumento) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.nombreCompleto) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.telefono) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.correo);
    }
    /**Agregado*/
    function ValidStepContratanteNew(contratante, actividad) {
      var valorTelefono = _validacionTelefonos(contratante);
      return !factory.isUndefinedOrNullOrEmpty(contratante.documentType) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.documentType ? contratante.documentType.Codigo : null) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.documentNumber) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.FullName) &&
        !factory.isUndefinedOrNullOrEmpty(contratante.Email) &&
        !factory.isUndefinedOrNullOrEmpty(valorTelefono) &&
        !factory.isUndefinedOrNullOrEmpty(actividad)
    }

    function _validacionTelefonos(contratante) {
      var valorTelefono = null;

      if (factory.isUndefinedOrNullOrEmpty(contratante.Telefono) && !factory.isUndefinedOrNullOrEmpty(contratante.Telefono2)) {
        valorTelefono = contratante.Telefono2;
      }

      if (!factory.isUndefinedOrNullOrEmpty(contratante.Telefono) && factory.isUndefinedOrNullOrEmpty(contratante.Telefono2)) {
        valorTelefono = contratante.Telefono;
      }

      if (!factory.isUndefinedOrNullOrEmpty(contratante.Telefono) && !factory.isUndefinedOrNullOrEmpty(contratante.Telefono2)) {
        valorTelefono = contratante.Telefono2;
      }

      return valorTelefono;
    }

    function ValidStepPoliza() {
      var poliza = factory && factory.cotizacion && factory.cotizacion.duracion.modelo || {};
      var codigo = factory.cotizacion.duracion.modelo.mDuracionCobertura ? factory.cotizacion.duracion.modelo.mDuracionCobertura.Codigo : null;
      return !factory.isUndefinedOrNullOrEmpty(factory.cotizacion.duracion.modelo.mFrecuenciaDuracion) &&
        !factory.isUndefinedOrNullOrEmpty(factory.cotizacion.duracion.modelo.mFechaInicial) &&
        !factory.isUndefinedOrNullOrEmpty(factory.cotizacion.duracion.modelo.mDuracionCobertura) &&
        !factory.isUndefinedOrNullOrEmpty(codigo) &&
        !factory.isUndefinedOrNullOrEmpty(factory.cotizacion.duracion.modelo.mCentroRiesgo);
    }

    function ValidStepRiesgos() {
      return factory.cotizacion.riesgos.filter(function (riesgo) {
        var valid = false;
        valid = factory.cotizacion.riesgos.filter(function (riesgo) { return !!riesgo.modelo.mCategoria && riesgo.coberturas.length }).length
          && (
            riesgo.tipo === 0 ? (riesgo.numeroTrabajadores > 0 && riesgo.errorFile === 0) :
              (riesgo.numeroTrabajadores === factory.getTotalCompletadoAseguradosRiesgo(riesgo))
          )

        return valid;
      }).length;
    }

    function ValidStepResultados() {
      return factory.validStepContratante() && factory.validStepRiesgos();
    }

    function GetTotalCompletadoAseguradosRiesgo(riesgo) {
      return riesgo.asegurados && riesgo.asegurados.filter(function (asegurado) {
        return !!asegurado.tipoDocumento
          && !!asegurado.numeroDocumento
          && (
            (
              !!asegurado.nombres
              && !!asegurado.apellidoPaterno
              && !!asegurado.apellidoMaterno
            )
            || !!asegurado.nombresCompleto
          )
          && !!asegurado.modelo.mFechaNacimiento
          && !!asegurado.ocupacion
          && asegurado.sueldo > 0
      }).length
    }

    function SetParametrosContratante(data) {
      factory.cotizacion.contratante = {
        tipoDocumento: data.TipoDocumento || data.documentType.Codigo,
        numeroDocumento: data.CodigoDocumento || data.documentNumber,
        nombreCompleto: data.Nombre || data.FullName,
        telefono: data.Phone,
        correo: data.Email,
        telefonoCasa: data.Telefono,
        telefonoMovil: data.Telefono2,
        correoElectronico: data.CorreoElectronico,
        representante: data.Representante,
        codCargoRepresentante: data.RepresentanteCargo.Codigo || 0,
        codDepartamento: data.Department.Codigo,
        codProvincia: data.Province && data.Province.Codigo ? data.Province.Codigo : '',
        codDistrito: data.District && data.District.Codigo ? data.District.Codigo : '',
        codTipoVia: data.CodigoVia || data.Via.Codigo,
        tipoViaNombre: data.NombreVia,
        codTipoNumero: data.CodigoNumero || data.NumberType.Codigo,
        tipoNumeroNombre: data.TextoNumero,
        codTipoInterior: data.CodigoInterior || data.Inside.Codigo,
        tipoInteriorNombre: data.TextoInterior,
        codTipoZona: data.CodigoZona || data.Zone.Codigo,
        tipoZonaNombre: data.TextoZona,
        referencia: data.Referencia
      }

    }

    function GetParametrosPoliza() {
      var frecuencia = factory.getValorFrecuencia(factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.CodigoRegistro);
      var mFechaFinal = _getAgregarMes(factory.cotizacion.duracion.modelo.mFechaInicial, factory.cotizacion.duracion.modelo.mDuracionCobertura.Codigo);
      factory.cotizacion.duracion.fechaFinal = factory.formatearFecha(mFechaFinal);
      factory.cotizacion.duracion.modelo.mFechaFinal = factory.formatearFecha(mFechaFinal);
      factory.cotizacion.CodTipDeclara = frecuencia === 12 ? 0 : frecuencia
      factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.Descripcion = factory.getNameFrecuencia(factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.CodigoRegistro);
      return {
        "CodCia": constants.module.polizas.vidaLey.companyCode,
        "CodRamo": constants.module.polizas.vidaLey.codeRamo,
        "CodAgente": factory.cotizacion.modelo.agente.codigoAgente,
        "NumDoc": factory.cotizacion.numDoc,
        "CodProd": factory.cotizacion.codProd,
        "CentroRiesgo": factory.cotizacion.duracion.modelo.mCentroRiesgo,
        "Poliza": {
          "numPoliza": factory.cotizacion.numeroPoliza,
          "FecEfecSpto": factory.formatearFecha(factory.cotizacion.duracion.modelo.mFechaInicial),
          "FecVctoSpto": factory.cotizacion.duracion.fechaFinal,
          "CodTipDeclara": factory.cotizacion.CodTipDeclara,
          "NomTipDeclara": factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.CodigoRegistro
        }
      }
    }

    function SetActivity(actividad, clausula) {
      factory.cotizacion.actividad = {
        "CodActividad": actividad.CodCiiu,
        "Nombre": actividad.Nombre,
        "CodClausula": clausula.IdClausula || '',
        "DescripcionClausula": clausula.Detalle || ''
      }
    }

    function GetParametrosContratante(update, numeroDocumento) {
      var params = {
        "CodCia": constants.module.polizas.vidaLey.companyCode,
        "CodRamo": constants.module.polizas.vidaLey.codeRamo,
        "CodAgente": factory.cotizacion.modelo.agente.codigoAgente,
        "NumDoc": factory.cotizacion.numDoc,
        "CodProd": factory.cotizacion.codProd,
        "Contratante": {
          "TipDocum": factory.cotizacion.contratante.tipoDocumento,
          "CodDocum": numeroDocumento,
          "Nombre": factory.cotizacion.contratante.nombreCompleto,
          "Correo": factory.cotizacion.contratante.correo,
          "Telefono": factory.cotizacion.contratante.telefono
        },
        "Contacto": {
          "TelefonoCasa": factory.cotizacion.contratante.telefonoCasa,
          "TelefonoMovil": factory.cotizacion.contratante.telefonoMovil,
          "CorreoElectronico": factory.cotizacion.contratante.correoElectronico,
          "Representante": factory.cotizacion.contratante.representante,
          "CodCargoRepresentante": factory.cotizacion.contratante.codCargoRepresentante
        },
        "Direccion": {
          "CodDepartamento": factory.cotizacion.contratante.codDepartamento,
          "CodProvincia": factory.cotizacion.contratante.codProvincia,
          "CodDistrito": factory.cotizacion.contratante.codDistrito,
          "CodTipoVia": factory.cotizacion.contratante.codTipoVia,
          "TipoViaNombre": factory.cotizacion.contratante.tipoViaNombre,
          "CodTipoNumero": factory.cotizacion.contratante.codTipoNumero,
          "TipoNumeroNombre": factory.cotizacion.contratante.tipoNumeroNombre,
          "CodTipoInterior": factory.cotizacion.contratante.codTipoInterior,
          "TipoInteriorNombre": factory.cotizacion.contratante.tipoInteriorNombre,
          "CodTipoZona": factory.cotizacion.contratante.codTipoZona,
          "TipoZonaNombre": factory.cotizacion.contratante.tipoZonaNombre,
          "Referencia": factory.cotizacion.contratante.referencia
        },
        "Actividad": factory.cotizacion.actividad
      };

      if (update) {
        params.NumTicket = factory.cotizacion && factory.cotizacion.numeroPoliza;
        params.MontoTopado = factory.cotizacion && factory.cotizacion.montoTopado || 0;
        params.UsuReg = factory.cotizacion && factory.cotizacion.claims && factory.cotizacion.claims.codigoUsuario;
        params.Poliza = {
          "NumPoliza": factory.cotizacion && factory.cotizacion.numeroPoliza
        }
      }
      factory.cotizacion.contratante.numeroDocumento = numeroDocumento;

      return params;
    }

    function GetParametrosRiesgo() {
      //grabar paso 3
      var parametros = {

        "NumDoc": factory.cotizacion.numDoc,
        "UsuReg": factory.cotizacion.usuReg,

        "NumMovCarga": "29481300",
        "ImpPrimaNeta": 100,

        "Poliza": {
          "numPoliza": factory.cotizacion.numeroPoliza
        },
        "CodCia": constants.module.polizas.vidaLey.companyCode,
        "CodRamo": constants.module.polizas.vidaLey.codeRamo,
        "CodAgente": factory.cotizacion.modelo.agente.codigoAgente,
        "CodProd": factory.cotizacion.codProd,

        "Contratante": {
          "TipDocum": factory.cotizacion.contratante.tipoDocumento,
          "CodDocum": factory.cotizacion.contratante.numeroDocumento,
          "Nombre": factory.cotizacion.contratante.nombreCompleto,
          "Correo": factory.cotizacion.contratante.correo,
          "Telefono": factory.cotizacion.contratante.telefono
        }
      }
      if (factory.cotizacion.codEstado === 'AC') {
        if (factory.cotizacion.McaMasivo === 'S') {
          var coberturaRiesgos = [];
          parametros.RiesgoDTO = _getRiesgoDTO(factory.cotizacion.riesgos);
          var coberturas = factory.cotizacion && factory.cotizacion.riesgos.map(function (riesgo, index) {
            return riesgo.coberturas[0].map(function (cobertura, index) {
              return {
                "NumDoc": factory.cotizacion.numDoc,
                "CodRiesgo": riesgo.NumRiesgo || riesgo.numRiesgo,
                "CodPlan": cobertura.CodPlan,
                "CodCobertura": cobertura.CodCobertura,
                "CodCategoria": riesgo.CodCategoria || riesgo.codigoCategoria,
                "UsuReg": factory.cotizacion.claims.codigoUsuario
              };
            })
          })

          coberturaRiesgos = coberturaRiesgos.concat(coberturas);
          parametros.Coberturas = _.flatten(coberturaRiesgos);

        } else {
          var coberturaRiesgos = [];
          if (factory.cotizacion.riesgos[0] && factory.cotizacion.riesgos[0].riesgos) {

            parametros.RiesgoDTO = _getRiesgoDTO(factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO);
            var coberturas = factory.cotizacion && factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO.map(function (riesgo, index) {
              return riesgo.coberturas.map(function (cobertura, index) {
                return {
                  "NumDoc": factory.cotizacion.numDoc,
                  "CodRiesgo": riesgo.NumRiesgo || riesgo.numRiesgo,
                  "CodPlan": cobertura.CodPlan,
                  "CodCobertura": cobertura.CodCobertura,
                  "CodCategoria": riesgo.CodCategoria || riesgo.codigoCategoria,
                  "UsuReg": factory.cotizacion.claims.codigoUsuario
                };
              })
            })

            coberturaRiesgos = coberturaRiesgos.concat(coberturas);
            parametros.Coberturas = _.flatten(coberturaRiesgos);
          } else {
            parametros.RiesgoDTO = _getRiesgoDTO(factory.cotizacion.riesgos);
            var coberturas = factory.cotizacion && factory.cotizacion.riesgos.map(function (riesgo, index) {
              return riesgo.coberturas.map(function (cobertura, index) {
                return {
                  "NumDoc": factory.cotizacion.numDoc,
                  "CodRiesgo": riesgo.NumRiesgo || riesgo.numRiesgo,
                  "CodPlan": cobertura.CodPlan,
                  "CodCobertura": cobertura.CodCobertura,
                  "CodCategoria": riesgo.CodCategoria || riesgo.codigoCategoria,
                  "UsuReg": factory.cotizacion.claims.codigoUsuario
                };
              })
            })

            coberturaRiesgos = coberturaRiesgos.concat(coberturas);
            parametros.Coberturas = _.flatten(coberturaRiesgos);
          }
        }
        parametros.ListaAsegurado = factory.cotizacion.riesgos.reduce(function (asegurados, riesgo) {

          return asegurados.concat(
            riesgo.asegurados.map(function (asegurado) {
              return {
                "Nombre": asegurado.nombres,
                "ApeMaterno": asegurado.apellidoMaterno,
                "ApePaterno": asegurado.apellidoPaterno,
                "CodDocum": asegurado.numeroDocumento,
                "FecNacimiento": asegurado.fechaNacimiento,
                "ImpSalario": asegurado.sueldo,
                "NomCategoria": riesgo.nomCategoria,
                "NomCategoriaEnlace": null,
                "NombreCompleto": asegurado.nombresCompleto,
                "Ocupacion": asegurado.ocupacion,
                "NomOcupacion": asegurado.ocupacion,
                "NumRiesgo": riesgo.numRiesgo,
                "NumRiesgoEnlace": 0,
                "Tasa": 0,
                "TasaEnlace": 0,
                "TipDocum": asegurado.tipoDocumento
              };
            })
          );
        }, []);
      } else {
        if (factory.cotizacion.riesgos[0] && factory.cotizacion.riesgos[0].riesgos) {
          parametros.RiesgoDTO = _getRiesgoDTO(factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO);
          parametros.Coberturas = factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO.reduce(function (coberturas, riesgo) {
            return coberturas.concat(
              factory.cotizacion.riesgos[0].coberturas[parseInt(riesgo.NumRiesgo) - 1]
                .filter(function (cobertura) { return cobertura.checked; })
                .map(function (cobertura) {
                  return {
                    "NumDoc": factory.cotizacion.numDoc,
                    "CodRiesgo": riesgo.NumRiesgo,
                    "CodPlan": cobertura.CodPlan,
                    "CodCobertura": cobertura.CodCobertura,
                    "CodCategoria": riesgo.CodCategoria,
                    "UsuReg": factory.cotizacion.claims.codigoUsuario
                  };
                })
            );
          }, []);
        } else {
          parametros.RiesgoDTO = _getRiesgoDTO(factory.cotizacion.riesgos);
          parametros.Coberturas = factory.cotizacion.riesgos.reduce(function (coberturas, riesgo) {
            return coberturas.concat(
              riesgo.coberturas[0]
                .filter(function (cobertura) { return cobertura.checked; })
                .map(function (cobertura) {
                  return {
                    "NumDoc": factory.cotizacion.numDoc,
                    "CodRiesgo": riesgo.numRiesgo,
                    "CodPlan": cobertura.CodPlan,
                    "CodCobertura": cobertura.CodCobertura,
                    "CodCategoria": riesgo.codigoCategoria,
                    "UsuReg": factory.cotizacion.claims.codigoUsuario
                  };
                })
            );
          }, []);
        }
        if (factory.cotizacion.riesgos && factory.cotizacion.riesgos.riesgos) {
          parametros.ListaAsegurado = factory.cotizacion.riesgos.reduce(function (asegurados, riesgo) {

            return asegurados.concat(
              riesgo.riesgos.CargaAsegurado.ListaAsegurado.map(function (asegurado) {
                return {
                  "Nombre": asegurado.nombres || asegurado.Nombre,
                  "ApeMaterno": asegurado.apellidoMaterno || asegurado.ApeMaterno,
                  "ApePaterno": asegurado.apellidoPaterno || asegurado.ApeMaterno,
                  "CodDocum": asegurado.numeroDocumento || asegurado.CodDocum,
                  "FecNacimiento": asegurado.fechaNacimiento || asegurado.FecNacimiento,
                  "ImpSalario": asegurado.sueldo || asegurado.ImpSalario,
                  "NomCategoria": riesgo.nomCategoria,
                  "NomCategoriaEnlace": null,
                  "NombreCompleto": asegurado.nombresCompleto || asegurado.NombreCompleto,
                  "Ocupacion": asegurado.ocupacion || asegurado.Ocupacion,
                  "NomOcupacion": asegurado.ocupacion || asegurado.Ocupacion,
                  "NumRiesgo": riesgo.numRiesgo,
                  "NumRiesgoEnlace": 0,
                  "Tasa": 0,
                  "TasaEnlace": 0,
                  "TipDocum": asegurado.tipoDocumento || asegurado.TipDocum
                };
              })
            );
          }, []);
        } else {
          parametros.ListaAsegurado = factory.cotizacion.ListaAsegurado;
        }
      }
      return parametros;
    }

    function GetParametrosGrabarPoliza() {
      return {
        "NumDoc": factory.cotizacion.numDoc,
        "NumMovCarga": factory.cotizacion.NumMovCarga,
        "UsuReg": factory.cotizacion.claims.codigoUsuario,
        "ImpPrimaNeta": factory.cotizacion.prima.Cotizacion.ConceptosDesglose.ImpPneta,
        "NumCotizacion": factory.cotizacion.prima.Cotizacion.NumCotizacion
      };
    }

    function GetParametrosGrabarCotizacion(codEstado, numCotizacion) {
      return {
        "NumDoc": factory.cotizacion.numDoc,
        "NumMovCarga": factory.cotizacion.NumMovCarga,
        "UsuReg": factory.cotizacion.claims.codigoUsuario,
        "ImpPrimaNeta": factory.cotizacion.prima.Cotizacion && factory.cotizacion.prima.Cotizacion.ConceptosDesglose.ImpPneta || factory.cotizacion.totalPrimaNeta || 0,
        "NumCotizacion": factory.cotizacion.prima.Cotizacion && factory.cotizacion.prima.Cotizacion.NumCotizacion || factory.cotizacion.NumCotizacion || numCotizacion || 0,
        "CodAgente": factory.cotizacion.modelo.agente.codigoAgente,
        "CodEstado": codEstado || ''
      };
    }

    function GetParametrosSolicitudRechazada(codEstado) {
      return {
        "NumDoc": factory.cotizacion.numDoc,
        "UsuReg": factory.cotizacion.claims.codigoUsuario,
        "CodEstado": codEstado || ''
      };
    }

    function getParametrosSolicitudAceptada2(codEstado, clausula, riesgos, numCotizacion, ImpPrimaNeta) {
      return {
        "NumDoc": factory.cotizacion.numDoc,
        "NumCotizacion": factory.cotizacion.prima.Cotizacion && factory.cotizacion.prima.Cotizacion.NumCotizacion || numCotizacion || 0,
        "UsuReg": factory.cotizacion.claims.codigoUsuario,
        "CodEstado": codEstado || '',
        "ClausulaManual": clausula || '',
        "ImpPrimaNeta": ImpPrimaNeta,
        "Riesgos": riesgos.map(function (riesgo) {
          return {
            "NumRiesgo": riesgo.NumRiesgo,
            "Tasa": riesgo.tasaSus || 0
          };
        })
      };
    }
    function GetParametrosSolicitudAceptada(codEstado, clausula, riesgos, numCotizacion) {
      return {
        "NumDoc": factory.cotizacion.numDoc,
        "NumCotizacion": factory.cotizacion.prima.Cotizacion && factory.cotizacion.prima.Cotizacion.NumCotizacion || numCotizacion || 0,
        "UsuReg": factory.cotizacion.claims.codigoUsuario,
        "CodEstado": codEstado || '',
        "ClausulaManual": clausula || '',
        "Riesgos": riesgos.map(function (riesgo) {
          return {
            "NumRiesgo": riesgo.NumRiesgo,
            "Tasa": riesgo.tasaSus || 0
          };
        })
      };
    }

    function GetParametrosAseguradosIndividual(riesgo) {
      riesgo.codigoCategoria = angular.isUndefined(riesgo.modelo.mCategoria) ? '' : riesgo.modelo.mCategoria.CodCategoria;
      riesgo.nomCategoria = angular.isUndefined(riesgo.modelo.mCategoria) ? '' : riesgo.modelo.mCategoria.NomCategoria;
      riesgo.asegurados.forEach(function (asegurado) {
        asegurado.fechaNacimiento = factory.formatearFecha(asegurado.modelo.mFechaNacimiento);
      });

      var parametros = _getParametrosCargaAseguradosBase(riesgo);
      parametros.tomador = _getCotizacionContratante();
      parametros.RiesgoDTO = _getRiesgoDTO([riesgo]);

      parametros.ListaAsegurado = riesgo.asegurados.map(function (asegurado) {
        // se comenta esta linea porque segun flujo solo debe mandar bien  nombresCompleto o apellidoPaterno ,apellidoMaterno, nombres
        //asegurado.nombresCompleto = asegurado.nombres + ' ' + asegurado.apellidoPaterno + ' ' + asegurado.apellidoMaterno;

        return {
          "Nombre": asegurado.nombres,
          "ApeMaterno": asegurado.apellidoMaterno,
          "ApePaterno": asegurado.apellidoPaterno,
          "CodDocum": asegurado.numeroDocumento,
          "FecNacimiento": asegurado.fechaNacimiento,
          "ImpSalario": asegurado.sueldo,
          "NomCategoria": riesgo.nomCategoria,
          "NomCategoriaEnlace": null,
          "NombreCompleto": asegurado.nombresCompleto || '',
          "Ocupacion": asegurado.ocupacion,
          "NomOcupacion": asegurado.ocupacion,
          "NumRiesgo": riesgo.numRiesgo,
          "NumRiesgoEnlace": 0,
          "Tasa": 0,
          "TasaEnlace": 0,
          "TipDocum": asegurado.tipoDocumento,
          "tipRiesgo": asegurado.TipoRiesgo.name
        };
      });

      return parametros;
    }

    function GetParametrosAseguradosMasivo(riesgo) {
      riesgo.codigoCategoria = angular.isUndefined(riesgo.modelo.mCategoria) ? '' : riesgo.modelo.mCategoria.CodCategoria;
      riesgo.nomCategoria = angular.isUndefined(riesgo.modelo.mCategoria) ? '' : riesgo.modelo.mCategoria.NomCategoria;
      var parametros = _getParametrosCargaAseguradosBase(riesgo);
      parametros.tomador = _getCotizacionContratante();
      parametros.RiesgoDTO = _getRiesgoDTO([riesgo]);

      return parametros;
    }

    function GetParametrosCalcularPrima() {
      var parametros = {
        "nroMovimientoCarga": factory.cotizacion.NumMovCarga,
        "cabecera": {
          "codigoAplicacion": "EMISA",
          "codigoUsuario": factory.cotizacion.claims.codigoUsuario
        },
        "poliza": {
          "numPoliza": factory.cotizacion.numeroPoliza,
          "FecEfecSpto": factory.formatearFecha(factory.cotizacion.duracion.modelo.mFechaInicial),
          "FecVctoSpto": factory.cotizacion.duracion.fechaFinal,
          "codAgt": factory.cotizacion.claims.codigoAgente,
          "codFormaDeclaracion": factory.cotizacion.CodTipDeclara,
          "moneda": {
            "codMon": constants.module.polizas.vidaLey.codeCurrency
          }
        },
        "producto": {
          "CodCia": constants.module.polizas.vidaLey.companyCode,
          "CodRamo": constants.module.polizas.vidaLey.codeRamo,
        },
        "contratante": _getCotizacionContratante()
      };
      if (factory.cotizacion.codEstado === "AC") {
        var cotizacionAC = factory.getRiegosAC();
        if (cotizacionAC.riesgosAC.length == 0) {
          cotizacionAC.riesgosAC = cotizacionAC.riesgos.map(function (riesgo) {
            return {
              NumDocRef: cotizacionAC.numDoc,
              NumRiesgo: riesgo.numRiesgo,
              NomCategoria: riesgo.nomCategoria,
              NumTrabajadores: riesgo.numeroTrabajadores,
              ImportePlanillaTopado: riesgo.montoTopado
            }
          })
        }
        parametros.riesgoVidaLey = cotizacionAC.riesgosAC.map(function (item) {
          return {
            "numDocRef": item.NumDocRef,
            "numRiesgo": item.NumRiesgo,
            "CodCategoria": item.CodCategoria,
            "nomCategoria": item.NomCategoria,
            "nomCentroRiesgo": cotizacionAC.duracion.modelo.mCentroRiesgo,
            "numAsegurados": item.NumTrabajadores,
            "impPlanilla": item.ImportePlanillaTopado,
            "coberturas": cotizacionAC.Coberturas
              .filter(function (cobertura) { return cobertura.NumRiesgo === parseInt(item.NumRiesgo); })
              .map(function (cobertura) {
                return {
                  "codCobertura": cobertura.CodCobertura,
                  "nomCobertura": cobertura.NomCobertura,
                  "impCobertura": cobertura.MontoMax,
                  "numRemuneraciones": cobertura.NumSueldos || 0
                };
              })
          }
        })
      }
      else {
        parametros.riesgoVidaLey = factory.cotizacion.riesgos.map(function (item) {
          return item.riesgos.CargaAsegurado.RiesgoDTO.map(function (riesgo) {
            return {
              "numDocRef": factory.cotizacion.numDoc,
              "numRiesgo": riesgo.NumRiesgo,
              "CodCategoria": riesgo.CodCategoria,
              "nomCategoria": riesgo.NomCategoria,
              "nomCentroRiesgo": factory.cotizacion.duracion.modelo.mCentroRiesgo,
              "numAsegurados": riesgo.NumTrabajadores,
              "impPlanilla": riesgo.ImportePlanillaTopado,
              "coberturas": riesgo.coberturas
                .filter(function (cobertura) { return cobertura.checked; })
                .map(function (cobertura) {
                  return {
                    "codCobertura": cobertura.CodCobertura,
                    "nomCobertura": cobertura.NombreCobertura,
                    "impCobertura": cobertura.MontoMax,
                    "numRemuneraciones": cobertura.NroSueldos || 0
                  };
                })
            }
          });
        });
      }

      parametros.riesgoVidaLey = _.flatten(parametros.riesgoVidaLey);

      return parametros;
    }

    function GetParametrosCalcularPrimaFlujoAlterno(riesgos) {
      var parametros = {
        "nroMovimientoCarga": factory.cotizacion.NumMovCarga,
        "cabecera": {
          "codigoAplicacion": "EMISA",
          "codigoUsuario": factory.cotizacion.claims.codigoUsuario
        },
        "poliza": {
          "numPoliza": factory.cotizacion.numeroPoliza,
          "FecEfecSpto": factory.formatearFecha(factory.cotizacion.duracion.modelo.mFechaInicial),
          "FecVctoSpto": factory.cotizacion.duracion.fechaFinal,
          "codAgt": factory.cotizacion.claims.codigoAgente,
          "codFormaDeclaracion": factory.cotizacion.CodTipDeclara,
          "moneda": {
            "codMon": constants.module.polizas.vidaLey.codeCurrency
          }
        },
        "producto": {
          "CodCia": constants.module.polizas.vidaLey.companyCode,
          "CodRamo": constants.module.polizas.vidaLey.codeRamo,
        },
        "contratante": _getCotizacionContratante()
      };

      parametros.riesgoVidaLey = riesgos.map(function (riesgo) {
        return {
          "numDocRef": factory.cotizacion.numDoc,
          "numRiesgo": riesgo.NumRiesgo,
          "CodCategoria": riesgo.CodCategoria,
          "nomCategoria": riesgo.NomCategoria,
          "nomCentroRiesgo": factory.cotizacion.duracion.modelo.mCentroRiesgo,
          "numAsegurados": riesgo.NumTrabajadores || riesgo.CantTrabajadores,
          "impPlanilla": riesgo.ImportePlanillaTopado,
          "tasa": riesgo.tasaSus,
          "coberturas": factory.cotizacion.riesgos[0].coberturas[0]
            .filter(function (cobertura) { return cobertura.checked; })
            .map(function (cobertura) {
              return {
                "codCobertura": cobertura.CodCobertura,
                "nomCobertura": cobertura.NombreCobertura,
                "impCobertura": cobertura.MontoMax,
                "numRemuneraciones": cobertura.NroSueldos || 0
              };
            })
        }
      });

      return parametros;
    }

    function GetParametrosReCalcularPrima(numCotizacion, riesgos) {

      return {
        "cabecera": {
          "codigoAplicacion": "EMISA",
          "codigoUsuario": factory.cotizacion.claims.codigoUsuario
        },
        "cotizacion": {
          "numCotizacion": numCotizacion
        },
        "riesgoVidaLey": riesgos.map(function (riesgo) {
          return {
            "NumDocRef": factory.cotizacion.numDoc,
            "numRiesgo": riesgo.NumRiesgo,
            "tasa": riesgo.tasaSus || 0
          };
        })
      }
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

    function ValidControlForm(form, controlName) {
      var control = form[controlName];
      return control && control.$error.required && !control.$pristine;
    }

    function IsUndefinedOrNullOrEmpty(value) {
      return value === null || value === undefined || value === '';
    }

    function SetInfoAplicacion(infoAplicacion) {
      factory.cotizacion.infoAplicacion = infoAplicacion;
    }

    function GetInfoAplicacion() {
      return factory.cotizacion.infoAplicacion;
    }

    function _setClaimsCotizacion(auth) {
      factory.cotizacion.claims = {
        codigoUsuario: auth && auth.loginUserName,
        rolUsuario: auth && auth.roleCode,
        nombreAgente: auth && auth.agentName,
        codigoAgente: auth && auth.agentID
      }
    }

    function _setDefaultCotizacionAgente(auth) {
      factory.cotizacion.modelo.agente = {
        codigoAgente: auth && auth.agentID,
        codigoNombre: (auth && auth.agentID) + "-" + (auth && auth.agentName),
        importeAplicarMapfreDolar: 0,
        mcamapfreDolar: "",
        codigoEstadoCivil: 0,
        codigoUsuario: auth && auth.loginUserName,
        nombreAgente: auth && auth.agentName
      }
    }

    function _setContratante(contratante) {
      factory.cotizacion.contratante = {
        tipoDocumento: contratante && contratante.tipoDocumento,
        numeroDocumento: contratante && contratante.numeroDocumento,
        nombreCompleto: contratante && contratante.nombreCompleto,
        telefono: contratante && contratante.telefono,
        correo: contratante && contratante.correo
      }
    }

    function _verificarSetearActividad(cotizacion) {
      if (cotizacion.Principal.Secuencia > 1) {
        factory.cotizacion.responseContratante = getClausula(cotizacion.Actividad);
      }
    }

    function _verificarSetearPoliza(cotizacion) {
      if (cotizacion.Principal.Secuencia > 2) {
        var frecuencia = factory.getValorFrecuencia(cotizacion.Principal.FormaPago);
        const fechaInicio = cotizacion.Principal.FecIniPoliza;
        const fechaInicioSplit = fechaInicio.split('/').reverse().join('-') + 'T00:00:00';
        const parseFechaInicio = new Date(fechaInicioSplit);
        factory.cotizacion.CodTipDeclara = frecuencia === 12 ? 0 : frecuencia
        _setPoliza({
          formaPago: cotizacion.Principal.FormaPago,
          fecIniPoliza: parseFechaInicio,
          fecFinPoliza: cotizacion.Principal.FecFinPoliza,
          codigo: frecuencia === 12 ? 0 : frecuencia,
          centroRiesgo: cotizacion.Principal.CentroRiesgo,
          descripcionFrecuencia: cotizacion.Principal.DesFormaPago
        });
      }
    }

    function _verificarSetearAsegurados(cotizacion) {
      if (cotizacion.Principal.Secuencia > 3) {
        factory.cotizacion.riesgos.map(function (riesgo, index) {
          riesgo.riesgos = {
            "CargaAsegurado": {
              "RiesgoDTO": [
                {
                  "NumRamo": constants.module.polizas.vidaLey.codeRamo,
                  "NumMovimiento": riesgo.numMovimiento,
                  "NumRiesgo": riesgo.numRiesgo,
                  "NumTrabajadores": riesgo.numeroTrabajadores,
                  "CodCategoria": riesgo.codigoCategoria,
                  "ImportPlanilla": riesgo.montoTrabajadores,
                  "ImportePlanillaTopado": cotizacion.Riesgos && cotizacion.Riesgos[index] && cotizacion.Riesgos[index].ImportePlanillaTopado || riesgo.importePlanillaTopado,
                  "NomCategoria": riesgo.nomCategoria,
                  "sumMontoTopado": riesgo.montoTopado,
                }
              ]
            }
          }
          return riesgo.riesgos;
        })

        factory.cotizacion.riesgos.map(function (riesgo) {
          riesgo.riesgos.CargaAsegurado.RiesgoDTO.forEach(function (riesgoDTO) {
            proxyVidaLey.GetListCoberturas(riesgoDTO.NumTrabajadores, true).then(function (response) {
              var coberturas = factory.getCoberturas(response)
              riesgo.coberturas = [];
              riesgo.coberturas.push(coberturas);
              riesgoDTO.coberturas = coberturas;
              var cob = coberturas.filter(function (cobertura) {
                return cobertura.flag === 2;
              });
              riesgoDTO.codPlan = cob[0].CodPlan;
            });
          })
        })
      }

    }

    function _setPoliza(poliza) {
      factory.cotizacion.duracion.fechaFinal = poliza.fecFinPoliza;

      factory.cotizacion.duracion.modelo = {};
      factory.cotizacion.duracion.modelo.mFechaInicial = poliza.fecIniPoliza;
      factory.cotizacion.duracion.modelo.fechaInicial = factory.formatearFecha(factory.cotizacion.duracion.modelo.mFechaInicial)
      factory.cotizacion.duracion.modelo.mFechaFinal = poliza.fecFinPoliza;
      factory.cotizacion.duracion.modelo.mCentroRiesgo = poliza.centroRiesgo;

      factory.cotizacion.duracion.modelo.mDuracionCobertura = {};
      factory.cotizacion.duracion.modelo.mDuracionCobertura.Codigo = poliza.codigo;

      factory.cotizacion.duracion.modelo.mFrecuenciaDuracion = {};
      factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.CodigoRegistro = poliza.formaPago;
      factory.cotizacion.duracion.modelo.mFrecuenciaDuracion.Descripcion = poliza.descripcionFrecuencia;
    }


    function _getAgregarMes(fecha, meses) {
      var currentMonth = fecha.getMonth();
      var fechaResult = new Date(fecha);
      fechaResult.setMonth(fecha.getMonth() + meses)
      if (fechaResult.getMonth() != ((currentMonth + meses) % 12)) {
        fechaResult.setDate(0);
      }
      return fechaResult;
    }

    function _getCotizacionContratante() {
      return {
        "tipDocum": factory.cotizacion.contratante.tipoDocumento,
        "codDocum": factory.cotizacion.contratante.numeroDocumento,
        "nombre": factory.cotizacion.contratante.nombreCompleto,
        "tipActEconomica": factory.cotizacion.actividad && factory.cotizacion.actividad.CodActividad || factory.cotizacion.codActividad

      };
    }

    function _getParametrosCargaAseguradosBase(riesgo) {
      return {
        "producto": {
          "codCia": constants.module.polizas.vidaLey.companyCode,
          "codRamo": constants.module.polizas.vidaLey.codeRamo,
          "codigoProducto": constantsVidaLey.CODIGO_PRODUCTO
        },
        "cabecera": {
          "codigoUsuario": factory.cotizacion.claims.codigoUsuario,
          "codigoAplicacion": 'EMISA'
        },
        "poliza": {
          "numPoliza": factory.cotizacion.numeroPoliza,
          "numSpto": constantsVidaLey.NUMERO_SUPLEMENTO,
          "numApli": constantsVidaLey.NUMERO_APLICACION,
          "numSptoApli": constantsVidaLey.NUMERO_SUPLEMENTO_APLICACION,
          "numPolizaEnlace": null,
          "FecEfecSpto": factory.formatearFecha(factory.cotizacion.duracion.modelo.mFechaInicial),
          "FecVctoSpto": factory.cotizacion.duracion.fechaFinal,
          "codFormaDeclaracion": factory.cotizacion.CodTipDeclara,
          "numRemuMN": 16
        },
        "trama": {
          "mcaValidaNroAseg": "S",
          "numAsegurados": riesgo.numeroTrabajadores,
          "mcaExoneraSueldoMin": "N",
          "mcaValidaSueldoTope": "N"
        }
      };
    }

    function _getRiesgoDTO(riesgos) {
      return riesgos.map(function (riesgo) {
        return {
          "NumMovimiento": riesgo.NumMovimiento || riesgo.numMovimiento,
          "NumRamo": constants.module.polizas.vidaLey.codeRamo,
          "NumRiesgo": riesgo.NumRiesgo || riesgo.numRiesgo,
          "NumTrabajadores": riesgo.NumTrabajadores || riesgo.numeroTrabajadores,
          "MontoTrabajadores": riesgo.sumMontoTopado,
          "MontoTrabajadoresReal": riesgo.sueldoTotal || riesgo.MontoTrabajadoresReal || riesgo.montoTrabajadoresReal,
          "CodCategoria": riesgo.CodCategoria || riesgo.codigoCategoria,
          "McaMasivo": factory.cotizacion.riesgos[0].tipo === 0 ? 'S' : 'N',
          "CodPlan": riesgo.codPlan,
          "ImportePlanilla": riesgo.montoTrabajadoresReal,
          "ImportePlanillaTopado": riesgo.ImportePlanillaTopado || riesgo.montoTrabajadores,
        };
      });
    }

    function setRiesgoMontoTopado(data) {
      var riesgoTopado = data.RiesgoDTO.map(function (riesgo) {
        return {
          "ImportePlanillaTopado": riesgo.ImportePlanillaTopado
        }
      });

      factory.cotizacion.riesgosTopado = _.flatten(riesgoTopado);
      if (factory.cotizacion.riesgos[0] && factory.cotizacion.riesgos[0].riesgos) {
        factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO = factory.cotizacion.riesgos[0].riesgos.CargaAsegurado.RiesgoDTO.map(function (riesgo, index) {
          return {
            "NumRamo": constants.module.polizas.vidaLey.codeRamo,
            "NumMovimiento": riesgo.NumMovimiento,
            "NumRiesgo": riesgo.NumRiesgo,
            "NumTrabajadores": riesgo.NumTrabajadores,
            "CodCategoria": riesgo.CodCategoria,
            "ImportPlanilla": riesgo.ImportPlanilla,
            "ImportePlanillaTopado": factory.cotizacion.riesgosTopado[index] && factory.cotizacion.riesgosTopado[index].ImportePlanillaTopado,
            "NomCategoria": riesgo.NomCategoria,
            "sumMontoTopado": riesgo.sumMontoTopado,
            "McaDeclaraAseg": riesgo.McaDeclaraAseg,
            "MontoTrabajadores": riesgo.MontoTrabajadores,
            "MontoTrabajadoresReal": riesgo.MontoTrabajadoresReal,
            "SueldoLimite": riesgo.SueldoLimite,
            "coberturas": riesgo.coberturas,
            "codPlan": riesgo.codPlan,
            "sueldoTotal": riesgo.sueldoTotal,
            "sumPlanillaTope": riesgo.sumPlanillaTope
          }
        });
      } else {
        factory.cotizacion.riesgos = factory.cotizacion.riesgos.map(function (riesgo, index) {
          return {
            "NumRamo": constants.module.polizas.vidaLey.codeRamo,
            "NumMovimiento": riesgo.NumMovimiento,
            "NumRiesgo": riesgo.NumRiesgo,
            "NumTrabajadores": riesgo.NumTrabajadores,
            "CodCategoria": riesgo.CodCategoria,
            "ImportPlanilla": riesgo.ImportPlanilla,
            "ImportePlanillaTopado": factory.cotizacion.riesgosTopado[index] && factory.cotizacion.riesgosTopado[index].ImportePlanillaTopado,
            "NomCategoria": riesgo.NomCategoria,
            "sumMontoTopado": riesgo.sumMontoTopado,
            "McaDeclaraAseg": riesgo.McaDeclaraAseg,
            "MontoTrabajadores": riesgo.MontoTrabajadores,
            "MontoTrabajadoresReal": riesgo.MontoTrabajadoresReal,
            "SueldoLimite": riesgo.SueldoLimite,
            "coberturas": riesgo.coberturas,
            "codPlan": riesgo.codPlan,
            "sueldoTotal": riesgo.sueldoTotal,
            "sumPlanillaTope": riesgo.sumPlanillaTope
          }
        });
      }
    }
    function storageVidaLey() {
      return JSON.parse(localStorage.getItem('evoSubMenuEMISAVIDALEY'))[0].items
    }
    function getCodObject(name) {
      var arrayVL = storageVidaLey();
      var item = arrayVL.find(function (item) {
        return item.nombreLargo.includes(name)
      })

      return item.codigoObj;
    }

    function SetResumeStep1Emit(data) {
      factory.cotizacion = {
        contratante: getContratante(data.Principal),
        responseContratante: getClausula(data.Actividad),
        duracion: getDuracion(data.Principal),
        modelo: { agente: { codigoNombre: data.Principal.CodAgente } }
      }

    }

    function getContratante(data) {

      return {
        tipoDocumento: data.TipDocCont,
        numeroDocumento: data.NumDocCont,
        nombreCompleto: data.RazonSocial,
        telefono: data.Telefono,
        correo: data.Correo,
        telefonoCasa: data.Telefono,
      }
    }

    function getClausula(data) {
      return {
        actividad: {
          codActividad: data.CodActividad,
          descripcionActividad: data.DescripcionActividad,
          descripcionClausula: data.DescripcionClausula
        }
      }
    }

    function getDuracion(data) {

      return {
        modelo: {
          mFechaInicial: data.FecIniPoliza,
          mFechaFinal: data.FecFinPoliza,
          mFrecuenciaDuracion: { Descripcion: data.DesFormaPago }
        }
      }
    }

    function SetParametrosContacto(data) {

      factory.emision = data;
    }

    function GetParametrosContacto() {

      return {
        CodAgente: factory.principal.CodAgente,
        NumDoc: factory.principal.NumDoc,
        Contacto: {
          TelefonoCasa: factory.emision.Telefono,
          TelefonoMovil: factory.emision.Telefono2,
          CorreoElectronico: factory.emision.CorreoElectronico,
          Representante: factory.emision.Representante,
          CodCargoRepresentante: factory.emision.TipoCargoRep
        },
        Direccion: factory.emision.Ubigeo
      }
    }

    function GetStep1Emit() {

      return factory.emision;
    }

    function GetStep2Emit() {

      return factory.emision.paso2;
    }


    function SetParamsStep1Emit(data) {
      factory.emision.paso1 = {
        CodAgente: factory.principal.CodAgente,
        NumDoc: factory.principal.NumDoc,
        Contacto: {
          TelefonoCasa: data.Telefono,
          TelefonoMovil: data.Telefono2,
          CorreoElectronico: data.CorreoElectronico,
          Representante: data.Representante,
          CodCargoRepresentante: data.RepresentanteCargo.Codigo
        },
        Direccion: {
          CodDepartamento: data.Department.Codigo,
          CodProvincia: data.Province.Codigo,
          CodDistrito: data.District.Codigo,
          CodTipoVia: data.Via.Codigo,
          TipoViaNombre: data.NombreVia,
          CodTipoNumero: data.NumberType.Codigo,
          TipoNumeroNombre: data.TextoNumero,
          CodTipoInterior: data.Inside.Codigo,
          TipoInteriorNombre: data.TextoInterior,
          CodTipoZona: data.Zone.Codigo,
          TipoZonaNombre: data.TextoZona,
          Referencia: data.Referencia
        }

      }
    }

    function ParamsStep1Emit() {

      return factory.emision.paso1;
    }

    function SetStep1Emit(data) {

      factory.principal = {
        CodAgente: data.Principal.CodAgente,
        NumDoc: data.Principal.NumDoc
      }

      factory.riesgos = data.Riesgos;
    }

    function GetPersonData(data) {
      return {
        documentId: data.Principal.NumDoc,
        CodigoDocumento: data.Principal.TipDocCont,
        documentType: data.Principal.TipDocCont,
        documentNumber: data.Principal.NumDocCont,
        NumeroDocumento: data.Principal.NumDocCont,
        Nombre: data.Principal.RazonSocial,
        ApellidoPaterno: '',
        ApellidoMaterno: '',
        Telefono: data.Contacto.TelefonoCasa,
        Telefono2: data.Contacto.TelefonoMovil,
        CorreoElectronico: data.Contacto.CorreoElectronico,
        Phone: data.Principal.Telefono,
        Email: data.Principal.Correo,
        Representante: data.Contacto.Representante,
        RepresentanteCargo: { Codigo: data.Contacto.CodCargoRepresentante },
        Department: { Codigo: data.Direccion.CodDepartamento, Descripcion: data.Direccion.NombreDepartamento },
        Province: { Codigo: data.Direccion.CodProvincia, Descripcion: data.Direccion.NombreProvincia },
        District: { Codigo: data.Direccion.CodDistrito, Descripcion: data.Direccion.NombreDistrito },
        Via: { Codigo: data.Direccion.CodTipoVia },
        NumberType: { Codigo: data.Direccion.CodTipoNumero },
        Inside: { Codigo: data.Direccion.CodTipoInterior },
        Zone: { Codigo: data.Direccion.CodTipoZona },
        NombreVia: data.Direccion.TipoViaNombre,
        TextoNumero: data.Direccion.TipoNumeroNombre,
        TextoInterior: data.Direccion.TipoInteriorNombre,
        TextoZona: data.Direccion.TipoZonaNombre,
        Referencia: data.Direccion.Referencia,
        Ubigeo: {
          Departamento: { Codigo: data.Direccion.CodDepartamento, Descripcion: data.Direccion.NombreDepartamento },
          Provincia: { Codigo: data.Direccion.CodProvincia, Descripcion: data.Direccion.NombreProvincia },
          CodigoProvincia: data.Direccion.CodProvincia,
          Distrito: { Codigo: data.Direccion.CodDistrito, Descripcion: data.Direccion.NombreDistrito },
          CodigoDistrito: data.Direccion.CodDistrito,
          CodigoVia: data.Direccion.CodTipoVia,
          CodigoNumero: data.Direccion.CodTipoNumero,
          CodigoInterior: data.Direccion.CodTipoInterior,
          CodigoZona: data.Direccion.CodTipoZona,
          NombreVia: data.Direccion.TipoViaNombre,
          TextoNumero: data.Direccion.TipoNumeroNombre,
          TextoInterior: data.Direccion.TipoInteriorNombre,
          TextoZona: data.Direccion.TipoZonaNombre,
          Referencia: data.Direccion.Referencia,
        }


      }
    }
    function SetStep2Emit(riesgo) {
      factory.emision.paso2 = {
        "CodAgente": factory.principal.CodAgente,
        "NumDoc": factory.principal.NumDoc,
        "CentroRiesgo": riesgo || '',
        "NumeroReferido": JSON.parse(window.localStorage.getItem('profile')).numeroReferido
      }
    }

    function SetRiskCenter(riesgo) {
      factory.CentroRiesgo = riesgo || ''
    }

    function GetRiskCenter() {
      return factory.CentroRiesgo;
    }

    function GetRiesgos() {
      return factory.riesgos;
    }

    function GetCurrentUserPermissions(roles) {
      var value = roles
        ? _.find(roles, function (rol) { return rol.nombreAplicacion === constantsVidaLey.APP })
        : null;

      return value.codigoRol;
    }

    function GetClausulaAutomatica() {

      return factory.cotizacion.actividad || '';
    }

    function GetUserActualRole() {
      return factory.getCurrentUserPermissions(factory.auth.rolesCode);
    }

    function _setSecuencia(secuencia) {
      if (secuencia) {
        Object.keys(factory.cotizacion.step).forEach(function (step) {
          if (step < secuencia) {
            factory.cotizacion.step[step] = true;
          }
        })
      }
    }

  }

});
