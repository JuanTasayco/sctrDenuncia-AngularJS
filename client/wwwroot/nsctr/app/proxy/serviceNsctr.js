/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.nsctr", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyNsctr', {
        endpoint: constants.system.api.endpoints['nsctr'],
        controllerLocation: {
            actions : {
                'methodServicesPagingListLocation':{
                    name:  'ServicesPagingListLocation',
                    path: 'api/mining/maintenance/locations/pagingListLocation'
                },
                'methodServicesCreateLocation':{
                    name:  'ServicesCreateLocation',
                    path: 'api/mining/maintenance/locations/CreateLocation'
                },
                'methodServicesGetLocationByLocationId':{
                    name:  'ServicesGetLocationByLocationId',
                    path: 'api/mining/maintenance/locations/getLocationByLocationId/{locationId}'
                },
                'methodServicesUpdateLocation':{
                    name:  'ServicesUpdateLocation',
                    path: 'api/mining/maintenance/locations/UpdateLocation'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodServicesAllManager':{
                    name:  'ServicesAllManager',
                    path: 'api/common/lookup/allmanager'
                },
                'methodServicesAutocompleteManager':{
                    name:  'ServicesAutocompleteManager',
                    path: 'api/common/lookup/manager/{filter}'
                },
                'methodServicesAutocompleteAgent':{
                    name:  'ServicesAutocompleteAgent',
                    path: 'api/common/lookup/agent/{idManager}?filter={filter}'
                },
                'methodServicesAllAgent':{
                    name:  'ServicesAllAgent',
                    path: 'api/common/lookup/allagent/{idManager}'
                },
                'methodServicesListDocumentType':{
                    name:  'ServicesListDocumentType',
                    path: 'api/common/lookup/documentType/{actionType}/{system}'
                },
                'methodServicesSystems':{
                    name:  'ServicesSystems',
                    path: 'api/common/lookup/systems'
                },
                'methodServicesPoliciesByInsured':{
                    name:  'ServicesPoliciesByInsured',
                    path: 'api/common/lookup/policies/ByInsured/{NSCTRSystemType}/{constancyNumber}/{documentType}/{documentNumber}'
                },
                'methodServicesValiditiesByPolicy':{
                    name:  'ServicesValiditiesByPolicy',
                    path: 'api/common/lookup/Validities/ByPolicies/{NSCTRSystemType}/{policyNumber}/{documentType}/{documentNumber}'
                },
                'methodServicesCoverageStatusType':{
                    name:  'ServicesCoverageStatusType',
                    path: 'api/common/lookup/coverage/statusType'
                },
                'methodServicesMedicList':{
                    name:  'ServicesMedicList',
                    path: 'api/common/lookup/allMedicsDropdownList'
                },
                'methodServicesAllClinics':{
                    name:  'ServicesAllClinics',
                    path: 'api/common/lookup/allClinics'
                },
                'methodServicesAbleList':{
                    name:  'ServicesAbleList',
                    path: 'api/common/lookup/AbleList'
                },
                'methodServicesEnterpriseList':{
                    name:  'ServicesEnterpriseList',
                    path: 'api/common/lookup/EnterpriseList'
                },
                'methodServicesTestTypeList':{
                    name:  'ServicesTestTypeList',
                    path: 'api/common/lookup/TestTypeList'
                },
                'methodServicesLocationList':{
                    name:  'ServicesLocationList',
                    path: 'api/common/lookup/LocationList'
                },
                'methodServicesStatesLocationMedicList':{
                    name:  'ServicesStatesLocationMedicList',
                    path: 'api/common/lookup/StatesLocationMedic/{typeStates}'
                },
                'methodGetRolesPermissionAbleStatus':{
                    name:  'GetRolesPermissionAbleStatus',
                    path: 'api/common/lookup/GetRolesPermissionAbleStatus/{NSCTRSystemType}/{Rol}'
                },
            }
        },
        controllerGenerateInclusionMain: {
            actions : {
                'methodInclusion_Step1_ManualUpload':{
                    name:  'Inclusion_Step1_ManualUpload',
                    path: 'api/inclusion/generate/main/step1/upload/manual'
                },
                'methodInclusion_Step1_ExcelUpload':{
                    name:  'Inclusion_Step1_ExcelUpload',
                    path: 'api/inclusion/generate/main/step1/upload/excel'
                },
                'methodInclusion_Step2_GenerateConstancy':{
                    name:  'Inclusion_Step2_GenerateConstancy',
                    path: 'api/inclusion/generate/main/step2/save/generateConstancy'
                },
            }
        },
        controllerClient: {
            actions : {
                'methodServicesPagingClient':{
                    name:  'ServicesPagingClient',
                    path: 'api/common/client/paging'
                },
                'methodServicsClientByDocumentNumber':{
                    name:  'ServicsClientByDocumentNumber',
                    path: 'api/common/client/byDocument/{documentNumber}'
                },
                'methodServicesClientValid':{
                    name:  'ServicesClientValid',
                    path: 'api/common/client/{documentType}/{documentNumber}/valid?SystemType={SystemType}'
                },
            }
        },
        controllerMiningGenerateInclusionMain: {
            actions : {
                'methodMining_Step1_ListaAptoPadron':{
                    name:  'Mining_Step1_ListaAptoPadron',
                    path: 'api/mining/inclusion/generate/main/step1/cruceListaAptosPadron'
                },
            }
        },
        controllerDeclarationInsured: {
            actions : {
                'methodServicesGetListInsuredDeclaration':{
                    name:  'ServicesGetListInsuredDeclaration',
                    path: 'api/declaration/insured/sheets'
                },
            }
        },
        controllerApplication: {
            actions : {
                'methodcreateCustomApplication':{
                    name:  'createCustomApplication',
                    path: 'api/common/application/custom/create'
                },
                'methodServicesApplicationsByClient':{
                    name:  'ServicesApplicationsByClient',
                    path: 'api/common/application/search/byPolicy'
                },
                'methodGetHistoricalApplications':{
                    name:  'GetHistoricalApplications',
                    path: 'api/common/application/historical'
                },
                'methodServicesDownloadExcelHistorical':{
                    name:  'ServicesDownloadExcelHistorical',
                    path: 'api/common/application/downloadExcelInsured'
                },
            }
        },
        controllerDeclarationSummary: {
            actions : {
                'methodGetConstancySummary':{
                    name:  'GetConstancySummary',
                    path: 'api/declaration/summarylist/{idConstancy}/{rol}/{NSCTRSystemType}'
                },
                'methodGetAdicionalDocuments':{
                    name:  'GetAdicionalDocuments',
                    path: 'api/declaration/documentoAdicional/{numCerti}/{codCia}/{numPoliza}/{numSpto}/{numApli}/{numSptoApli}/{codUsuario}/{type}'
                },
            }
        },
        controllerGenerateInclusionPre: {
            actions : {
                'methodValidateApplicationPreInclusion':{
                    name:  'ValidateApplicationPreInclusion',
                    path: 'api/inclusion/generate/pre/step1/validateApplication'
                },
            }
        },
        controllerInsured: {
            actions : {
                'methodServicesInsuredExcelByPolicy':{
                    name:  'ServicesInsuredExcelByPolicy',
                    path: 'api/common/insured/search/byPolicy'
                },
                'methodServicesInsuredPagingByPolicy':{
                    name:  'ServicesInsuredPagingByPolicy',
                    path: 'api/common/insured/paging/byPolicy'
                },
                'methodServicesInsuredByPolicyAndValidity':{
                    name:  'ServicesInsuredByPolicyAndValidity',
                    path: 'api/common/insured/getByPolicyAndValidity'
                },
                'methodServicesInsuredByDocumentTypeAndNumber':{
                    name:  'ServicesInsuredByDocumentTypeAndNumber',
                    path: 'api/common/insured/getByDocument/{documentType}/{documentNumber}'
                },
                'methodServicesInsuredUpdate':{
                    name:  'ServicesInsuredUpdate',
                    path: 'api/common/insured/update'
                },
            }
        },
        controllerManualConstancy: {
            actions : {
                'methodServicesPolicyValidities':{
                    name:  'ServicesPolicyValidities',
                    path: 'api/common/manualConstancy/validities/{CiaId}/{PolicyNumber}'
                },
                'methodGenerateManualConstancy':{
                    name:  'GenerateManualConstancy',
                    path: 'api/common/manualConstancy/generate'
                },
            }
        },
        controllerCoverage: {
            actions : {
                'methodServicesListPagingCoverage':{
                    name:  'ServicesListPagingCoverage',
                    path: 'api/common/coverage/paging'
                },
                'methodServicesSaveProvisionalCoverage':{
                    name:  'ServicesSaveProvisionalCoverage',
                    path: 'api/common/coverage/provisional/uploadExcel'
                },
                'methodServicesSaveProvisionalCoverageIndividual':{
                    name:  'ServicesSaveProvisionalCoverageIndividual',
                    path: 'api/common/coverage/provisional/Individual'
                },
                'methodServicesDeleteProvisionalConstancy':{
                    name:  'ServicesDeleteProvisionalConstancy',
                    path: 'api/common/coverage/provisional/deleteById?provisionalCoverageId={provisionalCoverageId}'
                },
                'methodServicesExportProvisionalToExcel':{
                    name:  'ServicesExportProvisionalToExcel',
                    path: 'api/common/coverage/provisional/exportToExcel'
                },
            }
        },
        controllerAssignments: {
            actions : {
                'methodServicesAutoCompleteLocation':{
                    name:  'ServicesAutoCompleteLocation',
                    path: 'api/mining/maintenance/assignments/autoCompleteLocation/{filter}'
                },
                'methodServicesGetAssignEnterprise':{
                    name:  'ServicesGetAssignEnterprise',
                    path: 'api/mining/maintenance/assignments/getAssignEnterpriseByEnterpriseId/{EnterpriseId}'
                },
                'methodServicesAllAssignEnterprise':{
                    name:  'ServicesAllAssignEnterprise',
                    path: 'api/mining/maintenance/assignments/pagingEnterprises'
                },
                'methodServicesAddLocationEnterprise':{
                    name:  'ServicesAddLocationEnterprise',
                    path: 'api/mining/maintenance/assignments/addLocationEnterprise'
                },
                'methodServicesDeleteLocationEnterprise':{
                    name:  'ServicesDeleteLocationEnterprise',
                    path: 'api/mining/maintenance/assignments/deleteLocationEnterprise/{LocationId}/{EnterpriseId}'
                },
                'methodServicesGetAllLocationsByEnterprise':{
                    name:  'ServicesGetAllLocationsByEnterprise',
                    path: 'api/mining/maintenance/assignments/listLocationsByEnterprise/{EnterpriseId}'
                },
            }
        },
        controllerLookupFiles: {
            actions : {
                'methodServicesTemplateExcel':{
                    name:  'ServicesTemplateExcel',
                    path: 'api/common/lookup/regular/DeclarationTemplate'
                },
                'methodServicesTemplateExcelMineria':{
                    name:  'ServicesTemplateExcelMineria',
                    path: 'api/common/lookup/mineria/DeclarationTemplate'
                },
                'methodServicesEvaluacionTemplateExcelMineria':{
                    name:  'ServicesEvaluacionTemplateExcelMineria',
                    path: 'api/common/lookup/mineria/EvaluationTemplate'
                },
                'methodServicesTemplateExcelMineriaVidaLey':{
                    name:  'ServicesTemplateExcelMineriaVidaLey',
                    path: 'api/common/lookup/vidaley/DeclarationTemplate'
                },
            }
        },
        controllerConstancy: {
            actions : {
                'methodServicesChangeStateConstancy':{
                    name:  'ServicesChangeStateConstancy',
                    path: 'api/common/constancy/changeStateConstancy'
                },
                'methodServicesListPagingConstancy':{
                    name:  'ServicesListPagingConstancy',
                    path: 'api/common/constancy/paging'
                },
                'methodServicesSendMailReceiptConstancies':{
                    name:  'ServicesSendMailReceiptConstancies',
                    path: 'api/common/constancy/sendMail'
                },
                'methodServicesDownloadExcelPayroll':{
                    name:  'ServicesDownloadExcelPayroll',
                    path: 'api/common/constancy/downloadExcelPayroll'
                },
                'methodServicesDownloadConstancy':{
                    name:  'ServicesDownloadConstancy',
                    path: 'api/common/constancy/download/{constancyNumber}'
                },
            }
        },
        controllerReports: {
            actions : {
                'methodEvaluationReportPaging':{
                    name:  'EvaluationReportPaging',
                    path: 'api/mining/reports/paging'
                },
                'methodEvaluationReportListPdf':{
                    name:  'EvaluationReportListPdf',
                    path: 'api/mining/reports/listEvaluation/pdf'
                },
                'methodEvaluationReportListExcel':{
                    name:  'EvaluationReportListExcel',
                    path: 'api/mining/reports/listEvaluation/excel'
                },
                'methodEvaluationReportListWord':{
                    name:  'EvaluationReportListWord',
                    path: 'api/mining/reports/listEvaluation/word'
                },
            }
        },
        controllerGenerateDeclarationMain: {
            actions : {
                'methodDeclaration_Step1_ManualUpload':{
                    name:  'Declaration_Step1_ManualUpload',
                    path: 'api/declaration/generate/main/step1/upload/manual'
                },
                'methodDeclaration_Step1_ExcelUpload':{
                    name:  'Declaration_Step1_ExcelUpload',
                    path: 'api/declaration/generate/main/step1/upload/excel'
                },
                'methodServicesDownloadErrorExcel':{
                    name:  'ServicesDownloadErrorExcel',
                    path: 'api/declaration/generate/main/step1/download/error'
                },
                'methodDeclaration_Step2_GenerateConstancy':{
                    name:  'Declaration_Step2_GenerateConstancy',
                    path: 'api/declaration/generate/main/step2/save/generateConstancy'
                },
                'methodServiceRiskPrimaPlanillaPendienteDeclaracion':{
                    name:  'ServiceRiskPrimaPlanillaPendienteDeclaracion',
                    path: 'api/declaration/generate/main/risk/primaPlanillaPendiente'
                },
                'methodDownloadPendingPayroll':{
                    name:  'DownloadPendingPayroll',
                    path: 'api/declaration/generate/main/risk/downloadPendingPayroll'
                },
            }
        },
        controllerGenerateDeclarationPre: {
            actions : {
                'methodServicesValidarCliente':{
                    name:  'ServicesValidarCliente',
                    path: 'api/declaration/generate/pre/validarCliente/{documentType}/{documentNumber}/{Rol}'
                },
                'methodValidateApplicationPreDeclaration':{
                    name:  'ValidateApplicationPreDeclaration',
                    path: 'api/declaration/generate/pre/step1/validateApplication'
                },
                'methodDeclaration_Step1_GetRisksLists':{
                    name:  'Declaration_Step1_GetRisksLists',
                    path: 'api/declaration/generate/pre/step1/initialConfigurations/getRisksLists'
                },
                'methodGetRiskTypeList':{
                    name:  'GetRiskTypeList',
                    path: 'api/declaration/generate/pre/getRiskTypeList?policyNumber={policyNumber}'
                },
            }
        },
        controllerDeclarationRisk: {
            actions : {
                'methodServiceRiskPrimaDeclaracion':{
                    name:  'ServiceRiskPrimaDeclaracion',
                    path: 'api/declaration/risk/prima'
                },
            }
        },
        controllerDeclarationAdmin: {
            actions : {
                'methodListPlanilla':{
                    name:  'ListPlanilla',
                    path: 'api/declaration/admin/list/planilla'
                },
                'methodServicesRePrintEmployees':{
                    name:  'ServicesRePrintEmployees',
                    path: 'api/declaration/admin/constancy/reprint'
                },
                'methodReimprimirConstanciaMasivo':{
                    name:  'ReimprimirConstanciaMasivo',
                    path: 'api/declaration/admin/constancy/reprint/massive'
                },
                'methodRecoverPayrollAdmin_Replace_Step1_Selection':{
                    name:  'RecoverPayrollAdmin_Replace_Step1_Selection',
                    path: 'api/declaration/admin/replacePayroll/step1/select'
                },
                'methodRecoverPayrollAdmin_Replace_Step2_Upload_Manual':{
                    name:  'RecoverPayrollAdmin_Replace_Step2_Upload_Manual',
                    path: 'api/declaration/admin/replacePayroll/step2/upload/manual'
                },
                'methodRecoverPayrollAdmin_Replace_Step2_Upload_Excel':{
                    name:  'RecoverPayrollAdmin_Replace_Step2_Upload_Excel',
                    path: 'api/declaration/admin/replacePayroll/step2/upload/excel'
                },
                'methodRecoverPayrollAdmin_Replace_Step3_SaveReplace':{
                    name:  'RecoverPayrollAdmin_Replace_Step3_SaveReplace',
                    path: 'api/declaration/admin/replacePayroll/step3/save/replace'
                },
                'methodRecoverPayrollAdmin_Replace_Step3_SaveReplaceForMining':{
                    name:  'RecoverPayrollAdmin_Replace_Step3_SaveReplaceForMining',
                    path: 'api/declaration/admin/replacePayroll/step3/save/replaceForMining'
                },
                'methodNullifyApplications':{
                    name:  'NullifyApplications',
                    path: 'api/declaration/admin/nullifyApplications'
                },
            }
        },
        controllerEvaluations: {
            actions : {
                'methodEvaluations_DeleteEvaluation':{
                    name:  'Evaluations_DeleteEvaluation',
                    path: 'api/mining/evaluations/deleteEvaluation/{idFile}'
                },
                'methodEvaluations_EvaluationsPagingList':{
                    name:  'Evaluations_EvaluationsPagingList',
                    path: 'api/mining/evaluations/EvaluationsPagingList'
                },
                'methodEvaluations_EvaluationsList':{
                    name:  'Evaluations_EvaluationsList',
                    path: 'api/mining/evaluations/EvaluationsList/{idMedic}'
                },
                'methodEvaluations_DetailEvaluationPagingList':{
                    name:  'Evaluations_DetailEvaluationPagingList',
                    path: 'api/mining/evaluations/DetailEvaluationsPagingList'
                },
                'methodEvaluations_DetailEvaluationList':{
                    name:  'Evaluations_DetailEvaluationList',
                    path: 'api/mining/evaluations/DetailEvaluationsList/{fileId}'
                },
                'methodEvaluations_CreatePadronEvaluation':{
                    name:  'Evaluations_CreatePadronEvaluation',
                    path: 'api/mining/evaluations/CreatePadronEvaluation'
                },
                'methodEvaluations_CreatePadronMasivoEvaluation':{
                    name:  'Evaluations_CreatePadronMasivoEvaluation',
                    path: 'api/mining/evaluations/CreatePadronMasivoEvaluation'
                },
                'methodServicesEvaluationCapableTypeFilterList':{
                    name:  'ServicesEvaluationCapableTypeFilterList',
                    path: 'api/mining/evaluations/capableTypeFilterList'
                },
                'methodServicesGetEvaluationsByEmployee':{
                    name:  'ServicesGetEvaluationsByEmployee',
                    path: 'api/mining/evaluations/getEvaluationsByEmployee/{documentType}/{documentNumber}'
                },
                'methodServicesGetEvaluationsByEmployeePaging':{
                    name:  'ServicesGetEvaluationsByEmployeePaging',
                    path: 'api/mining/evaluations/getEvaluationsByEmployeePaging'
                },
            }
        },
        controllerConsults: {
            actions : {
                'methodServicesConsults_GetCensusList':{
                    name:  'ServicesConsults_GetCensusList',
                    path: 'api/mining/consults/getCensusList'
                },
                'methodServicesConsults_GetCensusListPaging':{
                    name:  'ServicesConsults_GetCensusListPaging',
                    path: 'api/mining/consults/getCensusListPaging'
                },
                'methodServicesConsults_GetCensusListByExcelUpload':{
                    name:  'ServicesConsults_GetCensusListByExcelUpload',
                    path: 'api/mining/consults/getCensusListByExcelUpload'
                },
                'methodServicesConsults_DownloadCensusMassive':{
                    name:  'ServicesConsults_DownloadCensusMassive',
                    path: 'api/mining/consults/census/massive/download'
                },
                'methodUpdateCensus':{
                    name:  'UpdateCensus',
                    path: 'api/mining/consults/UpdateCensus'
                },
            }
        },
        controllerPolicy: {
            actions : {
                'methodServicesPoliciesCompleteByClient':{
                    name:  'ServicesPoliciesCompleteByClient',
                    path: 'api/common/policy/policiescomplete/byClient'
                },
                'methodPolicyCancellationSupplementApplication':{
                    name:  'PolicyCancellationSupplementApplication',
                    path: 'api/common/policy/cancellation/supplement/application'
                },
                'methodPolicyCancellationApplication':{
                    name:  'PolicyCancellationApplication',
                    path: 'api/common/policy/cancellation/application'
                },
            }
        },
        controllerMedic: {
            actions : {
                'methodServicesPagingListMedic':{
                    name:  'ServicesPagingListMedic',
                    path: 'api/mining/maintenance/medics/pagingListMedic'
                },
                'methodServicesCreateMedic':{
                    name:  'ServicesCreateMedic',
                    path: 'api/mining/maintenance/medics/CreateMedic'
                },
                'methodServicesUpdateMedic':{
                    name:  'ServicesUpdateMedic',
                    path: 'api/mining/maintenance/medics/UpdateMedic'
                },
                'methodServicesGetMedicId':{
                    name:  'ServicesGetMedicId',
                    path: 'api/mining/maintenance/medics/getMedicByMedicId/{MedicId}'
                },
            }
        }
    })



     module.factory("proxyLocation", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesPagingListLocation' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/locations/pagingListLocation',
                                         filter, undefined, showSpin)
                },
                'ServicesCreateLocation' : function(location, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/locations/CreateLocation',
                                         location, undefined, showSpin)
                },
                'ServicesGetLocationByLocationId' : function(locationId, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/locations/getLocationByLocationId/{locationId}',
                                                    { 'locationId':  { value: locationId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesUpdateLocation' : function(location, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/locations/UpdateLocation',
                                         location, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesAllManager' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/allmanager',
                                         undefined, undefined, showSpin)
                },
                'ServicesAutocompleteManager' : function(filter, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/manager/{filter}',
                                                    { 'filter':  { value: filter, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesAutocompleteAgent' : function(idManager, filter, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/agent/{idManager}?filter={filter}',
                                                    { 'idManager':  { value: idManager, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesAllAgent' : function(idManager, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/allagent/{idManager}',
                                                    { 'idManager':  { value: idManager, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesListDocumentType' : function(actionType, system, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/documentType/{actionType}/{system}',
                                                    { 'actionType':  { value: actionType, defaultValue:'CONT' } ,'system':  { value: system, defaultValue:'R' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesSystems' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/systems',
                                         undefined, undefined, showSpin)
                },
                'ServicesPoliciesByInsured' : function(NSCTRSystemType, constancyNumber, documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/policies/ByInsured/{NSCTRSystemType}/{constancyNumber}/{documentType}/{documentNumber}',
                                                    { 'NSCTRSystemType':  { value: NSCTRSystemType, defaultValue:'' } ,'constancyNumber':  { value: constancyNumber, defaultValue:'' } ,'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesValiditiesByPolicy' : function(NSCTRSystemType, policyNumber, documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/Validities/ByPolicies/{NSCTRSystemType}/{policyNumber}/{documentType}/{documentNumber}',
                                                    { 'NSCTRSystemType':  { value: NSCTRSystemType, defaultValue:'' } ,'policyNumber':  { value: policyNumber, defaultValue:'' } ,'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesCoverageStatusType' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/coverage/statusType',
                                         undefined, undefined, showSpin)
                },
                'ServicesMedicList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/allMedicsDropdownList',
                                         undefined, undefined, showSpin)
                },
                'ServicesAllClinics' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/allClinics',
                                         undefined, undefined, showSpin)
                },
                'ServicesAbleList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/AbleList',
                                         undefined, undefined, showSpin)
                },
                'ServicesEnterpriseList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/EnterpriseList',
                                         undefined, undefined, showSpin)
                },
                'ServicesTestTypeList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/TestTypeList',
                                         undefined, undefined, showSpin)
                },
                'ServicesLocationList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/LocationList',
                                         undefined, undefined, showSpin)
                },
                'ServicesStatesLocationMedicList' : function(typeStates, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/StatesLocationMedic/{typeStates}',
                                                    { 'typeStates':  { value: typeStates, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetRolesPermissionAbleStatus' : function(NSCTRSystemType, Rol, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/lookup/GetRolesPermissionAbleStatus/{NSCTRSystemType}/{Rol}',
                                                    { 'NSCTRSystemType':  { value: NSCTRSystemType, defaultValue:'' } ,'Rol':  { value: Rol, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGenerateInclusionMain", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'Inclusion_Step1_ManualUpload' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/inclusion/generate/main/step1/upload/manual',
                                         declarationRp, undefined, showSpin)
                },
                'Inclusion_Step1_ExcelUpload' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/inclusion/generate/main/step1/upload/excel',
                                         undefined, undefined, showSpin)
                },
                'Inclusion_Step2_GenerateConstancy' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/inclusion/generate/main/step2/save/generateConstancy',
                                         declarationRp, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClient", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesPagingClient' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/client/paging',
                                         filter, undefined, showSpin)
                },
                'ServicsClientByDocumentNumber' : function(documentNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/client/byDocument/{documentNumber}',
                                                    { 'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesClientValid' : function(documentType, documentNumber, SystemType, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/client/{documentType}/{documentNumber}/valid?SystemType={SystemType}',
                                                    { 'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' } ,'SystemType':  { value: SystemType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMiningGenerateInclusionMain", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'Mining_Step1_ListaAptoPadron' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/inclusion/generate/main/step1/cruceListaAptosPadron',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDeclarationInsured", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesGetListInsuredDeclaration' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/insured/sheets',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyApplication", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'createCustomApplication' : function(entity, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/application/custom/create',
                                         entity, undefined, showSpin)
                },
                'ServicesApplicationsByClient' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/application/search/byPolicy',
                                         filter, undefined, showSpin)
                },
                'GetHistoricalApplications' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/application/historical',
                                         filter, undefined, showSpin)
                },
                'ServicesDownloadExcelHistorical' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/application/downloadExcelInsured',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDeclarationSummary", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'GetConstancySummary' : function(idConstancy, rol, NSCTRSystemType, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/declaration/summarylist/{idConstancy}/{rol}/{NSCTRSystemType}',
                                                    { 'idConstancy':  { value: idConstancy, defaultValue:'' } ,'rol':  { value: rol, defaultValue:'' } ,'NSCTRSystemType':  { value: NSCTRSystemType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAdicionalDocuments' : function(numCerti, codCia, numPoliza, numSpto, numApli, numSptoApli, codUsuario, type, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/declaration/documentoAdicional/{numCerti}/{codCia}/{numPoliza}/{numSpto}/{numApli}/{numSptoApli}/{codUsuario}/{type}',
                                                    { 'numCerti':  { value: numCerti, defaultValue:'' } ,'codCia':  { value: codCia, defaultValue:'' } ,'numPoliza':  { value: numPoliza, defaultValue:'' } ,'numSpto':  { value: numSpto, defaultValue:'' } ,'numApli':  { value: numApli, defaultValue:'' } ,'numSptoApli':  { value: numSptoApli, defaultValue:'' } ,'codUsuario':  { value: codUsuario, defaultValue:'' } ,'type':  { value: type, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGenerateInclusionPre", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ValidateApplicationPreInclusion' : function(applications, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/inclusion/generate/pre/step1/validateApplication',
                                         applications, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInsured", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesInsuredExcelByPolicy' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/insured/search/byPolicy',
                                         filter, undefined, showSpin)
                },
                'ServicesInsuredPagingByPolicy' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/insured/paging/byPolicy',
                                         filter, undefined, showSpin)
                },
                'ServicesInsuredByPolicyAndValidity' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/insured/getByPolicyAndValidity',
                                         filter, undefined, showSpin)
                },
                'ServicesInsuredByDocumentTypeAndNumber' : function(documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/insured/getByDocument/{documentType}/{documentNumber}',
                                                    { 'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesInsuredUpdate' : function(insuredRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/insured/update',
                                         insuredRp, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyManualConstancy", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesPolicyValidities' : function(CiaId, PolicyNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/manualConstancy/validities/{CiaId}/{PolicyNumber}',
                                                    { 'CiaId':  { value: CiaId, defaultValue:'' } ,'PolicyNumber':  { value: PolicyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GenerateManualConstancy' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/manualConstancy/generate',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCoverage", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesListPagingCoverage' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/coverage/paging',
                                         filter, undefined, showSpin)
                },
                'ServicesSaveProvisionalCoverage' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/coverage/provisional/uploadExcel',
                                         undefined, undefined, showSpin)
                },
                'ServicesSaveProvisionalCoverageIndividual' : function(coverage, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/coverage/provisional/Individual',
                                         coverage, undefined, showSpin)
                },
                'ServicesDeleteProvisionalConstancy' : function(provisionalCoverageId, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/coverage/provisional/deleteById?provisionalCoverageId={provisionalCoverageId}',
                                                    { 'provisionalCoverageId':  { value: provisionalCoverageId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesExportProvisionalToExcel' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/coverage/provisional/exportToExcel',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAssignments", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesAutoCompleteLocation' : function(filter, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/assignments/autoCompleteLocation/{filter}',
                                                    { 'filter':  { value: filter, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesGetAssignEnterprise' : function(EnterpriseId, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/assignments/getAssignEnterpriseByEnterpriseId/{EnterpriseId}',
                                                    { 'EnterpriseId':  { value: EnterpriseId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesAllAssignEnterprise' : function(enterprise, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/assignments/pagingEnterprises',
                                         enterprise, undefined, showSpin)
                },
                'ServicesAddLocationEnterprise' : function(locationEnterprise, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/assignments/addLocationEnterprise',
                                         locationEnterprise, undefined, showSpin)
                },
                'ServicesDeleteLocationEnterprise' : function(LocationId, EnterpriseId, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/assignments/deleteLocationEnterprise/{LocationId}/{EnterpriseId}',
                                                    { 'LocationId':  { value: LocationId, defaultValue:'' } ,'EnterpriseId':  { value: EnterpriseId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesGetAllLocationsByEnterprise' : function(EnterpriseId, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/assignments/listLocationsByEnterprise/{EnterpriseId}',
                                                    { 'EnterpriseId':  { value: EnterpriseId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookupFiles", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesTemplateExcel' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/regular/DeclarationTemplate',
                                         undefined, undefined, showSpin)
                },
                'ServicesTemplateExcelMineria' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/mineria/DeclarationTemplate',
                                         undefined, undefined, showSpin)
                },
                'ServicesEvaluacionTemplateExcelMineria' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/mineria/EvaluationTemplate',
                                         undefined, undefined, showSpin)
                },
                'ServicesTemplateExcelMineriaVidaLey' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/common/lookup/vidaley/DeclarationTemplate',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyConstancy", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesChangeStateConstancy' : function(entity, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/constancy/changeStateConstancy',
                                         entity, undefined, showSpin)
                },
                'ServicesListPagingConstancy' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/constancy/paging',
                                         filter, undefined, showSpin)
                },
                'ServicesSendMailReceiptConstancies' : function(entity, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/constancy/sendMail',
                                         entity, undefined, showSpin)
                },
                'ServicesDownloadExcelPayroll' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/constancy/downloadExcelPayroll',
                                         filter, undefined, showSpin)
                },
                'ServicesDownloadConstancy' : function(constancyNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/common/constancy/download/{constancyNumber}',
                                                    { 'constancyNumber':  { value: constancyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReports", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'EvaluationReportPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/reports/paging',
                                         filter, undefined, showSpin)
                },
                'EvaluationReportListPdf' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/reports/listEvaluation/pdf',
                                         undefined, undefined, showSpin)
                },
                'EvaluationReportListExcel' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/reports/listEvaluation/excel',
                                         undefined, undefined, showSpin)
                },
                'EvaluationReportListWord' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/reports/listEvaluation/word',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGenerateDeclarationMain", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'Declaration_Step1_ManualUpload' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/step1/upload/manual',
                                         declarationRp, undefined, showSpin)
                },
                'Declaration_Step1_ExcelUpload' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/step1/upload/excel',
                                         undefined, undefined, showSpin)
                },
                'ServicesDownloadErrorExcel' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/step1/download/error',
                                         undefined, undefined, showSpin)
                },
                'Declaration_Step2_GenerateConstancy' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/step2/save/generateConstancy',
                                         declarationRp, undefined, showSpin)
                },
                'ServiceRiskPrimaPlanillaPendienteDeclaracion' : function(declaration, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/risk/primaPlanillaPendiente',
                                         declaration, undefined, showSpin)
                },
                'DownloadPendingPayroll' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/main/risk/downloadPendingPayroll',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGenerateDeclarationPre", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesValidarCliente' : function(documentType, documentNumber, Rol, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/declaration/generate/pre/validarCliente/{documentType}/{documentNumber}/{Rol}',
                                                    { 'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' } ,'Rol':  { value: Rol, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ValidateApplicationPreDeclaration' : function(applications, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/pre/step1/validateApplication',
                                         applications, undefined, showSpin)
                },
                'Declaration_Step1_GetRisksLists' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/generate/pre/step1/initialConfigurations/getRisksLists',
                                         declarationRp, undefined, showSpin)
                },
                'GetRiskTypeList' : function(policyNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/declaration/generate/pre/getRiskTypeList?policyNumber={policyNumber}',
                                                    { 'policyNumber':  { value: policyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDeclarationRisk", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServiceRiskPrimaDeclaracion' : function(risks, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/risk/prima',
                                         risks, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDeclarationAdmin", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ListPlanilla' : function(entity, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/list/planilla',
                                         entity, undefined, showSpin)
                },
                'ServicesRePrintEmployees' : function(entity, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/constancy/reprint',
                                         entity, undefined, showSpin)
                },
                'ReimprimirConstanciaMasivo' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/constancy/reprint/massive',
                                         undefined, undefined, showSpin)
                },
                'RecoverPayrollAdmin_Replace_Step1_Selection' : function(payrollRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/replacePayroll/step1/select',
                                         payrollRp, undefined, showSpin)
                },
                'RecoverPayrollAdmin_Replace_Step2_Upload_Manual' : function(payrollRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/replacePayroll/step2/upload/manual',
                                         payrollRp, undefined, showSpin)
                },
                'RecoverPayrollAdmin_Replace_Step2_Upload_Excel' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/replacePayroll/step2/upload/excel',
                                         undefined, undefined, showSpin)
                },
                'RecoverPayrollAdmin_Replace_Step3_SaveReplace' : function(payrollRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/replacePayroll/step3/save/replace',
                                         payrollRp, undefined, showSpin)
                },
                'RecoverPayrollAdmin_Replace_Step3_SaveReplaceForMining' : function(payrollRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/replacePayroll/step3/save/replaceForMining',
                                         payrollRp, undefined, showSpin)
                },
                'NullifyApplications' : function(declarationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/declaration/admin/nullifyApplications',
                                         declarationRp, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEvaluations", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'Evaluations_DeleteEvaluation' : function(idFile, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/evaluations/deleteEvaluation/{idFile}',
                                                    { 'idFile':  { value: idFile, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Evaluations_EvaluationsPagingList' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/evaluations/EvaluationsPagingList',
                                         filter, undefined, showSpin)
                },
                'Evaluations_EvaluationsList' : function(idMedic, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/evaluations/EvaluationsList/{idMedic}',
                                                    { 'idMedic':  { value: idMedic, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Evaluations_DetailEvaluationPagingList' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/evaluations/DetailEvaluationsPagingList',
                                         filter, undefined, showSpin)
                },
                'Evaluations_DetailEvaluationList' : function(fileId, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/evaluations/DetailEvaluationsList/{fileId}',
                                                    { 'fileId':  { value: fileId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Evaluations_CreatePadronEvaluation' : function(evaluationRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/evaluations/CreatePadronEvaluation',
                                         evaluationRp, undefined, showSpin)
                },
                'Evaluations_CreatePadronMasivoEvaluation' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/evaluations/CreatePadronMasivoEvaluation',
                                         undefined, undefined, showSpin)
                },
                'ServicesEvaluationCapableTypeFilterList' : function( showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + 'api/mining/evaluations/capableTypeFilterList',
                                         undefined, undefined, showSpin)
                },
                'ServicesGetEvaluationsByEmployee' : function(documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/evaluations/getEvaluationsByEmployee/{documentType}/{documentNumber}',
                                                    { 'documentType':  { value: documentType, defaultValue:'' } ,'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ServicesGetEvaluationsByEmployeePaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/evaluations/getEvaluationsByEmployeePaging',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyConsults", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesConsults_GetCensusList' : function(censusSearchRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/consults/getCensusList',
                                         censusSearchRp, undefined, showSpin)
                },
                'ServicesConsults_GetCensusListPaging' : function(censusSearchRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/consults/getCensusListPaging',
                                         censusSearchRp, undefined, showSpin)
                },
                'ServicesConsults_GetCensusListByExcelUpload' : function( showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/consults/getCensusListByExcelUpload',
                                         undefined, undefined, showSpin)
                },
                'ServicesConsults_DownloadCensusMassive' : function(listCensus, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/consults/census/massive/download',
                                         listCensus, undefined, showSpin)
                },
                'UpdateCensus' : function(updateCensusRp, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/consults/UpdateCensus',
                                         updateCensusRp, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicy", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesPoliciesCompleteByClient' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/policy/policiescomplete/byClient',
                                         filter, undefined, showSpin)
                },
                'PolicyCancellationSupplementApplication' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/policy/cancellation/supplement/application',
                                         filter, undefined, showSpin)
                },
                'PolicyCancellationApplication' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/common/policy/cancellation/application',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedic", ['oimProxyNsctr', 'httpData', function(oimProxyNsctr, httpData){
        return {
                'ServicesPagingListMedic' : function(filter, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/medics/pagingListMedic',
                                         filter, undefined, showSpin)
                },
                'ServicesCreateMedic' : function(medic, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/medics/CreateMedic',
                                         medic, undefined, showSpin)
                },
                'ServicesUpdateMedic' : function(medic, showSpin){
                    return httpData['post'](oimProxyNsctr.endpoint + 'api/mining/maintenance/medics/UpdateMedic',
                                         medic, undefined, showSpin)
                },
                'ServicesGetMedicId' : function(MedicId, showSpin){
                    return httpData['get'](oimProxyNsctr.endpoint + helper.formatNamed('api/mining/maintenance/medics/getMedicByMedicId/{MedicId}',
                                                    { 'MedicId':  { value: MedicId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
