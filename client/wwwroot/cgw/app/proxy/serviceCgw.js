/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.cgw", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyCgw', {
        endpoint: constants.system.api.endpoints['cgw'],
        controllerDoctor: {
            actions : {
                'methodResource_Doctor_Get_Doctor':{
                    name:  'Resource_Doctor_Get_Doctor',
                    path: 'api/doctor/doctors'
                },
            }
        },
        controllerHighCosts: {
            actions : {
                'methodResource_GuaranteeLetter_Validate_SendAlert':{
                    name:  'Resource_GuaranteeLetter_Validate_SendAlert',
                    path: 'api/highcosts/validateSendAlert'
                },
                'methodResource_GuaranteeLetter_Send_DailyAlertResume':{
                    name:  'Resource_GuaranteeLetter_Send_DailyAlertResume',
                    path: 'api/highcosts/sendDailyAlertResume'
                },
                'methodResource_GuaranteeLetter_Get_High_Costs_Pacients':{
                    name:  'Resource_GuaranteeLetter_Get_High_Costs_Pacients',
                    path: 'api/highcosts/pacients/search'
                },
                'methodResource_GuaranteeLetter_Get_High_Costs_Pacients_Detail':{
                    name:  'Resource_GuaranteeLetter_Get_High_Costs_Pacients_Detail',
                    path: 'api/highcosts/pacients/detail'
                },
                'methodResource_GuaranteeLetter_Get_High_Costs_Pacients_Report':{
                    name:  'Resource_GuaranteeLetter_Get_High_Costs_Pacients_Report',
                    path: 'api/highcosts/pacients/report'
                },
                'methodResource_GuaranteeLetter_Get_High_Costs_Sinisters':{
                    name:  'Resource_GuaranteeLetter_Get_High_Costs_Sinisters',
                    path: 'api/highcosts/sinisters/search'
                },
                'methodResource_GuaranteeLetter_Get_High_Costs_Sinisters_Report':{
                    name:  'Resource_GuaranteeLetter_Get_High_Costs_Sinisters_Report',
                    path: 'api/highcosts/sinisters/report'
                },
                'methodResource_GuaranteeLetter_Get_All_EconomicsGroups':{
                    name:  'Resource_GuaranteeLetter_Get_All_EconomicsGroups',
                    path: 'api/highcosts/filters/getAllEconomicsGroups'
                },
                'methodResource_GuaranteeLetter_Get_Clients_By_EconomicGroup':{
                    name:  'Resource_GuaranteeLetter_Get_Clients_By_EconomicGroup',
                    path: 'api/highcosts/filters/getClientsByEconomicGroup'
                },
                'methodResource_GuaranteeLetter_Get_Contract_By_Client':{
                    name:  'Resource_GuaranteeLetter_Get_Contract_By_Client',
                    path: 'api/highcosts/filters/getContractByClient'
                },
                'methodResource_GuaranteeLetter_Get_Modality_By_Branch':{
                    name:  'Resource_GuaranteeLetter_Get_Modality_By_Branch',
                    path: 'api/highcosts/filters/getModalityByBranch'
                },
                'methodResource_GuaranteeLetter_Get_Product_By_Modality':{
                    name:  'Resource_GuaranteeLetter_Get_Product_By_Modality',
                    path: 'api/highcosts/filters/getProductByModality'
                },
                'methodResource_GuaranteeLetter_Get_SubProduct_By_Product':{
                    name:  'Resource_GuaranteeLetter_Get_SubProduct_By_Product',
                    path: 'api/highcosts/filters/getSubProductByProduct'
                },
                'methodResource_GuaranteeLetter_Get_Policy_By_Branch':{
                    name:  'Resource_GuaranteeLetter_Get_Policy_By_Branch',
                    path: 'api/highcosts/filters/getPolicyByBranch'
                },
                'methodResource_GuaranteeLetter_Get_Contract_By_Policy':{
                    name:  'Resource_GuaranteeLetter_Get_Contract_By_Policy',
                    path: 'api/highcosts/filters/getContractByPolicy'
                },
                'methodResource_GuaranteeLetter_Get_SubContract_By_Contract':{
                    name:  'Resource_GuaranteeLetter_Get_SubContract_By_Contract',
                    path: 'api/highcosts/filters/getSubContractByContract'
                },
                'methodResource_GuaranteeLetter_Get_Contractor':{
                    name:  'Resource_GuaranteeLetter_Get_Contractor',
                    path: 'api/highcosts/filters/getContractor'
                },
            }
        },
        controllerExternalAuditor: {
            actions : {
                'methodExternalAuditorSave':{
                    name:  'ExternalAuditorSave',
                    path: 'api/externalauditor'
                },
                'methodResource_ExternalAuditor_Delete':{
                    name:  'Resource_ExternalAuditor_Delete',
                    path: 'api/externalauditor/{codeProvider}'
                },
                'methodExternalAuditorGetList':{
                    name:  'ExternalAuditorGetList',
                    path: 'api/externalauditor'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodResource_CGW_Get_ListState':{
                    name:  'Resource_CGW_Get_ListState',
                    path: 'api/cgw/getState'
                },
                'methodGetVersion':{
                    name:  'GetVersion',
                    path: 'api/cgw/getVersion'
                },
            }
        },
        controllerMedicalCare: {
            actions : {
                'methodResource_MedicalCare_Get_Query':{
                    name:  'Resource_MedicalCare_Get_Query',
                    path: 'api/medicalCare/listMedicalCare'
                },
            }
        },
        controllerCompanies: {
            actions : {
                'methodResource_General_Get_ListRamos':{
                    name:  'Resource_General_Get_ListRamos',
                    path: 'api/companies/{idcompany}/branch'
                },
                'methodResource_General_Get_ListContrato':{
                    name:  'Resource_General_Get_ListContrato',
                    path: 'api/companies/{idcompany}/branch/{idbranch}/contracts'
                },
                'methodResource_General_Get_ListModalidad':{
                    name:  'Resource_General_Get_ListModalidad',
                    path: 'api/companies/{idcompany}/branch/{idbranch}/modalities'
                },
                'methodResource_General_Get_ListProdSalud':{
                    name:  'Resource_General_Get_ListProdSalud',
                    path: 'api/companies/{idcompany}/branch/{idbranch}/modalities/{idmodality}/healthproducts'
                },
                'methodResource_General_Get_ListSubProdSalud':{
                    name:  'Resource_General_Get_ListSubProdSalud',
                    path: 'api/companies/{idcompany}/branch/{idbranch}/modalities/{idmodality}/products/{idproduct}/healthsubproducts'
                },
            }
        },
        controllerAffiliate: {
            actions : {
                'methodResource_Affiliate_Get_AffiliateSeniority':{
                    name:  'Resource_Affiliate_Get_AffiliateSeniority',
                    path: 'api/affiliate/{ccmpnia}/{cafldo}/AffiliateSeniority/{PolizaContrato}/{cprdcto}'
                },
                'methodResource_Affiliate_Get_OncologyActivation':{
                    name:  'Resource_Affiliate_Get_OncologyActivation',
                    path: 'api/affiliate/{id}/OncologyActivation'
                },
                'methodResource_Affiliate_SearchByFullName':{
                    name:  'Resource_Affiliate_SearchByFullName',
                    path: 'api/affiliate/affiliates/search'
                },
                'methodResource_Affiliate_Load':{
                    name:  'Resource_Affiliate_Load',
                    path: 'api/affiliate/load'
                },
                'methodResource_Affiliate_Record':{
                    name:  'Resource_Affiliate_Record',
                    path: 'api/affiliate/record'
                },
                'methodResource_Affiliate_GetListBudgets':{
                    name:  'Resource_Affiliate_GetListBudgets',
                    path: 'api/affiliate/budget'
                },
                'methodResource_Affiliate_SearchQuickByFullName':{
                    name:  'Resource_Affiliate_SearchQuickByFullName',
                    path: 'api/affiliate/quick'
                },
                'methodResource_Affiliate_GetListPreexistence':{
                    name:  'Resource_Affiliate_GetListPreexistence',
                    path: 'api/affiliate/preexistence'
                },
                'methodResource_Affiliate_GetListAffiliateByPolicy':{
                    name:  'Resource_Affiliate_GetListAffiliateByPolicy',
                    path: 'api/affiliate/affiliatePolicy?licenseNumber={licenseNumber}&policyNumber={policyNumber}&accidentDate={accidentDate}&filterData={filterData}&numPage={numPage}'
                },
                'methodResource_Affiliate_UpdateAffiliatePolicy':{
                    name:  'Resource_Affiliate_UpdateAffiliatePolicy',
                    path: 'api/affiliate/affiliatePolicyUpdate'
                },
                'methodResource_Affiliate_DownloadPhoto':{
                    name:  'Resource_Affiliate_DownloadPhoto',
                    path: 'api/affiliate/photo/{codeCompany}/{codeAffiliate}'
                },
                'methodResource_Affiliate_ConsultImportantCustomer':{
                    name:  'Resource_Affiliate_ConsultImportantCustomer',
                    path: 'api/affiliate/consultImportantCustomer'
                },
                'methodResource_Affiliate_ConsultObservedInsured':{
                    name:  'Resource_Affiliate_ConsultObservedInsured',
                    path: 'api/affiliate/consultObservedInsured'
                },
                'methodResource_Affiliate_GetListComplaints':{
                    name:  'Resource_Affiliate_GetListComplaints',
                    path: 'api/affiliate/complaints'
                },
            }
        },
        controllerAttentionType: {
            actions : {
                'methodResource_AttentionType_Get_Type':{
                    name:  'Resource_AttentionType_Get_Type',
                    path: 'api/attention/getType'
                },
            }
        },
        controllerGeneral: {
            actions : {
                'methodResource_General_Get_ListCompany':{
                    name:  'Resource_General_Get_ListCompany',
                    path: 'api/general/companies'
                },
                'methodResource_General_Get_ListUserForced':{
                    name:  'Resource_General_Get_ListUserForced',
                    path: 'api/general/users/forzed'
                },
                'methodResource_General_Get_ListUserExecutive':{
                    name:  'Resource_General_Get_ListUserExecutive',
                    path: 'api/general/executive/getList'
                },
                'methodResource_General_Get_ListCobranzaType':{
                    name:  'Resource_General_Get_ListCobranzaType',
                    path: 'api/general/collection/state'
                },
                'methodResource_General_Get_ValueIGV':{
                    name:  'Resource_General_Get_ValueIGV',
                    path: 'api/general/igv'
                },
                'methodResource_General_Get_ListProduct':{
                    name:  'Resource_General_Get_ListProduct',
                    path: 'api/general/product'
                },
                'methodResource_General_Get_ListCurrency':{
                    name:  'Resource_General_Get_ListCurrency',
                    path: 'api/general/currency'
                },
                'methodResource_General_Wcf_EnviarEmail':{
                    name:  'Resource_General_Wcf_EnviarEmail',
                    path: 'api/general/wcfEnviaEmail'
                },
            }
        },
        controllerCoordinator: {
            actions : {
                'methodGetListCoordinatorByFilter':{
                    name:  'GetListCoordinatorByFilter',
                    path: 'api/coordinator?filter={filter}&size={size}&num={num}'
                },
                'methodResource_Coordinator_Clinic':{
                    name:  'Resource_Coordinator_Clinic',
                    path: 'api/coordinator/{id}/clinics?filter={filter}&assigned={assigned}&size={size}&num={num}'
                },
                'methodResource_Coordinator_RegisterClinic':{
                    name:  'Resource_Coordinator_RegisterClinic',
                    path: 'api/coordinator/{id}/clinics'
                },
                'methodResource_Coordinator_DeleteClinic':{
                    name:  'Resource_Coordinator_DeleteClinic',
                    path: 'api/coordinator/{id}/clinics/{cprvdr}/{nsucursal}'
                },
            }
        },
        controllerSinisterExistence: {
            actions : {
                'methodGetSinisterOpening':{
                    name:  'GetSinisterOpening',
                    path: 'api/sinisterexistence/sinisterexistence?ProductCode={ProductCode}&AccidentDate={AccidentDate}&ContractNumber={ContractNumber}&AffiliateCode={AffiliateCode}&LicenseNumber={LicenseNumber}'
                },
                'methodListSinisterOpening':{
                    name:  'ListSinisterOpening',
                    path: 'api/sinisterexistence/viewsinisterexistence?ProductCode={ProductCode}&AccidentDate={AccidentDate}&ContractNumber={ContractNumber}&AffiliateCode={AffiliateCode}&LicenseNumber={LicenseNumber}'
                },
            }
        },
        controllerCopay: {
            actions : {
                'methodResource_Copay_Get_Query':{
                    name:  'Resource_Copay_Get_Query',
                    path: 'api/copay/getCopayForced'
                },
                'methodResource_ListCopayForced_Get_Query':{
                    name:  'Resource_ListCopayForced_Get_Query',
                    path: 'api/copay/getListCopayForced'
                },
            }
        },
        controllerClient: {
            actions : {
                'methodResource_Client_Search':{
                    name:  'Resource_Client_Search',
                    path: 'api/client/quick'
                },
                'methodResource_Client_Priority_Save':{
                    name:  'Resource_Client_Priority_Save',
                    path: 'api/client/priority'
                },
                'methodResource_Client_Priority_Delete':{
                    name:  'Resource_Client_Priority_Delete',
                    path: 'api/client/priority/{code}'
                },
                'methodResource_Client_Priority_GetList':{
                    name:  'Resource_Client_Priority_GetList',
                    path: 'api/client/priority'
                },
                'methodExclusionesTemporales':{
                    name:  'ExclusionesTemporales',
                    path: 'api/client/listaExclusionesTemporales'
                },
            }
        },
        controllerGuaranteeLetter: {
            actions : {
                'methodAttachedDocumentSave':{
                    name:  'AttachedDocumentSave',
                    path: 'api/guaranteeletter'
                },
                'methodGetListAttachedDocument':{
                    name:  'GetListAttachedDocument',
                    path: 'api/guaranteeletter?year={year}&number={number}&version={version}'
                },
                'methodResource_AttachedDocumentRejection_Update':{
                    name:  'Resource_AttachedDocumentRejection_Update',
                    path: 'api/guaranteeletter/{id}/document/{documentId}'
                },
                'methodResource_AttachedDocumentRejection_get':{
                    name:  'Resource_AttachedDocumentRejection_get',
                    path: 'api/guaranteeletter/{id}/document/{documentId}?year={year}&version={version}'
                },
                'methodResource_GuaranteeLetter_SendPendingAlertScan':{
                    name:  'Resource_GuaranteeLetter_SendPendingAlertScan',
                    path: 'api/guaranteeletter/sendpendingalertscan'
                },
                'methodResource_GuaranteeLetter_Get_PrimaPending':{
                    name:  'Resource_GuaranteeLetter_Get_PrimaPending',
                    path: 'api/guaranteeletter/{year}/{id}/primapending'
                },
                'methodResource_GuaranteeLetter_Get_Conditioned':{
                    name:  'Resource_GuaranteeLetter_Get_Conditioned',
                    path: 'api/guaranteeletter/{year}/{id}/conditioned'
                },
                'methodResource_GuaranteeLetter_Save_Scan':{
                    name:  'Resource_GuaranteeLetter_Save_Scan',
                    path: 'api/guaranteeletter/{year}/{id}/scan'
                },
                'methodResource_GuaranteeLetter_Get_ClinicsScanbyCDandGL':{
                    name:  'Resource_GuaranteeLetter_Get_ClinicsScanbyCDandGL',
                    path: 'api/guaranteeletter/{year}/{id}/scan/coordinator/{coordinator}?size={size}&num={num}'
                },
                'methodResource_GuaranteeLetter_Get_TariffServices':{
                    name:  'Resource_GuaranteeLetter_Get_TariffServices',
                    path: 'api/guaranteeletter/{year}/{id}/tariff/services?size={size}&num={num}'
                },
                'methodResource_GuaranteeLetter_Get_TariffPackages':{
                    name:  'Resource_GuaranteeLetter_Get_TariffPackages',
                    path: 'api/guaranteeletter/{year}/{id}/tariff/packages?size={size}&num={num}'
                },
                'methodResource_GuaranteeLetter_Get_GetTrayScanData':{
                    name:  'Resource_GuaranteeLetter_Get_GetTrayScanData',
                    path: 'api/guaranteeletter/{year}/{id}/scan?filter={filter}&size={size}&num={num}'
                },
                'methodResource_GuaranteeLetter_Get_StatusFilter':{
                    name:  'Resource_GuaranteeLetter_Get_StatusFilter',
                    path: 'api/guaranteeletter/scan/statusfilter'
                },
                'methodResource_GuaranteeLetter_Save_ConcurrentScan':{
                    name:  'Resource_GuaranteeLetter_Save_ConcurrentScan',
                    path: 'api/guaranteeletter/{year}/{id}/scan/concurrent'
                },
                'methodResource_GuaranteeLetter_Get_CoordinatorsWithClinics':{
                    name:  'Resource_GuaranteeLetter_Get_CoordinatorsWithClinics',
                    path: 'api/guaranteeletter/{year}/{id}/coordinators/withclinics?filter={filter}&size={size}&num={num}'
                },
                'methodResource_GuaranteeLetter_Get_HighCostMedicine':{
                    name:  'Resource_GuaranteeLetter_Get_HighCostMedicine',
                    path: 'api/guaranteeletter/{year}/{id}/{version}/medicine/highcost'
                },
                'methodResource_GuaranteeLetter_Delete_HighCostMedicine':{
                    name:  'Resource_GuaranteeLetter_Delete_HighCostMedicine',
                    path: 'api/guaranteeletter/{year}/{id}/{version}/medicine/highcost/{CodMed}'
                },
                'methodResource_GuaranteeLetter_Save_HighCostMedicine':{
                    name:  'Resource_GuaranteeLetter_Save_HighCostMedicine',
                    path: 'api/guaranteeletter/{year}/{id}/{version}/medicine/highcost'
                },
                'methodResource_GuaranteeLetter_Get_QueryState':{
                    name:  'Resource_GuaranteeLetter_Get_QueryState',
                    path: 'api/guaranteeletter/states'
                },
                'methodResource_GuaranteeLetter_AttachFile_Get_MaxSize':{
                    name:  'Resource_GuaranteeLetter_AttachFile_Get_MaxSize',
                    path: 'api/guaranteeletter/attachfile/maxsize'
                },
                'methodResource_GuaranteeLetter_AttachFile_Get_ListFile':{
                    name:  'Resource_GuaranteeLetter_AttachFile_Get_ListFile',
                    path: 'api/guaranteeletter/attachfile'
                },
                'methodResource_GuaranteeLetter_AttachFile_Download':{
                    name:  'Resource_GuaranteeLetter_AttachFile_Download',
                    path: 'api/guaranteeletter/attachfile/download/{idFile}'
                },
                'methodResource_GuaranteeLetter_Budget_Get_List':{
                    name:  'Resource_GuaranteeLetter_Budget_Get_List',
                    path: 'api/guaranteeletter/budget'
                },
                'methodResource_GuaranteeLetter_Budget_Get_AllList':{
                    name:  'Resource_GuaranteeLetter_Budget_Get_AllList',
                    path: 'api/guaranteeletter/budget/all'
                },
                'methodResource_GuaranteeLetter_Budget_Get_ListDetail':{
                    name:  'Resource_GuaranteeLetter_Budget_Get_ListDetail',
                    path: 'api/guaranteeletter/budget/detail'
                },
                'methodResource_GuaranteeLetter_InternalRemark_Get_List':{
                    name:  'Resource_GuaranteeLetter_InternalRemark_Get_List',
                    path: 'api/guaranteeletter/internalremark/{codeCompany}/{year}/{number}/{version}'
                },
                'methodResource_GuaranteeLetter_InternalRemark_InternalRemarkSave':{
                    name:  'Resource_GuaranteeLetter_InternalRemark_InternalRemarkSave',
                    path: 'api/guaranteeletter/internalremark'
                },
                'methodResource_GuaranteeLetter_Search':{
                    name:  'Resource_GuaranteeLetter_Search',
                    path: 'api/guaranteeletter/search'
                },
                'methodResource_GuaranteeLetter_ExternalAuditSearch':{
                    name:  'Resource_GuaranteeLetter_ExternalAuditSearch',
                    path: 'api/guaranteeletter/externalaudit/search'
                },
                'methodUpdatePendingPayment':{
                    name:  'UpdatePendingPayment',
                    path: 'api/guaranteeletter/updatePendingPayment?company={company}&number={number}&year={year}&value={value}'
                },
                'methodResource_GuaranteeLetter_Load':{
                    name:  'Resource_GuaranteeLetter_Load',
                    path: 'api/guaranteeletter/load'
                },
                'methodResource_GuaranteeLetter_Save':{
                    name:  'Resource_GuaranteeLetter_Save',
                    path: 'api/guaranteeletter/save'
                },
                'methodResource_GuaranteeLetter_Correct_Obsertation':{
                    name:  'Resource_GuaranteeLetter_Correct_Obsertation',
                    path: 'api/guaranteeletter/correct/observation'
                },
                'methodResource_GuaranteeLetter_Generate_MedicalExtension':{
                    name:  'Resource_GuaranteeLetter_Generate_MedicalExtension',
                    path: 'api/guaranteeletter/generate/medicalextension'
                },
                'methodResource_GuaranteeLetter_Get_ReasonReject':{
                    name:  'Resource_GuaranteeLetter_Get_ReasonReject',
                    path: 'api/guaranteeletter/reasonreject/{codeCompany}'
                },
                'methodResource_GuaranteeLetter_Get_RejectDetail':{
                    name:  'Resource_GuaranteeLetter_Get_RejectDetail',
                    path: 'api/guaranteeletter/rejectdetail/{codeCompany}/{cmrchzo}'
                },
                'methodResource_GuaranteeLetter_Invoices_Get_List':{
                    name:  'Resource_GuaranteeLetter_Invoices_Get_List',
                    path: 'api/guaranteeletter/invoice'
                },
                'methodResource_GuaranteeLetter_RejectionLetter_UpdateSend':{
                    name:  'Resource_GuaranteeLetter_RejectionLetter_UpdateSend',
                    path: 'api/guaranteeletter/update/send'
                },
                'methodResource_GuaranteeLetter_RejectLetter_Download':{
                    name:  'Resource_GuaranteeLetter_RejectLetter_Download',
                    path: 'api/guaranteeletter/reject/download/{codeCompany}/{year}/{number}/{version}/{fileType}'
                },
                'methodResource_GuaranteeLetter_Download':{
                    name:  'Resource_GuaranteeLetter_Download',
                    path: 'api/guaranteeletter/download/{codeCompany}/{year}/{number}/{version}/{fileType}'
                },
                'methodResource_GuaranteeLetter_Update_Diagnostic':{
                    name:  'Resource_GuaranteeLetter_Update_Diagnostic',
                    path: 'api/guaranteeletter/update/diagnostic'
                },
                'methodResource_GuaranteeLetter_Update_Benefit':{
                    name:  'Resource_GuaranteeLetter_Update_Benefit',
                    path: 'api/guaranteeletter/update/benefit'
                },
                'methodResource_GuaranteeLetter_Update_Executive':{
                    name:  'Resource_GuaranteeLetter_Update_Executive',
                    path: 'api/guaranteeletter/update/executive'
                },
                'methodResource_GuaranteeLetter_Approve':{
                    name:  'Resource_GuaranteeLetter_Approve',
                    path: 'api/guaranteeletter/approve'
                },
                'methodResource_GuaranteeLetter_ApproveExecutive':{
                    name:  'Resource_GuaranteeLetter_ApproveExecutive',
                    path: 'api/guaranteeletter/approve/executive'
                },
                'methodResource_GuaranteeLetter_Reject':{
                    name:  'Resource_GuaranteeLetter_Reject',
                    path: 'api/guaranteeletter/reject'
                },
                'methodResource_GuaranteeLetter_Observe':{
                    name:  'Resource_GuaranteeLetter_Observe',
                    path: 'api/guaranteeletter/observe'
                },
                'methodResource_GuaranteeLetter_Cancel':{
                    name:  'Resource_GuaranteeLetter_Cancel',
                    path: 'api/guaranteeletter/cancel'
                },
                'methodResource_GuaranteeLetter_Report_Movements':{
                    name:  'Resource_GuaranteeLetter_Report_Movements',
                    path: 'api/guaranteeletter/report/movements'
                },
                'methodResource_GuaranteeLetter_Report_AffiliateAndIssuedate':{
                    name:  'Resource_GuaranteeLetter_Report_AffiliateAndIssuedate',
                    path: 'api/guaranteeletter/report/affiliate/issuedate'
                },
                'methodResource_GuaranteeLetter_Report_State':{
                    name:  'Resource_GuaranteeLetter_Report_State',
                    path: 'api/guaranteeletter/report/state'
                },
                'methodResource_GuaranteeLetter_Report_Affiliate':{
                    name:  'Resource_GuaranteeLetter_Report_Affiliate',
                    path: 'api/guaranteeletter/report/affiliate'
                },
                'methodResource_GuaranteeLetter_Report_Clinic':{
                    name:  'Resource_GuaranteeLetter_Report_Clinic',
                    path: 'api/guaranteeletter/report/clinic'
                },
                'methodResource_GuaranteeLetter_Report_IssueDate':{
                    name:  'Resource_GuaranteeLetter_Report_IssueDate',
                    path: 'api/guaranteeletter/report/issuedate'
                },
                'methodResource_GuaranteeLetter_Report_Situation':{
                    name:  'Resource_GuaranteeLetter_Report_Situation',
                    path: 'api/guaranteeletter/report/situation'
                },
                'methodResource_GuaranteeLetter_Report_Scan':{
                    name:  'Resource_GuaranteeLetter_Report_Scan',
                    path: 'api/guaranteeletter/report/scan/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Tray':{
                    name:  'Resource_GuaranteeLetter_Report_Tray',
                    path: 'api/guaranteeletter/report'
                },
                'methodResource_GuaranteeLetter_Report_Download_Movements':{
                    name:  'Resource_GuaranteeLetter_Report_Download_Movements',
                    path: 'api/guaranteeletter/report/movements/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_AffiliateAndIssuedate':{
                    name:  'Resource_GuaranteeLetter_Report_Download_AffiliateAndIssuedate',
                    path: 'api/guaranteeletter/report/affiliate/issuedate/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_State':{
                    name:  'Resource_GuaranteeLetter_Report_Download_State',
                    path: 'api/guaranteeletter/report/state/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_Affiliate':{
                    name:  'Resource_GuaranteeLetter_Report_Download_Affiliate',
                    path: 'api/guaranteeletter/report/affiliate/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_Clinic':{
                    name:  'Resource_GuaranteeLetter_Report_Download_Clinic',
                    path: 'api/guaranteeletter/report/clinic/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_IssueDate':{
                    name:  'Resource_GuaranteeLetter_Report_Download_IssueDate',
                    path: 'api/guaranteeletter/report/issuedate/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Download_Situation':{
                    name:  'Resource_GuaranteeLetter_Report_Download_Situation',
                    path: 'api/guaranteeletter/report/situation/download/{fileType}'
                },
                'methodResource_GuaranteeLetter_Report_Tray2':{
                    name:  'Resource_GuaranteeLetter_Report_Tray2',
                    path: 'api/guaranteeletter/report2'
                },
                'methodResource_GuaranteeLetter_SendMailPendingProcess':{
                    name:  'Resource_GuaranteeLetter_SendMailPendingProcess',
                    path: 'api/guaranteeletter/pending/process'
                },
                'methodResource_GuaranteeLetter_DeleteMailPendingProcess':{
                    name:  'Resource_GuaranteeLetter_DeleteMailPendingProcess',
                    path: 'api/guaranteeletter/pending/process/delete'
                },
                'methodResource_GuaranteeLetter_Get_ReasonAnulled':{
                    name:  'Resource_GuaranteeLetter_Get_ReasonAnulled',
                    path: 'api/guaranteeletter/reasonanulled'
                },
                'methodGetMaxAmountForMedic':{
                    name:  'GetMaxAmountForMedic',
                    path: 'api/guaranteeletter/maxamountformedic?codeCompany={codeCompany}&codeProduct={codeProduct}'
                },
                'methodResource_GuaranteeLetter_Complaint_ReasonReject':{
                    name:  'Resource_GuaranteeLetter_Complaint_ReasonReject',
                    path: 'api/guaranteeletter/complaint/reasonreject'
                },
                'methodResource_GuaranteeLetter_Complaint_ReasonFinalized':{
                    name:  'Resource_GuaranteeLetter_Complaint_ReasonFinalized',
                    path: 'api/guaranteeletter/complaint/reasonfinalized'
                },
                'methodResource_GuaranteeLetter_Complaint_Required':{
                    name:  'Resource_GuaranteeLetter_Complaint_Required',
                    path: 'api/guaranteeletter/complaintRequired?companyId={companyId}&providerId={providerId}&productId={productId}'
                },
                'methodResource_GuaranteeLetter_Send_Mail_Invalidez':{
                    name:  'Resource_GuaranteeLetter_Send_Mail_Invalidez',
                    path: 'api/guaranteeletter/sendMailInvalidez?year={year}&number={number}&version={version}'
                },
            }
        },
        controllerExternalAudit: {
            actions : {
                'methodGetExternalAudit':{
                    name:  'GetExternalAudit',
                    path: 'api/externalaudit'
                },
                'methodResource_ExternalAudit_GetExternalAuditVersion':{
                    name:  'Resource_ExternalAudit_GetExternalAuditVersion',
                    path: 'api/externalaudit/version'
                },
                'methodResource_ExternalAudit_Insert':{
                    name:  'Resource_ExternalAudit_Insert',
                    path: 'api/externalaudit/insert'
                },
                'methodResource_ExternalAudit_Update':{
                    name:  'Resource_ExternalAudit_Update',
                    path: 'api/externalaudit/update'
                },
                'methodResource_ExternalAudit_ReportUpdate':{
                    name:  'Resource_ExternalAudit_ReportUpdate',
                    path: 'api/externalaudit/report'
                },
                'methodApproveExternalAudit':{
                    name:  'ApproveExternalAudit',
                    path: 'api/externalaudit/approve'
                },
                'methodResource_ExternalAudit_Save':{
                    name:  'Resource_ExternalAudit_Save',
                    path: 'api/externalaudit/save'
                },
                'methodDownloadTemplate':{
                    name:  'DownloadTemplate',
                    path: 'api/externalaudit/template/{fileType}'
                },
                'methodResource_ExternalAudit_GetAllState':{
                    name:  'Resource_ExternalAudit_GetAllState',
                    path: 'api/externalaudit/state'
                },
                'methodResource_ExternalAudit_GetListAuditor':{
                    name:  'Resource_ExternalAudit_GetListAuditor',
                    path: 'api/externalaudit/auditor'
                },
                'methodResource_AttachFile_GetListFile':{
                    name:  'Resource_AttachFile_GetListFile',
                    path: 'api/externalaudit/attachfile'
                },
                'methodResource_AttachFile_Download':{
                    name:  'Resource_AttachFile_Download',
                    path: 'api/externalaudit/attachfile/download'
                },
                'methodResource_AttachFile_Delete':{
                    name:  'Resource_AttachFile_Delete',
                    path: 'api/externalaudit/attachfile/delete'
                },
            }
        },
        controllerMedicalAuditor: {
            actions : {
                'methodGetList':{
                    name:  'GetList',
                    path: 'api/medicalauditor'
                },
            }
        },
        controllerClinic: {
            actions : {
                'methodResource_Clinic_Get_ListClinic':{
                    name:  'Resource_Clinic_Get_ListClinic',
                    path: 'api/clinic/clinics?year={year}&number={number}'
                },
                'methodResource_Clinic_Get_ListClinicByFilter':{
                    name:  'Resource_Clinic_Get_ListClinicByFilter',
                    path: 'api/clinic/clinics'
                },
                'methodResource_Clinic_Get_PerCDCAndGL':{
                    name:  'Resource_Clinic_Get_PerCDCAndGL',
                    path: 'api/clinic/guaranteeletter/{year}/{id}/coordinator/{coordinator}?size={size}&num={num}'
                },
                'methodResource_Clinic_Get_ListBranchClinicByRuc':{
                    name:  'Resource_Clinic_Get_ListBranchClinicByRuc',
                    path: 'api/clinic/branchclinics/{ruc}'
                },
            }
        },
        controllerCoverageMinsa: {
            actions : {
                'methodSaveCoverageMinsa':{
                    name:  'SaveCoverageMinsa',
                    path: 'api/coverageminsa/saveCoverageMinsa'
                },
                'methodCoverageMinsaGetAll':{
                    name:  'CoverageMinsaGetAll',
                    path: 'api/coverageminsa/coverageminsa'
                },
                'methodGetLogCoverageMinsa':{
                    name:  'GetLogCoverageMinsa',
                    path: 'api/coverageminsa/getlogcoverage?TypeAttention={TypeAttention}'
                },
            }
        },
        controllerSumAssured: {
            actions : {
                'methodGetSumAssuredTray':{
                    name:  'GetSumAssuredTray',
                    path: 'api/assuredsum?cbnfco={cbnfco}&cdgnstco={cdgnstco}&size={size}&num={num}'
                },
                'methodResource_SumAssured_GetByID':{
                    name:  'Resource_SumAssured_GetByID',
                    path: 'api/assuredsum/{id}'
                },
                'methodSaveSumAssured':{
                    name:  'SaveSumAssured',
                    path: 'api/assuredsum'
                },
                'methodResource_SumAssured_Update':{
                    name:  'Resource_SumAssured_Update',
                    path: 'api/assuredsum/{id}'
                },
                'methodResource_SumAssured_Delete':{
                    name:  'Resource_SumAssured_Delete',
                    path: 'api/assuredsum/{id}'
                },
            }
        },
        controllerCgwSecurity: {
            actions : {
                'methodResource_Cgw_Security_GetTicketUser':{
                    name:  'Resource_Cgw_Security_GetTicketUser',
                    path: 'api/security/ticket'
                },
                'methodResource_Cgw_Security_GetRole':{
                    name:  'Resource_Cgw_Security_GetRole',
                    path: 'api/security/role/{groupApplication}'
                },
            }
        },
        controllerMedicine: {
            actions : {
                'methodResource_HighCostMedicine_GetMedicineTray':{
                    name:  'Resource_HighCostMedicine_GetMedicineTray',
                    path: 'api/medicine/highcost?filter={filter}&size={size}&num={num}'
                },
                'methodResource_HighCostMedicine_GetContactTray':{
                    name:  'Resource_HighCostMedicine_GetContactTray',
                    path: 'api/medicine/highcost/contact?filter={filter}&size={size}&num={num}'
                },
                'methodResource_HighCostMedicine_SaveContact':{
                    name:  'Resource_HighCostMedicine_SaveContact',
                    path: 'api/medicine/highcost/contact'
                },
                'methodResource_HighCostMedicine_UpdateContact':{
                    name:  'Resource_HighCostMedicine_UpdateContact',
                    path: 'api/medicine/highcost/contact/{id}'
                },
                'methodResource_HighCostMedicine_DeleteContact':{
                    name:  'Resource_HighCostMedicine_DeleteContact',
                    path: 'api/medicine/highcost/contact/{id}'
                },
            }
        },
        controllerCoverage: {
            actions : {
                'methodGetListByFilter':{
                    name:  'GetListByFilter',
                    path: 'api/coverage?filter={filter}&codcia={codcia}'
                },
            }
        },
        controllerUITInfo: {
            actions : {
                'methodGetUitValue':{
                    name:  'GetUitValue',
                    path: 'api/uitinfo/uitvalue'
                },
            }
        },
        controllerProduct: {
            actions : {
                'methodResource_Product_Coverage_GetListByProduct':{
                    name:  'Resource_Product_Coverage_GetListByProduct',
                    path: 'api/product/coverage/{productCode}'
                },
                'methodResource_Product_Coverage_GetListByProductAndPolicy':{
                    name:  'Resource_Product_Coverage_GetListByProductAndPolicy',
                    path: 'api/product/coverage/car/{companyCode}/{policyNumber}'
                },
            }
        },
        controllerConditioned: {
            actions : {
                'methodGetConditionedTray':{
                    name:  'GetConditionedTray',
                    path: 'api/exclusioncondition?filter={filter}&size={size}&num={num}'
                },
                'methodResource_Conditioned_GetByID':{
                    name:  'Resource_Conditioned_GetByID',
                    path: 'api/exclusioncondition/{id}'
                },
                'methodSaveConditioned':{
                    name:  'SaveConditioned',
                    path: 'api/exclusioncondition'
                },
                'methodResource_Conditioned_Update':{
                    name:  'Resource_Conditioned_Update',
                    path: 'api/exclusioncondition/{id}'
                },
                'methodResource_Conditioned_Delete':{
                    name:  'Resource_Conditioned_Delete',
                    path: 'api/exclusioncondition/{id}'
                },
            }
        },
        controllerInternalRemark: {
            actions : {
                'methodResource_InternalRemark_GetList_Common':{
                    name:  'Resource_InternalRemark_GetList_Common',
                    path: 'api/internalremark/common'
                },
            }
        },
        controllerExecutive: {
            actions : {
                'methodResource_Executive_GetExecutiveByClinic':{
                    name:  'Resource_Executive_GetExecutiveByClinic',
                    path: 'api/executive/clinic/{cproveedor}/{sucursal}'
                },
                'methodResource_Executive_GetList':{
                    name:  'Resource_Executive_GetList',
                    path: 'api/executive/executives'
                },
                'methodGetListExecutiveByFilter':{
                    name:  'GetListExecutiveByFilter',
                    path: 'api/executive?filter={filter}&size={size}&num={num}'
                },
                'methodResource_Executive_GetAllAssigned':{
                    name:  'Resource_Executive_GetAllAssigned',
                    path: 'api/executive/AllAssigned'
                },
                'methodResource_Executive_ClinicNoAssigned':{
                    name:  'Resource_Executive_ClinicNoAssigned',
                    path: 'api/executive/clinics?filter={filter}'
                },
                'methodResource_Executive_Clinic':{
                    name:  'Resource_Executive_Clinic',
                    path: 'api/executive/{id}/clinics?filter={filter}&size={size}&num={num}'
                },
                'methodResource_Executive_Diagnostic':{
                    name:  'Resource_Executive_Diagnostic',
                    path: 'api/executive/{id}/diagnostics?filter={filter}&size={size}&num={num}'
                },
                'methodResource_Executive_RegisterClinic':{
                    name:  'Resource_Executive_RegisterClinic',
                    path: 'api/executive/{id}/clinics'
                },
                'methodResource_Executive_DeleteClinic':{
                    name:  'Resource_Executive_DeleteClinic',
                    path: 'api/executive/{id}/clinics/{cprvdr}/{nsucursal}'
                },
                'methodResource_Executive_RegisterDiagnostic':{
                    name:  'Resource_Executive_RegisterDiagnostic',
                    path: 'api/executive/{id}/diagnostics'
                },
                'methodResource_Executive_DeleteDiagnostic':{
                    name:  'Resource_Executive_DeleteDiagnostic',
                    path: 'api/executive/{id}/diagnostic/{cdgnstco}'
                },
            }
        },
        controllerPolicySoat: {
            actions : {
                'methodGetPolicySoatBy':{
                    name:  'GetPolicySoatBy',
                    path: 'api/policySoat/GetSoat?plateNumber={plateNumber}&accidentDate={accidentDate}'
                },
            }
        },
        controllerEps: {
            actions : {
                'methodResource_Eps_Get_ListTypePerson':{
                    name:  'Resource_Eps_Get_ListTypePerson',
                    path: 'api/eps/typeperson'
                },
                'methodResource_Eps_Get_ListTypeDocument':{
                    name:  'Resource_Eps_Get_ListTypeDocument',
                    path: 'api/eps/typedocument'
                },
            }
        },
        controllerDiagnostic: {
            actions : {
                'methodResource_Diagnostic_Get_Diagnostic':{
                    name:  'Resource_Diagnostic_Get_Diagnostic',
                    path: 'api/diagnostic/diagnostics'
                },
                'methodResource_Diagnostic_GetList_Diagnostic':{
                    name:  'Resource_Diagnostic_GetList_Diagnostic',
                    path: 'api/diagnostic/quick'
                },
                'methodResource_Diagnostic_Priority_Save':{
                    name:  'Resource_Diagnostic_Priority_Save',
                    path: 'api/diagnostic/priority'
                },
                'methodResource_Diagnostic_Priority_Delete':{
                    name:  'Resource_Diagnostic_Priority_Delete',
                    path: 'api/diagnostic/priority/{code}'
                },
                'methodResource_Diagnostic_Priority_GetList':{
                    name:  'Resource_Diagnostic_Priority_GetList',
                    path: 'api/diagnostic/priority'
                },
            }
        }
    })



     module.factory("proxyDoctor", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Doctor_Get_Doctor' : function(doctorSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/doctor/doctors',
                                         doctorSearch, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyHighCosts", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_GuaranteeLetter_Validate_SendAlert' : function(highCostsReq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/validateSendAlert',
                                         highCostsReq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Send_DailyAlertResume' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/sendDailyAlertResume',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_High_Costs_Pacients' : function(highCostPacientSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/pacients/search',
                                         highCostPacientSearch, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_High_Costs_Pacients_Detail' : function(highCostPacientSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/pacients/detail',
                                         highCostPacientSearch, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_High_Costs_Pacients_Report' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/pacients/report',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_High_Costs_Sinisters' : function(highCostSinisterSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/sinisters/search',
                                         highCostSinisterSearch, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_High_Costs_Sinisters_Report' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/sinisters/report',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_All_EconomicsGroups' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getAllEconomicsGroups',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Clients_By_EconomicGroup' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getClientsByEconomicGroup',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Contract_By_Client' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getContractByClient',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Modality_By_Branch' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getModalityByBranch',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Product_By_Modality' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getProductByModality',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_SubProduct_By_Product' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getSubProductByProduct',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Policy_By_Branch' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getPolicyByBranch',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Contract_By_Policy' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getContractByPolicy',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_SubContract_By_Contract' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getSubContractByContract',
                                         parameters, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Contractor' : function(parameters, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/highcosts/filters/getContractor',
                                         parameters, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyExternalAuditor", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'ExternalAuditorSave' : function(externalAuditorRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalauditor',
                                         externalAuditorRq, undefined, showSpin)
                },
                'Resource_ExternalAuditor_Delete' : function(codeProvider, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/externalauditor/{codeProvider}',
                                                    { 'codeProvider':  { value: codeProvider, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ExternalAuditorGetList' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/externalauditor',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_CGW_Get_ListState' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/cgw/getState',
                                         undefined, undefined, showSpin)
                },
                'GetVersion' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/cgw/getVersion',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedicalCare", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_MedicalCare_Get_Query' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/medicalCare/listMedicalCare',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCompanies", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_General_Get_ListRamos' : function(idcompany, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/companies/{idcompany}/branch',
                                                    { 'idcompany':  { value: idcompany, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListContrato' : function(idcompany, idbranch, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/companies/{idcompany}/branch/{idbranch}/contracts',
                                                    { 'idcompany':  { value: idcompany, defaultValue:'' } ,'idbranch':  { value: idbranch, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListModalidad' : function(idcompany, idbranch, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/companies/{idcompany}/branch/{idbranch}/modalities',
                                                    { 'idcompany':  { value: idcompany, defaultValue:'' } ,'idbranch':  { value: idbranch, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListProdSalud' : function(idcompany, idbranch, idmodality, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/companies/{idcompany}/branch/{idbranch}/modalities/{idmodality}/healthproducts',
                                                    { 'idcompany':  { value: idcompany, defaultValue:'' } ,'idbranch':  { value: idbranch, defaultValue:'' } ,'idmodality':  { value: idmodality, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListSubProdSalud' : function(idcompany, idbranch, idmodality, idproduct, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/companies/{idcompany}/branch/{idbranch}/modalities/{idmodality}/products/{idproduct}/healthsubproducts',
                                                    { 'idcompany':  { value: idcompany, defaultValue:'' } ,'idbranch':  { value: idbranch, defaultValue:'' } ,'idmodality':  { value: idmodality, defaultValue:'' } ,'idproduct':  { value: idproduct, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAffiliate", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Affiliate_Get_AffiliateSeniority' : function(ccmpnia, cafldo, PolizaContrato, cprdcto, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/affiliate/{ccmpnia}/{cafldo}/AffiliateSeniority/{PolizaContrato}/{cprdcto}',
                                                    { 'ccmpnia':  { value: ccmpnia, defaultValue:'' } ,'cafldo':  { value: cafldo, defaultValue:'' } ,'PolizaContrato':  { value: PolizaContrato, defaultValue:'' } ,'cprdcto':  { value: cprdcto, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Affiliate_Get_OncologyActivation' : function(id, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/affiliate/{id}/OncologyActivation',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Affiliate_SearchByFullName' : function(affiliateSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/affiliates/search',
                                         affiliateSearch, undefined, showSpin)
                },
                'Resource_Affiliate_Load' : function(affiliateLoad, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/load',
                                         affiliateLoad, undefined, showSpin)
                },
                'Resource_Affiliate_Record' : function(affiliateRecord, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/record',
                                         affiliateRecord, undefined, showSpin)
                },
                'Resource_Affiliate_GetListBudgets' : function(budgetSearchRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/budget',
                                         budgetSearchRq, undefined, showSpin)
                },
                'Resource_Affiliate_SearchQuickByFullName' : function(basicInfoRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/quick',
                                         basicInfoRq, undefined, showSpin)
                },
                'Resource_Affiliate_GetListPreexistence' : function(affiliateRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/preexistence',
                                         affiliateRq, undefined, showSpin)
                },
                'Resource_Affiliate_GetListAffiliateByPolicy' : function(licenseNumber, policyNumber, accidentDate, filterData, numPage, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/affiliate/affiliatePolicy?licenseNumber={licenseNumber}&policyNumber={policyNumber}&accidentDate={accidentDate}&filterData={filterData}&numPage={numPage}',
                                                    { 'licenseNumber':  { value: licenseNumber, defaultValue:'' } ,'policyNumber':  { value: policyNumber, defaultValue:'' } ,'accidentDate':  { value: accidentDate, defaultValue:'' } ,'filterData':  { value: filterData, defaultValue:'' } ,'numPage':  { value: numPage, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Affiliate_UpdateAffiliatePolicy' : function(affiliatePolicyRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/affiliatePolicyUpdate',
                                         affiliatePolicyRq, undefined, showSpin)
                },
                'Resource_Affiliate_DownloadPhoto' : function(codeCompany, codeAffiliate, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/affiliate/photo/{codeCompany}/{codeAffiliate}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'codeAffiliate':  { value: codeAffiliate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Affiliate_ConsultImportantCustomer' : function(request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/consultImportantCustomer',
                                         request, undefined, showSpin)
                },
                'Resource_Affiliate_ConsultObservedInsured' : function(request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/consultObservedInsured',
                                         request, undefined, showSpin)
                },
                'Resource_Affiliate_GetListComplaints' : function(request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/affiliate/complaints',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAttentionType", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_AttentionType_Get_Type' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/attention/getType',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGeneral", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_General_Get_ListCompany' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/companies',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListUserForced' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/users/forzed',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListUserExecutive' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/executive/getList',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListCobranzaType' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/collection/state',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ValueIGV' : function(igvRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/general/igv',
                                         igvRq, undefined, showSpin)
                },
                'Resource_General_Get_ListProduct' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/product',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Get_ListCurrency' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/general/currency',
                                         undefined, undefined, showSpin)
                },
                'Resource_General_Wcf_EnviarEmail' : function(body, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/general/wcfEnviaEmail',
                                         body, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCoordinator", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetListCoordinatorByFilter' : function(filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/coordinator?filter={filter}&size={size}&num={num}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Coordinator_Clinic' : function(id, filter, assigned, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/coordinator/{id}/clinics?filter={filter}&assigned={assigned}&size={size}&num={num}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' } ,'assigned':  { value: assigned, defaultValue:'true' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Coordinator_RegisterClinic' : function(id, request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/coordinator/{id}/clinics',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_Coordinator_DeleteClinic' : function(id, cprvdr, nsucursal, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/coordinator/{id}/clinics/{cprvdr}/{nsucursal}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'cprvdr':  { value: cprvdr, defaultValue:'' } ,'nsucursal':  { value: nsucursal, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinisterExistence", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetSinisterOpening' : function(ProductCode, AccidentDate, ContractNumber, AffiliateCode, LicenseNumber, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/sinisterexistence/sinisterexistence?ProductCode={ProductCode}&AccidentDate={AccidentDate}&ContractNumber={ContractNumber}&AffiliateCode={AffiliateCode}&LicenseNumber={LicenseNumber}',
                                                    { 'ProductCode':  { value: ProductCode, defaultValue:'' } ,'AccidentDate':  { value: AccidentDate, defaultValue:'' } ,'ContractNumber':  { value: ContractNumber, defaultValue:'' } ,'AffiliateCode':  { value: AffiliateCode, defaultValue:'' } ,'LicenseNumber':  { value: LicenseNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'ListSinisterOpening' : function(ProductCode, AccidentDate, ContractNumber, AffiliateCode, LicenseNumber, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/sinisterexistence/viewsinisterexistence?ProductCode={ProductCode}&AccidentDate={AccidentDate}&ContractNumber={ContractNumber}&AffiliateCode={AffiliateCode}&LicenseNumber={LicenseNumber}',
                                                    { 'ProductCode':  { value: ProductCode, defaultValue:'' } ,'AccidentDate':  { value: AccidentDate, defaultValue:'' } ,'ContractNumber':  { value: ContractNumber, defaultValue:'' } ,'AffiliateCode':  { value: AffiliateCode, defaultValue:'' } ,'LicenseNumber':  { value: LicenseNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCopay", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Copay_Get_Query' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/copay/getCopayForced',
                                         undefined, undefined, showSpin)
                },
                'Resource_ListCopayForced_Get_Query' : function(copayForcedSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/copay/getListCopayForced',
                                         copayForcedSearch, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClient", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Client_Search' : function(clientSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/client/quick',
                                         clientSearch, undefined, showSpin)
                },
                'Resource_Client_Priority_Save' : function(clientPriorityRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/client/priority',
                                         clientPriorityRq, undefined, showSpin)
                },
                'Resource_Client_Priority_Delete' : function(code, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/client/priority/{code}',
                                                    { 'code':  { value: code, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Client_Priority_GetList' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/client/priority',
                                         undefined, undefined, showSpin)
                },
                'ExclusionesTemporales' : function(exclusiones, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/client/listaExclusionesTemporales',
                                         exclusiones, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGuaranteeLetter", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'AttachedDocumentSave' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter',
                                         undefined, undefined, showSpin)
                },
                'GetListAttachedDocument' : function(year, number, version, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter?year={year}&number={number}&version={version}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'version':  { value: version, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachedDocumentRejection_Update' : function(id, documentId, request, showSpin){
                    return httpData['put'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{id}/document/{documentId}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'documentId':  { value: documentId, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_AttachedDocumentRejection_get' : function(year, id, version, documentId, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{id}/document/{documentId}?year={year}&version={version}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'version':  { value: version, defaultValue:'' } ,'documentId':  { value: documentId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_SendPendingAlertScan' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/sendpendingalertscan',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_PrimaPending' : function(year, id, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/primapending',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_Conditioned' : function(year, id, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/conditioned',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Save_Scan' : function(year, id, request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/scan',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_ClinicsScanbyCDandGL' : function(year, id, coordinator, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/scan/coordinator/{coordinator}?size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'coordinator':  { value: coordinator, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_TariffServices' : function(year, id, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/tariff/services?size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_TariffPackages' : function(year, id, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/tariff/packages?size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_GetTrayScanData' : function(year, id, filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/scan?filter={filter}&size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_StatusFilter' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/scan/statusfilter',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Save_ConcurrentScan' : function(year, id, request, showSpin){
                    return httpData['patch'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/scan/concurrent',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_CoordinatorsWithClinics' : function(year, id, filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/coordinators/withclinics?filter={filter}&size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_HighCostMedicine' : function(year, id, version, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/{version}/medicine/highcost',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'version':  { value: version, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Delete_HighCostMedicine' : function(year, id, version, CodMed, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/{version}/medicine/highcost/{CodMed}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'version':  { value: version, defaultValue:'' } ,'CodMed':  { value: CodMed, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Save_HighCostMedicine' : function(year, id, version, ListMed, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/{year}/{id}/{version}/medicine/highcost',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'version':  { value: version, defaultValue:'' }  }),
                                         ListMed, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_QueryState' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/states',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_AttachFile_Get_MaxSize' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/attachfile/maxsize',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_AttachFile_Get_ListFile' : function(guaranteeLetterLoadRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/attachfile',
                                         guaranteeLetterLoadRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_AttachFile_Download' : function(idFile, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/attachfile/download/{idFile}',
                                                    { 'idFile':  { value: idFile, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Budget_Get_List' : function(guaranteeLetterLoadRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/budget',
                                         guaranteeLetterLoadRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Budget_Get_AllList' : function(guaranteeLetterLoadRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/budget/all',
                                         guaranteeLetterLoadRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Budget_Get_ListDetail' : function(guaranteeLetterLoadRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/budget/detail',
                                         guaranteeLetterLoadRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_InternalRemark_Get_List' : function(codeCompany, year, number, version, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/internalremark/{codeCompany}/{year}/{number}/{version}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'year':  { value: year, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'version':  { value: version, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_InternalRemark_InternalRemarkSave' : function(remarkInternalSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/internalremark',
                                         remarkInternalSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Search' : function(guaranteeLetterSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/search',
                                         guaranteeLetterSearch, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_ExternalAuditSearch' : function(guaranteeLetterSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/externalaudit/search',
                                         guaranteeLetterSearch, undefined, showSpin)
                },
                'UpdatePendingPayment' : function(company, number, year, value, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/updatePendingPayment?company={company}&number={number}&year={year}&value={value}',
                                                    { 'company':  { value: company, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'year':  { value: year, defaultValue:'' } ,'value':  { value: value, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Load' : function(guaranteeLetterLoad, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/load',
                                         guaranteeLetterLoad, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Save' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/save',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Correct_Obsertation' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/correct/observation',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Generate_MedicalExtension' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/generate/medicalextension',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_ReasonReject' : function(codeCompany, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/reasonreject/{codeCompany}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_RejectDetail' : function(codeCompany, cmrchzo, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/rejectdetail/{codeCompany}/{cmrchzo}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'cmrchzo':  { value: cmrchzo, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Invoices_Get_List' : function(invoiceRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/invoice',
                                         invoiceRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_RejectionLetter_UpdateSend' : function(guaranteeLetter, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/update/send',
                                         guaranteeLetter, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_RejectLetter_Download' : function(codeCompany, year, number, version, fileType, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/reject/download/{codeCompany}/{year}/{number}/{version}/{fileType}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'year':  { value: year, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'version':  { value: version, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Download' : function(codeCompany, year, number, version, fileType, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/download/{codeCompany}/{year}/{number}/{version}/{fileType}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'year':  { value: year, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'version':  { value: version, defaultValue:'' } ,'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Update_Diagnostic' : function(diagnosticRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/update/diagnostic',
                                         diagnosticRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Update_Benefit' : function(benefitRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/update/benefit',
                                         benefitRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Update_Executive' : function(guaranteeLetterExecutiveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/update/executive',
                                         guaranteeLetterExecutiveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Approve' : function(guaranteeLetterSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/approve',
                                         guaranteeLetterSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_ApproveExecutive' : function(guaranteeLetterSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/approve/executive',
                                         guaranteeLetterSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Reject' : function(guaranteeLetterSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/reject',
                                         guaranteeLetterSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Observe' : function(guaranteeLetterSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/observe',
                                         guaranteeLetterSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Cancel' : function(guaranteeLetterSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/cancel',
                                         guaranteeLetterSaveRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Movements' : function(movementRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/movements',
                                         movementRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_AffiliateAndIssuedate' : function(affiliateAndIssueDateRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/affiliate/issuedate',
                                         affiliateAndIssueDateRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_State' : function(stateRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/state',
                                         stateRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Affiliate' : function(affiliateRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/affiliate',
                                         affiliateRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Clinic' : function(clinicRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/clinic',
                                         clinicRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_IssueDate' : function(issueDateRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/issuedate',
                                         issueDateRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Situation' : function(situationRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report/situation',
                                         situationRq, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Scan' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/scan/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Tray' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/guaranteeletter/report',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_Movements' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/movements/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_AffiliateAndIssuedate' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/affiliate/issuedate/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_State' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/state/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_Affiliate' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/affiliate/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_Clinic' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/clinic/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_IssueDate' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/issuedate/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Download_Situation' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/report/situation/download/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Report_Tray2' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/report2',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_SendMailPendingProcess' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/pending/process',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_DeleteMailPendingProcess' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/pending/process/delete',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Get_ReasonAnulled' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/reasonanulled',
                                         undefined, undefined, showSpin)
                },
                'GetMaxAmountForMedic' : function(codeCompany, codeProduct, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/maxamountformedic?codeCompany={codeCompany}&codeProduct={codeProduct}',
                                                    { 'codeCompany':  { value: codeCompany, defaultValue:'' } ,'codeProduct':  { value: codeProduct, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Complaint_ReasonReject' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/complaint/reasonreject',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Complaint_ReasonFinalized' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/guaranteeletter/complaint/reasonfinalized',
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Complaint_Required' : function(companyId, providerId, productId, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/complaintRequired?companyId={companyId}&providerId={providerId}&productId={productId}',
                                                    { 'companyId':  { value: companyId, defaultValue:'' } ,'providerId':  { value: providerId, defaultValue:'' } ,'productId':  { value: productId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_GuaranteeLetter_Send_Mail_Invalidez' : function(body, year, number, version, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/guaranteeletter/sendMailInvalidez?year={year}&number={number}&version={version}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'number':  { value: number, defaultValue:'' } ,'version':  { value: version, defaultValue:'' }  }),
                                         body, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyExternalAudit", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetExternalAudit' : function(externalAuditSearchRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit',
                                         externalAuditSearchRq, undefined, showSpin)
                },
                'Resource_ExternalAudit_GetExternalAuditVersion' : function(externalAuditSearchRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/version',
                                         externalAuditSearchRq, undefined, showSpin)
                },
                'Resource_ExternalAudit_Insert' : function(externalAuditSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/insert',
                                         externalAuditSaveRq, undefined, showSpin)
                },
                'Resource_ExternalAudit_Update' : function(externalAuditSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/update',
                                         externalAuditSaveRq, undefined, showSpin)
                },
                'Resource_ExternalAudit_ReportUpdate' : function(externalAuditSaveRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/report',
                                         externalAuditSaveRq, undefined, showSpin)
                },
                'ApproveExternalAudit' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/approve',
                                         undefined, undefined, showSpin)
                },
                'Resource_ExternalAudit_Save' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/save',
                                         undefined, undefined, showSpin)
                },
                'DownloadTemplate' : function(fileType, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/externalaudit/template/{fileType}',
                                                    { 'fileType':  { value: fileType, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_ExternalAudit_GetAllState' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/externalaudit/state',
                                         undefined, undefined, showSpin)
                },
                'Resource_ExternalAudit_GetListAuditor' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/externalaudit/auditor',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_GetListFile' : function(externalAuditSearchRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/attachfile',
                                         externalAuditSearchRq, undefined, showSpin)
                },
                'Resource_AttachFile_Download' : function( showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/attachfile/download',
                                         undefined, undefined, showSpin)
                },
                'Resource_AttachFile_Delete' : function(externalAuditAttachFileDownloadRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/externalaudit/attachfile/delete',
                                         externalAuditAttachFileDownloadRq, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedicalAuditor", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetList' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/medicalauditor',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyClinic", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Clinic_Get_ListClinic' : function(year, number, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/clinic/clinics?year={year}&number={number}',
                                                    { 'year':  { value: year, defaultValue:'1' } ,'number':  { value: number, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Clinic_Get_ListClinicByFilter' : function(clinicSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/clinic/clinics',
                                         clinicSearch, undefined, showSpin)
                },
                'Resource_Clinic_Get_PerCDCAndGL' : function(year, id, coordinator, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/clinic/guaranteeletter/{year}/{id}/coordinator/{coordinator}?size={size}&num={num}',
                                                    { 'year':  { value: year, defaultValue:'' } ,'id':  { value: id, defaultValue:'' } ,'coordinator':  { value: coordinator, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Clinic_Get_ListBranchClinicByRuc' : function(ruc, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/clinic/branchclinics/{ruc}',
                                                    { 'ruc':  { value: ruc, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCoverageMinsa", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'SaveCoverageMinsa' : function(coverageMinsaRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/coverageminsa/saveCoverageMinsa',
                                         coverageMinsaRq, undefined, showSpin)
                },
                'CoverageMinsaGetAll' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/coverageminsa/coverageminsa',
                                         undefined, undefined, showSpin)
                },
                'GetLogCoverageMinsa' : function(TypeAttention, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/coverageminsa/getlogcoverage?TypeAttention={TypeAttention}',
                                                    { 'TypeAttention':  { value: TypeAttention, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySumAssured", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetSumAssuredTray' : function(cbnfco, cdgnstco, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/assuredsum?cbnfco={cbnfco}&cdgnstco={cdgnstco}&size={size}&num={num}',
                                                    { 'cbnfco':  { value: cbnfco, defaultValue:'' } ,'cdgnstco':  { value: cdgnstco, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_SumAssured_GetByID' : function(id, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/assuredsum/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveSumAssured' : function(sumAssured, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/assuredsum',
                                         sumAssured, undefined, showSpin)
                },
                'Resource_SumAssured_Update' : function(id, sumAssured, showSpin){
                    return httpData['patch'](oimProxyCgw.endpoint + helper.formatNamed('api/assuredsum/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         sumAssured, undefined, showSpin)
                },
                'Resource_SumAssured_Delete' : function(id, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/assuredsum/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCgwSecurity", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Cgw_Security_GetTicketUser' : function(securityUserRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/security/ticket',
                                         securityUserRq, undefined, showSpin)
                },
                'Resource_Cgw_Security_GetRole' : function(groupApplication, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/security/role/{groupApplication}',
                                                    { 'groupApplication':  { value: groupApplication, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedicine", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_HighCostMedicine_GetMedicineTray' : function(filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/medicine/highcost?filter={filter}&size={size}&num={num}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_HighCostMedicine_GetContactTray' : function(filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/medicine/highcost/contact?filter={filter}&size={size}&num={num}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_HighCostMedicine_SaveContact' : function(HighCostMedicine, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/medicine/highcost/contact',
                                         HighCostMedicine, undefined, showSpin)
                },
                'Resource_HighCostMedicine_UpdateContact' : function(id, HighCostMedicine, showSpin){
                    return httpData['patch'](oimProxyCgw.endpoint + helper.formatNamed('api/medicine/highcost/contact/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         HighCostMedicine, undefined, showSpin)
                },
                'Resource_HighCostMedicine_DeleteContact' : function(id, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/medicine/highcost/contact/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCoverage", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetListByFilter' : function(filter, codcia, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/coverage?filter={filter}&codcia={codcia}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'codcia':  { value: codcia, defaultValue:'3' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUITInfo", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetUitValue' : function(uitInfoRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/uitinfo/uitvalue',
                                         uitInfoRq, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProduct", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Product_Coverage_GetListByProduct' : function(productCode, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/product/coverage/{productCode}',
                                                    { 'productCode':  { value: productCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Product_Coverage_GetListByProductAndPolicy' : function(companyCode, policyNumber, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/product/coverage/car/{companyCode}/{policyNumber}',
                                                    { 'companyCode':  { value: companyCode, defaultValue:'' } ,'policyNumber':  { value: policyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyConditioned", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetConditionedTray' : function(filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/exclusioncondition?filter={filter}&size={size}&num={num}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Conditioned_GetByID' : function(id, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/exclusioncondition/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveConditioned' : function(Conditioned, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/exclusioncondition',
                                         Conditioned, undefined, showSpin)
                },
                'Resource_Conditioned_Update' : function(id, Conditioned, showSpin){
                    return httpData['patch'](oimProxyCgw.endpoint + helper.formatNamed('api/exclusioncondition/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         Conditioned, undefined, showSpin)
                },
                'Resource_Conditioned_Delete' : function(id, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/exclusioncondition/{id}',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInternalRemark", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_InternalRemark_GetList_Common' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/internalremark/common',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyExecutive", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Executive_GetExecutiveByClinic' : function(cproveedor, sucursal, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/clinic/{cproveedor}/{sucursal}',
                                                    { 'cproveedor':  { value: cproveedor, defaultValue:'' } ,'sucursal':  { value: sucursal, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_GetList' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/executive/executives',
                                         undefined, undefined, showSpin)
                },
                'GetListExecutiveByFilter' : function(filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/executive?filter={filter}&size={size}&num={num}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_GetAllAssigned' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/executive/AllAssigned',
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_ClinicNoAssigned' : function(filter, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/clinics?filter={filter}',
                                                    { 'filter':  { value: filter, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_Clinic' : function(id, filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/clinics?filter={filter}&size={size}&num={num}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_Diagnostic' : function(id, filter, size, num, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/diagnostics?filter={filter}&size={size}&num={num}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'filter':  { value: filter, defaultValue:'' } ,'size':  { value: size, defaultValue:'10' } ,'num':  { value: num, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_RegisterClinic' : function(id, request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/clinics',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_Executive_DeleteClinic' : function(id, cprvdr, nsucursal, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/clinics/{cprvdr}/{nsucursal}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'cprvdr':  { value: cprvdr, defaultValue:'' } ,'nsucursal':  { value: nsucursal, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Executive_RegisterDiagnostic' : function(id, request, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/diagnostics',
                                                    { 'id':  { value: id, defaultValue:'' }  }),
                                         request, undefined, showSpin)
                },
                'Resource_Executive_DeleteDiagnostic' : function(id, cdgnstco, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/executive/{id}/diagnostic/{cdgnstco}',
                                                    { 'id':  { value: id, defaultValue:'' } ,'cdgnstco':  { value: cdgnstco, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicySoat", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'GetPolicySoatBy' : function(plateNumber, accidentDate, showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + helper.formatNamed('api/policySoat/GetSoat?plateNumber={plateNumber}&accidentDate={accidentDate}',
                                                    { 'plateNumber':  { value: plateNumber, defaultValue:'' } ,'accidentDate':  { value: accidentDate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEps", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Eps_Get_ListTypePerson' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/eps/typeperson',
                                         undefined, undefined, showSpin)
                },
                'Resource_Eps_Get_ListTypeDocument' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/eps/typedocument',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDiagnostic", ['oimProxyCgw', 'httpData', function(oimProxyCgw, httpData){
        return {
                'Resource_Diagnostic_Get_Diagnostic' : function(diagnosticSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/diagnostic/diagnostics',
                                         diagnosticSearch, undefined, showSpin)
                },
                'Resource_Diagnostic_GetList_Diagnostic' : function(quickSearch, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/diagnostic/quick',
                                         quickSearch, undefined, showSpin)
                },
                'Resource_Diagnostic_Priority_Save' : function(diagnosticPriorityRq, showSpin){
                    return httpData['post'](oimProxyCgw.endpoint + 'api/diagnostic/priority',
                                         diagnosticPriorityRq, undefined, showSpin)
                },
                'Resource_Diagnostic_Priority_Delete' : function(code, showSpin){
                    return httpData['delete'](oimProxyCgw.endpoint + helper.formatNamed('api/diagnostic/priority/{code}',
                                                    { 'code':  { value: code, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Resource_Diagnostic_Priority_GetList' : function( showSpin){
                    return httpData['get'](oimProxyCgw.endpoint + 'api/diagnostic/priority',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
