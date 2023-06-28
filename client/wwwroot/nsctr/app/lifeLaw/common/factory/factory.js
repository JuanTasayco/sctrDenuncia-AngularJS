'use strict'

define([
	'angular', 'constants', 'nsctr_constants',
	'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

		var appNsctr = angular.module('appNsctr');

		/*########################
    # factory
    ########################*/
		appNsctr.factory('lifeLawFactory',
			['nsctrService', 'proxyMedic', 'proxyAssignments', 'proxyLocation', 'proxyEvaluations', 'proxyConsults',
			'proxyReports', 'httpData', '$sce', 'mainServices',
			function(nsctrService, proxyMedic, proxyAssignments, proxyLocation, proxyEvaluations, proxyConsults,
			proxyReports, httpData, $sce, mainServices){

			// proxyConsults
			proxyConsults.CSGetCensusList = function(option, params, showSpin){
				if (nsctr_constants.typeLoad.massive.code == option){
					return nsctrService.fnServiceUploadPromise('api/mining/consults/getCensusListByExcelUpload', params, showSpin);
				}else{
					return proxyConsults.ServicesConsults_GetCensusList(params, showSpin);
				}
			}
			// proxyEvaluations
			proxyEvaluations.CSSaveEvaluation = function(option, params, showSpin){
				if (nsctr_constants.typeLoad.massive.code == option){
					return nsctrService.fnServiceUploadPromise('api/mining/evaluations/CreatePadronMasivoEvaluation', params, showSpin);
				}else{
					return proxyEvaluations.Evaluations_CreatePadronEvaluation(params, showSpin);
				}
			}
			// proxyReports
			proxyReports.CSDownloadReport = function(documentType, data) {
				const dataJsonRequest = 'json=' + JSON.stringify(data);
				const opcMenu = localStorage.getItem('currentBreadcrumb');
				const urlRequest = constants.system.api.endpoints.nsctr + 'api/mining/reports/listEvaluation/' + documentType +'?COD_OBJETO=635&OPC_MENU='+ opcMenu;
				return httpData.postDownload(
					urlRequest,
					dataJsonRequest,
					{ headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer'},
					true
					);
			}
			/*########################
    	# return
    	########################*/
			return{
				proxyMedic : proxyMedic,
				proxyAssignments : proxyAssignments,
        proxyLocation : proxyLocation,
        proxyEvaluations: proxyEvaluations,
        proxyConsults: proxyConsults,
        proxyReports: proxyReports
			};

		}]);


});