'use strict';

define(['angular', 'constants', 'fileSaver'], function (ng, constants, fileSaver) {
  reFactory.$inject = [
    'proxyCompany',
    'proxyPowerEpsProduct',
    'proxyRequestRefund',
    'proxyDiagnostic',
    'proxyMedicalCare',
    'proxySex',
    'proxyDocument',
    'proxySpecialty',
    'proxyBeneficiary',
    'proxyCause',
    'proxyLocation',
    'proxyLookUp',
    'proxyPowerEpsLookUp',
    'proxyEquifax',
    'proxyCompensation',
    'proxySinisterBeneficiary',
    'proxyMedia',
    'proxyFinishRequestRefund',
    'proxyDocumentLiquidation',
    'proxyPreLiquidation',
    'proxyInvoicePreLiquidation',
    'proxyProcedure',
    'proxyProvider',
    'proxyCustomer',
    'proxyDocumentStatus',
    'proxyPowerEpsValidation',
    'proxyBroker',
    // 'proxyBrokerAssignment',
    'proxyExecutive',
    'proxyRequestRefundEps',
    'proxyFinishRequestRefundEps',
    'proxyRefundTray',
    'proxyUser',
    'proxyAffiliation',
    'proxyAffiliate',
    'proxyBenefit',
    'reFactoryMedicalAssistance',
    'reFactoryPersonalAccidents',
    'reFactoryReassignExecutive',
    'reFactoryMaintenance',
    'mpSpin',
    '$q',
    '$http',
    '$log'
  ];

  function reFactory(
    proxyCompany,
    proxyPowerEpsProduct,
    proxyRequestRefund,
    proxyDiagnostic,
    proxyMedicalCare,
    proxySex,
    proxyDocument,
    proxySpecialty,
    proxyBeneficiary,
    proxyCause,
    proxyLocation,
    proxyLookUp,
    proxyPowerEpsLookUp,
    proxyEquifax,
    proxyCompensation,
    proxySinisterBeneficiary,
    proxyMedia,
    proxyFinishRequestRefund,
    proxyDocumentLiquidation,
    proxyPreLiquidation,
    proxyInvoicePreLiquidation,
    proxyProcedure,
    proxyProvider,
    proxyCustomer,
    proxyDocumentStatus,
    proxyPowerEpsValidation,
    proxyBroker,
    // proxyBrokerAssignment,
    proxyExecutive,
    proxyRequestRefundEps,
    proxyFinishRequestRefundEps,
    proxyRefundTray,
    proxyUser,
    proxyAffiliation,
    proxyAffiliate,
    proxyBenefit,
    reFactoryMedicalAssistance,
    reFactoryPersonalAccidents,
    reFactoryReassignExecutive,
    reFactoryMaintenance,
    mpSpin,
    $q,
    $http,
    $log
  ) {
    var SHOW_SPINNER = true;
    var CODE_USER = 'SGA';
    var CODE_SYSTEM = 'EPS';

    var factory = {
      solicitud: {
        GetAllCompany: GetAllCompany,
        GetProductsByCompany: GetProductsByCompany,
        GetDataByLicensePlate: GetDataByLicensePlate,
        GetDiagnosticList: GetDiagnosticList,
        GetAfiliatesList: GetAfiliatesList,
        GetCustomerList: GetCustomerList,
        GetCoveragesList: GetCoveragesList,
        GetBenefitList: GetBenefitList,
        GetSexList: GetSexList,
        GetDocumentsType: GetDocumentsType,
        GetSpecialtyList: GetSpecialtyList,
        GetBeneficiaryList: GetBeneficiaryList,
        GetSinisterList: GetSinisterList,
        GetDepartmentList: GetDepartmentList,
        GetProvinceList: GetProvinceList,
        GetDistrictList: GetDistrictList,
        GetLookUpList: GetLookUpList,
        GeatAssistance: GeatAssistance,
        GenerateContract: GenerateContract,
        GetCustomerContract: GetCustomerContract,
        GetEquifaxData: GetEquifaxData,
        ValidatePolicyMedicalAssistance: ValidatePolicyMedicalAssistance,
        ValidateDocumentsDate: ValidateDocumentsDate,
        GetBeneficiaryListMapfre: GetBeneficiaryListMapfre,
        SaveSinisterBeneficiary: SaveSinisterBeneficiary,
        SaveSolicitudeDisconnectedTemporary: SaveSolicitudeDisconnectedTemporary,
        SaveSolicitudeDisconnectedPermanent: SaveSolicitudeDisconnectedPermanent,
        SaveSolicitudeDisconnectedAccidental: SaveSolicitudeDisconnectedAccidental,
        SaveSolicitudeDisconnectedSepelio: SaveSolicitudeDisconnectedSepelio,
        SaveSolicitudeDisconnectedCuracion: SaveSolicitudeDisconnectedCuracion,

        SaveSolicitudeTemporaryOn: SaveSolicitudeTemporaryOn,
        SaveSolicitudePermanentOn: SaveSolicitudePermanentOn,
        SaveSolicitudeAccidentalOn: SaveSolicitudeAccidentalOn,
        SaveSolicitudeSepelioOn: SaveSolicitudeSepelioOn,
        SaveSolicitudeCuracionOn: SaveSolicitudeCuracionOn,

        GenerateAfiliateId: GenerateAfiliateId,
        GetAccidentalDeathList: GetAccidentalDeathList,
        GetTemporaryDisabilityList: GetTemporaryDisabilityList,
        GetPermanentDisabilityList: GetPermanentDisabilityList,
        CalculationTemporaryDisability: CalculationTemporaryDisability,
        CalculationForPermanentDisability: CalculationForPermanentDisability,
        CalculationForAccidentalDeath: CalculationForAccidentalDeath,
        CalculationForTemporaryDisabilityOff: CalculationForTemporaryDisabilityOff,
        CalculationForAccidentalDeathOff: CalculationForAccidentalDeathOff,
        CalculationForPermanentDisabilityOff: CalculationForPermanentDisabilityOff,
        SaveTemporaryDisability: SaveTemporaryDisability,
        SavePermanentDisability: SavePermanentDisability,
        SaveAccidentalDeath: SaveAccidentalDeath,
        UpdateTemporaryDisability: UpdateTemporaryDisability,
        UpdatePermanentDisability: UpdatePermanentDisability,
        UpdateAccidentalDeath: UpdateAccidentalDeath,
        AnnularTemporaryDisability: AnnularTemporaryDisability,
        AnnularAccidentalDeath: AnnularAccidentalDeath,
        AnnularPermanentDisability: AnnularPermanentDisability,
        ReservationAmount: ReservationAmount,
        GetDocumentLiquidation: GetDocumentLiquidation,
        SaveDocumentLiquidation: SaveDocumentLiquidation,
        UploadObservation: UploadObservation,
        GetDocumentObservedDetail: GetDocumentObservedDetail,
        GetRefundTrayDetailDocumentBy: GetRefundTrayDetailDocumentBy,
        GetPreLiquidation: GetPreLiquidation,
        SavePreLiquidation: SavePreLiquidation,
        GetComprobantesList: GetComprobantesList,
        SaveComprobante: SaveComprobante,
        UpdateComprobante: UpdateComprobante,
        GetAllProcedures: GetAllProcedures,
        GetRazSocialByRuc: GetRazSocialByRuc,
        SaveCompany: SaveCompany,
        GetDefaultInvoiceDisconnected: GetDefaultInvoiceDisconnected,
        GetDocumentNumberValid: GetDocumentNumberValid,
        SaveExtendBeneficiary: SaveExtendBeneficiary,
        // ReassignExecutiveMassive: ReassignExecutiveMassive,
        // medicalAssistance
        GetCustomerInfo: GetCustomerInfo,
        // media
        UploadFile: UploadFile,
        UploadFileObserved: UploadFileObserved,
        UploadSignedDocument: UploadSignedDocument,
        GetAllFiles: GetAllFiles,
        GetNextMedia: GetNextMedia,
        DeleteFile: DeleteFile,
        DownloadFile: DownloadFile,
        ProcessDocumentaryManager: ProcessDocumentaryManager,
        DownloadCompensationReport: DownloadCompensationReport,
        DownloadLetter: DownloadLetter,
        // Lookups
        GetTemporaryDisabilityTemplate: GetTemporaryDisabilityTemplate,
        GetPermanentDisabilityTemplate: GetPermanentDisabilityTemplate,
        GetAccidentalDeathTemplate: GetAccidentalDeathTemplate,
        GetGastosCuracionTemplate: GetGastosCuracionTemplate,
        GetGastosSepelioTemplate: GetGastosSepelioTemplate,
        GetAccidentalDeathModalTemplate: GetAccidentalDeathModalTemplate,
        GetAllBenefitsBy: GetAllBenefitsBy,
        GetMedicalAssistanceTemplate: GetMedicalAssistanceTemplate,
        GetPersonalAccidentsTemplate: GetPersonalAccidentsTemplate,
        GetRegularHealthTemplate: GetRegularHealthTemplate,
        GetSctrTemplate: GetSctrTemplate,
        MediaExtensions: MediaExtensions,

        GetAllDocumentsReceivedType: GetAllDocumentsReceivedType,
        GetAffiliateInfoPlan: GetAffiliateInfoPlan,
        GetAffiliateClients: GetAffiliateClients,
        SaveDocumentEps: SaveDocumentEps,
        GetDocument: GetDocument,
        ValidTreatmentDate: ValidTreatmentDate,
        SaveSolicitudeDisconnectedSalud: SaveSolicitudeDisconnectedSalud,
        UploadFileDocumentaryManager: UploadFileDocumentaryManager,
        //documents
        GetAllDocumentStatus: GetAllDocumentStatus,
        GetAllRefundTrayBy: GetAllRefundTrayBy,
        SetRefundOrder: SetRefundOrder,
        GetStateDocument: GetStateDocument,
        //documents
        GetDocumentNumberIsValid: GetDocumentNumberIsValid,
        // Broker
        GetBrokerList: GetBrokerList,
        GetEjecutivoList: GetEjecutivoList,
        GetMedicList: GetMedicList,

        GetAffiliate: GetAffiliate,

        // EPS
        GetAllBenefitEps: GetAllBenefitEps,
        GetAllBeneficiaryByFilters: GetAllBeneficiaryByFilters,
        
      },
      common: {
        DatePicker: DatePicker,
        FromDateToString: FromDateToString,
        AddDaysToDate: AddDaysToDate,
        FormatDate: FormatDate
      },
      medicalAssistance: reFactoryMedicalAssistance,
      personalAccidents: reFactoryPersonalAccidents,
      reassignExecutive: reFactoryReassignExecutive,
      maintenance: reFactoryMaintenance
    };

    // function declaration powereps

    function GetAllCompany() {
      return proxyCompany.Resource_PowerEps_Company_GetAll(CODE_USER, CODE_SYSTEM, SHOW_SPINNER);
    }

    function GetProductsByCompany(companyId) {
      return proxyPowerEpsProduct.Resource_PowerEps_Product_GetAll(CODE_USER, companyId, SHOW_SPINNER);
    }

    function GetSexList() {
      return proxySex.Resource_PowerEps_Sex_GetAll(SHOW_SPINNER);
    }

    function GetDocumentsType() {
      return proxyDocument.Resource_PowerEps_Document_Type_GetAll(SHOW_SPINNER);
    }

    function GetSpecialtyList() {
      return proxySpecialty.Resource_PowerEps_Specialty_GetAll(SHOW_SPINNER);
    }

    function GetBeneficiaryList() {
      return proxyBeneficiary.Resource_PowerEps_Beneficiary_GetAll(SHOW_SPINNER);
    }

    function GetSinisterList() {
      return proxyCause.Resource_PowerEps_Cause_GetAll(SHOW_SPINNER);
    }

    function GetDepartmentList() {
      return proxyLocation.Resource_PowerEps_Location_GetAllDepartment(SHOW_SPINNER);
    }

    function GetProvinceList(departmentCode) {
      return proxyLocation.Resource_PowerEps_Location_GetAllProvinceBy(departmentCode, SHOW_SPINNER);
    }

    function GetDistrictList(departmentCode, idProvince) {
      return proxyLocation.Resource_PowerEps_Location_GetAllDistrictBy(departmentCode, idProvince, SHOW_SPINNER);
    }

    function GetEquifaxData(criteria) {
      return proxyEquifax.Resource_PowerEps_Equifax_Get(criteria, SHOW_SPINNER);
    }

    function ValidatePolicyMedicalAssistance(policySupplementValidCriteria) {
      return proxyPowerEpsValidation.PolicySupplementValid(policySupplementValidCriteria, SHOW_SPINNER);
    }

    // function declaration refunds

    function GetAffiliate(SearchAffiliateCriteria) {
      return proxyAffiliation.GetSearchAffiliateBy(SearchAffiliateCriteria, SHOW_SPINNER);
    }

    function GetDataByLicensePlate(companyId, licensePlate) {
      return proxyRequestRefund.GetPolicyBy(companyId, licensePlate, SHOW_SPINNER);
    }

    function GetAfiliatesList(affiliateGetAllCriteria) {
      return proxyAffiliate.GetAllAffiliatesBy(affiliateGetAllCriteria, SHOW_SPINNER);
    }

    function GetCustomerList(criteria) {
      return proxyRequestRefund.GetAllCustomersBy(criteria, SHOW_SPINNER);
    }

    function GetCoveragesList() {
      return proxyRequestRefund.GetAllCoverages(SHOW_SPINNER);
    }

    function GeatAssistance(criteriaReq) {
      return proxyRequestRefund.GetAssistanceProviderBy(criteriaReq, SHOW_SPINNER);
    }

    function GenerateContract(policyCompanyCriteria) {
      return proxyRequestRefund.GenerateContract(policyCompanyCriteria, SHOW_SPINNER);
    }

    function GetCustomerContract(beneficiaryRequestCriteria) {
      return proxyRequestRefund.GetRequestCustomerContract(beneficiaryRequestCriteria, SHOW_SPINNER);
    }

    function ValidateDocumentsDate(validReceptionDocumentDateBy) {
      return proxyRequestRefund.ValidReceptionDocumentDateBy(validReceptionDocumentDateBy, SHOW_SPINNER);
    }

    function GetLookUpList() {
      return proxyPowerEpsLookUp.GetAllParametersForPowerEps(SHOW_SPINNER);
    }

    function GetAccidentalDeathList(requestCompensationTemporaryDisabilityCriteria) {
      return proxyCompensation.GetAllAccidentalDeath(requestCompensationTemporaryDisabilityCriteria, SHOW_SPINNER);
    }

    function GetTemporaryDisabilityList(requestCompensationTemporaryDisabilityCriteria) {
      return proxyCompensation.GetAllTemporaryDisability(requestCompensationTemporaryDisabilityCriteria, SHOW_SPINNER);
    }

    function GetPermanentDisabilityList(requestCompesationPermanentDisabilityCriteria) {
      return proxyCompensation.GetAllPermanentDisability(requestCompesationPermanentDisabilityCriteria, SHOW_SPINNER);
    }

    function GetBeneficiaryListMapfre(documentControlNumber, anio) {
      return proxySinisterBeneficiary.GetAllBy(documentControlNumber, anio, SHOW_SPINNER);
    }

    function GenerateAfiliateId(generateAffiliateCriteria) {
      return proxySinisterBeneficiary.GenerateAffiliation(generateAffiliateCriteria, SHOW_SPINNER);
    }

    function SaveSinisterBeneficiary(sinisterBeneficiaryCriteria) {
      return proxySinisterBeneficiary.Save(sinisterBeneficiaryCriteria, SHOW_SPINNER);
    }

    function SaveExtendBeneficiary(sinisterBeneficiaryExtendCriteria) {
      return proxySinisterBeneficiary.SaveExtend(sinisterBeneficiaryExtendCriteria, SHOW_SPINNER);
    }

    function CalculationTemporaryDisability(compensationTemporaryDisabilityCalculationCriteria) {
      return proxyCompensation.CalculationForTemporaryDisability(
        compensationTemporaryDisabilityCalculationCriteria,
        SHOW_SPINNER
      );
    }

    function CalculationForPermanentDisability(compensationPermanentDisabilityCalculationCriteria) {
      return proxyCompensation.CalculationForPermanentDisability(
        compensationPermanentDisabilityCalculationCriteria,
        SHOW_SPINNER
      );
    }

    function CalculationForTemporaryDisabilityOff(compensationTemporaryDisabilityCalculationOffCriteria) {
      return proxyCompensation.CalculationForTemporaryDisabilityOff(
        compensationTemporaryDisabilityCalculationOffCriteria,
        SHOW_SPINNER
      );
    }

    function CalculationForAccidentalDeathOff(compensationAccidentalDeathCalculationOffCriteria) {
      return proxyCompensation.CalculationForAccidentalDeathOff(
        compensationAccidentalDeathCalculationOffCriteria,
        SHOW_SPINNER
      );
    }

    function CalculationForPermanentDisabilityOff(CalculationForPermanentDisabilityOff) {
      return proxyCompensation.CalculationForPermanentDisabilityOff(
        CalculationForPermanentDisabilityOff,
        SHOW_SPINNER
      );
    }

    function CalculationForAccidentalDeath(compensationCalculationCriteria) {
      return proxyCompensation.CalculationForAccidentalDeath(compensationCalculationCriteria, SHOW_SPINNER);
    }

    function SaveTemporaryDisability(compensationTemporaryDisabilitySaveCriteria) {
      return proxyCompensation.SaveTemporaryDisability(compensationTemporaryDisabilitySaveCriteria, SHOW_SPINNER);
    }

    function SavePermanentDisability(compensationPermanentDisabilitySaveCriteria) {
      return proxyCompensation.SavePermanentDisability(compensationPermanentDisabilitySaveCriteria, SHOW_SPINNER);
    }

    function SaveAccidentalDeath(compensationAccidentalDeathSaveCriteria) {
      return proxyCompensation.SaveAccidentalDeath(compensationAccidentalDeathSaveCriteria, SHOW_SPINNER);
    }

    function UpdateTemporaryDisability(compensationTemporaryDisabilityUpdateCriteria) {
      return proxyCompensation.UpdateTemporaryDisability(compensationTemporaryDisabilityUpdateCriteria, SHOW_SPINNER);
    }

    function UpdatePermanentDisability(compensationPermanentDisabilityUpdateCriteria) {
      return proxyCompensation.UpdatePermanentDisability(compensationPermanentDisabilityUpdateCriteria, SHOW_SPINNER);
    }

    function UpdateAccidentalDeath(compensationAccidentalDeathUpdateCriteria) {
      return proxyCompensation.UpdateAccidentalDeath(compensationAccidentalDeathUpdateCriteria, SHOW_SPINNER);
    }

    function AnnularTemporaryDisability(compensationTemporaryDisabilityAnnularCriteria) {
      return proxyCompensation.AnnularTemporaryDisability(compensationTemporaryDisabilityAnnularCriteria, SHOW_SPINNER);
    }

    function AnnularAccidentalDeath(compensationAccidentalDeathAnnularCriteria) {
      return proxyCompensation.AnnularAccidentalDeath(compensationAccidentalDeathAnnularCriteria, SHOW_SPINNER);
    }

    function AnnularPermanentDisability(compensationPermanentDisabilityAnnularCriteria) {
      return proxyCompensation.AnnularPermanentDisability(compensationPermanentDisabilityAnnularCriteria, SHOW_SPINNER);
    }

    function ReservationAmount(reservationSinisterDateCriteria) {
      return proxyCompensation.SetReservationAmount(reservationSinisterDateCriteria, SHOW_SPINNER);
    }

    function UploadFile(file, codeFileType, data) {
      var apiPath = constants.system.api.endpoints.reembolso2 + 'api/media/Upload';
      var params = {
        anio: data.anio,
        benefitCode: data.benefitCode,
        codeFileType: codeFileType,
        documentControlNumber: data.documentControlNumber || null,
        file: file,
        idAffiliate: data.idAffiliate,
        idCompany: data.idCompany,
        invoiceItemNumber: data.invoiceItemNumber,
        mediaTempSequence: data.mediaTempSequence,
        policyNumber: data.policyNumber,
        productCode: data.productCode,
        sinisterNumber: data.sinisterNumber
      };
      return _buildReqUpload(apiPath, params);
    }
    
    function UploadFileObserved(file, codeFileType, data) {
      var apiPath = constants.system.api.endpoints.reembolso2 + 'api/media/UploadObservedDocument';
      var params = {
        anio: data.anio,
        benefitCode: data.benefitCode,
        codeFileType: codeFileType,
        documentControlNumber: data.documentControlNumber || null,
        file: file,
        idAffiliate: data.idAffiliate,
        idCompany: data.idCompany,
        invoiceItemNumber: data.invoiceItemNumber,
        mediaTempSequence: data.mediaTempSequence,
        policyNumber: data.policyNumber,
        productCode: data.productCode,
        sinisterNumber: data.sinisterNumber
      };

      return _buildReqUpload(apiPath, params);
    }

    function UploadSignedDocument(file, codeFileType, data) {
      var apiPath = constants.system.api.endpoints.reembolso2 + 'api/media/UploadSignedDocument';
      var params = {
        anio: data.anio,
        benefitCode: data.benefitCode,
        codeFileType: codeFileType,
        documentControlNumber: data.documentControlNumber,
        file: file,
        idAffiliate: data.idAffiliate,
        idCompany: data.idCompany,
        invoiceItemNumber: data.invoiceItemNumber,
        mediaTempSequence: data.mediaTempSequence,
        policyNumber: data.policyNumber,
        productCode: data.productCode,
        sinisterNumber: data.sinisterNumber
      };
      return _buildReqUpload(apiPath, params);
    }

    function GetAllFiles(getAllByCodeSqCriteria) {
      return proxyMedia.GetAllByCodeSq(getAllByCodeSqCriteria, SHOW_SPINNER);
    }

    function GetNextMedia(nextSequenceGetCriteria) {
      return proxyMedia.GetNextMediaSequence(nextSequenceGetCriteria, SHOW_SPINNER);
    }

    function DeleteFile(mediaDto) {
      return proxyMedia.DeleteMediaBy(mediaDto, SHOW_SPINNER);
    }

    function DownloadFile(mediaPath, options) {
      return _downloadMedia(mediaPath, options);
    }

    function ProcessDocumentaryManager(filePowerSq) {
      return proxyMedia.ProcessToDocumentaryManager(filePowerSq, SHOW_SPINNER);
    }

    function DownloadLetter(filePowerSq) {
      return proxyMedia.DownloadLetterBy(filePowerSq, SHOW_SPINNER);
    }

    function DownloadCompensationReport(mediaPath, options) {
      return _downloadMedia(mediaPath, options);
    }

    function GetTemporaryDisabilityTemplate() {
      return proxyLookUp.GetRequirementForTemporaryDisability(SHOW_SPINNER);
    }

    function GetPermanentDisabilityTemplate() {
      return proxyLookUp.GetRequirementForPermanentDisability(SHOW_SPINNER);
    }

    function GetAccidentalDeathTemplate() {
      return proxyLookUp.GetRequirementForAccidentalDeath(SHOW_SPINNER);
    }

    function GetGastosCuracionTemplate() {
      return proxyLookUp.GetRequirementForCureCost(SHOW_SPINNER);
    }

    function GetGastosSepelioTemplate() {
      return proxyLookUp.GetRequirementForFuneral(SHOW_SPINNER);
    }

    function GetAccidentalDeathModalTemplate() {
      return proxyLookUp.GetRequirementCompensationForAccidentalDeath(SHOW_SPINNER);
    }

    function GetMedicalAssistanceTemplate() {
      return proxyLookUp.GetRequirementForMedicalAssistance(SHOW_SPINNER);
    }

    function GetPersonalAccidentsTemplate() {
      return proxyLookUp.GetRequirementForPersonalAccident(SHOW_SPINNER);
    }

    function GetRegularHealthTemplate() {
      return proxyLookUp.GetRequirementForEps(SHOW_SPINNER);
    }

    function GetSctrTemplate() {
      return proxyLookUp.GetRequirementForSctr(SHOW_SPINNER);
    }

    function MediaExtensions() {
      return proxyLookUp.GetValidMediaExtensions(SHOW_SPINNER);
    }

    function SaveSolicitudeDisconnectedTemporary(rqForTemporaryDisabilityDto) {
      return proxyFinishRequestRefund.SaveRefundForTemporaryDisability(rqForTemporaryDisabilityDto, SHOW_SPINNER);
    }

    function SaveSolicitudeTemporaryOn(rqForTemporaryDisabilityDto) {
      return proxyFinishRequestRefund.SaveRefundForTemporaryDisabilityOn(rqForTemporaryDisabilityDto, SHOW_SPINNER);
    }

    function SaveSolicitudeDisconnectedPermanent(rqForPermanentDisabilityDto) {
      return proxyFinishRequestRefund.SaveRefundForPermanentDisability(rqForPermanentDisabilityDto, SHOW_SPINNER);
    }

    function SaveSolicitudePermanentOn(rqForPermanentDisabilityDto) {
      return proxyFinishRequestRefund.SaveRefundForPermanentDisabilityOn(rqForPermanentDisabilityDto, SHOW_SPINNER);
    }

    function SaveSolicitudeDisconnectedAccidental(rqForAccidentalDeathDto) {
      return proxyFinishRequestRefund.SaveRefundForAccidentalDeath(rqForAccidentalDeathDto, SHOW_SPINNER);
    }

    function SaveSolicitudeAccidentalOn(rqForAccidentalDeathDto) {
      return proxyFinishRequestRefund.SaveRefundForAccidentalDeathOn(rqForAccidentalDeathDto, SHOW_SPINNER);
    }

    function SaveSolicitudeDisconnectedSepelio(rqForDocLiquidationDto) {
      return proxyFinishRequestRefund.SaveRefundForFuneral(rqForDocLiquidationDto, SHOW_SPINNER)
    }

    function SaveSolicitudeSepelioOn(rqForDocLiquidationDto) {
      return proxyFinishRequestRefund.SaveRefundForFuneralOn(rqForDocLiquidationDto, SHOW_SPINNER)
    }

    function SaveSolicitudeDisconnectedCuracion(rqForDocLiquidationDto) {
      return proxyFinishRequestRefund.SaveRefundForExpensesCuration(rqForDocLiquidationDto, SHOW_SPINNER)
    }

    function SaveSolicitudeCuracionOn(rqForDocLiquidationDto) {
      return proxyFinishRequestRefund.SaveRefundForExpensesCurationOn(rqForDocLiquidationDto, SHOW_SPINNER)
    }

    function UploadFileDocumentaryManager(documentaryManagerMultipleUploadCriteria) {
      return proxyFinishRequestRefund.UploadFileToDocumentaryManager(documentaryManagerMultipleUploadCriteria, SHOW_SPINNER);
    }

    function GetDocumentLiquidation(documentLiquidationGetCriteria) {
      return proxyDocumentLiquidation.GetDocumentLiquidationBy(documentLiquidationGetCriteria, SHOW_SPINNER);
    }

    function SaveDocumentLiquidation(documentLiquidationSoatSaveCriteria) {
      return proxyDocumentLiquidation.SaveDocumentLiquidationBy(documentLiquidationSoatSaveCriteria, SHOW_SPINNER);
    }

    function UploadObservation(anioDocuControlNumberUserCriteria) {
      return proxyDocumentLiquidation.UpdateDocumentObserved(anioDocuControlNumberUserCriteria, SHOW_SPINNER)
    }

    function GetDocumentObservedDetail(documentObservedCriteria) {
      return proxyRefundTray.GetDocumentObservedBy(documentObservedCriteria, SHOW_SPINNER);
    }

    function GetRefundTrayDetailDocumentBy(refundTrayDetailGetCriteria) {
      return proxyRefundTray.GetRefundTrayDetailDocumentBy(refundTrayDetailGetCriteria, SHOW_SPINNER);
    }

    function GetPreLiquidation(preLiquidationGetCriteria) {
      return proxyPreLiquidation.GetPreLiquidationBy(preLiquidationGetCriteria, SHOW_SPINNER)
    }

    function SavePreLiquidation(preLiquidationSaveCriteria) {
      return proxyPreLiquidation.SavePreLiquidation(preLiquidationSaveCriteria, SHOW_SPINNER);
    }

    function GetComprobantesList(invoicePreLiquidationGetAllCriteria) {
      return proxyInvoicePreLiquidation.GetAllInvoicePreLiquidationBy(invoicePreLiquidationGetAllCriteria, SHOW_SPINNER);
    }

    function SaveComprobante(invoicePreLiquidationSaveCriteria) {
      return proxyInvoicePreLiquidation
        .SaveInvoicePreLiquidationWithProceduresBy(invoicePreLiquidationSaveCriteria, SHOW_SPINNER)
    }

    function UpdateComprobante(invoicePreLiquidationUpdateCriteria) {
      return proxyInvoicePreLiquidation
        .UpdateInvoicePreLiquidationWithProceduresBy(invoicePreLiquidationUpdateCriteria, SHOW_SPINNER)
    }

    function GetDefaultInvoiceDisconnected() {
      return proxyInvoicePreLiquidation.GetDefaultValuesForInvoicePreLiq(SHOW_SPINNER);
    }

    function GetDocumentNumberValid(invoicePreLiquidationDocumentExistsCriteria) {
      return proxyInvoicePreLiquidation.GetDocumentNumberIsValid(invoicePreLiquidationDocumentExistsCriteria, SHOW_SPINNER);
    }

    function GetAllProcedures(idCompany) {
      return proxyProcedure.GetAllProcedureBy(idCompany, SHOW_SPINNER);
    }

    function GetRazSocialByRuc(criteria) {
      return proxyProvider.GetRucAndDescriptionBy(criteria, SHOW_SPINNER);
    }

    function SaveCompany(providerVariousSaveCriteria) {
      return proxyProvider.SaveProviderVarious(providerVariousSaveCriteria, SHOW_SPINNER)
    }

    function GetCustomerInfo(customerDescriptionCriteria) {
      return proxyCustomer.GetCustomerInfoBy(customerDescriptionCriteria, SHOW_SPINNER)
    }

    // function declarations cgw

    function GetDiagnosticList(criteria) {
      return proxyDiagnostic.Resource_Diagnostic_Get_Diagnostic(criteria, SHOW_SPINNER);
    }

    function GetBenefitList() {
      return proxyMedicalCare.Resource_MedicalCare_Get_Query(SHOW_SPINNER);
    }

    //salud
    //salud
    function GetAllBenefitsBy(idCompany, criteria) {
      return proxyRequestRefund.GetAllBenefitsBy(idCompany, criteria, SHOW_SPINNER);
    }

    function GetAllDocumentsReceivedType() {
      return proxyRequestRefund.GetAllDocumentsReceivedType(SHOW_SPINNER);
    }

    function GetAffiliateInfoPlan(affiliateInfoPlanCriteria) {
      return proxyRequestRefundEps.GetAffiliateInfoPlan(affiliateInfoPlanCriteria, SHOW_SPINNER);
    }

    function GetAffiliateClients(clientCriteria) {
      return proxyRequestRefundEps.GetAffiliateClients(clientCriteria, SHOW_SPINNER);
    }

    function SaveDocumentEps(rqRefundEpsDocumentDto) {
      return proxyDocumentLiquidation.SaveDocumentEps(rqRefundEpsDocumentDto, SHOW_SPINNER);
    }

    function GetDocument(anioDocuControlNumberCriteria) {
      return proxyRequestRefundEps.GetDocument(anioDocuControlNumberCriteria, SHOW_SPINNER);
    }

    function ValidTreatmentDate(documentTreatmentCriteria) {
      return proxyRequestRefundEps.ValidTreatmentDate(documentTreatmentCriteria, SHOW_SPINNER);
    }

    function SaveSolicitudeDisconnectedSalud(rqRefundEpsHealth) {
      return proxyFinishRequestRefundEps.SaveRefundForHealth(rqRefundEpsHealth, SHOW_SPINNER)
    }

    function GetDocumentNumberIsValid(invoicePreLiquidationDocumentExistsCriteria) {
      return proxyInvoicePreLiquidation.GetDocumentNumberIsValid(invoicePreLiquidationDocumentExistsCriteria, SHOW_SPINNER)
    }

    // broker
    function GetBrokerList(criteria) {
      return proxyBroker.GetAllBrokerBy(criteria, SHOW_SPINNER);
    }

    function GetEjecutivoList(criteria) {
      return proxyUser.GetUserExecutiveBy(criteria, SHOW_SPINNER);
    }

    function GetMedicList(criteria, productCode) {
      return proxyUser.GetResponsibleDoctorBy(criteria, productCode, SHOW_SPINNER);
    }

    //documents

    function GetAllDocumentStatus() {
      return proxyDocumentStatus.GetAllDocumentStatus(SHOW_SPINNER);
    }

    function GetAllRefundTrayBy(refundTrayCriteria) {
      return proxyRefundTray.GetAllRefundTrayBy(refundTrayCriteria, SHOW_SPINNER);
    }

    function SetRefundOrder(refundOrderCriteria) {
      return proxyRefundTray.SetRefundOrder(refundOrderCriteria, SHOW_SPINNER);
    }

    function GetStateDocument() {
      return proxyRefundTray.GetAllCustomDocumentStatus(SHOW_SPINNER);
    }

    // EPS
    function GetAllBenefitEps(benefitsEpsCriteria) {
      return proxyBenefit.GetAllBenefitEpsSalud(benefitsEpsCriteria, SHOW_SPINNER);
    }

    //documents

    // common
    function FromDateToString(date) {
      if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var formatDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
        return formatDate;
      } else {
        throw new Error('Argument is not Date type');
      }
    }

    function DatePicker(model, options, validate) {
      var vDefaultOptions = {
        formatYear: 'yy',
        initDate: null,
        maxDate: null,
        minDate: null,
        startingDay: 1
      };
      var vOptions = options || {};
      var vMegerOptions = angular.merge({}, vDefaultOptions, vOptions);

      this.model = model || null;
      this.options = vMegerOptions;
      this.open = false;
      this.FORMAT_DATE = constants.formats.dateFormat;
      this.FORMAT_MASK = constants.formats.dateFormatMask;
      this.FORMAT_PATTERN = constants.formats.dateFormatRegex;
      this.ALT_INPUT_FORMATS = ['M!/d!/yyyy'];
      this.validate = validate || {};

      function _setModel(model) {
        this.model = model;
      }

      function _setInitDate(initDate) {
        this.options.initDate = initDate;
      }

      function _setMaxDate(maxDate) {
        this.options.maxDate = maxDate;
      }

      function _setMinDate(minDate) {
        this.options.minDate = minDate;
      }

      function _setOpen(open) {
        this.open = open;
      }

      function _setFormatDate(formatDate) {
        this.FORMAT_DATE = formatDate;
      }

      function _setFormatMask(formatMask) {
        this.FORMAT_MASK = formatMask;
      }

      function _setFormatPattern(formatPattern) {
        this.FORMAT_PATTERN = formatPattern;
      }

      function _setAltInputFormats(altInputFormats) {
        this.ALT_INPUT_FORMATS = altInputFormats;
      }

      function _setValidate(validate) {
        var vSetValidate = angular.merge({}, this.validate, validate);
        this.validate = vSetValidate;
      }

      this.setModel = _setModel;
      this.setInitDate = _setInitDate;
      this.setMaxDate = _setMaxDate;
      this.setMinDate = _setMinDate;
      this.setOpen = _setOpen;
      this.setFormatDate = _setFormatDate;
      this.setFormatMask = _setFormatMask;
      this.setFormatPattern = _setFormatPattern;
      this.setAltInputFormats = _setAltInputFormats;
      this.setValidate = _setValidate;
    }

    function AddDaysToDate(fecha, dias) {
      var newdate = fecha;
      newdate.setDate(newdate.getDate() + dias);
      return newdate;
    }

    function FormatDate(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var formatDate = day + '/' + month + '/' + year;
      return date instanceof Date ? formatDate : 'Error: argument date is not Date type';
    }

    // privates

    function _downloadMedia(mediaPath, opts) {
      var deferred = $q.defer();
      mpSpin.start();
      $http
        .get(constants.system.api.endpoints.reembolso2 + mediaPath, {
          responseType: 'arraybuffer'
        })
        .success(
          function (data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');
            var FileName = opts.fileName;
            var blob = new Blob([data], {
              type: type
            });
            fileSaver(blob, FileName);
            deferred.resolve(FileName);
            mpSpin.end();
          },
          function () {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function (data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function _buildReqUpload(apiPath, params) {
      var deferred = $q.defer();
      var fd = new FormData();
      var keyParams = _.keys(params);
      _.forEach(keyParams, function pFe(item) {
        fd.append(item, params[item]);
      });
      mpSpin.start();
      $http
        .post(apiPath, fd, {
          transformRequest: ng.identity,
          headers: {
            'Content-Type': undefined
          },
          uploadEventHandlers: {
            progress: function (ev) {
              $log.log('UploadProgress total: ' + ev.total);
            }
          }
        })
        .then(function (response) {
          mpSpin.end();
          deferred.resolve(response);
        })
        .catch(function ucsErrHttp(err) {
          mpSpin.end();
          $log.error('Falló la carga de fotos', err);
        });

      return deferred.promise;
    }

    function GetAllBeneficiaryByFilters(documentControlNumber, anio, tipoFiltro, valorfiltro) {
      return proxySinisterBeneficiary.GetAllBeneficiaryByFilters(documentControlNumber, anio, tipoFiltro, valorfiltro, true);
    }

    return ng.extend({}, factory);
  }

  return ng
    .module('appReembolso.factory', [
      'oim.proxyService.cgw',
      'oim.proxyService.reembolso',
      'oim.proxyService.reembolso2',
      'appReembolso.factoryMedicalAssistance',
      'appReembolso.factoryPersonalAccidents',
      'appReembolso.factoryReassignExecutive',
      'appReembolso.factoryMaintenance'
    ])
    .factory('reFactory', reFactory);
});
