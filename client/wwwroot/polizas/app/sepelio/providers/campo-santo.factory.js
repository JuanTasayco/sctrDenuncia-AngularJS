define([
  'angular', 'lodash'
], function (angular, _) {
  'use strict';

  angular
    .module("appSepelio")
    .factory('campoSantoFactory', campoSantoFactory);

  campoSantoFactory.$inject = ['oimPrincipal', 'proxyClaims'];

  function campoSantoFactory( oimPrincipal, proxyClaims) {

    var alternativas = {};
    var componentView = '';
    var codigoRamo;
    var detalleSimulacion = {};
    var idCotizacion = null;
    var dataCorreoExepcional = {};
    var dataprospecto;
    var dataEvaluarAlternativas;
    var isPreemitidoEditable = true;

    var factory = {
      setClaims: SetClaims,
      initCotizacion: InitCotizacion,
      getUser: GetUser,
      setdataAlternativas: SetdataAlternativas,
      getdataAlternativas: GetdataAlternativas,
      setComponenteView: SetComponenteView,
      getComponenteView: GetComponenteView,
      setcodigoRamo: SetcodigoRamo,
      getcodigoRamo: GetcodigoRamo,
      setdataDetalleSimulacion: SetdataDetalleSimulacion,
      getdataDetalleSimulacion: GetdataDetalleSimulacion,
      setidCotizacion: SetidCotizacion,
      getidCotizacion: GetidCotizacion,
      setdataCorreoExepcional: SetdataCorreoExepcional,
      getdataCorreoExepcional: GetdataCorreoExepcional,
      setdataProspecto: SetdataProspecto,
      getdataProspecto: GetdataProspecto,
      validControlForm: ValidControlForm,
      setCotizacionProducto: SetCotizacionProducto,
      getModelTomador: getModelTomador,
      getModelBenefiario: getModelBenefiario,
      getModelAval: getModelAval,
      formatearFecha: FormatearFecha,
      formatearFechaNacimiento: FormatearFechaNacimiento,
      modelSimuladacion: modelSimuladacion,
      modelBuscarCotizacion: modelBuscarCotizacion,
      sendEmailExepcional: sendEmailExepcional,
      setDataEvaluarAlternativas: SetDataEvaluarAlternativas,
      getDataEvaluarAlternativas: GetDataEvaluarAlternativas,
      getModelDatosAdicionales: getModelDatosAdicionales,
      getCotizacionEmision: getCotizacionEmision,
      getIDTipoFinanciamiento: GetIDTipoFinanciamiento,
      userRoot: UserRoot,
      getClaims: getClaims,
      setDataStep: SetDataStep, 
      getDataStep: GetDataStep,
      setTipoFinancimiento: SetTipoFinancimiento,
      getDataCotizacion: GetDataCotizacion,
      getCotizacionFechaEfecto: GetCotizacionFechaEfecto,
      calcularEdad: calcularEdad,
      isPreemitidoEditable: IsPreemitidoEditable,
      setPreemitidoEditable: SetPreemitidoEditable
    };


    return factory;

    function IsPreemitidoEditable(){
      return isPreemitidoEditable;
    }

    function SetPreemitidoEditable(val){
      isPreemitidoEditable = val;
    }

    function SetTipoFinancimiento(id){
      factory.cotizacion.datosCotizacion.idTipoFinanciamiento = id;
    }

    function SetcodigoRamo(params) {
      codigoRamo = params;
    }

    function GetcodigoRamo() {
      return codigoRamo;
    }

    function SetComponenteView(params) {
      componentView = params;
    }

    function GetComponenteView() {
      return componentView;
    }


    function SetdataAlternativas(params) {
      alternativas = params;
    }

    function GetdataAlternativas() {
      return alternativas;
    }

    function SetdataDetalleSimulacion(params) {
      detalleSimulacion = params;
    }

    function GetdataDetalleSimulacion() {
      return detalleSimulacion;
    }

    function SetidCotizacion(params) {
      idCotizacion = params;
    }

    function GetidCotizacion() {
      return idCotizacion;
    }

    function SetdataCorreoExepcional(params) {
      dataCorreoExepcional = params;
    }

    function GetdataCorreoExepcional() {
      return dataCorreoExepcional;
    }

    function SetdataProspecto(params) {
      dataprospecto = params;
    }

    function GetdataProspecto() {
      return dataprospecto;
    }

    function SetDataEvaluarAlternativas(params) {
      dataEvaluarAlternativas = params;
    }

    function GetDataEvaluarAlternativas() {
      return dataEvaluarAlternativas;
    }

    function InitCotizacion() {
      factory.cotizacion = {
        step: {},
        claims: {},
        datosAval: {},
        datosCotizacion: {},
        datosBeneficiario: {},
        datosTomador: {},
        datosAdicionales: {},
        form: {},
        simulador: {},
        editar: false
      };
      _setClaimsCotizacion(factory.auth);
    }
    function SetCotizacionProducto(cotizacion) {
      factory.initCotizacion();
      factory.cotizacion = angular.extend({}, factory.cotizacion, cotizacion);
    }
    function ValidControlForm(form, controlName) {
      var control = form[controlName];
      return control && control.$error.required && !control.$pristine;
    }
    function SetClaims(claims) {
      factory.auth = claims;
    }
    function GetUser() {
      return {
        codigoUsuario: factory.auth && factory.auth.loginUserName,
        rolUsuario: factory.auth && factory.auth.roleCode,
        nombreAgente: factory.auth && factory.auth.agentName,
        codigoAgente: factory.auth && factory.auth.agentID
      };
    }

    function getClaims() {
      return proxyClaims.GetClaims();
    }

    function _setClaimsCotizacion(auth) {
      factory.cotizacion.claims = {
        codigoUsuario: auth && auth.loginUserName,
        rolUsuario: auth && auth.roleCode,
        nombreAgente: auth && auth.agentName,
        codigoAgente: auth && auth.agentID
      }
    }

    function UserRoot() {
      var rol = oimPrincipal.get_role('EMISA-CAMPOSANTO');
      var Roles = { "AGENTE": false, "EMISOR": true, "EMISOR_2": true };
      return Roles[rol]
    }

    function FormatearFecha(fecha) {
      if (fecha) {
        if (fecha instanceof Date) {
          var today = fecha;
          var dd = today.getDate();
          var mm = today.getMonth() + 1;

          var yyyy = today.getFullYear();
          return today = ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy;
        }
        else {
          var fechaAux = new Date(fecha);
          var dd = fechaAux.getDate();
          var mm = fechaAux.getMonth() + 1;
          var yyyy = fechaAux.getFullYear();
          return ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy;
        }
      }
      return fecha;
    }

    function FormatearFechaNacimiento(fecha) {
      if (fecha) {
        if (fecha instanceof Date) {
          var today = fecha;
          var dd = today.getDate();
          var mm = today.getMonth() + 1;
          var yyyy = today.getFullYear();
          if (isNaN(yyyy)) {
            return "1990-01-01"
          }
          else {
            return today = yyyy + '-' + mm + '-' + dd;
          }
        }
        else if (fecha.search('/') >= 0) {
          var fechaSplit = fecha.split("/");
          return fechaSplit[2] + '-' + fechaSplit[1] + '-' + fechaSplit[0];
        }
        else {
          return fecha;
        }
      }
      else {
        return null;
      }
    }

    function calcularEdad(fecha) {
      var hoy = new Date();
      var cumpleanos = new Date(fecha);
      var edad = hoy.getFullYear() - cumpleanos.getFullYear();
      var m = hoy.getMonth() - cumpleanos.getMonth();
  
      if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
          edad--;
      }
  
      return edad;
    }

    function GetIDTipoFinanciamiento(nroCuotas) {
      if (nroCuotas = 1) {
        return "TIPO_1"
      }
      else if (nroCuotas > 1 & nroCuotas < 13) {
        return "TIPO_2"
      }
      else if (nroCuotas > 12 & nroCuotas < 25) {
        return "TIPO_3"
      }
      else if (nroCuotas >= 36) {
        return "TIPO_4"
      }
    }

    function getGeneralModelEmision(preEmision) {
      var isValidDate = Date.parse(preEmision.modelo.fechaNacimiento);
      var paramModelEmision = {
        "idAsociado": preEmision.modelo.idAsociado || 0,  // por defecto 0
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion || null,
        "nombre": preEmision.modelo.nombre || null,
        "paterno": preEmision.modelo.paterno || null,
        "materno": preEmision.modelo.materno || null,
        "idDocumento": preEmision.modelo.idDocumento.Codigo,
        "numDocumento": preEmision.modelo.numDocumento || null,
        "fechaNacimiento": isNaN(isValidDate) ? null : FormatearFechaNacimiento(preEmision.modelo.fechaNacimiento),
        "idEstadoCivil": preEmision.modelo.estadoCivil ? preEmision.modelo.estadoCivil.CodigoEstadoCivil : null,
        "idProfesion": preEmision.modelo.profesion ? preEmision.modelo.profesion.codProfesionBE : null,
        "idOcupacion": preEmision.modelo.ocupacion ? preEmision.modelo.ocupacion.Codigo : null,
        "idNacionalidad": preEmision.modelo.nacionalidad ? preEmision.modelo.nacionalidad.Codigo : null,
        "correoElectronico": preEmision.modelo.correoElectronico || null,
        "celular1": preEmision.modelo.celular1 || null,
        "celular2": preEmision.modelo.celular2 || null,
        "idPais": preEmision.modelo.pais.Codigo || null,
        "idDepartamento": preEmision.modelo.departamento ? preEmision.modelo.departamento.Codigo : null,
        "idProvincia": preEmision.modelo.provincia ? preEmision.modelo.provincia.Codigo : null,
        "idDistrito": preEmision.modelo.distrito ? preEmision.modelo.distrito.Codigo : null,
        "idTipoDomicilio": preEmision.modelo.domicilio ? preEmision.modelo.domicilio.Codigo : null,
        "idNumero": preEmision.modelo.numeracion ? preEmision.modelo.numeracion.Codigo : null,
        "idInterior": preEmision.modelo.interior ? preEmision.modelo.interior.Codigo : null,
        "idZona": preEmision.modelo.zona ? preEmision.modelo.zona.Codigo : null,
        "referencia": preEmision.modelo.referencia || null,
        "idSexo": preEmision.modelo.sexo ? preEmision.modelo.sexo.Codigo : null,
        "descripcionDomicilio": preEmision.modelo.descripcionDomicilio,
        "descripcionNumero": preEmision.modelo.descripcionNumero,
        "descripcionInterior": preEmision.modelo.descripcionInterior,
        "descripcionZona": preEmision.modelo.descripcionZona
      }
      return paramModelEmision;
    }
    function getModelTomador() {
      var globalParameter = getGeneralModelEmision(factory.cotizacion.datosTomador);
      return globalParameter;
    }
    function getModelBenefiario() {
      return _getModelEmisionDTO(factory.cotizacion.datosBeneficiario);
    }
    function getModelAval() {
      var globalParameter = getGeneralModelEmision(factory.cotizacion.datosAval);
      var paramAval = {
        "ImporteAFinanciar": factory.cotizacion.datosAval.modelo.ImporteAFinanciar
      }
      var parameter = angular.extend({}, globalParameter, paramAval);

      if (factory.cotizacion.datosAval.modelo.eliminado) {
        return null; 
      }else{
        return parameter;
      }
    }

    function getModelDatosAdicionales() {
      factory.cotizacion.datosAdicionales.idCotizacion = factory.cotizacion.datosCotizacion.idCotizacion;
      var isValidDateContrato = Date.parse(factory.cotizacion.datosAdicionales.modelo.fechaContrato);
      var isValidDateInhumacion = Date.parse(factory.cotizacion.datosAdicionales.modelo.fechaInhumacion);
      return {
        "idAsociado": factory.cotizacion.datosCotizacion.idAsociado,
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion,
        "idSede": factory.cotizacion.datosAdicionales.modelo.agenciaFuneraria ? factory.cotizacion.datosAdicionales.modelo.agenciaFuneraria.CodAgencia : null,
        "tipoEmision": factory.cotizacion.datosAdicionales.modelo.tipoEmision ? factory.cotizacion.datosAdicionales.modelo.tipoEmision.value : null,
        "numeroContrato": factory.cotizacion.datosAdicionales.modelo.numeroContrato,
        "numeroContratoManual": factory.cotizacion.datosAdicionales.modelo.numeroContratoManual,
        "numeroContratoGenerado": factory.cotizacion.datosAdicionales.modelo.numeroContratoGenerado,
        "fechaContrato": isNaN(isValidDateContrato) ? null : factory.formatearFechaNacimiento(factory.cotizacion.datosAdicionales.modelo.fechaContrato),
        "fechaInhumacion": isNaN(isValidDateInhumacion) ? null : factory.formatearFechaNacimiento(factory.cotizacion.datosAdicionales.modelo.fechaInhumacion),
        "idVendedorFunarario": factory.cotizacion.datosAdicionales.modelo.vendedorFunerario ? factory.cotizacion.datosAdicionales.modelo.vendedorFunerario.codVendedor : null,
        "nombreVendedor": factory.cotizacion.datosAdicionales.modelo.vendedorFunerario ? factory.cotizacion.datosAdicionales.modelo.vendedorFunerario.nombreCompleto : null,
        "idSupervidorNI": factory.cotizacion.datosAdicionales.modelo.supervisorNI ? factory.cotizacion.datosAdicionales.modelo.supervisorNI.codSupervisor : null,
        "codUbicacion": factory.cotizacion.datosAdicionales.modelo.ubicacion,
        "codSector": factory.cotizacion.datosAdicionales.modelo.sector,
        "sitio": factory.cotizacion.datosAdicionales.modelo.sitio,
        "tamanio": factory.cotizacion.datosAdicionales.modelo.tamano
      };
    }

    function getCotizacionEmision() {
      var globalParameter = angular.copy(factory.cotizacion.datosCotizacion);
      var fechasParams = {
        "fecEfec": factory.formatearFechaNacimiento(factory.cotizacion.datosCotizacion.fecEfec),
        "fecVcto": factory.formatearFechaNacimiento(factory.cotizacion.datosCotizacion.fecVcto),
        "estado": "PRE-EMITIDO"
      }
      var parameter = angular.extend({}, globalParameter, fechasParams);
      return parameter;
    }

    function _getModelEmisionDTO(model) {
      return model.map(function (item) {
        var isValidDate = Date.parse(item.modelo.fechaNacimiento);
        var isValidDateDefuncion = Date.parse(item.modelo.fechaDefuncion)
        return {
          "idCotizacion": item.modelo.idCotizacion || factory.cotizacion.datosCotizacion.idCotizacion || null,
          "nombre": item.modelo.nombre || null,
          "paterno": item.modelo.paterno || null,
          "materno": item.modelo.materno || null,
          "tipoBeneficiario": item.modelo.tipoBeneficiario ? item.modelo.tipoBeneficiario.Codigo : null,
          "idDocumento": item.modelo.idDocumento.Codigo,
          "numDocumento": item.modelo.numDocumento || null,
          "fechaNacimiento": isNaN(isValidDate) ? null : FormatearFechaNacimiento(item.modelo.fechaNacimiento),
          "idEstadoCivil": item.modelo.estadoCivil ? item.modelo.estadoCivil.CodigoEstadoCivil : null,
          "idProfesion": item.modelo.profesion ? item.modelo.profesion.codProfesionBE : null,
          "idOcupacion": item.modelo.ocupacion ? item.modelo.ocupacion.Codigo : null,
          "idNacionalidad": item.modelo.nacionalidad ? item.modelo.nacionalidad.Codigo : null,
          "correoElectronico": item.modelo.correoElectronico || null,
          "celular1": item.modelo.celular1 || null,
          "celular2": item.modelo.celular2 || null,
          "idPais": item.modelo.pais.Codigo || null,
          "idDepartamento": item.modelo.departamento ? item.modelo.departamento.Codigo : null,
          "idProvincia": item.modelo.provincia ? item.modelo.provincia.Codigo : null,
          "idDistrito": item.modelo.distrito ? item.modelo.distrito.Codigo : null,
          "idTipoDomicilio": item.modelo.domicilio ? item.modelo.domicilio.Codigo : null,
          "idNumero": item.modelo.numeracion ? item.modelo.numeracion.Codigo : null,
          "idInterior": item.modelo.interior ? item.modelo.interior.Codigo : null,
          "idZona": item.modelo.zona ? item.modelo.zona.Codigo : null,
          "referencia": item.modelo.referencia || null,
          "idSexo": item.modelo.sexo ? item.modelo.sexo.Codigo : null,
          "descripcionDomicilio": item.modelo.descripcionDomicilio,
          "descripcionNumero": item.modelo.descripcionNumero,
          "descripcionInterior": item.modelo.descripcionInterior,
          "descripcionZona": item.modelo.descripcionZona,
          "codParentesco": item.modelo.parentesco ? item.modelo.parentesco.Codigo : null,
          "fechaDefuncion": isNaN(isValidDateDefuncion) ? null : FormatearFechaNacimiento(item.modelo.fechaDefuncion),
        }
      })
    }

    function GetDataCotizacion(){
      
      var datosCotizacion = factory.cotizacion.datosCotizacion;
            
      return {
        documentType:{
          Codigo: datosCotizacion.idDocumento
        },
        documentNumber: datosCotizacion.numDocumento,
        Nombre: datosCotizacion.nombre,
        ApellidoPaterno: datosCotizacion.paterno,
        ApellidoMaterno: datosCotizacion.materno,
        civilState:{
          Codigo: datosCotizacion.idEstadoCivil
        },
        CorreoElectronico: datosCotizacion.correoElectronico,
        Telefono: datosCotizacion.celular1,
        Telefono2: datosCotizacion.celular2,
        Direccion: datosCotizacion.direccion,       
        Department: {
          Codigo:  datosCotizacion.idDepartamento,
        },
        Province: {
          Codigo:  datosCotizacion.idProvincia,
        },
        District: {
          Codigo:  datosCotizacion.idDistrito,
        },
        camposanto: {
          Codigo:  datosCotizacion.idCampoSanto,
        },
        ramo:  datosCotizacion.idRamo,
        tipoContrato: {
          Codigo:  datosCotizacion.idTipoProducto,
          Descripcion: datosCotizacion.nombreTipoProducto
        },
        modalidad: {
          Codigo:  datosCotizacion.idModalidad,
          Descripcion: datosCotizacion.nombreModalidad
        },
        idProducto: {
          Codigo:  datosCotizacion.idProducto,
          Descripcion: datosCotizacion.nombreProducto
        },
        cuotas: {
          Codigo:  datosCotizacion.idFraccionamiento,
          NumeroCuota:  datosCotizacion.numeroCuotas,
        },
        idTipoFinanciamiento:  datosCotizacion.idTipoFinanciamiento,
        idRangoEdad:  datosCotizacion.idRangoEdad,
        estudiosSuperiores:  datosCotizacion.estudiosSuperiores,
        estadoCotizacion:  datosCotizacion.estado,
        gradoInstruccion:  datosCotizacion.idGradoEducacion,
        auto:  datosCotizacion.idAuto,
        idPago:  datosCotizacion.idPago,
        contratoRelacionado:  datosCotizacion.NumeroContratoRelacionado
        
      }
    }

    function modelGeneralCotizacion() {
      var person = factory.cotizacion.datosCotizacion.personData || GetDataCotizacion();

      return {
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion || GetidCotizacion(),
        "idDocumento": person.documentType.Codigo,
        "numDocumento": person.documentNumber,
        "nombre": person.Nombre,
        "paterno": person.ApellidoPaterno,
        "materno": person.ApellidoMaterno,
        "idEstadoCivil": factory.cotizacion.datosCotizacion.estadocivil ? factory.cotizacion.datosCotizacion.estadocivil : person.civilState.Codigo,
        "idRamo": parseInt(factory.cotizacion.datosCotizacion.ramo) ||parseInt(person.ramo),
        "idCampoSanto": factory.cotizacion.datosCotizacion.camposanto && factory.cotizacion.datosCotizacion.camposanto.Codigo || person.camposanto.Codigo,
        "idTipoProducto": factory.cotizacion.datosCotizacion.tipoContrato && factory.cotizacion.datosCotizacion.tipoContrato.Codigo || person.tipoContrato.Codigo,
        "idModalidad": factory.cotizacion.datosCotizacion.modalidad && parseInt(factory.cotizacion.datosCotizacion.modalidad.Codigo) || parseInt(person.modalidad.Codigo),
        "idProducto": factory.cotizacion.datosCotizacion.producto && factory.cotizacion.datosCotizacion.producto.Codigo || person.idProducto.Codigo,
        "numeroCuotas": factory.cotizacion.datosCotizacion.cuotas && factory.cotizacion.datosCotizacion.cuotas.NumeroCuota || person.cuotas.NumeroCuota,
        "idTipoFinanciamiento": factory.cotizacion.datosCotizacion.idTipoFinanciamiento || person.idTipoFinanciamiento,
        "correoElectronico": person.CorreoElectronico,
        "celular1": person.Telefono,
        "celular2": person.Telefono2,
        "direccion": person.Direccion,
        "idRangoEdad": factory.cotizacion.datosCotizacion.idrangoedad || person.idRangoEdad,
        "idDepartamento": person.Department && person.Department.Codigo || person.Ubigeo.CodigoDepartamento,
        "idProvincia": person.Province && person.Province.Codigo || person.Ubigeo.CodigoProvincia,
        "idDistrito": person.District && person.District.Codigo || person.Ubigeo.CodigoDistrito,
        "estudiosSuperiores": factory.cotizacion.datosCotizacion.estudioSuperior || person.estudiosSuperiores,
        "estado": factory.cotizacion.datosCotizacion.estadoCotizacion,
        "idGradoEducacion": person.gradoInstruccion || factory.cotizacion.datosCotizacion.gradoInstruccion && factory.cotizacion.datosCotizacion.gradoInstruccion.Codigo || null,
        "idAgente": factory.cotizacion.datosCotizacion.claims ? factory.cotizacion.datosCotizacion.claims.codigoAgente : factory.cotizacion.datosCotizacion.idAgente ||  parseInt(oimPrincipal.getAgent().codigoAgente),
        "nombreAgente": factory.cotizacion.datosCotizacion.claims ? getFormatNombreAgente(factory.cotizacion.datosCotizacion.claims.nombreAgente) : factory.cotizacion.datosCotizacion.nombreAgente ? getFormatNombreAgente(factory.cotizacion.datosCotizacion.nombreAgente) : getFormatNombreAgente(oimPrincipal.getAgent().codigoNombre),
        "idAuto": factory.cotizacion.datosCotizacion.auto ? factory.cotizacion.datosCotizacion.auto.toString() : person.auto,
        "idPago": factory.cotizacion.datosCotizacion.idPago || factory.cotizacion.datosCotizacion.TipoFinancimiento,
        "idCategoria": null,
        "idFraccionamiento": factory.cotizacion.datosCotizacion.cuotas && factory.cotizacion.datosCotizacion.cuotas.Codigo || person.cuotas.Codigo,
        "idMotivo": null,
        "textoMotivo": null,
        "numeroContratoRelacionado": factory.cotizacion.datosCotizacion.contratoRelacionado
      }
    }

    function getFormatNombreAgente(nombreAgente){
      var parts = nombreAgente.split(" >>> ");
      if (parts.length > 1) return parts[1];
      else return parts[0] ;
    }

    function modelSimuladacion() {
      var globalParameter = modelGeneralCotizacion()
      var simulacion = {
        "costoTotal": factory.cotizacion.simulador.montoTotal || factory.cotizacion.datosCotizacion.simulacion.precioProducto,
        "costoFinal": parseFloat(factory.cotizacion.simulador.montoTotal) - parseFloat(factory.cotizacion.simulador.descuento) || parseFloat(factory.cotizacion.datosCotizacion.simulacion.precioProducto) - parseFloat(factory.cotizacion.datosCotizacion.simulacion.descuento),
        "cuotaInicial": parseFloat(factory.cotizacion.simulador.importeInicial) || parseFloat(factory.cotizacion.datosCotizacion.simulacion.cuotaInicial),
        "descuento": parseFloat(factory.cotizacion.simulador.descuento) || parseFloat(factory.cotizacion.datosCotizacion.simulacion ? factory.cotizacion.datosCotizacion.simulacion.descuento : 0),
        "fechaNacimiento": factory.formatearFechaNacimiento(factory.cotizacion.datosCotizacion.fechaNacimiento) || "1990-01-01",
      }
      var parameter = angular.extend({}, globalParameter, simulacion);
      return parameter
    }
    function modelBuscarCotizacion() {
      return {
        "tipoBusqueda": 2,
        "idRamo": null,
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion,
        "idCampoSanto": null,
        "idTipoContrato": null,
        "estado": null,
        "fechaInicio": null,
        "fechaFin": null,
        "numeroPagina": 1,
        "numeroRegistros": 10
      }
    }
    function sendEmailExepcional() {
      return {
        "tipoCorreo": "C_RECIBIDO",
        "idTipoContrato": factory.cotizacion.datosCotizacion.producto ? factory.cotizacion.datosCotizacion.producto.Codigo : factory.cotizacion.datosCotizacion.idProducto,
        "nombreTipoContrato": factory.cotizacion.datosCotizacion.producto ? factory.cotizacion.datosCotizacion.producto.Descripcion : factory.cotizacion.datosCotizacion.nombreProducto,
        "idCategoria": "TIPO_A",
        "importe": factory.cotizacion.simulador.montoTotal,
        "idAgente": parseInt(oimPrincipal.getAgent().codigoAgente),
        "nombreAgente": factory.cotizacion.claims.nombreAgente,
        "comentario": "ENVIO DE COTIZACION",
        "idRamo": parseInt(factory.cotizacion.datosCotizacion.ramo),
        "idCampoSanto": factory.cotizacion.datosCotizacion.camposanto ? factory.cotizacion.datosCotizacion.camposanto.Codigo : factory.cotizacion.datosCotizacion.idCampoSanto,
        "emailusuario": factory.cotizacion.datosCotizacion.emailSend,
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion,
      }
    }

    function SetDataStep (data) {
      factory.dataStep = angular.extend({}, factory.dataStep, data);
    }


    function GetDataStep() {
      return factory.dataStep;
    }

    function GetCotizacionFechaEfecto() {
      var params = {
        "idCotizacion": factory.cotizacion.datosCotizacion.idCotizacion,
        "fecEfec": factory.formatearFechaNacimiento(factory.cotizacion.datosCotizacion.fecEfec),
        "fecVcto": factory.formatearFechaNacimiento(factory.cotizacion.datosCotizacion.fecVcto),
      }
      return params;
    }

  }


});
