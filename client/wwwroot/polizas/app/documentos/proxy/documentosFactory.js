'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appAutos = angular.module('appAutos');

		appAutos.factory('documentosFactory',
			['$http', '$q', 'proxyDocumento', 'proxyProducto', 'proxyPoliza', 'proxyAutomovil', 'proxySoat', 'mpSpin', '$httpParamSerializerJQLike', 'mainServices', 'httpData', 'proxyClinicaDigital',
			function($http, $q, proxyDocumento, proxyProducto, proxyPoliza, proxyAutomovil, proxySoat, mpSpin, $httpParamSerializerJQLike, mainServices, httpData, proxyClinicaDigital){

			//https://mxperu.atlassian.net/browse/OIM-140
			function getProducts(userCode, showSpin){
				return proxyProducto.GetListProductoBandeja(userCode, showSpin);
			}

			//https://mxperu.atlassian.net/browse/OIM-613
			function filterDocuments(params, showSpin){
				return proxyDocumento.ListarDocumentoPag(params, showSpin);
			}

			function filterDocumentsHogar(params, showSpin){
				return proxyDocumento.ListarDocumentoPorCodigoProcesoPag(params, showSpin);
			}

			//https://mxperu.atlassian.net/browse/OIM-140
			function getProductsByRamo(companyCode, codeRamo, showSpin){
				// debugger;
				return proxyProducto.GetListProductoBandejaxCiaRamo(companyCode, codeRamo, showSpin);
			}

			function getProductsByUser(params, showSpin){
				return proxyProducto.getListProductByUsuario(params, showSpin);
			}

			function anularSOAT(params, showSpin){
				return proxyPoliza.AnularPoliza(params, showSpin);
			}

			function filterDocumentsSOAT(params, showSpin){
				return proxySoat.GetListDocumentoSoat(params, showSpin);
			}

			function getEndosatarios(p){
          return $http.get(constants.system.api.endpoints.policy + 'api/contratante/endosatario/' + (p || ""))
      }

      function modificarPlacaEndosatario(rp){
      	return proxyAutomovil.ModificarPlacaEndosatario(rp, true);
      }

			function filterDocumentsSalud(params, showSpin){
          return proxyDocumento.ListarDocumentoSaludPag(params, showSpin);
			}
			
			function generarArchivo(params, vFileName) {
				mpSpin.start();
				$http({
          url: constants.system.api.endpoints.policy + 'api/documento/descargardocumento/' + params,
          method: 'POST',
          headers:{
						'Content-Type': 'application/x-www-form-urlencoded',
						responseType: 'arraybuffer'
          }
					
				}).success(
					function(data, status, headers) {
						mainServices.fnDownloadFileBase64(data, 'pdf', vFileName, true);
						mpSpin.end();
					},
					function(data, status) {
						mpSpin.end();
						mModalAlert.showError("Error al descargar el documento", 'ERROR');
					});
				}

				function generarExcel(params, vFileName) {
					var pathParams = {
						opcMenu: localStorage.getItem('currentBreadcrumb')
					  };
					const urlRequest = constants.system.api.endpoints.policy + 'api/documento/descargarExcel?COD_OBJETO=4&OPC_MENU='+pathParams.opcMenu;
				return httpData.postDownload(
							urlRequest,
							params,
							{ responseType: 'arraybuffer'},
							true
					).then(function(data){
						console.log("data", data);
						mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
					  });
				}
				function filterDocumentsClinicaDigital(params, showSpin){
					return proxyClinicaDigital.GetListarBandejaDocumentos(params, showSpin);
				}

			return{
				getProducts: getProducts,
				filterDocuments: filterDocuments,
				filterDocumentsHogar: filterDocumentsHogar,
				getProductsByRamo: getProductsByRamo,
				getProductsByUser: getProductsByUser,
				anularSOAT: anularSOAT,
				filterDocumentsSOAT: filterDocumentsSOAT,
				getEndosatarios: getEndosatarios,
				modificarPlacaEndosatario: modificarPlacaEndosatario,
				filterDocumentsSalud: filterDocumentsSalud,
				generarArchivo: generarArchivo,
				generarExcel: generarExcel,
				filterDocumentsClinicaDigital: filterDocumentsClinicaDigital
			};

		}]);

});