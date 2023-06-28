'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appAutos = angular.module('appAutos');
		
		appAutos.factory('documentosFactory', 
			['$http', '$q', 'proxyDocumento', 'proxyProducto', 'proxyClinicaDigital', 
			function($http, $q, proxyDocumento, proxyProducto, proxyClinicaDigital){

			//https://mxperu.atlassian.net/browse/OIM-140
			function getProducts(userCode, showSpin){
				return proxyProducto.GetListProductoBandeja(userCode, showSpin);
			}
			
			//https://mxperu.atlassian.net/browse/OIM-613
			function filterDocuments(params, showSpin){
				return proxyDocumento.ListarDocumentoPag(params, showSpin);
			}
			function filterDocumentsClinicaDigital(params, showSpin){
				return proxyClinicaDigital.GetListarBandejaDocumentos(params, showSpin);
			}
			
			return{
				getProducts: getProducts,
				filterDocuments: filterDocuments,
				filterDocumentsClinicaDigital:filterDocumentsClinicaDigital
			};

		}]);

});

