'use strict'

define([
	'angular', 'constants', 'nsctr_constants',
	'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

		var appNsctr = angular.module('appNsctr');

		/*########################
    # factory
    ########################*/
		appNsctr.factory('miningFactory',
			['nsctrService', 'proxyMedic', 'proxyAssignments', 'proxyLocation', 'proxyEvaluations', 'proxyConsults',
			'proxyReports', 'httpData', '$sce', 'proxyMiningGenerateInclusionMain','mainServices',
			function(nsctrService, proxyMedic, proxyAssignments, proxyLocation, proxyEvaluations, proxyConsults,
			proxyReports, httpData, $sce, proxyMiningGenerateInclusionMain, mainServices){

			var API_ENDPOINT = constants.system.api.endpoints.nsctr;

			//proxyCommon
			var proxyCommon = {};
			proxyCommon.CSServicesModalSearch = function(searchType, params, showSpin){
				var vService = {};
				vService[nsctr_constants.client.code] = proxyAssignments.ServicesAllAssignEnterprise;
				vService[nsctr_constants.insured.code] = proxyConsults.ServicesConsults_GetCensusListPaging;
				return vService[searchType](params, showSpin);
			}
			proxyCommon.CSServicesSaveMaintenance = function(maintenanceType, actionType, params, showSpin){
				var vService = {};
				vService[nsctr_constants.medic.code] = {
					A: proxyMedic.ServicesCreateMedic,
					U: proxyMedic.ServicesUpdateMedic
				};
				vService[nsctr_constants.location.code] = {
					A: proxyLocation.ServicesCreateLocation,
					U: proxyLocation.ServicesUpdateLocation
				};
				return vService[maintenanceType][actionType](params, showSpin);
			}

			//proxyMiningGenerateInclusionMain
			proxyMiningGenerateInclusionMain.CSMining_Step1_ListaAptoPadron = function(params, showSpin){
				return nsctrService.fnServiceUploadPromise('api/mining/inclusion/generate/main/step1/cruceListaAptosPadron', params, showSpin);
			}

			//proxyConsults
			proxyConsults.CSServicesConsults_DownloadCensusMassive = function(params, showSpin) {
				var vUrl = API_ENDPOINT + 'api/mining/consults/census/massive/download',
						vResponseType	= {
							responseType: 'arraybuffer'
						};
				return httpData['post'](vUrl, params, vResponseType, showSpin);
			}
			proxyConsults.CSGetCensusList = function(option, params, showSpin){
				if (nsctr_constants.typeLoad.massive.code == option){
					return nsctrService.fnServiceUploadPromise('api/mining/consults/getCensusListByExcelUpload', params, showSpin);
				}else{
					return proxyConsults.ServicesConsults_GetCensusList(params, showSpin);
				}
			}

			//proxyEvaluations
			proxyEvaluations.CSSaveEvaluation = function(option, params, showSpin){
				if (nsctr_constants.typeLoad.massive.code == option){
					return nsctrService.fnServiceUploadPromise('api/mining/evaluations/CreatePadronMasivoEvaluation', params, showSpin);
				}else{
					return proxyEvaluations.Evaluations_CreatePadronEvaluation(params, showSpin);
				}
      }

      //proxyReports
      proxyReports.CSDownloadReport = function(reportType) {
			const opcMenu = localStorage.getItem('currentBreadcrumb');
			const urlRequest = constants.system.api.endpoints.nsctr + 'api/mining/reports/listEvaluation/' + reportType +'?COD_OBJETO=635&OPC_MENU='+ opcMenu;
			return httpData.postDownload(
				urlRequest,
				{ 
					headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, 
					responseType: 'arraybuffer'
				},
				true
			);
      };

			return{
				proxyCommon: proxyCommon,
				proxyMedic : proxyMedic,
				proxyAssignments : proxyAssignments,
        proxyLocation : proxyLocation,
        proxyEvaluations: proxyEvaluations,
        proxyConsults: proxyConsults,
        proxyReports: proxyReports,
        proxyMiningGenerateInclusionMain: proxyMiningGenerateInclusionMain
			};

		}]);


});
