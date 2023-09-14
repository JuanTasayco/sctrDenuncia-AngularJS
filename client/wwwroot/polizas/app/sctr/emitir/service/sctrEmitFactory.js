'use strict'

define([
  'angular', 'constants'
], function(angular, constants){

  var appAutos = angular.module('appAutos');

  appAutos.factory('sctrEmitFactory', ['proxyAgente', 'proxyGeneral', 'proxyTipoDocumento', 'proxyContratante', 'proxyClaims', 'proxySctr', 'proxyCotizacion', 'proxyFile', '$http', '$q', '$window', 'mpSpin', function(proxyAgente, proxyGeneral, proxyTipoDocumento, proxyContratante, proxyClaims, proxySctr, proxyCotizacion, proxyFile, $http, $q, $window, mpSpin){

		var base = constants.system.api.endpoints.policy;

    function concatenateUrl(params){
      var url = '';
      angular.forEach(params, function(value, key) {
        url += '/' + value;
      });
      url ? url : url = '/';
      // console.log(url);
      return url;
    }

    function getData(url, params){
      var newUrl = url + concatenateUrl(params)
      var deferred = $q.defer();
      $http({
        method : 'GET',
        url : base + newUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );
      return deferred.promise;
    }

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
        }
      );
      return deferred.promise;
    }

    var addVariableSession = function(key, newObj) {
      var mydata = newObj;
      $window.sessionStorage.setItem(key, JSON.stringify(mydata));
    };

    var getVariableSession = function(key){
     var mydata = $window.sessionStorage.getItem(key);
      if (mydata) {
          mydata = JSON.parse(mydata);
      }
      return mydata || [];
    };

    var eliminarVariableSession = function(key) {
      $window.sessionStorage.removeItem(key);
    };

    function formatearFecha(fecha){
      if(fecha instanceof Date){
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if(dd === 32){
          dd = 1;
          mm = today.getMonth()+2;
        }

        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }


        var yyyy = today.getFullYear();
        return today = dd+'/'+mm+'/'+yyyy;
      }
    }

    function firstDate(fecha){
      if(fecha instanceof Date){
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if(dd === 32){
          dd = 1;
          mm = today.getMonth()+2;
        }else{
           dd = 1;
        }

        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

        var yyyy = today.getFullYear();
        return today = dd+'/'+mm+'/'+yyyy;
      }
    }

    function agregarMes(fecha, meses){
			var currentMonth = fecha.getMonth();
	    fecha.setMonth(fecha.getMonth() + meses)

	    if (fecha.getMonth() != ((currentMonth + meses) % 12)){
	        fecha.setDate(0);
	    }
	    return fecha;
    }

    function agregarDias(fecha, meses){
      var dias = 29;
      var newdate = fecha;

      if(meses == 2){dias=59;}

      newdate.setDate(newdate.getDate() + dias);

      //console.log(newdate);


      var dd = newdate.getDate();
      var mm = newdate.getMonth() + 1;

      if(dd<10){
        dd='0'+dd;
      }
      if(mm<10){
        mm='0'+mm;
      }

      var y = newdate.getFullYear();

      var someFormattedDate = dd + '/' + mm + '/' + y;

      //console.log(someFormattedDate);

      return someFormattedDate;
    }

    function getDescripcionDuracion(desde, hasta){

      var espacio = desde.split(" ");
      if (espacio.length) {desde=espacio[0];}

      espacio = hasta.split(" ");
      if (hasta.length) {hasta=espacio[0];}

      var aF1 = desde.split("/");
      var aF2 = hasta.split("/");
      var dif = (parseInt(aF2[2]*12) + parseInt(aF2[1])) - (parseInt(aF1[2]*12) + parseInt(aF1[1]));

      if (aF2[2]<aF1[2]){
          dif = dif - 1;
        }

      if(dif == 1){
        return '1 MES';
      }else if(dif == 0){
        dif += 1;
        return '1 MES';
      }else if(dif == -1){
        return '1 MES';
      }else{
        return dif + ' MESES';
      }

    }

    function getGestor(params, showSpin){
      //return getData('api/general/gestoroficina/' + constants.module.polizas.autos.companyCode, params.codAgente);
      return proxyGeneral.GetGestorOficina(params.codCia, params.codAgente, showSpin);
    }

    function getDatosContratante(params, showSpin){
      //return getData('api/contratante/tercero/' + constants.module.polizas.autos.companyCode + '/' + params.documentType + '/' + params.documentNumber, '');
      //return proxyContratante.GetContratanteByNroDocumento(params.codeEnterprise, params.documentType, params.documentNumber, showSpin);
      return proxySctr.GetSctrEmpresa(params, showSpin);
    }

    function getAgente(params, showSpin){
      //return getData('api/agente/buscar?codigoNombre=' + params, '');
      return proxyAgente.buscarAgente(params, showSpin);
    }

    function getClaims(){
      return proxyClaims.GetClaims();
    }

    function getTipoDocumento(){
      return proxyTipoDocumento.getSctrListTipoDocumento();//getTipoDocumento();
      //return proxySctr.GetTipoDoc(false);
    }

    function getListCargo(showSpin){
    	//return proxyGeneral.GetListCargo(showSpin);
    	return getData('api/general/cargo', '');
    }

    function getActividadSunat(params, showSpin){
    	// return postData('api/general/actividadeconomica/sunat', params);
      var base = constants.system.api.endpoints.policy;
      var deferred = $q.defer();
      $http({
        method : 'POST',
        url : base + 'api/general/actividadeconomica/sunat',
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );

      return deferred.promise;
    }

    function getFrecuencia(tipo, showSpin){
    	//return proxySctr.GetFrecuenciaByCodGru(tipo, showSpin);
      return getData('api/sctr/frecuencia/'+tipo+'/N', '');
    	// return postData('api/general/actividadeconomica/sunat', params);
    }

    function getFrecuenciaDoc(tipo, showSpin){
      //return proxySctr.GetFrecuenciaByCodGru(tipo, showSpin);
      return getData('api/sctr/frecuencia/'+tipo+'/T', '');
      // return postData('api/general/actividadeconomica/sunat', params);
    }

		function getActividadEco(params){
    	//return proxyGeneral.GetActividadEconomicaSunat(params, showSpin);
    	// return postData('api/general/actividadeconomica/poliza', params);


      var base = constants.system.api.endpoints.policy;
      var deferred = $q.defer();
      $http({
        method : 'POST',
        url : base + 'api/general/actividadeconomica/poliza',
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( function(response) {
          deferred.resolve(response.data);
        }
      );

      return deferred.promise;
    }

    function getFactor(params, showSpin){
    	//return proxyGeneral.GetListCargo(showSpin);
    	return getData('api/sctr/factor/'+ params, '');
    }

    function getTasaPC(params, showSpin){
    	//return proxyGeneral.GetListCargo(showSpin);
    	return getData('api/sctr/tasa/pc/'+ params.codigoGrupo +'/' + params.codigoActividad, '');
    }

		function getPlantilla(params, showSpin){
    	//return proxyGeneral.GetListCargo(showSpin);
    	return getData('api/file/emisa/' + params, '');
    }

    function addCommentAndFile(comment, file, showSpin){

    }

    function grabarPaso1PC(params, showSpin){
    	return proxySctr.PcGrabarPolizaP1(params, showSpin);
    }

    function grabarPaso1PN(params, showSpin){
      return proxySctr.PnGrabarPolizaP1(params, showSpin);
    }

    function grabarPasos2PC(params, showSpin){
    	return proxySctr.PcGrabarPolizaValidarP2(params, showSpin);
    }

    function grabarPasos2PN(params, showSpin){
      return proxySctr.PnGrabarPolizaP2(params, showSpin);
    }

    function grabarPasos3PC(params, showSpin){
    	return proxySctr.PcGrabarPolizaP3(params, showSpin);
    }

    function grabarPasos3PNAdmin(params, showSpin){
      //return proxySctr.PnGrabarPolizaP3CotizacionSolicitar(params, showSpin);
      return postData('api/sctr/poliza/pn/p3', params);
    }

    function grabarPasos3PNSolicitudAgt(params, showSpin){
      return proxySctr.PnGrabarPolizaP3CotizacionSolicitar(params, showSpin);
    }

    function grabarPasos3PNAgt(params, showSpin){
      return proxySctr.PnGrabarPolizaP3TasaGestionar(params, showSpin);
    }

    function grabarPasos3PNEnviarApro(params, showSpin){
      return proxySctr.PnGrabarPolizaP3CotizacionGestionar(params, showSpin);
    }

    function uploadXLS(params, showSpin){
      return proxySctr.PcCargarPlanillaP4(params, showSpin);
    }

    function grabarPaso4(params, showSpin){
    	return proxySctr.PcGrabarPolizaP4(params, showSpin);
    }

    function grabarPaso5(params, showSpin){
    	return proxySctr.PcGrabarPolizaP5(params, showSpin);
    }

    function download(params, defaultFileName) {
      var self = this;
      var deferred = $q.defer();
      $http.get(base + 'api/file/emisa/' + params, { responseType: "arraybuffer" }).success(
        function (data, status, headers) {
          var type = headers('Content-Type');
          var disposition = headers('Content-Disposition');
          if (disposition) {
            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1])
              defaultFileName = match[1];
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          var blob = new Blob([data], { type: type });
          saveAs(blob, defaultFileName);
          deferred.resolve(defaultFileName);
        }, function (data, status) {
          var e = /* error */
          deferred.reject(e);
        });
      return deferred.promise;
    }

    function downloadObs(params, defaultFileName) {
      var self = this;
      var deferred = $q.defer();
      // var vparams = {
      //   NumeroSolicitud: params
      // };
      $http.post(base + 'api/sctr/poliza/p4/upload/error', params, { responseType: "arraybuffer" }).success(
        function (data, status, headers) {
          var type = headers('Content-Type');
          var disposition = headers('Content-Disposition');
          if (disposition) {
            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1])
              defaultFileName = match[1];
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          var blob = new Blob([data], { type: type });
          saveAs(blob, defaultFileName);
          deferred.resolve(defaultFileName);
        }, function (data, status) {
          var e = /* error */
          deferred.reject(e);
        });
      return deferred.promise;
    }

    function listarMensajes(params, showSpin){
      return proxySctr.GetListMensaje(params, showSpin);
    }

    function getPrimaMinima(params, showSpin){
      return proxySctr.GetPrimaMinima(params.codCia, params.codRamo, params.codMoneda, showSpin);
    }

    function getEstados(showSpin){
      return proxySctr.GetListState(showSpin);
    }

    function getReportes(params, showSpin){
      // return proxySctr.GetListDocumentReport(params, showSpin);
      return proxySctr.GetListDocumentReportPage(params, showSpin);
    }

    function getCotizacion(params, showSpin){
      return proxySctr.GetListEmpresaSctrEmi(params, showSpin);
    }

    function emitirPC(params, showSpin){
      return proxySctr.PcEmitirPolizaP4(params, showSpin);
    }

    function emitirPN(params, showSpin){
      return proxySctr.PnEmitirPolizaP4(params, showSpin);
    }

    function getTemplate(idTemplate){
      //return proxyFile.GetTemplate(idTemplate, true);

      $window.open(base + 'api/file/emisa/' + idTemplate);
    }

    function getConstancia(params){
      return proxySctr.DownloadFilePcConstancia(params,true);
    }

    function getPoliza(tipo, id, numPoliza, defaultFileName,codigoagente){
      tipo = tipo.toLowerCase();
      //return proxyFile.GetTemplate(idTemplate, true);
      // getData('api/sctr/descarga/'+tipo+'/poliza/'+ id + '/' + numPoliza, '').then(function(response){
      //   if (response.OperationCode == constants.operationCode.success){
      //     var url = response.Data;
      //     $window.open(url);
      //   }
      // });

      var self = this;
      var deferred = $q.defer();
      mpSpin.start();
      $http.get(base + 'api/sctr/download/'+tipo+'/poliza/'+ id + '/' + numPoliza+'/' + codigoagente, { responseType: "arraybuffer" }).success(
        function (data, status, headers) {
          var type = headers('Content-Type');
          var disposition = headers('Content-Disposition');
          if (disposition) {
            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1])
              defaultFileName = match[1];
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          var blob = new Blob([data], { type: type });
          saveAs(blob, defaultFileName);
          mpSpin.end();
          deferred.resolve(defaultFileName);
        }, function (data, status) {
          mpSpin.end();
          var e = /* error */
          deferred.reject(e);
        }).error(function(data){
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function getCondiciones(tipo){
      getTemplate(tipo);
    }

    function getRecibo(tipo, params, defaultFileName){
      tipo = tipo.toLowerCase();
      //return proxyFile.GetTemplate(idTemplate, true);
      //var valor = getData('api/sctr/descarga/'+tipo+'/recibo/'+ params, '');
      // getData('api/sctr/descarga/'+tipo+'/recibo/'+ params, '').then(function(response){
      //   if (response.OperationCode == constants.operationCode.success){
      //     var url = response.Data;
      //     $window.open(url);
      //   }
      // });

      var self = this;
      var deferred = $q.defer();
      mpSpin.start();
      $http.get(base + 'api/sctr/download/'+tipo+'/recibo/'+ params, { responseType: "arraybuffer" }).success(
        function (data, status, headers) {
          var type = headers('Content-Type');
          var disposition = headers('Content-Disposition');
          if (disposition) {
            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1])
              defaultFileName = match[1];
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          var blob = new Blob([data], { type: type });
          saveAs(blob, defaultFileName);
          mpSpin.end();
          deferred.resolve(defaultFileName);
        }, function (data, status) {
          mpSpin.end();
          var e = /* error */
          deferred.reject(e);
        });
      return deferred.promise;
    }

    function exportReports(tipoDoc, solicitud){//descarga de excel
      // $window.open(base + 'api/sctr/solicitud/exportar/' + tipoDoc);
      return proxySctr.ExportListSolicitudesSCTR(tipoDoc, solicitud, true);
    }

    function getSuscriptorByIdAgent(codAgente){
      return proxySctr.GetSuscriptorByIdAgent(codAgente, false);
    }

    function getSueldoMinimo(codAgente){
      return proxyGeneral.GetSueldoMinimo(false);
    }

    function getListSuscriptor(params){
      return proxySctr.GetListSuscriptor(params, true);
    }

    function getSuscriptor(id, showSpin){
      //console.log(id);
      return proxySctr.GetSuscriptor(id, true);
    }

    function saveSuscriptor(params, showSpin){
        return proxySctr.SaveSuscriptor(params, true);
    }

    function getListOficina(params, showSpin){
        return proxySctr.GetListOficina(params, true);
    }

    function saveSuscriptorOficina(params, showSpin){
        return proxySctr.SaveSuscriptorOficina(params, true);
    }

    function getUsuarioOim(params, showSpin){
        return proxySctr.GetUsuarioOim(params, true);
    }

    function getParamsSCTR(params, showSpin){
      // return postData('api/general/actividadeconomica/sunat', params);
      return proxySctr.GetListParametro(params, true);

      // var base = constants.system.api.endpoints.policy;
      // var deferred = $q.defer();
      // $http({
      //   method : 'POST',
      //   url : base + 'api/sctr/parametro/listar',
      //   data: params,
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }).then( function(response) {
      //     deferred.resolve(response.data);
      //   }
      // );

      // return deferred.promise;
    }

    function getListParametroDetalle(params, showSpin){
      return proxySctr.GetListParametroDetalle(params, true);
    }

    function grabarParametroDetalle(params, showSpin){
      return proxySctr.GrabarParametroDetalle(params, true);
    }

    function grabarParametro(params, showSpin){
      return proxySctr.GrabarParametro(params, true);
    }

    function getListBandejaPage(params, showSpin){
      return proxySctr.GetListBandejaPage(params, true);
    }

    function getDatoDocumentoAgente(params, showSpin){
      return proxyAgente.GetDatoDocumentoAgente(params, true);
    }

    function getListProduct(){
      return proxySctr.GetListProduct(false);
    }

    function getProfessions(){
      return proxyGeneral.GetOcupacion(0, '', true);
    }

    function getCodOficina(codigoCompania, codigoAgente){
      return proxyAgente.GetRegionOficina(codigoCompania, codigoAgente, false);
    }
    
    function getOrigen() {
      return proxySctr.GetListProcedencia(false);
    }
    
    function getUserRole() {
      return proxySctr.GetUserRole(false);
    }
    
    function showAgent() {
      return getUserRole().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
           return  response.Data === 'ADM' || response.Data === 'GST';
        } 
        return false;
      });
    }
    

    return {
      addVariableSession: addVariableSession,
      getVariableSession: getVariableSession,
      eliminarVariableSession: eliminarVariableSession,
      formatearFecha: formatearFecha,
      firstDate: firstDate,
      agregarMes: agregarMes,
      agregarDias: agregarDias,
      getDescripcionDuracion: getDescripcionDuracion,
      getGestor: getGestor,
      getDatosContratante: getDatosContratante,
      getAgente: getAgente,
      getClaims: getClaims,
      getTipoDocumento: getTipoDocumento,
      getListCargo: getListCargo,
      getActividadSunat: getActividadSunat,
      getFrecuencia: getFrecuencia,
      getFrecuenciaDoc: getFrecuenciaDoc,
      getActividadEco: getActividadEco,
      getFactor: getFactor,
      getTasaPC: getTasaPC,
      getPlantilla: getPlantilla,
      addCommentAndFile: addCommentAndFile,
      grabarPaso1PC: grabarPaso1PC,
      grabarPaso1PN: grabarPaso1PN,
      grabarPasos2PC: grabarPasos2PC,
      grabarPasos2PN: grabarPasos2PN,
      grabarPasos3PC: grabarPasos3PC,
      grabarPasos3PNAdmin: grabarPasos3PNAdmin,
      uploadXLS: uploadXLS,
      grabarPaso4: grabarPaso4,
      grabarPaso5: grabarPaso5,
      download: download,
      downloadObs: downloadObs,
      listarMensajes: listarMensajes,
      getPrimaMinima: getPrimaMinima,

      getEstados: getEstados,
      getReportes: getReportes,
      getCotizacion: getCotizacion,
      emitirPC: emitirPC,
      emitirPN: emitirPN,

      getTemplate: getTemplate,
      getConstancia: getConstancia,
      getPoliza: getPoliza,
      getCondiciones: getCondiciones,
      getRecibo: getRecibo,
      exportReports: exportReports,

      getSuscriptorByIdAgent: getSuscriptorByIdAgent,
      getSueldoMinimo: getSueldoMinimo,
      grabarPasos3PNSolicitudAgt: grabarPasos3PNSolicitudAgt,
      grabarPasos3PNAgt: grabarPasos3PNAgt,
      grabarPasos3PNEnviarApro: grabarPasos3PNEnviarApro,
      getListSuscriptor: getListSuscriptor,
      getSuscriptor: getSuscriptor,
      saveSuscriptor: saveSuscriptor,
      getListOficina: getListOficina,
      saveSuscriptorOficina: saveSuscriptorOficina,
      getUsuarioOim: getUsuarioOim,

      getParamsSCTR: getParamsSCTR,
      getListParametroDetalle: getListParametroDetalle,
      grabarParametroDetalle: grabarParametroDetalle,
      grabarParametro: grabarParametro,

      getDatoDocumentoAgente: getDatoDocumentoAgente,

      getListBandejaPage: getListBandejaPage,

      getListProduct: getListProduct,
      getProfessions: getProfessions,
      getCodOficina: getCodOficina,
      
      getOrigen: getOrigen,
      getUserRole: getUserRole,
      showAgent: showAgent
    };
  }]);

  appAutos.service('fileUpload', ['$http', '$q', 'mpSpin', function ($http, $q, mpSpin) {
    this.uploadFileToUrl = function(file, paramsFile){
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("rolOrigen", paramsFile.rolOrigen);
      fd.append("usuarioOrigen", paramsFile.usuarioOrigen);
      fd.append("usuarioDestino", paramsFile.usuarioDestino);
      fd.append("asunto", paramsFile.asunto);
      fd.append("mensaje", paramsFile.mensaje);

      if(file===null) {
       // fd.append("fieldNameHere", null);
      }else{
        for(var i=0; i<file.length; i++){
          fd.append("fieldNameHere", file[i]);
        }
      }

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/mensaje/grabar', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
                progress: function(c) {
                    console.log('Progress -> ' + c);
                    console.log(c);
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    mpSpin.start();
                    console.log('UploadProgress -> ' + e);
                    console.log(e);
                    console.log('loaded: ' + e);
                    console.log('total: ' + e);
                }
            }
      })
      .success(function(){
        mpSpin.end();
      })
      .error(function(){
        mpSpin.end();
      });
    }

    this.uploadXLSFilePC = function(file, paramsFile){
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("cantidadTrabajador", paramsFile.cantidadTrabajador);
      fd.append("sueldoTotal", paramsFile.sueldoTotal);
      fd.append("fieldNameHere", file);

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/poliza/p4/pc/cargar', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
                progress: function(c) {
                    console.log('Progress -> ' + c);
                    console.log(c);
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    mpSpin.start();
                    console.log('UploadProgress -> ' + e);
                    console.log(e);
                    console.log('loaded: ' + e);
                    console.log('total: ' + e);
                }
            }
      })
      .then( function(response) {
          mpSpin.end();
          deferred.resolve(response);
        });
      mpSpin.end();

      return deferred.promise;
      // .success(function(data){
      //   // debugger;
      //   this.asegurados = data;
      // })
      // .error(function(){
      // });
    }

    this.uploadXLSFilePN = function(file, paramsFile){
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append("numeroSolicitud", paramsFile.numeroSolicitud);
      fd.append("cantidadTrabajador", paramsFile.cantidadTrabajador);
      fd.append("sueldoTotal", paramsFile.sueldoTotal);
      fd.append("fieldNameHere", file);

      $http.post(constants.system.api.endpoints.policy + 'api/sctr/poliza/p4/pN/cargar', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          eventHandlers: {
                progress: function(c) {
                    console.log('Progress -> ' + c);
                    console.log(c);
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    mpSpin.start();
                    console.log('UploadProgress -> ' + e);
                    console.log(e);
                    console.log('loaded: ' + e);
                    console.log('total: ' + e);
                }
            }
      })
      .then( function(response) {
          mpSpin.end();
          deferred.resolve(response);
        });
      mpSpin.end();

      return deferred.promise;
      // .success(function(data){
      //   // debugger;
      //   this.asegurados = data;
      // })
      // .error(function(){
      // });
    }
  }]);

});
