define(['angular', 'constants'], function(angular, cons)
{
    var appAutos = angular.module("appAutos");

    appAutos.factory('autosFactory',[ '$q', '$http',  '$window', 'httpData', 'mainServices', 'mModalAlert', 'mpSpin', 'proxyDocumento', function( $q, $http, $window, httpData, mainServices, mModalAlert, mpSpin, proxyDocumento)//, $http, $q, $window)
    {

		var base = cons.system.api.endpoints.policy;
		var base2 = cons.system.api.endpoints.security;


		//MSAAVEDRA 20211111
		var urlGenerarDocumento = cons.system.api.endpoints.wsrgenerardocumento;
		//

		function fnConvertFormData(params){
			var fd = new FormData();
			angular.forEach(params, function(value, key) {
				fd.append(key, value);
			});
			return fd;
		}

		function fnServiceUploadPromise(url, params, showSpin){
			var vConfig = {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			};
			var vParams = fnConvertFormData(params);
			return httpData['post'](constants.system.api.endpoints.policy + url, vParams, vConfig, false);
		}

		function cargaAltaDocumental(params, showSpin){
			if (params.fieldNameHere){
				return fnServiceUploadPromise('api/emision/vehiculo/cargaAltaDocumental', params, false);
			}else{
				var deferred = $q.defer(),
						vResponse = {
							OperationCode : 200,
							Data 					: {
								ValueResult: ''
							}
						};
				deferred.resolve(vResponse);
				return deferred.promise;
			}
		}


		function postData(URL, data){
			var deferred = $q.defer();
			$http({
					method : 'POST',
					url : base + URL,
					data: data,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response) {
					deferred.resolve(response.data.Data);
				}).catch(function(response) {
					console.log('Error Servicio postData: ' + response.statusText);
					deferred.reject(response.statusText);
				})
			return deferred.promise;
		}

		function getData(URL, params){
			if (params !== '') { URL += '/';}
			var deferred = $q.defer();
			$http({
					method : 'GET',
					url : base + URL + params,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response) {
					deferred.resolve(response.data.Data);
				}).catch(function(response) {
					console.log('Error Servicio getData: ' + response.statusText);
					deferred.reject(response.statusText);
				})
			return deferred.promise;
		}

		/*##############################
        # loadSelect
        ##############################*/
		function loadSelect(URL, params){
			if (params !== '') { URL += '/';}
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : base + URL + params,
				 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(response) {
				deferred.resolve(response.data.Data);
			}).catch(function(response) {
				console.log('Error Servicio loadSelect: ' + response.statusText);
				deferred.reject(response.statusText);
			});
			return deferred.promise;
		}

		/*##############################
        # loadAutocompleteFilter
        ##############################*/

		function loadAutocompleteFilter(URL, params, value, valColumn){
			if (params !== '') { URL += '/';}

			var vList = {};
			var matches = [];

			return $http({
				method : 'GET',
				url :  base + URL + params
			}).then(function mySucces(response) {
				vList = response.data.Data;

				var length = vList.length;
				for (var i = 0; i < length; i++) {
					if ((vList[i][valColumn].toUpperCase().indexOf(value.toString().toUpperCase()) >= 0)) {
	     				matches.push(vList[i]);
		    		}else{
		    			console.log('No hay coincidencias');
		    		}
				}

				return matches;
			}).catch(function(response) {
					console.log('Error Servicio loadAutocomplete: ' + response.statusText);
			});
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


		function getPDF(URL, params){
			if (params !== '') { URL += '/';}
			$window.open(base + URL + params);
		}


		function getHeader(URL, params){
			if (params !== '') { URL += '/';}
			var deferred = $q.defer();
			$http({
					method : 'GET',
					url : base2 + URL + params,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(data, status, headers, config) {
					deferred.resolve(data.data);
				}).catch(function(response) {
					console.log('Error Servicio getData: ' + response.statusText);
					deferred.reject(response.statusText);
				})
			return deferred.promise;
		}

		function getMarcaModelo(params){

			var base = constants.system.api.endpoints.policy;
			var deferred = $q.defer();
			$http({
					method : 'POST',
					url : base + 'api/automovil/marcamodelo',
					data: params,
					headers: {
						'Content-Type': 'application/json'
					}
			}).then( function(response) {
				deferred.resolve(response.data);
			});

			return deferred.promise;
		}
		function generarPDF301(params, vFileName) {


			//MSAAVEDRA 20211111
			console.log('msaavedra', params);
			const urlRequest = urlGenerarDocumento + 'cotizacion';
			console.log('urlRequest', urlRequest);
			return httpData.postDownload(
				urlRequest,
				params,
				{ headers: { 'Content-Type': 'application/json' } },
				true
			).then(function (data) {
				console.log('data', data);
				if (data.file.codigoRespuesta == 0) {
					mainServices.fnDownloadFromFile(data.file.mensajeRespuesta, 'pdf', vFileName, true);
				} else {
					mModalAlert.showError(data.file.mensajeRespuesta, 'Error');
				}

			});
		}

		function generarPDF(params, vFileName) {
			const pathParams = {
				opcMenu: localStorage.getItem('currentBreadcrumb')
			  };
			const urlRequest = base + 'api/reporte/autos/cotizacion/' + params +'?COD_OBJETO=635&OPC_MENU='+pathParams.opcMenu;
		return	httpData.postDownload(
			urlRequest,
			undefined,
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'},
			true
			).then(function(data){
			console.log(data);
			mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
				});
		}

    function getDocument(CodDocumento) {
      return proxyDocumento.GetDocumentoByNumber(cons.module.polizas.autos.companyCode, CodDocumento, cons.module.polizas.autos.codeRamo, true)
    }

        return {
					fnConvertFormData: fnConvertFormData,
					fnServiceUploadPromise: fnServiceUploadPromise,
					cargaAltaDocumental: cargaAltaDocumental,
        	loadSelect : loadSelect,
        	loadAutocompleteFilter : loadAutocompleteFilter,
        	postData: postData,
        	getData: getData,
        	addVariableSession: addVariableSession,
          getVariableSession: getVariableSession,
          eliminarVariableSession: eliminarVariableSession,
          getPDF: getPDF,
          getHeader: getHeader,
          getMarcaModelo: getMarcaModelo,
	  generarPDF301: generarPDF301, //MSAAVEDRA 20211112
          generarPDF: generarPDF,
          getDocument: getDocument
        }
    }]);
});
