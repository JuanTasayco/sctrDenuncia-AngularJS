/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.reembolso2", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyReembolso2', {
        endpoint: constants.system.api.endpoints['reembolso2'],
        controllerDoctor: {
            actions : {
                'methodGetAllProcedureBy':{
                    name:  'GetAllProcedureBy',
                    path: 'api/doctor/GetAll?search={search}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Doctor?key={key}'
                },
            }
        },
        controllerRefundTray: {
            actions : {
                'methodGetAllRefundTrayBy':{
                    name:  'GetAllRefundTrayBy',
                    path: 'api/RefundTray/GetAllRefundTrayBy'
                },
                'methodSetRefundOrder':{
                    name:  'SetRefundOrder',
                    path: 'api/RefundTray/SetRefundOrder'
                },
                'methodDownloadReport':{
                    name:  'DownloadReport',
                    path: 'api/RefundTray/Download/Report'
                },
                'methodGetAllCustomDocumentStatus':{
                    name:  'GetAllCustomDocumentStatus',
                    path: 'api/RefundTray/GetAllCustomDocumentStatus'
                },
                'methodGetDocumentObservedBy':{
                    name:  'GetDocumentObservedBy',
                    path: 'api/RefundTray/GetDocumentObservedBy'
                },
                'methodGetRefundTrayDetailDocumentBy':{
                    name:  'GetRefundTrayDetailDocumentBy',
                    path: 'api/RefundTray/GetRefundTrayDetailDocumentBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/RefundTray?key={key}'
                },
            }
        },
        controllerProcedure: {
            actions : {
                'methodGetAllProcedureBy':{
                    name:  'GetAllProcedureBy',
                    path: 'api/procedure/GetAll?idCompany={idCompany}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Procedure?key={key}'
                },
            }
        },
        controllerInvoicePreLiquidation: {
            actions : {
                'methodGetAllInvoicePreLiquidationBy':{
                    name:  'GetAllInvoicePreLiquidationBy',
                    path: 'api/InvoicePreLiquidation/GetAllInvoicePreLiquidationBy'
                },
                'methodSaveInvoicePreLiquidationWithProceduresBy':{
                    name:  'SaveInvoicePreLiquidationWithProceduresBy',
                    path: 'api/InvoicePreLiquidation/SaveInvoicePreLiquidationWithProceduresBy'
                },
                'methodUpdateInvoicePreLiquidationWithProceduresBy':{
                    name:  'UpdateInvoicePreLiquidationWithProceduresBy',
                    path: 'api/InvoicePreLiquidation/UpdateInvoicePreLiquidationWithProceduresBy'
                },
                'methodGetDefaultValuesForInvoicePreLiq':{
                    name:  'GetDefaultValuesForInvoicePreLiq',
                    path: 'api/InvoicePreLiquidation/GetDefaultValuesForInvoicePreLiq'
                },
                'methodGetDocumentNumberIsValid':{
                    name:  'GetDocumentNumberIsValid',
                    path: 'api/InvoicePreLiquidation/GetDocumentNumberIsValid'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/InvoicePreLiquidation?key={key}'
                },
            }
        },
        controllerLookUp: {
            actions : {
                'methodGetAllParametersForRefundSoat':{
                    name:  'GetAllParametersForRefundSoat',
                    path: 'api/LookUp/GetAllParametersForRefundSoat'
                },
                'methodGetRequirementForTemporaryDisability':{
                    name:  'GetRequirementForTemporaryDisability',
                    path: 'api/LookUp/GetRequirementForTemporaryDisability'
                },
                'methodGetRequirementForPermanentDisability':{
                    name:  'GetRequirementForPermanentDisability',
                    path: 'api/LookUp/GetRequirementForPermanentDisability'
                },
                'methodGetRequirementForAccidentalDeath':{
                    name:  'GetRequirementForAccidentalDeath',
                    path: 'api/LookUp/GetRequirementForAccidentalDeath'
                },
                'methodGetRequirementForCureCost':{
                    name:  'GetRequirementForCureCost',
                    path: 'api/LookUp/GetRequirementForCureCosts'
                },
                'methodGetRequirementForFuneral':{
                    name:  'GetRequirementForFuneral',
                    path: 'api/LookUp/GetRequirementForFuneral'
                },
                'methodGetRequirementForPersonalAccident':{
                    name:  'GetRequirementForPersonalAccident',
                    path: 'api/LookUp/GetRequirementForPersonalAccidens'
                },
                'methodGetRequirementForMedicalAssistance':{
                    name:  'GetRequirementForMedicalAssistance',
                    path: 'api/LookUp/GetRequirementForMedicalAssistance'
                },
                'methodGetRequirementForEps':{
                    name:  'GetRequirementForEps',
                    path: 'api/LookUp/GetRequirementForRegularHealth'
                },
                'methodGetRequirementForSctr':{
                    name:  'GetRequirementForSctr',
                    path: 'api/LookUp/GetRequirementForSctr'
                },
                'methodGetRequirementCompensationForAccidentalDeath':{
                    name:  'GetRequirementCompensationForAccidentalDeath',
                    path: 'api/LookUp/GetRequirementCompensationForAccidentalDeath'
                },
                'methodGetValidMediaExtensions':{
                    name:  'GetValidMediaExtensions',
                    path: 'api/LookUp/GetValidMediaExtensions'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/LookUp?key={key}'
                },
            }
        },
        controllerRequestRefundEps: {
            actions : {
                'methodGetAffiliateInfoPlan':{
                    name:  'GetAffiliateInfoPlan',
                    path: 'api/RequestRefundEps/GetAffiliateInfoPlan'
                },
                'methodGetAffiliateClients':{
                    name:  'GetAffiliateClients',
                    path: 'api/RequestRefundEps/GetAffiliateClients'
                },
                'methodValidTreatmentDate':{
                    name:  'ValidTreatmentDate',
                    path: 'api/RequestRefundEps/ValidTreatmentDate'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/RequestRefundEps?key={key}'
                },
            }
        },
        controllerAffiliate: {
            actions : {
                'methodGetAllAffiliatesBy':{
                    name:  'GetAllAffiliatesBy',
                    path: 'api/Affiliate/GetAllAffiliatesBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Affiliate?key={key}'
                },
            }
        },
        controllerRequestRefund: {
            actions : {
                'methodGetPolicyBy':{
                    name:  'GetPolicyBy',
                    path: 'api/RequestRefund/GetPolicyBy?idCompany={idCompany}&licensePlate={licensePlate}'
                },
                'methodGenerateContract':{
                    name:  'GenerateContract',
                    path: 'api/RequestRefund/GenerateContract'
                },
                'methodGetAllDiagnosticsBy':{
                    name:  'GetAllDiagnosticsBy',
                    path: 'api/RequestRefund/GetAllDiagnosticsBy?criteria={criteria}'
                },
                'methodGetAllBenefitsBy':{
                    name:  'GetAllBenefitsBy',
                    path: 'api/RequestRefund/GetAllBenefitsBy?idCompany={idCompany}&criteria={criteria}'
                },
                'methodGetAllProductsBy':{
                    name:  'GetAllProductsBy',
                    path: 'api/RequestRefund/GetAllProductsBy?idCompany={idCompany}&productCode={productCode}'
                },
                'methodGetAllCustomersBy':{
                    name:  'GetAllCustomersBy',
                    path: 'api/RequestRefund/GetAllCustomersBy?criteria={criteria}'
                },
                'methodGetAllCustomerContractPoliciesBy':{
                    name:  'GetAllCustomerContractPoliciesBy',
                    path: 'api/RequestRefund/GetAllCustomerContractPoliciesBy?idCompany={idCompany}&criteria={criteria}'
                },
                'methodGetPlanDescriptionBy':{
                    name:  'GetPlanDescriptionBy',
                    path: 'api/RequestRefund/GetPlanDescriptionBy?idCompany={idCompany}&idCustomer={idCustomer}&productCode={productCode}'
                },
                'methodGetAllRelationshipsBy':{
                    name:  'GetAllRelationshipsBy',
                    path: 'api/RequestRefund/GetAllRelationshipsBy?criteria={criteria}'
                },
                'methodGetAllCoverages':{
                    name:  'GetAllCoverages',
                    path: 'api/RequestRefund/GetAllCoverages'
                },
                'methodGetAllDocumentsReceivedType':{
                    name:  'GetAllDocumentsReceivedType',
                    path: 'api/RequestRefund/GetAllDocumentsReceivedType'
                },
                'methodGetAssistanceProviderBy':{
                    name:  'GetAssistanceProviderBy',
                    path: 'api/RequestRefund/GetAssistanceProviderBy'
                },
                'methodGetRequestCustomerContract':{
                    name:  'GetRequestCustomerContract',
                    path: 'api/RequestRefund/GetRequestCustomerContractBy'
                },
                'methodDoValidationForStepOne':{
                    name:  'DoValidationForStepOne',
                    path: 'api/RequestRefund/DoValidationForStepOne'
                },
                'methodValidReceptionDocumentDateBy':{
                    name:  'ValidReceptionDocumentDateBy',
                    path: 'api/RequestRefund/ValidReceptionDocumentDateBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/RequestRefund?key={key}'
                },
            }
        },
        controllerCustomer: {
            actions : {
                'methodGetCustomerInfoBy':{
                    name:  'GetCustomerInfoBy',
                    path: 'api/Customer/GetCustomerInfoBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Customer?key={key}'
                },
            }
        },
        controllerDemo: {
            actions : {
                'methodGetDate':{
                    name:  'GetDate',
                    path: 'api/Demo/getDate'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Demo?key={key}'
                },
            }
        },
        controllerPreLiquidationProcedure: {
            actions : {
                'methodGetAllPreLiquidationProceduresBy':{
                    name:  'GetAllPreLiquidationProceduresBy',
                    path: 'api/PreLiquidationProcedure/GetAllPreLiquidationProceduresBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PreLiquidationProcedure?key={key}'
                },
            }
        },
        controllerMaintenance: {
            actions : {
                'methodGetAllExecutiveSoatByLastNun':{
                    name:  'GetAllExecutiveSoatByLastNun',
                    path: 'api/Maintenance/GetAllExecutiveSoatByLastSinNum'
                },
                'methodSaveExecutiveSoatByLastSinNun':{
                    name:  'SaveExecutiveSoatByLastSinNun',
                    path: 'api/Maintenance/SaveExecutiveSoatByLastSinNum'
                },
                'methodUpdateExecutiveSoatByLastSinNun':{
                    name:  'UpdateExecutiveSoatByLastSinNun',
                    path: 'api/Maintenance/UpdateExecutiveSoatByLastSinNum'
                },
                'methodActiveOrInactiveExecutiveSoatByLastSinNun':{
                    name:  'ActiveOrInactiveExecutiveSoatByLastSinNun',
                    path: 'api/Maintenance/ActiveOrInactiveExecutiveSoatByLastSinNum'
                },
                'methodInactivateExecutiveSoatByLastSinNun':{
                    name:  'InactivateExecutiveSoatByLastSinNun',
                    path: 'api/Maintenance/InactivateExecutiveSoatByLastSinNum'
                },
                'methodGetAllAvailableLastDigit':{
                    name:  'GetAllAvailableLastDigit',
                    path: 'api/Maintenance/GetAllAvailableLastDigit'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Maintenance?key={key}'
                },
            }
        },
        controllerDocumentLiquidation: {
            actions : {
                'methodGetDocumentLiquidationBy':{
                    name:  'GetDocumentLiquidationBy',
                    path: 'api/DocumentLiquidation/GetDocumentLiquidationBy'
                },
                'methodSaveDocumentLiquidationBy':{
                    name:  'SaveDocumentLiquidationBy',
                    path: 'api/DocumentLiquidation/SaveDocumentLiquidationBy'
                },
                'methodUpdateDocumentObserved':{
                    name:  'UpdateDocumentObserved',
                    path: 'api/DocumentLiquidation/UpdateDocumentObserved'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/DocumentLiquidation?key={key}'
                },
            }
        },
        controllerBenefit: {
            actions : {
                'methodGetAllBenefitBy':{
                    name:  'GetAllBenefitBy',
                    path: 'api/Benefit/GetAllBenefitBy'
                },
                'methodGetAllBenefitAaPpBy':{
                    name:  'GetAllBenefitAaPpBy',
                    path: 'api/Benefit/GetAllBenefitAaPpBy'
                },
                'methodGetAllBenefitEpsSalud':{
                    name:  'GetAllBenefitEpsSalud',
                    path: 'api/Benefit/GetAllBenefitEps'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Benefit?key={key}'
                },
            }
        },
        controllerFinishRequestRefundAaMm: {
            actions : {
                'methodSaveRefundForAaMm':{
                    name:  'SaveRefundForAaMm',
                    path: 'api/FinishRequestRefundAaMm/SaveRefundForAaMm'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/FinishRequestRefundAaMm?key={key}'
                },
            }
        },
        controllerFinishRequestRefundAaPp: {
            actions : {
                'methodSaveRefundForAaPp':{
                    name:  'SaveRefundForAaPp',
                    path: 'api/FinishRequestRefundAaPp/SaveRefundForAaPp'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/FinishRequestRefundAaPp?key={key}'
                },
            }
        },
        controllerPreLiquidation: {
            actions : {
                'methodGetPreLiquidationBy':{
                    name:  'GetPreLiquidationBy',
                    path: 'api/PreLiquidation/GetPreLiquidationBy'
                },
                'methodSavePreLiquidation':{
                    name:  'SavePreLiquidation',
                    path: 'api/PreLiquidation/SavePreLiquidation'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PreLiquidation?key={key}'
                },
            }
        },
        controllerReport: {
            actions : {
                'methodReportCompensationPdf':{
                    name:  'ReportCompensationPdf',
                    path: 'api/report/downloadCompensation?documentYear={documentYear}&documentControlNumber={documentControlNumber}'
                },
                'methodReportProfitLiquidation':{
                    name:  'ReportProfitLiquidation',
                    path: 'api/report/downloadProfitLiquidation?documentYear={documentYear}&documentControlNumber={documentControlNumber}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Report?key={key}'
                },
            }
        },
        controllerAffiliation: {
            actions : {
                'methodGetSearchAffiliateBy':{
                    name:  'GetSearchAffiliateBy',
                    path: 'api/affiliation/GetAffiliate'
                },
                'methodSaveAffiliateTemporary':{
                    name:  'SaveAffiliateTemporary',
                    path: 'api/affiliation/SaveAffiliate'
                },
                'methodGenerateOpening':{
                    name:  'GenerateOpening',
                    path: 'api/affiliation/GenerateOpening'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Affiliation?key={key}'
                },
            }
        },
        controllerAssignment: {
            actions : {
                'methodListAssignment':{
                    name:  'ListAssignment',
                    path: 'api/assignment/list'
                },
                'methodUpdateAssignment':{
                    name:  'UpdateAssignment',
                    path: 'api/assignment/update'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Assignment?key={key}'
                },
            }
        },
        controllerUser: {
            actions : {
                'methodGetUserExecutiveBy':{
                    name:  'GetUserExecutiveBy',
                    path: 'api/user/GetUserExecutiveBy?search={search}'
                },
                'methodGetResponsibleDoctorBy':{
                    name:  'GetResponsibleDoctorBy',
                    path: 'api/user/GetResponsibleDoctorBy?search={search}&productCode={productCode}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/User?key={key}'
                },
            }
        },
        controllerFinishRequestRefundEps: {
            actions : {
                'methodSaveRefundForHealth':{
                    name:  'SaveRefundForHealth',
                    path: 'api/FinishRequestRefundEps/SaveRefundForHealth'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/FinishRequestRefundEps?key={key}'
                },
            }
        },
        controllerMedicalAssistance: {
            actions : {
                'methodGetDocumentMedicalAssistance':{
                    name:  'GetDocumentMedicalAssistance',
                    path: 'api/MedicalAssistance/GetDocumentMedicalAssistance'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/MedicalAssistance?key={key}'
                },
            }
        },
        controllerSinisterBeneficiary: {
            actions : {
                'methodSave':{
                    name:  'Save',
                    path: 'api/SinisterBeneficiary/Save'
                },
                'methodGetBy':{
                    name:  'GetBy',
                    path: 'api/SinisterBeneficiary/GetBy'
                },
                'methodGetAllBy':{
                    name:  'GetAllBy',
                    path: 'api/SinisterBeneficiary/GetAllBy?documentControlNumber={documentControlNumber}&anio={anio}'
                },
                'methodGenerateAffiliation':{
                    name:  'GenerateAffiliation',
                    path: 'api/SinisterBeneficiary/GenerateAffiliation'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/SinisterBeneficiary?key={key}'
                },
            }
        },
        controllerBroker: {
            actions : {
                'methodGetAllBrokerBy':{
                    name:  'GetAllBrokerBy',
                    path: 'api/broker/GetAll?search={search}'
                },
                'methodGetAllExecutiveBrokerBy':{
                    name:  'GetAllExecutiveBrokerBy',
                    path: 'api/broker/GetAllExecutiveBrokerBy?idRefundExecutive={idRefundExecutive}'
                },
                'methodSaveExecutiveBroker':{
                    name:  'SaveExecutiveBroker',
                    path: 'api/broker/SaveExecutiveBroker'
                },
                'methodDeleteExecutiveBroker':{
                    name:  'DeleteExecutiveBroker',
                    path: 'api/broker/DeleteExecutiveBroker'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Broker?key={key}'
                },
            }
        },
        controllerPersonalAccidents: {
            actions : {
                'methodGetDocumentPersonalAccidents':{
                    name:  'GetDocumentPersonalAccidents',
                    path: 'api/PersonalAccidents/GetDocumentPersonalAccidents'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PersonalAccidents?key={key}'
                },
            }
        },
        controllerCompensation: {
            actions : {
                'methodGetAllTemporaryDisability':{
                    name:  'GetAllTemporaryDisability',
                    path: 'api/compensation/GetAllTemporaryDisability'
                },
                'methodGetAllAccidentalDeath':{
                    name:  'GetAllAccidentalDeath',
                    path: 'api/compensation/GetAllAccidentalDeath'
                },
                'methodGetAllPermanentDisability':{
                    name:  'GetAllPermanentDisability',
                    path: 'api/compensation/GetAllPermanentDisability'
                },
                'methodCalculationForTemporaryDisability':{
                    name:  'CalculationForTemporaryDisability',
                    path: 'api/compensation/CalculationForTemporaryDisability'
                },
                'methodCalculationForTemporaryDisabilityOff':{
                    name:  'CalculationForTemporaryDisabilityOff',
                    path: 'api/compensation/CalculationForTemporaryDisabilityOff'
                },
                'methodCalculationForAccidentalDeath':{
                    name:  'CalculationForAccidentalDeath',
                    path: 'api/compensation/CalculationForAccidentalDeath'
                },
                'methodCalculationForAccidentalDeathOff':{
                    name:  'CalculationForAccidentalDeathOff',
                    path: 'api/compensation/CalculationForAccidentalDeathOff'
                },
                'methodCalculationForPermanentDisability':{
                    name:  'CalculationForPermanentDisability',
                    path: 'api/compensation/CalculationForPermanentDisability'
                },
                'methodCalculationForPermanentDisabilityOff':{
                    name:  'CalculationForPermanentDisabilityOff',
                    path: 'api/compensation/CalculationForPermanentDisabilityOff'
                },
                'methodSaveTemporaryDisability':{
                    name:  'SaveTemporaryDisability',
                    path: 'api/compensation/SaveTemporaryDisability'
                },
                'methodSaveAccidentalDeath':{
                    name:  'SaveAccidentalDeath',
                    path: 'api/compensation/SaveAccidentalDeath'
                },
                'methodSavePermanentDisability':{
                    name:  'SavePermanentDisability',
                    path: 'api/compensation/SavePermanentDisability'
                },
                'methodUpdateTemporaryDisability':{
                    name:  'UpdateTemporaryDisability',
                    path: 'api/compensation/UpdateTemporaryDisability'
                },
                'methodUpdateAccidentalDeath':{
                    name:  'UpdateAccidentalDeath',
                    path: 'api/compensation/UpdateAccidentalDeath'
                },
                'methodUpdatePermanentDisability':{
                    name:  'UpdatePermanentDisability',
                    path: 'api/compensation/UpdatePermanentDisability'
                },
                'methodAnnularTemporaryDisability':{
                    name:  'AnnularTemporaryDisability',
                    path: 'api/compensation/AnnularTemporaryDisability'
                },
                'methodAnnularAccidentalDeath':{
                    name:  'AnnularAccidentalDeath',
                    path: 'api/compensation/AnnularAccidentalDeath'
                },
                'methodAnnularPermanentDisability':{
                    name:  'AnnularPermanentDisability',
                    path: 'api/compensation/AnnularPermanentDisability'
                },
                'methodSetReservationAmount':{
                    name:  'SetReservationAmount',
                    path: 'api/compensation/SetReservationAmount'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Compensation?key={key}'
                },
            }
        },
        controllerExecutive: {
            actions : {
                'methodGetAllExecutiveBy':{
                    name:  'GetAllExecutiveBy',
                    path: 'api/executive/GetAll'
                },
                'methodSaveExecutive':{
                    name:  'SaveExecutive',
                    path: 'api/executive/Save'
                },
                'methodActivateOrInactivate':{
                    name:  'ActivateOrInactivate',
                    path: 'api/executive/ActivateOrInactivate'
                },
                'methodInactivateMassive':{
                    name:  'InactivateMassive',
                    path: 'api/executive/InactivateMassive'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Executive?key={key}'
                },
            }
        },
        controllerProvider: {
            actions : {
                'methodGetRucAndDescriptionBy':{
                    name:  'GetRucAndDescriptionBy',
                    path: 'api/provider/getRuc?criteria={criteria}'
                },
                'methodSaveProviderVarious':{
                    name:  'SaveProviderVarious',
                    path: 'api/provider/save'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Provider?key={key}'
                },
            }
        },
        controllerMedia: {
            actions : {
                'methodUpload':{
                    name:  'Upload',
                    path: 'api/media/Upload'
                },
                'methodUploadSignedDocument':{
                    name:  'UploadSignedDocument',
                    path: 'api/media/UploadSignedDocument'
                },
                'methodUploadObservedDocument':{
                    name:  'UploadObservedDocument',
                    path: 'api/media/UploadObservedDocument'
                },
                'methodGetNextMediaSequence':{
                    name:  'GetNextMediaSequence',
                    path: 'api/media/GetNextMediaSequence'
                },
                'methodGetAllByCodeSq':{
                    name:  'GetAllByCodeSq',
                    path: 'api/media/GetAllByCodeSq'
                },
                'methodDeleteMediaBy':{
                    name:  'DeleteMediaBy',
                    path: 'api/media/DeleteMediaBy'
                },
                'methodDownloadMediaFile':{
                    name:  'DownloadMediaFile',
                    path: 'api/media/DownloadMediaFile/{filePowerSq}/{item}/{codeFileType}/{idCompany}/{productCode}/{benefitCode}/{invoiceItemNumber}'
                },
                'methodDownloadMediaByteFile':{
                    name:  'DownloadMediaByteFile',
                    path: 'api/media/DownloadMediaByteFile'
                },
                'methodDeleteDocumentaryManager':{
                    name:  'DeleteDocumentaryManager',
                    path: 'api/media/DeleteDocumentaryManager?idDocument={idDocument}'
                },
                'methodProcessToDocumentaryManager':{
                    name:  'ProcessToDocumentaryManager',
                    path: 'api/media/ProcessToDocumentaryManagerBy?filePowerSq={filePowerSq}'
                },
                'methodDownloadLetterBy':{
                    name:  'DownloadLetterBy',
                    path: 'api/media/DownloadLetterBy'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Media?key={key}'
                },
            }
        },
        controllerFinishRequestRefund: {
            actions : {
                'methodSaveRefundForAccidentalDeath':{
                    name:  'SaveRefundForAccidentalDeath',
                    path: 'api/FinishRequestRefund/SaveRefundForAccidentalDeath'
                },
                'methodSaveRefundForAccidentalDeathOn':{
                    name:  'SaveRefundForAccidentalDeathOn',
                    path: 'api/FinishRequestRefund/SaveRefundForAccidentalDeathOn'
                },
                'methodSaveRefundForPermanentDisability':{
                    name:  'SaveRefundForPermanentDisability',
                    path: 'api/FinishRequestRefund/SaveRefundForPermanentDisability'
                },
                'methodSaveRefundForPermanentDisabilityOn':{
                    name:  'SaveRefundForPermanentDisabilityOn',
                    path: 'api/FinishRequestRefund/SaveRefundForPermanentDisabilityOn'
                },
                'methodSaveRefundForTemporaryDisability':{
                    name:  'SaveRefundForTemporaryDisability',
                    path: 'api/FinishRequestRefund/SaveRefundForTemporaryDisability'
                },
                'methodSaveRefundForTemporaryDisabilityOn':{
                    name:  'SaveRefundForTemporaryDisabilityOn',
                    path: 'api/FinishRequestRefund/SaveRefundForTemporaryDisabilityOn'
                },
                'methodSaveRefundForExpensesCuration':{
                    name:  'SaveRefundForExpensesCuration',
                    path: 'api/FinishRequestRefund/SaveRefundForExpensesCuration'
                },
                'methodSaveRefundForExpensesCurationOn':{
                    name:  'SaveRefundForExpensesCurationOn',
                    path: 'api/FinishRequestRefund/SaveRefundForExpensesCurationOn'
                },
                'methodSaveRefundForFuneral':{
                    name:  'SaveRefundForFuneral',
                    path: 'api/FinishRequestRefund/SaveRefundForFuneral'
                },
                'methodSaveRefundForFuneralOn':{
                    name:  'SaveRefundForFuneralOn',
                    path: 'api/FinishRequestRefund/SaveRefundForFuneralOn'
                },
                'methodUploadFileToDocumentaryManager':{
                    name:  'UploadFileToDocumentaryManager',
                    path: 'api/FinishRequestRefund/UploadFileToDocumentaryManager'
                },
                'methodSaveRefundForSoat':{
                    name:  'SaveRefundForSoat',
                    path: 'api/FinishRequestRefund/soat'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/FinishRequestRefund?key={key}'
                },
            }
        },
        controllerOimApi: {
            actions : {
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/OimApi?key={key}'
                },
            }
        },
        controllerServiceDescriptor: {
            actions : {
                'methodNegotiateGet':{
                    name:  'NegotiateGet',
                    path: 'api/ServiceDescriptor'
                },
            }
        }
    })



     module.factory("proxyDoctor", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllProcedureBy' : function(search, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/doctor/GetAll?search={search}',
                                                    { 'search':  { value: search, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Doctor?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRefundTray", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllRefundTrayBy' : function(refundTrayCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RefundTray/GetAllRefundTrayBy',
                                         refundTrayCriteria, undefined, showSpin)
                },
                'SetRefundOrder' : function(refundOrderCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RefundTray/SetRefundOrder',
                                         refundOrderCriteria, undefined, showSpin)
                },
                'DownloadReport' : function(refundTrayCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RefundTray/Download/Report',
                                         refundTrayCriteria, undefined, showSpin)
                },
                'GetAllCustomDocumentStatus' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/RefundTray/GetAllCustomDocumentStatus',
                                         undefined, undefined, showSpin)
                },
                'GetDocumentObservedBy' : function(documentObservedCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RefundTray/GetDocumentObservedBy',
                                         documentObservedCriteria, undefined, showSpin)
                },
                'GetRefundTrayDetailDocumentBy' : function(refundTrayDetailGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RefundTray/GetRefundTrayDetailDocumentBy',
                                         refundTrayDetailGetCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RefundTray?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProcedure", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllProcedureBy' : function(idCompany, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/procedure/GetAll?idCompany={idCompany}',
                                                    { 'idCompany':  { value: idCompany, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Procedure?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInvoicePreLiquidation", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllInvoicePreLiquidationBy' : function(invoicePreLiquidationGetAllCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/InvoicePreLiquidation/GetAllInvoicePreLiquidationBy',
                                         invoicePreLiquidationGetAllCriteria, undefined, showSpin)
                },
                'SaveInvoicePreLiquidationWithProceduresBy' : function(invoicePreLiquidationSaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/InvoicePreLiquidation/SaveInvoicePreLiquidationWithProceduresBy',
                                         invoicePreLiquidationSaveCriteria, undefined, showSpin)
                },
                'UpdateInvoicePreLiquidationWithProceduresBy' : function(invoicePreLiquidationUpdateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/InvoicePreLiquidation/UpdateInvoicePreLiquidationWithProceduresBy',
                                         invoicePreLiquidationUpdateCriteria, undefined, showSpin)
                },
                'GetDefaultValuesForInvoicePreLiq' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/InvoicePreLiquidation/GetDefaultValuesForInvoicePreLiq',
                                         undefined, undefined, showSpin)
                },
                'GetDocumentNumberIsValid' : function(invoicePreLiquidationDocumentExistsCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/InvoicePreLiquidation/GetDocumentNumberIsValid',
                                         invoicePreLiquidationDocumentExistsCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/InvoicePreLiquidation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookUp", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllParametersForRefundSoat' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetAllParametersForRefundSoat',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForTemporaryDisability' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForTemporaryDisability',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForPermanentDisability' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForPermanentDisability',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForAccidentalDeath' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForAccidentalDeath',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForCureCost' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForCureCosts',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForFuneral' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForFuneral',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForPersonalAccident' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForPersonalAccidens',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForMedicalAssistance' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForMedicalAssistance',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForEps' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForRegularHealth',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementForSctr' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementForSctr',
                                         undefined, undefined, showSpin)
                },
                'GetRequirementCompensationForAccidentalDeath' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetRequirementCompensationForAccidentalDeath',
                                         undefined, undefined, showSpin)
                },
                'GetValidMediaExtensions' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/LookUp/GetValidMediaExtensions',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/LookUp?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRequestRefundEps", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAffiliateInfoPlan' : function(affiliateInfoPlanCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefundEps/GetAffiliateInfoPlan',
                                         affiliateInfoPlanCriteria, undefined, showSpin)
                },
                'GetAffiliateClients' : function(clientCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefundEps/GetAffiliateClients',
                                         clientCriteria, undefined, showSpin)
                },
                'ValidTreatmentDate' : function(documentTreatmentCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefundEps/ValidTreatmentDate',
                                         documentTreatmentCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefundEps?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAffiliate", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllAffiliatesBy' : function(affiliateGetAllCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Affiliate/GetAllAffiliatesBy',
                                         affiliateGetAllCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Affiliate?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRequestRefund", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetPolicyBy' : function(idCompany, licensePlate, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetPolicyBy?idCompany={idCompany}&licensePlate={licensePlate}',
                                                    { 'idCompany':idCompany  ,'licensePlate':  { value: licensePlate, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GenerateContract' : function(policyCompanyCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefund/GenerateContract',
                                         policyCompanyCriteria, undefined, showSpin)
                },
                'GetAllDiagnosticsBy' : function(criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllDiagnosticsBy?criteria={criteria}',
                                                    { 'criteria':  { value: criteria, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllBenefitsBy' : function(idCompany, criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllBenefitsBy?idCompany={idCompany}&criteria={criteria}',
                                                    { 'idCompany':idCompany  ,'criteria':  { value: criteria, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllProductsBy' : function(idCompany, productCode, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllProductsBy?idCompany={idCompany}&productCode={productCode}',
                                                    { 'idCompany':idCompany  ,'productCode':  { value: productCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllCustomersBy' : function(criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllCustomersBy?criteria={criteria}',
                                                    { 'criteria':  { value: criteria, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllCustomerContractPoliciesBy' : function(idCompany, criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllCustomerContractPoliciesBy?idCompany={idCompany}&criteria={criteria}',
                                                    { 'idCompany':idCompany  ,'criteria':  { value: criteria, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetPlanDescriptionBy' : function(idCompany, idCustomer, productCode, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetPlanDescriptionBy?idCompany={idCompany}&idCustomer={idCustomer}&productCode={productCode}',
                                                    { 'idCompany':idCompany  ,'idCustomer':idCustomer  ,'productCode':productCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetAllRelationshipsBy' : function(criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund/GetAllRelationshipsBy?criteria={criteria}',
                                                    { 'criteria':  { value: criteria, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetAllCoverages' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/RequestRefund/GetAllCoverages',
                                         undefined, undefined, showSpin)
                },
                'GetAllDocumentsReceivedType' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/RequestRefund/GetAllDocumentsReceivedType',
                                         undefined, undefined, showSpin)
                },
                'GetAssistanceProviderBy' : function(assistanceProviderCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefund/GetAssistanceProviderBy',
                                         assistanceProviderCriteria, undefined, showSpin)
                },
                'GetRequestCustomerContract' : function(beneficiaryRequestCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefund/GetRequestCustomerContractBy',
                                         beneficiaryRequestCriteria, undefined, showSpin)
                },
                'DoValidationForStepOne' : function(validationForStepOneCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefund/DoValidationForStepOne',
                                         validationForStepOneCriteria, undefined, showSpin)
                },
                'ValidReceptionDocumentDateBy' : function(validReceptionDocumentDateBy, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/RequestRefund/ValidReceptionDocumentDateBy',
                                         validReceptionDocumentDateBy, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/RequestRefund?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCustomer", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetCustomerInfoBy' : function(customerDescriptionCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Customer/GetCustomerInfoBy',
                                         customerDescriptionCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Customer?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDemo", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetDate' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/Demo/getDate',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Demo?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPreLiquidationProcedure", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllPreLiquidationProceduresBy' : function(preLiquidationProceduresGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/PreLiquidationProcedure/GetAllPreLiquidationProceduresBy',
                                         preLiquidationProceduresGetCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/PreLiquidationProcedure?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMaintenance", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllExecutiveSoatByLastNun' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/Maintenance/GetAllExecutiveSoatByLastSinNum',
                                         undefined, undefined, showSpin)
                },
                'SaveExecutiveSoatByLastSinNun' : function(saveExecutiveSoatByLastSinNum, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Maintenance/SaveExecutiveSoatByLastSinNum',
                                         saveExecutiveSoatByLastSinNum, undefined, showSpin)
                },
                'UpdateExecutiveSoatByLastSinNun' : function(updateExecutiveSoatByLastSinNum, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Maintenance/UpdateExecutiveSoatByLastSinNum',
                                         updateExecutiveSoatByLastSinNum, undefined, showSpin)
                },
                'ActiveOrInactiveExecutiveSoatByLastSinNun' : function(executiveSoatByLastSinNum, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Maintenance/ActiveOrInactiveExecutiveSoatByLastSinNum',
                                         executiveSoatByLastSinNum, undefined, showSpin)
                },
                'InactivateExecutiveSoatByLastSinNun' : function(listExecutiveSoatByLastSinNum, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Maintenance/InactivateExecutiveSoatByLastSinNum',
                                         listExecutiveSoatByLastSinNum, undefined, showSpin)
                },
                'GetAllAvailableLastDigit' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/Maintenance/GetAllAvailableLastDigit',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Maintenance?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocumentLiquidation", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetDocumentLiquidationBy' : function(documentLiquidationGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/DocumentLiquidation/GetDocumentLiquidationBy',
                                         documentLiquidationGetCriteria, undefined, showSpin)
                },
                'SaveDocumentLiquidationBy' : function(documentLiquidationSoatSaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/DocumentLiquidation/SaveDocumentLiquidationBy',
                                         documentLiquidationSoatSaveCriteria, undefined, showSpin)
                },
                'UpdateDocumentObserved' : function(anioDocuControlNumberUserCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/DocumentLiquidation/UpdateDocumentObserved',
                                         anioDocuControlNumberUserCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/DocumentLiquidation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBenefit", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllBenefitBy' : function(policyCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Benefit/GetAllBenefitBy',
                                         policyCriteria, undefined, showSpin)
                },
                'GetAllBenefitAaPpBy' : function(benefitsAaPpCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Benefit/GetAllBenefitAaPpBy',
                                         benefitsAaPpCriteria, undefined, showSpin)
                },
                'GetAllBenefitEpsSalud' : function(benefitsEpsCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/Benefit/GetAllBenefitEps',
                                         benefitsEpsCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Benefit?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFinishRequestRefundAaMm", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'SaveRefundForAaMm' : function(rqRefundAaMmDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefundAaMm/SaveRefundForAaMm',
                                         rqRefundAaMmDto, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/FinishRequestRefundAaMm?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFinishRequestRefundAaPp", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'SaveRefundForAaPp' : function(rqRefundAaPpDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefundAaPp/SaveRefundForAaPp',
                                         rqRefundAaPpDto, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/FinishRequestRefundAaPp?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPreLiquidation", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetPreLiquidationBy' : function(preLiquidationGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/PreLiquidation/GetPreLiquidationBy',
                                         preLiquidationGetCriteria, undefined, showSpin)
                },
                'SavePreLiquidation' : function(preLiquidationSaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/PreLiquidation/SavePreLiquidation',
                                         preLiquidationSaveCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/PreLiquidation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReport", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'ReportCompensationPdf' : function(documentYear, documentControlNumber, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/report/downloadCompensation?documentYear={documentYear}&documentControlNumber={documentControlNumber}',
                                                    { 'documentYear':documentYear  ,'documentControlNumber':documentControlNumber   }),
                                         undefined, undefined, showSpin)
                },
                'ReportProfitLiquidation' : function(documentYear, documentControlNumber, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/report/downloadProfitLiquidation?documentYear={documentYear}&documentControlNumber={documentControlNumber}',
                                                    { 'documentYear':documentYear  ,'documentControlNumber':documentControlNumber   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Report?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAffiliation", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetSearchAffiliateBy' : function(SearchAffiliateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/affiliation/GetAffiliate',
                                         SearchAffiliateCriteria, undefined, showSpin)
                },
                'SaveAffiliateTemporary' : function(openingCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/affiliation/SaveAffiliate',
                                         openingCriteria, undefined, showSpin)
                },
                'GenerateOpening' : function(openingCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/affiliation/GenerateOpening',
                                         openingCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Affiliation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAssignment", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'ListAssignment' : function(assignmentCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/assignment/list',
                                         assignmentCriteria, undefined, showSpin)
                },
                'UpdateAssignment' : function(listUpdateAssignmentCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/assignment/update',
                                         listUpdateAssignmentCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Assignment?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUser", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetUserExecutiveBy' : function(search, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/user/GetUserExecutiveBy?search={search}',
                                                    { 'search':search   }),
                                         undefined, undefined, showSpin)
                },
                'GetResponsibleDoctorBy' : function(search, productCode, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/user/GetResponsibleDoctorBy?search={search}&productCode={productCode}',
                                                    { 'search':search  ,'productCode':productCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/User?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFinishRequestRefundEps", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'SaveRefundForHealth' : function(rqRefundEpsHealth, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefundEps/SaveRefundForHealth',
                                         rqRefundEpsHealth, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/FinishRequestRefundEps?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedicalAssistance", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetDocumentMedicalAssistance' : function(documentMedicalAssistanceCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/MedicalAssistance/GetDocumentMedicalAssistance',
                                         documentMedicalAssistanceCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/MedicalAssistance?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinisterBeneficiary", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'Save' : function(sinisterBeneficiarySaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/SinisterBeneficiary/Save',
                                         sinisterBeneficiarySaveCriteria, undefined, showSpin)
                },
                'GetBy' : function(sinisterBeneficiaryGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/SinisterBeneficiary/GetBy',
                                         sinisterBeneficiaryGetCriteria, undefined, showSpin)
                },
                'GetAllBy' : function(documentControlNumber, anio, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/SinisterBeneficiary/GetAllBy?documentControlNumber={documentControlNumber}&anio={anio}',
                                                    { 'documentControlNumber':documentControlNumber  ,'anio':anio   }),
                                         undefined, undefined, showSpin)
                },
                'GenerateAffiliation' : function(generateAffiliateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/SinisterBeneficiary/GenerateAffiliation',
                                         generateAffiliateCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/SinisterBeneficiary?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBroker", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllBrokerBy' : function(search, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/broker/GetAll?search={search}',
                                                    { 'search':search   }),
                                         undefined, undefined, showSpin)
                },
                'GetAllExecutiveBrokerBy' : function(idRefundExecutive, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/broker/GetAllExecutiveBrokerBy?idRefundExecutive={idRefundExecutive}',
                                                    { 'idRefundExecutive':idRefundExecutive   }),
                                         undefined, undefined, showSpin)
                },
                'SaveExecutiveBroker' : function(saveBrokerCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/broker/SaveExecutiveBroker',
                                         saveBrokerCriteria, undefined, showSpin)
                },
                'DeleteExecutiveBroker' : function(deleteExecutivoBrokerCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/broker/DeleteExecutiveBroker',
                                         deleteExecutivoBrokerCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Broker?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPersonalAccidents", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetDocumentPersonalAccidents' : function(documentPersonalAccidentsCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/PersonalAccidents/GetDocumentPersonalAccidents',
                                         documentPersonalAccidentsCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/PersonalAccidents?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCompensation", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllTemporaryDisability' : function(compensationTemporaryDisabilityCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/GetAllTemporaryDisability',
                                         compensationTemporaryDisabilityCriteria, undefined, showSpin)
                },
                'GetAllAccidentalDeath' : function(compensationTemporaryDisabilityCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/GetAllAccidentalDeath',
                                         compensationTemporaryDisabilityCriteria, undefined, showSpin)
                },
                'GetAllPermanentDisability' : function(compensationPermanentDisabilityCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/GetAllPermanentDisability',
                                         compensationPermanentDisabilityCriteria, undefined, showSpin)
                },
                'CalculationForTemporaryDisability' : function(compensationTemporaryDisabilityCalculationCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForTemporaryDisability',
                                         compensationTemporaryDisabilityCalculationCriteria, undefined, showSpin)
                },
                'CalculationForTemporaryDisabilityOff' : function(compensationTemporaryDisabilityCalculationOffCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForTemporaryDisabilityOff',
                                         compensationTemporaryDisabilityCalculationOffCriteria, undefined, showSpin)
                },
                'CalculationForAccidentalDeath' : function(compensationCalculationCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForAccidentalDeath',
                                         compensationCalculationCriteria, undefined, showSpin)
                },
                'CalculationForAccidentalDeathOff' : function(compensationAccidentalDeathCalculationOffCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForAccidentalDeathOff',
                                         compensationAccidentalDeathCalculationOffCriteria, undefined, showSpin)
                },
                'CalculationForPermanentDisability' : function(compensationPermanentDisabilityCalculationCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForPermanentDisability',
                                         compensationPermanentDisabilityCalculationCriteria, undefined, showSpin)
                },
                'CalculationForPermanentDisabilityOff' : function(compensationPermanentDisabilityCalculationOffCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/CalculationForPermanentDisabilityOff',
                                         compensationPermanentDisabilityCalculationOffCriteria, undefined, showSpin)
                },
                'SaveTemporaryDisability' : function(compensationTemporaryDisabilitySaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/SaveTemporaryDisability',
                                         compensationTemporaryDisabilitySaveCriteria, undefined, showSpin)
                },
                'SaveAccidentalDeath' : function(compensationAccidentalDeathSaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/SaveAccidentalDeath',
                                         compensationAccidentalDeathSaveCriteria, undefined, showSpin)
                },
                'SavePermanentDisability' : function(compensationPermanentDisabilitySaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/SavePermanentDisability',
                                         compensationPermanentDisabilitySaveCriteria, undefined, showSpin)
                },
                'UpdateTemporaryDisability' : function(compensationTemporaryDisabilityUpdateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/UpdateTemporaryDisability',
                                         compensationTemporaryDisabilityUpdateCriteria, undefined, showSpin)
                },
                'UpdateAccidentalDeath' : function(compensationAccidentalDeathUpdateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/UpdateAccidentalDeath',
                                         compensationAccidentalDeathUpdateCriteria, undefined, showSpin)
                },
                'UpdatePermanentDisability' : function(compensationPermanentDisabilityUpdateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/UpdatePermanentDisability',
                                         compensationPermanentDisabilityUpdateCriteria, undefined, showSpin)
                },
                'AnnularTemporaryDisability' : function(compensationTemporaryDisabilityAnnularCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/AnnularTemporaryDisability',
                                         compensationTemporaryDisabilityAnnularCriteria, undefined, showSpin)
                },
                'AnnularAccidentalDeath' : function(compensationAccidentalDeathAnnularCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/AnnularAccidentalDeath',
                                         compensationAccidentalDeathAnnularCriteria, undefined, showSpin)
                },
                'AnnularPermanentDisability' : function(compensationPermanentDisabilityAnnularCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/AnnularPermanentDisability',
                                         compensationPermanentDisabilityAnnularCriteria, undefined, showSpin)
                },
                'SetReservationAmount' : function(reservationSinisterDateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/compensation/SetReservationAmount',
                                         reservationSinisterDateCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Compensation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyExecutive", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetAllExecutiveBy' : function( showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + 'api/executive/GetAll',
                                         undefined, undefined, showSpin)
                },
                'SaveExecutive' : function(saveExecutiveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/executive/Save',
                                         saveExecutiveCriteria, undefined, showSpin)
                },
                'ActivateOrInactivate' : function(executiveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/executive/ActivateOrInactivate',
                                         executiveCriteria, undefined, showSpin)
                },
                'InactivateMassive' : function(listExecutiveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/executive/InactivateMassive',
                                         listExecutiveCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Executive?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProvider", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetRucAndDescriptionBy' : function(criteria, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/provider/getRuc?criteria={criteria}',
                                                    { 'criteria':criteria   }),
                                         undefined, undefined, showSpin)
                },
                'SaveProviderVarious' : function(providerVariousSaveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/provider/save',
                                         providerVariousSaveCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Provider?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedia", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'Upload' : function( showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/Upload',
                                         undefined, undefined, showSpin)
                },
                'UploadSignedDocument' : function( showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/UploadSignedDocument',
                                         undefined, undefined, showSpin)
                },
                'UploadObservedDocument' : function( showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/UploadObservedDocument',
                                         undefined, undefined, showSpin)
                },
                'GetNextMediaSequence' : function(nextSequenceGetCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/GetNextMediaSequence',
                                         nextSequenceGetCriteria, undefined, showSpin)
                },
                'GetAllByCodeSq' : function(getAllByCodeSqCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/GetAllByCodeSq',
                                         getAllByCodeSqCriteria, undefined, showSpin)
                },
                'DeleteMediaBy' : function(mediaDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/DeleteMediaBy',
                                         mediaDto, undefined, showSpin)
                },
                'DownloadMediaFile' : function(filePowerSq, item, codeFileType, idCompany, productCode, benefitCode, invoiceItemNumber, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/media/DownloadMediaFile/{filePowerSq}/{item}/{codeFileType}/{idCompany}/{productCode}/{benefitCode}/{invoiceItemNumber}',
                                                    { 'filePowerSq':filePowerSq  ,'item':item  ,'codeFileType':codeFileType  ,'idCompany':idCompany  ,'productCode':productCode  ,'benefitCode':benefitCode  ,'invoiceItemNumber':invoiceItemNumber   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadMediaByteFile' : function(getMediaBySqItem, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/DownloadMediaByteFile',
                                         getMediaBySqItem, undefined, showSpin)
                },
                'DeleteDocumentaryManager' : function(idDocument, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + helper.formatNamed('api/media/DeleteDocumentaryManager?idDocument={idDocument}',
                                                    { 'idDocument':idDocument   }),
                                         undefined, undefined, showSpin)
                },
                'ProcessToDocumentaryManager' : function(filePowerSq, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + helper.formatNamed('api/media/ProcessToDocumentaryManagerBy?filePowerSq={filePowerSq}',
                                                    { 'filePowerSq':filePowerSq   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadLetterBy' : function(getDocumentaryManagerLetterCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/media/DownloadLetterBy',
                                         getDocumentaryManagerLetterCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/Media?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyFinishRequestRefund", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'SaveRefundForAccidentalDeath' : function(rqForAccidentalDeathDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForAccidentalDeath',
                                         rqForAccidentalDeathDto, undefined, showSpin)
                },
                'SaveRefundForAccidentalDeathOn' : function(rqForAccidentalDeathDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForAccidentalDeathOn',
                                         rqForAccidentalDeathDto, undefined, showSpin)
                },
                'SaveRefundForPermanentDisability' : function(rqForPermanentDisabilityDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForPermanentDisability',
                                         rqForPermanentDisabilityDto, undefined, showSpin)
                },
                'SaveRefundForPermanentDisabilityOn' : function(rqForPermanentDisabilityDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForPermanentDisabilityOn',
                                         rqForPermanentDisabilityDto, undefined, showSpin)
                },
                'SaveRefundForTemporaryDisability' : function(rqForTemporaryDisabilityDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForTemporaryDisability',
                                         rqForTemporaryDisabilityDto, undefined, showSpin)
                },
                'SaveRefundForTemporaryDisabilityOn' : function(rqForTemporaryDisabilityDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForTemporaryDisabilityOn',
                                         rqForTemporaryDisabilityDto, undefined, showSpin)
                },
                'SaveRefundForExpensesCuration' : function(rqForDocLiquidationDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForExpensesCuration',
                                         rqForDocLiquidationDto, undefined, showSpin)
                },
                'SaveRefundForExpensesCurationOn' : function(rqForDocLiquidationDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForExpensesCurationOn',
                                         rqForDocLiquidationDto, undefined, showSpin)
                },
                'SaveRefundForFuneral' : function(rqForDocLiquidationDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForFuneral',
                                         rqForDocLiquidationDto, undefined, showSpin)
                },
                'SaveRefundForFuneralOn' : function(rqForDocLiquidationDto, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/SaveRefundForFuneralOn',
                                         rqForDocLiquidationDto, undefined, showSpin)
                },
                'UploadFileToDocumentaryManager' : function(documentaryManagerMultipleUploadCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/UploadFileToDocumentaryManager',
                                         documentaryManagerMultipleUploadCriteria, undefined, showSpin)
                },
                'SaveRefundForSoat' : function(rqRefundSoat, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + 'api/FinishRequestRefund/soat',
                                         rqRefundSoat, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/FinishRequestRefund?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyOimApi", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso2.endpoint + helper.formatNamed('api/OimApi?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyServiceDescriptor", ['oimProxyReembolso2', 'httpData', function(oimProxyReembolso2, httpData){
        return {
                'NegotiateGet' : function(value, showSpin){
                    return httpData['post'](oimProxyReembolso2.endpoint + helper.formatNamed('api/ServiceDescriptor',
                                                    { 'value':value   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
