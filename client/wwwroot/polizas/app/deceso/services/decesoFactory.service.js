'use strict';

define(['angular', 'constants'], function(angular, constants) {
    decesoFactory.$inject = [
    '$http',
    '$q',
    '$state',
    '$window',
    'proxyDeceso',
    'proxyCotizacion',
    'httpData',
    'mModalAlert',
    'mainServices',
    'mpSpin',
    'proxyMail',
    'proxySalud',
    'proxyGeneral',
    'proxyMenu'
  ];
  function decesoFactory(
    $http,
    $q,
    $state,
    $window,
    proxyDeceso,
    proxyCotizacion,
    httpData,
    mModalAlert,
    mainServices,
    mpSpin,
    proxyMail,
    proxySalud,
    proxyGeneral,
    proxyMenu
  ) {
    var firstStep = {};    

    function ListarRamoTronPag(model, showSpin) {
        return proxyDeceso.ListarRamoTronPag(model, showSpin);
    }
    function ActualizaRamo(model, showSpin) {
      return proxyDeceso.ActualizaRamo(model, showSpin);
    }
    function ListaPolizaGrupoTron(codigoRamo, showSpin) {
      return proxyDeceso.ListaPolizaGrupoTron(codigoRamo, showSpin);
    }
    function ListaModalidadTron(codigoRamo, showSpin) {
      return proxyDeceso.ListaModalidadTron(codigoRamo, showSpin);
    }
    function ActualizaPolizaGrupoModalidad(request, showSpin){
      return proxyDeceso.ActualizaPolizaGrupoModalidad(request, showSpin);
    }
    function ObtenerArchivos(request, showSpin){
      return proxyDeceso.ObtenerArchivos(request, showSpin);
    }
    function GetDescargarArchivo(codigo, showSpin){
      return proxyDeceso.GetDescargarArchivo(codigo, showSpin);
    }
    function GetDescargarArchivo64(codigo, showSpin){
      return proxyDeceso.GetDescargarArchivo64(codigo, showSpin);
    }
    function saveFileInterest(option, file, paramsFile){
      var fd = new FormData();
      fd.append("Descripcion", paramsFile.Description);
      fd.append("Nombre", paramsFile.Name);
      fd.append("Estado", paramsFile.Estate);
      fd.append("UsuarioCreacion", paramsFile.userCreation);
      fd.append("Type", file ? file.type : null);
      fd.append("fieldNameHere", file || null);

      if (option == 'r'){
        return $http.post(constants.system.api.endpoints.policy + 'api/deceso/archivos-interes/cargar/', fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        });
      }else{
        fd.append("Codigo", paramsFile.Code);
        return $http.put(constants.system.api.endpoints.policy + 'api/deceso/archivos-interes/actualizar/', fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        });
      }
    }
    function GetListAgente(body, showSpin){
      return proxyDeceso.GetListAgente(body, showSpin);
    }
    function ListaMedioPago(showSpin){
      return proxyDeceso.ListaMedioPago(showSpin);
    }
    function ListarRamo(showSpin){
      return proxyDeceso.ListarRamo(showSpin);
    }
    function ListaPolizaGrupo(codigoRamo, showSpin){
      return proxyDeceso.ListaPolizaGrupo(codigoRamo, showSpin);
    }
    function ListaModalidad(codigoRamo, showSpin){
      return proxyDeceso.ListaModalidad(codigoRamo, showSpin);
    }
    function validarIntegrante(param, showSpin){
      return proxyDeceso.ValidaEdad(param, showSpin);
    }
    function ListaTipoAsegurado(showSpin){
      return proxyDeceso.ListaTipoAsegurado(showSpin);
    }
    function ListaFinanciamiento(codigoRamo, numeroPolizaGrupo, codigoModalidad, showSpin){
      return proxyDeceso.ListaFinanciamiento(codigoRamo, numeroPolizaGrupo, codigoModalidad, showSpin);
    }
    function RegistrarCotizacion(param, showSpin){
      return proxyDeceso.RegistrarCotizacion(param, showSpin);
    }
    function ObtenerCotizacion(num, showSpin){
      return proxyDeceso.ObtenerCotizacion(num, showSpin);
    }
    function DescargarCotizacion(num, showSpin){
      return proxyDeceso.DescargarCotizacion(num, showSpin);
    }
    function SendMailCotizacionDeceso(data, showSpin){
      return proxyMail.SendMailCotizacionDeceso(data, showSpin);
    }
    function FechaVigencia(CodigoRamo, NumeroPolizaGrupo, CodigoModalidad, showSpin){
      return proxyDeceso.FechaVigencia(CodigoRamo, NumeroPolizaGrupo, CodigoModalidad, showSpin);
    }
    function ListarCotizacionDecesoPag(model, showSpin){
      return proxyCotizacion.ListarCotizacionDecesoPag(model, showSpin);
    }
    function ListarCotizacionDecesoPag(model, showSpin){
      return proxyCotizacion.ListarCotizacionDecesoPag(model, showSpin);
    }
    function GetListEntidadFinanciera(showSpin){
      return proxyGeneral.GetListEntidadFinanciera(showSpin);
    }
    function GetListGestor(TipoGestor, CodigoEntidad, showSpin){
      return proxyGeneral.GetListGestor(TipoGestor, CodigoEntidad, showSpin);
    }
    function GetListTipoCuenta(showSpin){
      return proxyGeneral.GetListTipoCuenta(showSpin);
    }
    function GetEnmascarCuenta(codigoEntidad, tipoCuenta, codigoMoneda, cuentaCalcular, showSpin){
      return proxyGeneral.GetEnmascarCuenta(codigoEntidad, tipoCuenta, codigoMoneda, cuentaCalcular, showSpin);
    }
    function GetListTipoTarjeta(showSpin){
      return proxyGeneral.GetListTipoTarjeta(showSpin);
    }
    function GetListMonedaDeceso(showSpin){
      return proxyGeneral.GetListMonedaDeceso(showSpin);
    }
    function GetListCodigoTarjeta(codCia, CodigoTipoTarjeta, showSpin){
      return proxyGeneral.GetListCodigoTarjeta(codCia, CodigoTipoTarjeta, showSpin);
    }    
    function GetEnmascarTarjeta(tipoTarjeta, numeroTarjeta, showSpin){
      return proxyGeneral.GetEnmascarTarjeta(tipoTarjeta, numeroTarjeta, showSpin);
    }
    function _fnConvertFormData(params){
      var fd = new FormData();
      angular.forEach(params, function(value, key) {
        fd.append(key, value);
      });
      return fd;
    }

    function _fnServiceUploadPromise(url, params, showSpin){
      var vConfig = {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      };
      var vParams = _fnConvertFormData(params);
      return httpData['post'](constants.system.api.endpoints.policy + url, vParams, vConfig, showSpin);
    }
    function setPasos(data) {
      firstStep = data;
    }
    function getPasos2(quotationNumber, showspin){
      var self = this;
      return $q(function (resolve, reject) {
        if (Object.keys(firstStep).length === 0 || quotationNumber != firstStep.NumeroDocumento) {
          proxyDeceso.ObtenerCotizacion(quotationNumber, showspin).then(function(res) {
            if (res.OperationCode === 200) {
              self.setPasos(res.Data);
              resolve(res.Data);
            } else {
              reject(res.error);
            }
          });
        } else {
          resolve(firstStep);
        }
      });
    }
    function ListarArchivoDeceso(codigoCompania, codigoRamo, nroDocumento, showSpin){
      return proxyDeceso.ListarArchivoDeceso(codigoCompania, codigoRamo, nroDocumento, showSpin);
    }
    function EliminarArchivoDeceso(CodigoArchivoAdjunto, showSpin){
      return proxyDeceso.EliminarArchivoDeceso(CodigoArchivoAdjunto, showSpin);
    }
    function RegistrarEmision(solicitud, showSpin){
      return proxyDeceso.RegistrarEmision(solicitud, showSpin);
    }
    function emisionFormat(firstStep, asegurados){
      var request = {
        "CodigoSistema": firstStep.CodigoSistema || "OIM",
        "NumeroDocumento": firstStep.NumeroDocumento,
        "Ramo": firstStep.Ramo,
        "PolizaGrupo": {
            "NumeroPolizaGrupo": firstStep.PolizaGrupo.NumeroPolizaGrupo
        },
        "Modalidad": {
            "CodigoModalidad": firstStep.Modalidad.CodigoModalidad
        },
        "Agente": {
            "CodigoAgente": firstStep.mAgente.CodigoAgente,
            "CodigoNombre": firstStep.mAgente.CodigoNombre
        },
        "Financiamiento": {
            "Descripcion": firstStep.Financiamiento.Descripcion ? firstStep.Financiamiento.Descripcion : '',
            "Codigo": firstStep.Financiamiento.Codigo
        },
        "FormaPago": {
          "Descripcion": firstStep.FormaPago.Descripcion,
          "Codigo": firstStep.FormaPago.Codigo,
          "Tipo": firstStep.FormaPago.Tipo || '',
          "CodigoGestor": firstStep.FormaPago.CodigoGestor || '',
        },
        "contratante": {
            "mcaFisico": firstStep.Contratante.mcaFisico,
            "NumeroDocumento": firstStep.Contratante.NumeroDocumento,
            "TipoDocumento": firstStep.Contratante.TipoDocumento,
            "FechaNacimiento": firstStep.Contratante.FechaNacimientojs,
            "ApellidoPaterno": firstStep.Contratante.ApellidoPaterno,
            "ApellidoMaterno": firstStep.Contratante.ApellidoMaterno,
            "Nombre": firstStep.Contratante.Nombre,
            "telefonoCasa": firstStep.Contratante.TelefonoCasa,
            "telefonoMovil": firstStep.Contratante.TelefonoMovil,
            "correo": firstStep.Contratante.Correo,
            "codProfesion": firstStep.Contratante.CodProfesion,
            "nacionalidad": firstStep.Contratante.Nacionalidad,
            "EstadoCivil":  {
              "Codigo": firstStep.Contratante.EstadoCivil.CodigoEstadoCivil,
              "Descripcion": ""
            },
            "Sexo": firstStep.Contratante.Sexo,
            "direccion": {
                  "codPais": firstStep.Contratante.Direccion.CodPais,
                  "codDepartamento": firstStep.Contratante.Direccion.CodDepartamento,
                  "codProvincia": firstStep.Contratante.Direccion.CodProvincia,
                  "codDistrito": firstStep.Contratante.Direccion.CodDistrito,
                  "tipDomicilio": firstStep.Contratante.Direccion.TipDomicilio,
                  "nomDomicilio": firstStep.Contratante.Direccion.NomDomicilio,
                  "tipNumero": firstStep.Contratante.Direccion.TipNumero,
                  "descNumero": firstStep.Contratante.Direccion.DescNumero,
                  "tipInterior": firstStep.Contratante.Direccion.TipInterior,
                  "nroInterior": firstStep.Contratante.Direccion.NroInterior,
                  "tipZona": firstStep.Contratante.Direccion.TipZona,
                  "nomZona": firstStep.Contratante.Direccion.NomZona,
                  "refDireccion": firstStep.Contratante.Direccion.RefDireccion
              }
        },
        "asegurados": asegurados,
        "FlagAgenteDirecto": firstStep.FlagAgenteDirecto,
        "fechaInicio": firstStep.FechaInicio,
        "fechaFin": firstStep.FechaFin,
        "gestorCobro": {
          "codigoEntidad": firstStep.data.entidad && firstStep.data.entidad.Codigo ? firstStep.data.entidad.Codigo : '',
          "cuentaCorriente": firstStep.data.cuentaNoFormat ? firstStep.data.cuentaNoFormat : '',
          "tipoTarjeta":  firstStep.data.tipoTarjeta && firstStep.data.tipoTarjeta.Codigo ? firstStep.data.tipoTarjeta.Codigo : '',
          "codigoTarjeta": firstStep.data.codigoTarjeta && firstStep.data.codigoTarjeta.Codigo ? firstStep.data.codigoTarjeta.Codigo : '',
          "numeroTarjeta": firstStep.data.numeroTarjetaNoFormat ? firstStep.data.numeroTarjetaNoFormat : '',
          "fechaVencimientoTarjeta": firstStep.data.fechaTarjeta ? firstStep.data.fechaTarjeta : '',
          "codigoTipoCuenta": firstStep.data.tipoCuenta && firstStep.data.tipoCuenta.Codigo ? firstStep.data.tipoCuenta.Codigo : '',
          "codigoMoneda": firstStep.data.moneda && firstStep.data.moneda.Codigo ? firstStep.data.moneda.Codigo : '',
          "codigoOficina": firstStep.data.entidad && firstStep.data.entidad.CodigoOficiona ? firstStep.data.entidad.CodigoOficiona : '',
          "cuentaCalcular": firstStep.data.ctaCalcular ? firstStep.data.ctaCalcular : '',
          "codigoCompensacion": 0,
          "tipoGestor": firstStep.registro == 'C' ? 'DB' : 'TA',
          "codigoGestor": firstStep.data.codigoGestorEn && firstStep.data.codigoGestorEn.Codigo ? firstStep.data.codigoGestorEn.Codigo : '',
          "cuentaDc": "",
          "archivoCargomatico": ""
        }
    }
    return request;
    }
    function getGestor(params, showSpin){
      return proxyDeceso.GetListGestorCotizacion(params, showSpin);
    }
    function getAgent(params, showSpin){
      return proxyDeceso.GetListAgente(params, showSpin);
    }
    
    var factory = {
        ListarRamoTronPag: ListarRamoTronPag,
        ActualizaRamo: ActualizaRamo,     
        ListaPolizaGrupoTron: ListaPolizaGrupoTron,     
        ListaModalidadTron: ListaModalidadTron,
        ActualizaPolizaGrupoModalidad: ActualizaPolizaGrupoModalidad,
        saveFileInterest: saveFileInterest,
        GetDescargarArchivo: GetDescargarArchivo,
        GetDescargarArchivo64: GetDescargarArchivo64,
        ObtenerArchivos: ObtenerArchivos,
        GetListAgente: GetListAgente,
        ListaMedioPago: ListaMedioPago,
        ListarRamo: ListarRamo,
        ListaPolizaGrupo: ListaPolizaGrupo,
        ListaModalidad: ListaModalidad,
        validarIntegrante:validarIntegrante,
        ListaTipoAsegurado: ListaTipoAsegurado,
        ListaFinanciamiento: ListaFinanciamiento,
        RegistrarCotizacion: RegistrarCotizacion,
        ObtenerCotizacion: ObtenerCotizacion,
        DescargarCotizacion: DescargarCotizacion,
        SendMailCotizacionDeceso: SendMailCotizacionDeceso,
        FechaVigencia: FechaVigencia,
        ListarCotizacionDecesoPag: ListarCotizacionDecesoPag,
        GetListEntidadFinanciera: GetListEntidadFinanciera,
        GetListGestor: GetListGestor,
        GetListTipoCuenta: GetListTipoCuenta,
        GetEnmascarCuenta: GetEnmascarCuenta,
        GetListTipoTarjeta: GetListTipoTarjeta,
        GetListCodigoTarjeta: GetListCodigoTarjeta,
        GetEnmascarTarjeta: GetEnmascarTarjeta,
        GetListMonedaDeceso: GetListMonedaDeceso,
        cargaAltaDocumental: function(params, showSpin) {
          return _fnServiceUploadPromise('api/deceso/archivos', params, showSpin);
        },
        setPasos: setPasos,
        getPasos2: getPasos2,
        ListarArchivoDeceso: ListarArchivoDeceso,
        EliminarArchivoDeceso: EliminarArchivoDeceso,
        RegistrarEmision: RegistrarEmision,
        emisionFormat:emisionFormat,
        getGestor:getGestor,
        getAgent:getAgent
    };
    return factory;
  }

  return angular.module('appDeceso').factory('decesoFactory', decesoFactory);
});
