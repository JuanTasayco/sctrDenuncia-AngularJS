'use strict'

define([
	'angular', 'constants', 'nsctr_constants',
	'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

		var appNsctr = angular.module('appNsctr');
		/*########################
    # factory
    ########################*/
		appNsctr.factory('commonFactory',
			['$q', 'proxyLookup', 'proxyClient', 'proxyPolicy', 'proxyApplication', 'proxyInsured', 'proxyCoverage',
			'proxyConstancy', 'proxyLookupFiles', 'proxyConsults', '$sce', 'proxyDeclarationSummary', 'proxyGenerateInclusionMain',
			'proxyGenerateDeclarationMain', 'proxyDeclarationRisk', 'mpSpin', 'proxyDeclarationAdmin', 'nsctrService',
			'proxyManualConstancy', 'proxyGenerateDeclarationPre', 'proxyGenerateInclusionPre', 'mainServices', 'httpData',
			function($q, proxyLookup, proxyClient, proxyPolicy, proxyApplication, proxyInsured, proxyCoverage,
			proxyConstancy, proxyLookupFiles, proxyConsults, $sce, proxyDeclarationSummary, proxyGenerateInclusionMain,
			proxyGenerateDeclarationMain, proxyDeclarationRisk, mpSpin, proxyDeclarationAdmin, nsctrService,
			proxyManualConstancy, proxyGenerateDeclarationPre, proxyGenerateInclusionPre, mainServices, httpData){

			var proxyCommon = {},
					API_ENDPOINT = constants.system.api.endpoints.nsctr,
					TYPE_LOAD = nsctr_constants.typeLoad;

			//proxyCoverage
			proxyCoverage.CSServicesSaveProvisionalCoverage = function(typeLoad, params, showSpin){
				if (TYPE_LOAD.individual.code == typeLoad){
					return proxyCoverage.ServicesSaveProvisionalCoverageIndividual(params, showSpin)
				}else{
					return nsctrService.fnServiceUploadPromise('api/common/coverage/provisional/uploadExcel', params, showSpin);
				}
			};
			proxyCoverage.CSServicesExportProvisionalToExcel = function(){
				return $sce.trustAsResourceUrl(API_ENDPOINT + 'api/common/coverage/provisional/exportToExcel');
			};
			//proxyManualConstancy
			proxyManualConstancy.CSGenerateManualConstancy = function(params, showSpin){
				return nsctrService.fnServiceUploadPromise('api/common/manualConstancy/generate', params, showSpin);
			};
			//proxyDeclarationAdmin
			proxyDeclarationAdmin.CSServicesRePrintEmployees = function(typeLoad, params, showSpin){
				if (TYPE_LOAD.individual.code == typeLoad){
					return proxyDeclarationAdmin.ServicesRePrintEmployees(params, showSpin)
				}else{
					return nsctrService.fnServiceUploadPromise('api/declaration/admin/constancy/reprint/massive', params, showSpin);
				}
			};
			proxyDeclarationAdmin.CSRecoverPayrollAdmin_Replace_Step2_Upload = function(typeLoad, params, showSpin){
				if (TYPE_LOAD.individual.code == typeLoad){
					return proxyDeclarationAdmin.RecoverPayrollAdmin_Replace_Step2_Upload_Manual(params, showSpin);
				}else{
					return nsctrService.fnServiceUploadPromise('api/declaration/admin/replacePayroll/step2/upload/excel', params, showSpin);
				}
			};

			//proxyGenerateDeclarationMain
			proxyGenerateDeclarationMain.CSServicesDownloadErrorExcel = function(){
				return $sce.trustAsResourceUrl(API_ENDPOINT + 'api/declaration/generate/main/step1/download/error');
			};
			proxyGenerateDeclarationMain.CSDownloadPendingPayroll = function(){
				return $sce.trustAsResourceUrl(API_ENDPOINT + 'api/declaration/generate/main/risk/downloadPendingPayroll');
			}
			//proxyLookupFiles
			proxyLookupFiles.CSServicesEvaluacionTemplateExcelMineria = function(){
				return API_ENDPOINT + 'api/common/lookup/mineria/EvaluationTemplate';
			};
			proxyLookupFiles.CSServicesTemplateExcel = function(module){
			var vPrefixUri = module.prefixUri;
			const opcMenu = localStorage.getItem('currentBreadcrumb');
			const urlRequest = API_ENDPOINT + 'api/common/lookup/' + vPrefixUri +'/DeclarationTemplate?COD_OBJETO=635&OPC_MENU='+ opcMenu;
			return httpData.getDownload(
				urlRequest,
				{  responseType: 'arraybuffer' },
				true
				).then(
					function ( data ){
					  mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
					}
				  );
			};
			//proxyApplication
			proxyApplication.CSServicesDownloadExcelHistorical = function(params,showSpin){
				  return httpData.postDownload(API_ENDPOINT + 'api/common/application/downloadExcelInsured', params, { responseType: 'arraybuffer' }, showSpin)
				  .then(
					function ( data ){
					  mainServices.fnDownloadFileBase64(data.file, 'application/vnd.ms-excel', data.defaultFileName, true);
					}
				  );
			};
			//proxyLookup
			proxyLookup.CSServicesTemplateExcel = function(){
				return API_ENDPOINT + 'api/common/lookup/excelTemplate';
			};
			/*########################
    	# proxyCommon
    	########################*/
    	//CSDeclaration_Inclusion_Step1
			function _declarationFirstStep(typeLoad, params, showSpin){
				if (TYPE_LOAD.individual.code == typeLoad){
					return httpData.post(
						API_ENDPOINT + 'api/declaration/generate/main/step1/upload/manual',
						params, 
						{ headers: {'Content-Type': 'text/html; charset=UTF-8'} }, 
						showSpin
					  );
				}else{
					return nsctrService.fnServiceUploadPromise('api/declaration/generate/main/step1/upload/excel', params, showSpin);
				}
			}
			function _inclusionFirstStep(showRisksList, typeLoad, params, showSpin){
				if (showRisksList){
					if (TYPE_LOAD.individual.code == typeLoad){
						return httpData.post(
							API_ENDPOINT + 'api/inclusion/generate/main/step1/upload/manual',
							params, 
							{ headers: {'Content-Type': 'text/html; charset=UTF-8'} }, 
							showSpin
						  );
					}else{
						return nsctrService.fnServiceUploadPromise('api/inclusion/generate/main/step1/upload/excel', params, showSpin);
					}
				}else{
					return _declarationFirstStep(typeLoad, params, showSpin);
				}
			}
			proxyCommon.CSDeclaration_Inclusion_Step1 = function(isDeclaration, showRisksList, typeLoad, params, showSpin){
				if (isDeclaration){
					return _declarationFirstStep(typeLoad, params, showSpin);
				}else{
					return _inclusionFirstStep(showRisksList, typeLoad, params, showSpin)
				}
			};
			//for REGULAR
			proxyCommon.CSInclusion_Step1 = function(showRisksList, typeLoad, params, showSpin){
				return _inclusionFirstStep(showRisksList, typeLoad, params, showSpin);
			};
			//for REGULAR
			proxyCommon.CSDeclaration_Step1 = function(typeLoad, params, showSpin){
				return _declarationFirstStep(typeLoad, params, showSpin);
			};
			//CSDeclaration_Inclusion_Step2
			function _inclusionSecondStep(showRisksList, params, showSpin){
				if (showRisksList){
					return proxyGenerateInclusionMain.Inclusion_Step2_GenerateConstancy(params, showSpin);
				}else{
					return proxyGenerateDeclarationMain.Declaration_Step2_GenerateConstancy(params, showSpin);
				}
			}
			proxyCommon.CSDeclaration_Inclusion_Step2 = function(isDeclaration, showRisksList, params, showSpin){
				if (isDeclaration){
					return proxyGenerateDeclarationMain.Declaration_Step2_GenerateConstancy(params, showSpin);
				}else{
					return _inclusionSecondStep(showRisksList, params, showSpin);
				}
			};
			//for REGULAR
			proxyCommon.CSInclusion_Step2 = function(showRisksList, params, showSpin){
				return _inclusionSecondStep(showRisksList, params, showSpin);
			};
			//for risksPremium & pendingRisksPremium in one service - R/M/V
			//_standardObject
			function _standardObject(){
				return {
					message: '',
					data: [],
					operationCode: 200,
					typeMessage: 'standardObject'
				}
			}
			function _serviceRiskPrimaPlanillaPendienteDeclaracion(params, showSpin){
				function _end(){
			    if (showSpin) mpSpin.end();
			  }
			  if (showSpin) mpSpin.start();

			  function _pendingRisksPremium(data){
			  	var vArrayMain = [],
			  			vArrayPendingRiskPremium = [];

			  	if (data.pendingPensionRiskList && data.pendingPensionRiskList.length > 0) {
						var vPension = data.pendingPensionRiskList[0];
						vPension.policyType = nsctr_constants.pension.code;
						vPension.totalAmount = data.pendingPensionRiskList.splice(-1, 1)[0]
						vArrayMain.push(vPension);
			  	}
			  	if (data.pendingHealthRiskList && data.pendingHealthRiskList.length > 0) {
			  		var vHealth = data.pendingHealthRiskList[0];
						vHealth.policyType = nsctr_constants.health.code;
						vHealth.totalAmount = data.pendingHealthRiskList.splice(-1, 1)[0]
						vArrayMain.push(vHealth);
			  	}
			  	function _listRiskPrima(list){
			  		var vList = [];
			  		angular.forEach(list, function(value1, key1, array) {
							var vItem = {
								riskNumber:       value1.riskNumber,
								riskName:         value1.riskDescription,
								planillaCantidad: value1.payrollQuantity,
								planillaMonto:    value1.payrollAmount,
								planillaPrima:    value1.payrollPremium,
							}
							vList.push(vItem);
			      });
			      return vList;
			  	}
			  	angular.forEach(vArrayMain, function(value1, key1){
			  		var vItem = {
			  			policyType:             value1.policyType,
			        policyNumber: 					value1.policyNumber,
			        dateFinishApplication:  value1.endDate,
			        applicationNumber:      value1.aplicationNumber,
			        planillaCantidadTotal:  value1.totalAmount.payrollQuantity,
			        planillaMontoTotal:     value1.totalAmount.payrollAmount,
			        planillaPrimaTotal:     value1.totalAmount.payrollPremium,
			        listRiskPrima: 					_listRiskPrima(
			        													value1.policyType === nsctr_constants.pension.code
			        														? data.pendingPensionRiskList
			        														: data.pendingHealthRiskList
			        												)
			  		};
			  		vArrayPendingRiskPremium.push(vItem);
			  	});

			    return {
			    	data: vArrayPendingRiskPremium
			    }
			  }

			  var deferred = $q.defer();
			  proxyGenerateDeclarationMain.ServiceRiskPrimaPlanillaPendienteDeclaracion(params, false).then(function(response){
					var pendingRisksPremium = _pendingRisksPremium(response.data);
			    deferred.resolve(pendingRisksPremium);
			    _end();
			  }, function (error){
			  	deferred.reject(error.statusText);
			  	_end();
			  });
				return deferred.promise;
			}
			proxyCommon.CSServiceRiskPrimaDeclaracion = function(paramsRisks, paramsPendingRisks, showSpin){
				var vServicePendingRisksPremium = (paramsPendingRisks)
																						? _serviceRiskPrimaPlanillaPendienteDeclaracion(paramsPendingRisks, false)
																						: _standardObject();

				return mainServices.fnReturnSeveralPromise([
					proxyDeclarationRisk.ServiceRiskPrimaDeclaracion(paramsRisks, false),
					vServicePendingRisksPremium
					], showSpin);
			};

			// proxyConstancy
			proxyConstancy.ServicesDownloadExcelPayroll = function(params, showSpin) {
				return httpData.postDownload(API_ENDPOINT + 'api/common/constancy/downloadExcelPayroll', params, { responseType: 'arraybuffer' }, showSpin);
			}

			/*########################
    	# return
    	########################*/
			return{
				proxyLookup: proxyLookup,
				proxyClient: proxyClient,
				proxyPolicy: proxyPolicy,
				proxyApplication: proxyApplication,
				proxyInsured: proxyInsured,
				proxyCoverage: proxyCoverage,
				proxyConstancy: proxyConstancy,
				proxyLookupFiles: proxyLookupFiles,
				proxyCommon: proxyCommon,
				proxyDeclarationSummary: proxyDeclarationSummary,
				proxyGenerateInclusionMain: proxyGenerateInclusionMain,
				proxyGenerateDeclarationMain: proxyGenerateDeclarationMain,
				proxyDeclarationRisk: proxyDeclarationRisk,
				proxyDeclarationAdmin: proxyDeclarationAdmin,
				proxyManualConstancy: proxyManualConstancy,
				proxyGenerateDeclarationPre: proxyGenerateDeclarationPre,
				proxyGenerateInclusionPre: proxyGenerateInclusionPre
			};

		}]);

});