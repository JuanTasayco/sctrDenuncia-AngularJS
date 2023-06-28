define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular.module(constants.module.polizas.fola.moduleName).factory('folaFactory', FolaFactory);

  FolaFactory.$inject = ['$http', '$q', '$rootScope', 'oimPrincipal', 'mainServices', 'FileSaver','$timeout', 'folaService'];
    
    function FolaFactory($http, $q, $rootScope, oimPrincipal, mainServices, FileSaver, $timeout, folaService) {
    var factory = {
      getUser: GetUser,
      clearCotizacion: ClearCotizacion,
      initCotizacion: InitCotizacion,
      getParametrosContratante: GetParametrosContratante,
      formatearFecha: FormatearFecha,
      validControlForm: ValidControlForm,
      isUndefinedOrNullOrEmpty: IsUndefinedOrNullOrEmpty,
      setInfoAplicacion: SetInfoAplicacion,
      getInfoAplicacion: GetInfoAplicacion,
      downloadFileBase64: DownloadFileBase64,
      transformRiesgoEmitir: TransformRiesgoEmitir,
      transformContratanteEmitir: TransformContratanteEmitir,
      searchElementForKey: SearchElementForKey,
      searchElementDuplicateForKey: SearchElementDuplicateForKey,
      getCotizacion: GetCotizacion,
      showError: ShowError,
      auth: {},
      parametros: {},
      cotizacion: {},
      tiposDocumento: [],
    };
    var baseView = '/polizas/app/fola/views';
    var duracionDefault = {
      fechaInicial: '',
      fechaFinal: '',
      tipoDeclaracionDesc: '',
      tipoDeclaracion: '',
      duracion: 0,
      modelo: {},
    };
    var estructuraRiesgoDefault = {
      tipo: 0,
      numRiesgo: 0,
      numMovimiento: '',
      codigoCategoria: '',
      nomCategoria: '',
      numeroTrabajadores: 0,
      montoTrabajadores: 0,
      montoTopado: 0,
      montoTrabajadoresReal: 0,
      montoPrimaNeta: 0,
      asegurados: [],
      errorFile: 2,
      fileName: '',
      planilla: void 0,
      coberturas: [],
      modelo: {},
    };

    return factory;

    function ClearCotizacion() {
      factory.cotizacion = {};
    }

    function InitCotizacion() {
      if (!!factory.cotizacion.init) return void 0;
      factory.cotizacion = {
        init: false,
        step: {1: false, 2: false, 3: false},
        claims: {},
        modelo: {},
        contratante: {},
        riesgos: [],
        duracion: {},
        solicitudCotizacion: {},
        prima: {},
        numDoc: '',
        codProd: '',
        numeroPoliza: '',
        fecEfecRecibo: '',
        fecVctoRecibo: '',
        montoTopado: 0,
        infoAplicacion: {},
      };

      _setClaimsCotizacion(factory.auth);
      _setDefaultCotizacionAgente(factory.auth);
      _setContratante();

      factory.cotizacion.duracion = angular.copy(duracionDefault);
    }
    // function CreatePDF(pdfBuffers, numeroDocumento){
    //   PDFLib.PDFDocument.create().then(function(mergedPdf){
    //     for(var i=0; i<pdfBuffers.length; i++){
    //       PDFLib.PDFDocument.load(pdfBuffers[i],{ignoreEncryption:true}).then(function(pdf){
    //         mergedPdf.copyPages(pdf, pdf.getPageIndices()).then(function(copiedPages){
    //           copiedPages.forEach(function(page) {
    //             mergedPdf.addPage(page);
    //           });
    //         });
    //       });
    //     }
    //     $timeout(function(){
    //       mergedPdf.save().then(function(buf){
    //         var blobNew = new Blob([buf],{type: 'application/pdf'})
    //         FileSaver.saveAs(blobNew, 'doc_'+numeroDocumento+'.pdf');
    //       });
    //     }, 1500)
    //   });
    // }
    function GetUser() {
      return {
        codigoUsuario: factory.auth && factory.auth.loginUserName,
        rolUsuario: factory.auth && factory.auth.roleCode,
        nombreAgente: factory.auth && factory.auth.agentName,
        codigoAgente: factory.auth && factory.auth.agentID,
      };
    }
    function GetParametrosContratante() {
      return {
        CodCia: constants.module.polizas.fola.companyCode,
        CodRamo: constants.module.polizas.fola.codeRamo,
        CodAgente: factory.cotizacion.modelo.agente.codigoAgente,
        NumDoc: factory.cotizacion.numDoc,
        CodProd: factory.cotizacion.codProd,
        Contratante: {
          TipDocum: factory.cotizacion.contratante.tipoDocumento,
          CodDocum: factory.cotizacion.contratante.numeroDocumento,
          Nombre: factory.cotizacion.contratante.nombreCompleto,
          Correo: factory.cotizacion.contratante.correo,
          Telefono: factory.cotizacion.contratante.telefono,
        },
        Poliza: factory.getParametrosPoliza(),
      };
    }
    function FormatearFecha(fecha) {
      if (fecha instanceof Date) {
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        return (today = ('0' + dd).substr(-2) + '/' + ('0' + mm).substr(-2) + '/' + yyyy);
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
    // funciones privadas
    function _getAgregarMes(fecha, meses) {
      var currentMonth = fecha.getMonth();
      var fechaResult = new Date(fecha);
      fechaResult.setMonth(fecha.getMonth() + meses);
      if (fechaResult.getMonth() != (currentMonth + meses) % 12) {
        fechaResult.setDate(0);
      }
      return fechaResult;
    }
    function DownloadFileBase64(base64, documentType, fileName) {
      var vType = {
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        png: 'image/png',
        jpeg: 'image/jpeg'
      };
      var vExtension = {
        pdf: 'pdf',
        excel: 'xlsx',
        png: 'png',
        jpeg: 'jpeg'
      };
      var vDocumentType = documentType || '';
      var contentType = vType[vDocumentType.toLowerCase()] || documentType;
      var contentExtension = vExtension[vDocumentType.toLowerCase()] || documentType;
      var blob = new Blob([_base64toBlob(base64, contentType)], {});

      var vFileName = (fileName || 'documento') + '.' + contentExtension;
      FileSaver.saveAs(blob, vFileName);
    }
    function _base64toBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);
      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);
        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, {type: contentType});
    }
    function TransformContratanteEmitir(contratante) {
      var contratanteTransform = {};
      contratanteTransform.tipoDocumento = contratante.tipoDocumento;
      contratanteTransform.numeroDocumento = contratante.numeroDocumento;
      contratanteTransform.nombre = contratante.nombre;
      contratanteTransform.correoElectronico = contratante.correoElectronico;
      contratanteTransform.celular = contratante.celular;
      contratanteTransform.telefono = contratante.telefono;
      contratanteTransform.tipoActividadEconomica = contratante.tipoActividadEconomica;
      if (contratante.contacto) {
        contratanteTransform.contacto = {
          nombre: contratante.contacto.nombre,
          codigoTipoCargo: contratante.contacto.codigoTipoCargo,
          nombreTipoCargo: contratante.contacto.nombreTipoCargo,
        };
      }
      if (contratante.direccion) {
        contratanteTransform.direccion = {
          codigoDepartamento: contratante.direccion.codigoDepartamento,
          nombreDepartamento: contratante.direccion.nombreDepartamento,
          codigoProvincia: contratante.direccion.codigoProvincia,
          nombreProvincia: contratante.direccion.nombreProvincia,
          codigoDistrito: contratante.direccion.codigoDistrito,
          nombreDistrito: contratante.direccion.nombreDistrito,
          tipoVia: contratante.direccion.tipoVia,
          nombreVia: contratante.direccion.nombreVia,
          numero: contratante.direccion.numero,
          enumeracion: contratante.direccion.enumeracion,
          tipoInterior: contratante.direccion.tipoInterior,
          numeroInterior: contratante.direccion.numeroInterior,
          tipoZona: contratante.direccion.tipoZona,
          nombreZona: contratante.direccion.nombreZona,
          referencia: contratante.direccion.referencia
        };
      }
      return contratanteTransform;
    }
    function TransformRiesgoEmitir(riesgo) {
      var riesgosTransform = {
        asegurados: [],
      };
      riesgosTransform.numeroCotizacion = riesgo.numeroCotizacion;
      riesgosTransform.idRiesgo = riesgo.idRiesgo;
      riesgosTransform.idPlan = riesgo.idPlan;
      var asegurados = riesgo.asegurados;
      asegurados.forEach(function(asegurado) {
        riesgosTransform.asegurados.push({
          tipoDocumento: asegurado.tipoDocumento,
          numeroDocumento: asegurado.numeroDocumento,
          nombre: asegurado.nombre,
          apellidoPaterno: asegurado.apellidoPaterno,
          apellidoMaterno: asegurado.apellidoMaterno,
          codigoActividad: riesgo.codigoOcupacion,
          nombreActividad: riesgo.ocupacion,
          fechaNacimiento: asegurado.fechaNacimiento,
          telefono: asegurado.telefono,
          correo: asegurado.correo,
          talla: asegurado.talla,
          peso: asegurado.peso
        });
      });
      return riesgosTransform;
    }
    function GetCotizacion(quotationNumber, showSpin){
      var deferred = $q.defer();
      proxyCotizacion.buscarCotizacionVidaPorCodigo(quotationNumber, showSpin).then(function(response){
        quotation =  response.data;
        deferred.resolve(quotation);
      }, function (error){
        deferred.reject(error.message);
      });
      return deferred.promise;
    }

    function SearchElementForKey(arrays, key, element){
      return arrays.includes(arrays.find(function(array){ return array[key] === element}));
    }
    function ShowError(error, message){
      if (error.data) {
        if (error.data.errores) {
          if (error.data.errores.length > 0) {
            return error.data.errores[0];
          }
        }
      }
      return message ? message: 'Error';
    }
    function SearchElementDuplicateForKey(arrays, key, value){
      var elementsDuplicate = [];
      elementsDuplicate = arrays.filter(function(array) {
        if(array[key] === value){
          return array;
        }
      });
      return elementsDuplicate;
    }
  }
});
