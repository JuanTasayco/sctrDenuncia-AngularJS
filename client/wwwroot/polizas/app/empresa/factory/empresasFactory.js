define([
	'angular',
	'constants',
	'lodash'
], function(
	angular,
	constants,
	_){

		var appAutos = angular.module('appAutos');

		appAutos.factory('empresasFactory', [
			'proxyEmpresa',
			'proxyClaims',
			'proxyHogar',
			'proxyTipoDocumento',
			'proxyContratante',
			'proxyCotizacion',
			'proxyDocumento',
			'proxyEmision',
			'proxyFinanciamiento',
			'proxyGeneral',
			'proxyReporte',
			'proxyMail',
			'$http',
			'$q',
			'$window',
			'proxyFile',
			'httpData',
			'mModalAlert',
			'mainServices',
			'mpSpin',
			function(
				proxyEmpresa,
				proxyClaims,
				proxyHogar,
				proxyTipoDocumento,
				proxyContratante,
				proxyCotizacion,
				proxyDocumento,
				proxyEmision,
				proxyFinanciamiento,
				proxyGeneral,
				proxyReporte,
				proxyMail,
				$http,
				$q,
				$window,
				proxyFile,
				httpData,
				mModalAlert,
				mainServices,
				mpSpin
			){

		  var vBase = constants.system.api.endpoints.policy;

	    var addVarSS = function(key, newObj) {
	      var mydata = newObj;
	      if (!_.isEmpty(mydata))
	        $window.sessionStorage.setItem(key, JSON.stringify(mydata));
	      else
	        $window.sessionStorage.setItem(key, "");
	    };

	    var getVarSS = function(key){
	     var mydata = $window.sessionStorage.getItem(key);
	      if (!_.isEmpty(mydata)) {
	          mydata = JSON.parse(mydata);
	      }
	      return mydata || [];
	    };

	    var removeVarSS = function(key) {
	      $window.sessionStorage.removeItem(key);
	    };

			function daysDiff(date1, date2){

				var MIL_SEC_DAY = 1000 * 60 * 60 * 24;

				var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
				var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

				return Math.floor((utc2 - utc1)/MIL_SEC_DAY);
			}

			function formatDate(strDate){
	      if(strDate instanceof Date){
	        var today = strDate;
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

			//ubigeo
			function getDepartamentos(){
				return proxyEmpresa.GetListDepartamentosV2(false);
			}

			function getProvincias(cod){
				return proxyEmpresa.GetListProvinciasV2(cod, false);
			}

			function getDistritos(cod){
				return proxyEmpresa.GetListDistritosV2(cod, false);
			}

			function getProfile(){
				var profile = {};
				profile = $window.localStorage.getItem('profile');
      	return JSON.parse(profile);
			}

			function getProductsList(codCia){
				return proxyEmpresa.GetProductosV2(codCia, false);
			}

			function getCompaniesList(codCia){
				//return proxyEmpresa.GetListTipoEmpresa(codCia, false);
				return proxyEmpresa.GetTipoEmpresaV2(codCia, false);
			}

			function getBusinessTurnList(ramo, company){
				return proxyEmpresa.GetGiroNegocioV2(ramo, company, true);
			}

			function getCategoryConstruction(codCia){
				return proxyEmpresa.GetCategoriaConstruccionV2(codCia, false);
			}

			function getCategoryInspeccion(codCia){
				return proxyEmpresa.GetListCategoriaInspeccion(codCia, false);
			}

			function getLocalType(codCia){
				return proxyEmpresa.GetListTipoLocalV2(codCia, false);
			}

			function getGroupPolicy(policy){
				return proxyEmpresa.GetGrupoPolizaV2(policy, true);
			}

			function saveBudget(cotizacion){
				return proxyEmpresa.grabarCotizacionEmpresaV2(cotizacion, true);
			}

	    function getAlarmType() {
	      var codCia = constants.module.polizas.hogar.codeCia;
	      var codRamo = constants.module.polizas.hogar.codeRamo;
	      return proxyHogar.GetAlarmaMonitoreo(codCia, codRamo);
	    }

	    function getComunicationType(codModalidad, alertCode) {
	      var codCia = constants.module.polizas.hogar.codeCia;
	      var codRamo = constants.module.polizas.hogar.codeRamo;
	      return proxyHogar.GetComunicationType(codCia, codRamo, codModalidad, alertCode)
	    }

	    function getPackageType(comunicationTypeId, showSpin) {
	      return proxyHogar.GetPackageType(comunicationTypeId, showSpin);
	    }

	    function generarCotizacion(params, showSpin){
	    	return proxyEmpresa.GenerarCotizacion(params, showSpin);
	    }

	    function guardarCotizacion(params, showSpin){
	    	return proxyEmpresa.grabarCotizacionV2(params, showSpin);
	    }

	    //resumen poliza
	    function getResumenCotizacion(numDoc, showSpin){
	    	return proxyEmpresa.GetDocumento(numDoc, showSpin);
	    }


			//emision
			function getListEmit(params){
				return proxyEmpresa.GetFiltrarCotizacionesV2(params, true);
			}

			function getContractor(params){
				return true;
			}

			//paso1
			function obtenerCotizacionPorNumDoc(numDoc){
				return proxyEmpresa.GetDocumento(numDoc, true);
			}

			//paso 2
			function obtenerListaMaterial(){
				return proxyEmpresa.GetListMatConstV2(false);
			}

			function obtenerListaUso(){
				return proxyEmpresa.GetListUsoPredioV2(false);
			}

			function autocompleteInspector(txt){
				return proxyEmpresa.GetObtenerInspectorV2(txt, false);
			}

			function obtenerTotalAsegurados(){
				return true;
			}

			//paso 3
			function obtenerListaProfesiones(params){
				return proxyEmpresa.GetProfesionesV2(params, false);
			}

			function obtenerListaOcupaciones(params){
				return proxyEmpresa.GetOcupacionesV2(params, false);
			}

			function obtenerListaVia(){
				return proxyEmpresa.GetViaEmisionV2(false)
			}

			function obtenerListaVivienda(){
				return proxyEmpresa.GetNumeroEmisionV2(false);
			}

			function obtenerListaInterior(){
				return proxyEmpresa.GetInteriorEmisionV2(false);
			}

			//paso 4
			function obtenerEndosatarioRuc(codeCia, ruc){
				return proxyEmpresa.GetEndosatarioRUCV2(codeCia, ruc, true);
			}

			function obtenerEndosatarioNombre(codeCia, nombre){
				return proxyEmpresa.GetEndosatarioRUCV2(codeCia, nombre, true);
			}

			//guardar paso
			function guardarPaso(params){
				return proxyEmpresa.SaveEmissionStep(params, true);
			}


      /*########################
      # fnConvertFormData
      ########################*/
      function fnConvertFormData(params){
        var fd = new FormData();
        angular.forEach(params, function(value, key) {
          fd.append(key, value);
        });
        return fd;
      }
      /*########################
      # fnServiceUploadPromise
      ########################*/
      function fnServiceUploadPromise(url, params, showSpin){
        var vConfig = {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        };
        var vParams = fnConvertFormData(params);
        var vUri = vBase + url
        return httpData['post'](vUri, vParams, vConfig, showSpin);
      }
      /*########################
      # proxys
      ########################*/

      var proxyEmpresa = proxyEmpresa;
      proxyEmpresa.CSLoadExcel = function(params, showSpin){
      	return fnServiceUploadPromise('api/empresa/excel', params, true);
      }

      var proxyFile = proxyFile;
      proxyFile.CSGetTemplate = function(idTemplate, showSpin){
      	var vUri = vBase + 'api/file/emisa/'+ idTemplate;
	      return httpData['get'](vUri, {responseType: 'arraybuffer'}, undefined, showSpin);
			}
			
			function generarPDF(params, vFileName) {
				mpSpin.start();
				$http.post(constants.system.api.endpoints.policy + 'api/empresa/getDocumentoEmpresaPDFV2/' + params, undefined, { responseType: "arraybuffer" }).success(
					function(data, status, headers) {
							mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
							mpSpin.end();
					},
					function(data, status) {
						mpSpin.end();
						mModalAlert.showError("Error al descargar el documento", 'ERROR');
					});
			}

			return {
				//session
				addVarSS: addVarSS,
				getVarSS: getVarSS,
				removeVarSS: removeVarSS,

				//ubigeo
				getDepartamentos: getDepartamentos,
				getProvincias: getProvincias,
				getDistritos: getDistritos,

				//fechas
				formatDate: formatDate,
				daysDiff: daysDiff,

				//profile
				getProfile: getProfile,

				//cotizacion
				getProductsList: getProductsList,
				getCompaniesList: getCompaniesList,
				getBusinessTurnList: getBusinessTurnList,
				getCategoryConstruction: getCategoryConstruction,
				getLocalType: getLocalType,
				getGroupPolicy: getGroupPolicy,
				saveBudget: saveBudget,
				getAlarmType: getAlarmType,
				getComunicationType: getComunicationType,
				getPackageType: getPackageType,
				generarCotizacion: generarCotizacion,
				guardarCotizacion: guardarCotizacion,

				//resumen
				getResumenCotizacion: getResumenCotizacion,

				//emision
				getListEmit: getListEmit,
				getContractor: getContractor,
				getCategoryInspeccion: getCategoryInspeccion,

				//paso 1
				obtenerCotizacionPorNumDoc: obtenerCotizacionPorNumDoc,

				//paso 2
				obtenerListaMaterial: obtenerListaMaterial,
				obtenerListaUso: obtenerListaUso,
				autocompleteInspector: autocompleteInspector,
				obtenerTotalAsegurados: obtenerTotalAsegurados,

				//paso 3
				obtenerListaProfesiones: obtenerListaProfesiones,
				obtenerListaOcupaciones: obtenerListaOcupaciones,
				obtenerListaVia: obtenerListaVia,
				obtenerListaVivienda: obtenerListaVivienda,
				obtenerListaInterior: obtenerListaInterior,

				//paso 4
				obtenerEndosatarioRuc: obtenerEndosatarioRuc,
				obtenerEndosatarioNombre: obtenerEndosatarioNombre,
        guardarPaso: guardarPaso,

        proxyGeneral: proxyGeneral,
        proxyHogar: proxyHogar,
        proxyEmpresa: proxyEmpresa,
        proxyFile: proxyFile,
        proxyContratante: proxyContratante,
        proxyTipoDocumento: proxyTipoDocumento,
        proxyFinanciamiento: proxyFinanciamiento,
				proxyEmision: proxyEmision,
				generarPDF: generarPDF
			};

		}]);

});
