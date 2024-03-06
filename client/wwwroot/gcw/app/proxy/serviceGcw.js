/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.gcw", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyGcw', {
        endpoint: constants.system.api.endpoints['gcw'],
        controllerSelfSettlement: {
            actions : {
                'methodselfSettlementGetPendingCommissions':{
                    name:  'selfSettlementGetPendingCommissions',
                    path: 'api/self-settlement/comissions'
                },
                'methodselfSettlementAgentValidation':{
                    name:  'selfSettlementAgentValidation',
                    path: 'api/self-settlement/validation'
                },
                'methodselfSettlementGenerationPaymentOrders':{
                    name:  'selfSettlementGenerationPaymentOrders',
                    path: 'api/self-settlement/payment-order/massive'
                },
                'methodselfSettlementCancellationPaymentOrders':{
                    name:  'selfSettlementCancellationPaymentOrders',
                    path: 'api/self-settlement/payment-order/{orderId}/cancellation'
                },
                'methodselfSettlementInvoiceUploader':{
                    name:  'selfSettlementInvoiceUploader',
                    path: 'api/self-settlement/invoice/uploader'
                },
            }
        },
        controllerGenerated: {
            actions : {
                'methodgetCommissionListGenerated':{
                    name:  'getCommissionListGenerated',
                    path: 'api/commission/generated/paging'
                },
                'methodgetCommissionReportGenerated':{
                    name:  'getCommissionReportGenerated',
                    path: 'api/commission/generated/download'
                },
                'methodGetList':{
                    name:  'GetList',
                    path: 'api/commission/generated/getList'
                },
            }
        },
        controllerAccident: {
            actions : {
                'methodgetDetailAccident':{
                    name:  'getDetailAccident',
                    path: 'api/accident/paging'
                },
            }
        },
        controllerDetraction: {
            actions : {
                'methodgetCommissionListDetractionPaging':{
                    name:  'getCommissionListDetractionPaging',
                    path: 'api/commission/detraction/paging'
                },
                'methodGetDetraction':{
                    name:  'GetDetraction',
                    path: 'api/commission/detraction'
                },
                'methodgetCommissionReportDetraction':{
                    name:  'getCommissionReportDetraction',
                    path: 'api/commission/detraction/download'
                },
            }
        },
        controllerNetworkAgent: {
            actions : {
                'methodgetListNetworkTray':{
                    name:  'getListNetworkTray',
                    path: 'api/networkagent/agenttray/paging'
                },
                'methodgetListAgentClient':{
                    name:  'getListAgentClient',
                    path: 'api/networkagent/agentclient/paging'
                },
                'methodgetListAgentClientDetail':{
                    name:  'getListAgentClientDetail',
                    path: 'api/networkagent/agentclientdetail/paging'
                },
                'methodgetListAgentClientFilterIntegrality':{
                    name:  'getListAgentClientFilterIntegrality',
                    path: 'api/networkagent/agentclient/filterintegrality'
                },
                'methodgetListAgentClientFilterExpirationPolicy':{
                    name:  'getListAgentClientFilterExpirationPolicy',
                    path: 'api/networkagent/agentclient/filterexpirationpolicy'
                },
                'methodgetListAgentClientFilterDelinquency':{
                    name:  'getListAgentClientFilterDelinquency',
                    path: 'api/networkagent/agentclient/filterdelinquency'
                },
                'methodgetListAgentClientFilterPolicyType':{
                    name:  'getListAgentClientFilterPolicyType',
                    path: 'api/networkagent/agentclient/filterpolictytype'
                },
                'methodgetListAgentClientDetailDownload':{
                    name:  'getListAgentClientDetailDownload',
                    path: 'api/networkagent/agentclientdetail/download'
                },
                'methodgetListAgentClientDownload':{
                    name:  'getListAgentClientDownload',
                    path: 'api/networkagent/agentclient/download'
                },
            }
        },
        controllerDashboardOffice: {
            actions : {
                'methodgetIntegralitySection':{
                    name:  'getIntegralitySection',
                    path: 'api/dashboardoffice/integrality'
                },
                'methodgetPolicyIndicatorSection':{
                    name:  'getPolicyIndicatorSection',
                    path: 'api/dashboardoffice/policyindicator'
                },
                'methodgetAgentDetail':{
                    name:  'getAgentDetail',
                    path: 'api/dashboardoffice/agentdetail'
                },
                'methodgetSummaryIntegrality':{
                    name:  'getSummaryIntegrality',
                    path: 'api/dashboardoffice/integralitysummary'
                },
                'methodgetSummaryIntegralityYear':{
                    name:  'getSummaryIntegralityYear',
                    path: 'api/dashboardoffice/integralitysummaryyear'
                },
                'methodgetSummaryPolicyType':{
                    name:  'getSummaryPolicyType',
                    path: 'api/dashboardoffice/policytypesummary'
                },
                'methodgetTotalClients':{
                    name:  'getTotalClients',
                    path: 'api/dashboardoffice/totalclients'
                },
                'methodgetListAgentDetailDownload':{
                    name:  'getListAgentDetailDownload',
                    path: 'api/dashboardoffice/agentdetail/downloadd'
                },
            }
        },
        controllerBranchClient: {
            actions : {
                'methodgetCommissionListBranchClient':{
                    name:  'getCommissionListBranchClient',
                    path: 'api/commission/branchClient/paging'
                },
                'methodgetCommissionReportBranchClient':{
                    name:  'getCommissionReportBranchClient',
                    path: 'api/commission/branchClient/download'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodgetAutoCompleteManager':{
                    name:  'getAutoCompleteManager',
                    path: 'api/lookup/manager/{filter}/{codeOffice}/{roleCode}'
                },
                'methodgetListManagerCollectionEmail':{
                    name:  'getListManagerCollectionEmail',
                    path: 'api/lookup/managerCollectionEmail/{companyId}/{id}'
                },
                'methodgetAutoCompleteAgent':{
                    name:  'getAutoCompleteAgent',
                    path: 'api/lookup/agent/{idManager}/{filter}/{codeOffice}/{roleCode}/{networkId}'
                },
                'methodgetAutoCompleteOffice':{
                    name:  'getAutoCompleteOffice',
                    path: 'api/lookup/office/{filter}'
                },
                'methodgetDocumentType':{
                    name:  'getDocumentType',
                    path: 'api/lookup/documentType'
                },
                'methodgetListRamo':{
                    name:  'getListRamo',
                    path: 'api/lookup/ramo?sectorCode={sectorCode}'
                },
                'methodgetListRamoBySectorCode':{
                    name:  'getListRamoBySectorCode',
                    path: 'api/lookup/ramo/{sectorCode}'
                },
                'methodgetListRamoMapfre':{
                    name:  'getListRamoMapfre',
                    path: 'api/lookup/ramo/mapfre?companyId={companyId}'
                },
                'methodgetListRamoMapfreByCompanyId':{
                    name:  'getListRamoMapfreByCompanyId',
                    path: 'api/lookup/ramo/mapfre/{companyId}'
                },
                'methodgetLookupAgentManagerByPolicy':{
                    name:  'getLookupAgentManagerByPolicy',
                    path: 'api/lookup/agentManager/policy'
                },
                'methodgetReplacementCarStatus':{
                    name:  'getReplacementCarStatus',
                    path: 'api/lookup/replacementCar/status'
                },
                'methodgetReplacementCarProvider':{
                    name:  'getReplacementCarProvider',
                    path: 'api/lookup/replacementCar/providers'
                },
                'methodgetLookupValidadeAgent':{
                    name:  'getLookupValidadeAgent',
                    path: 'api/lookup/validadeAgent/{agentId}/{agentIdSelected}/{companyId}/{roleCode}'
                },
                'methodgetLookupValidateAgent':{
                    name:  'getLookupValidateAgent',
                    path: 'api/lookup/validateAgent'
                },
                'methodGetAllNetworks':{
                    name:  'GetAllNetworks',
                    path: 'api/lookup/network'
                },
            }
        },
        controllerPolicy: {
            actions : {
                'methodgetListPagingPolicyFilter':{
                    name:  'getListPagingPolicyFilter',
                    path: 'api/policy/paging'
                },
                'methodgetReportListPolicyFilter':{
                    name:  'getReportListPolicyFilter',
                    path: 'api/policy/download'
                },
                'methodgetValidatePolicy':{
                    name:  'getValidatePolicy',
                    path: 'api/policy/validate/{policyNumber}/{roleType}/{codeManagerOffice}'
                },
                'methodgetListPolicySegmentationType':{
                    name:  'getListPolicySegmentationType',
                    path: 'api/policy/segmentation'
                },
                'methodSendPoliciesUncertified':{
                    name:  'SendPoliciesUncertified',
                    path: 'api/policy/send'
                },
            }
        },
        controllerSector: {
            actions : {
                'methodGetSectors':{
                    name:  'GetSectors',
                    path: 'api/sector'
                },
                'methodGetListSubSector':{
                    name:  'GetListSubSector',
                    path: 'api/sector/{sectorId}/subsector'
                },
                'methodGetListRamosBySector':{
                    name:  'GetListRamosBySector',
                    path: 'api/sector/{sectorId}/subsector/{subSectorId}/ramo'
                },
            }
        },
        controllerRenewal: {
            actions : {
                'methodgetDetailRenewalPaging':{
                    name:  'getDetailRenewalPaging',
                    path: 'api/renewal/paging'
                },
                'methodgetDetailRenewal':{
                    name:  'getDetailRenewal',
                    path: 'api/renewal/list'
                },
                'methodgetRenewalDownload':{
                    name:  'getRenewalDownload',
                    path: 'api/renewal/download'
                },
                'methodgetRenewalSinisterDownload':{
                    name:  'getRenewalSinisterDownload',
                    path: 'api/renewal/download/sinister'
                },
                'methodgetRenewalEmail':{
                    name:  'getRenewalEmail',
                    path: 'api/renewal/email'
                },
                'methodgetDataPolicyElectronic':{
                    name:  'getDataPolicyElectronic',
                    path: 'api/renewal/dataPolicyElectronic'
                },
                'methodgetregisterFlagPolicyElectronic':{
                    name:  'getregisterFlagPolicyElectronic',
                    path: 'api/renewal/registerFlagPolicyElectronic'
                },
            }
        },
        controllerBenefit: {
            actions : {
                'methodgetBenefitListPagingBenefitFilter':{
                    name:  'getBenefitListPagingBenefitFilter',
                    path: 'api/benefit/paging'
                },
                'methodgetBenefitListPBenefitFilter':{
                    name:  'getBenefitListPBenefitFilter',
                    path: 'api/benefit/download'
                },
            }
        },
        controllerLiquidationSoat: {
            actions : {
                'methodgetCollectionSoatPaging':{
                    name:  'getCollectionSoatPaging',
                    path: 'api/collection/soat/paging'
                },
                'methodgetCollectionRegisterSoat':{
                    name:  'getCollectionRegisterSoat',
                    path: 'api/collection/soat/register'
                },
                'methodgetCollectionRegisterSoatSelected':{
                    name:  'getCollectionRegisterSoatSelected',
                    path: 'api/collection/soat/register/selected'
                },
                'methodgetCollectionReportSoat':{
                    name:  'getCollectionReportSoat',
                    path: 'api/collection/soat/download?extensionFile={extensionFile}'
                },
                'methodgetCollectionReportSoatV2':{
                    name:  'getCollectionReportSoatV2',
                    path: 'api/collection/soat/download/{extension}'
                },
                'methodgetCollectionListSoatHeaderPaging':{
                    name:  'getCollectionListSoatHeaderPaging',
                    path: 'api/collection/soat/history/paging'
                },
                'methodgetCollectionCancelSoatCab':{
                    name:  'getCollectionCancelSoatCab',
                    path: 'api/collection/soat/history/cancel/{preSettlement}'
                },
                'methodgetCollectionReportSoatHistory':{
                    name:  'getCollectionReportSoatHistory',
                    path: 'api/collection/soat/history/download'
                },
                'methodgetCollectionSendEmailConsult':{
                    name:  'getCollectionSendEmailConsult',
                    path: 'api/collection/soat/email/consult'
                },
            }
        },
        controllerPerson: {
            actions : {
                'methodgetListPersonType':{
                    name:  'getListPersonType',
                    path: 'api/person/type'
                },
                'methodgetListPagingPersonFilter':{
                    name:  'getListPagingPersonFilter',
                    path: 'api/person/paging'
                },
                'methodgetListPagingPersonEpsFilter':{
                    name:  'getListPagingPersonEpsFilter',
                    path: 'api/person/eps/paging'
                },
            }
        },
        controllerMapfreDollar: {
            actions : {
                'methodgetMapfreDollarListMapfreDollarPaging':{
                    name:  'getMapfreDollarListMapfreDollarPaging',
                    path: 'api/mapfredollar/paging'
                },
                'methodgetMapfreDollarReportMapfreDollar':{
                    name:  'getMapfreDollarReportMapfreDollar',
                    path: 'api/mapfredollar/download'
                },
                'methodgetMapfreDollarListStateMapfreDollarPaging':{
                    name:  'getMapfreDollarListStateMapfreDollarPaging',
                    path: 'api/mapfredollar/state/paging'
                },
                'methodgetMapfreDollarReportStateMapfreDollar':{
                    name:  'getMapfreDollarReportStateMapfreDollar',
                    path: 'api/mapfredollar/state/download'
                },
            }
        },
        controllerElement: {
            actions : {
                'methodgetListPaidDocumentType':{
                    name:  'getListPaidDocumentType',
                    path: 'api/lookup/document/paid'
                },
                'methodgetLookupListCommercialSegment':{
                    name:  'getLookupListCommercialSegment',
                    path: 'api/lookup/commercialSegment'
                },
                'methodgetListSector':{
                    name:  'getListSector',
                    path: 'api/lookup/sector'
                },
                'methodgetListProcessDate':{
                    name:  'getListProcessDate',
                    path: 'api/lookup/processDate'
                },
                'methodgetListPolicyType':{
                    name:  'getListPolicyType',
                    path: 'api/lookup/policyType'
                },
                'methodgetListSituation':{
                    name:  'getListSituation',
                    path: 'api/lookup/situation'
                },
                'methodgetListDocumentTypePolicy':{
                    name:  'getListDocumentTypePolicy',
                    path: 'api/lookup/document/type'
                },
                'methodgetLookupListStateRenovation':{
                    name:  'getLookupListStateRenovation',
                    path: 'api/lookup/stateRenovation'
                },
                'methodgetLookupListStateCCC':{
                    name:  'getLookupListStateCCC',
                    path: 'api/lookup/stateCCC'
                },
            }
        },
        controllerSinisterCar: {
            actions : {
                'methodgetSinisterListSinisterCarPaging':{
                    name:  'getSinisterListSinisterCarPaging',
                    path: 'api/sinister/car/paging'
                },
                'methodgetSinisterReportSinister':{
                    name:  'getSinisterReportSinister',
                    path: 'api/sinister/car/download'
                },
                'methodgetSinisterSinisterCarDetail':{
                    name:  'getSinisterSinisterCarDetail',
                    path: 'api/sinister/car/detail/{companyId}/{numberSinister}/{roleType}'
                },
                'methodgetSinisterReportSinisterCarDetailDownload':{
                    name:  'getSinisterReportSinisterCarDetailDownload',
                    path: 'api/sinister/car/detail/download/{companyId}/{numberSinister}/{roleType}/{agentId}'
                },
                'methodgetSinisterNotificationSinister':{
                    name:  'getSinisterNotificationSinister',
                    path: 'api/sinister/car/notification'
                },
                'methodgetSinisterListPayment':{
                    name:  'getSinisterListPayment',
                    path: 'api/sinister/car/documentPayment/{checkNumber}/{companyId}/{documentNumber}'
                },
                'methodgetSinisterDetailPaymentDownload':{
                    name:  'getSinisterDetailPaymentDownload',
                    path: 'api/sinister/car/detailPayment/download/{companyId}/{issuerVoucher}/{documentNumber}/{sinisterOrigin}/{wayPay}'
                },
                'methodgetSinisterRetentionDownload':{
                    name:  'getSinisterRetentionDownload',
                    path: 'api/sinister/car/retention/download/{companyId}/{retention}/{sinisterOrigin}'
                },
                'methodgetSinisterDocumentDownload':{
                    name:  'getSinisterDocumentDownload',
                    path: 'api/sinister/car/document/{idDocument}?formato={formato}'
                },
            }
        },
        controllerHistory: {
            actions : {
                'methodgetCollectionVoucherPaymentReport':{
                    name:  'getCollectionVoucherPaymentReport',
                    path: 'api/history/voucher/download'
                },
                'methodgetCollectionGetDonwloadInvoice':{
                    name:  'getCollectionGetDonwloadInvoice',
                    path: 'api/history/invoice/download'
                },
            }
        },
        controllerPayment: {
            actions : {
                'methodgetListPendingPayment':{
                    name:  'getListPendingPayment',
                    path: 'api/payment/pending/paging'
                },
                'methodgetListPagingHistoryPayment':{
                    name:  'getListPagingHistoryPayment',
                    path: 'api/payment/history/paging'
                },
                'methodgetReportHistoryPayment':{
                    name:  'getReportHistoryPayment',
                    path: 'api/payment/history/download'
                },
                'methodgetListDocumentPayment2':{
                    name:  'getListDocumentPayment2',
                    path: 'api/payment/document/paging2'
                },
                'methodgetListDocumentPayment':{
                    name:  'getListDocumentPayment',
                    path: 'api/payment/document/paging/group'
                },
                'methodgetReportDocumentPayment':{
                    name:  'getReportDocumentPayment',
                    path: 'api/payment/document/download'
                },
                'methodgetReportDocumentPayment2':{
                    name:  'getReportDocumentPayment2',
                    path: 'api/payment/document/download2'
                },
                'methodgetDocumentByNumber':{
                    name:  'getDocumentByNumber',
                    path: 'api/payment/document'
                },
                'methodgetDocumentStateByNumber':{
                    name:  'getDocumentStateByNumber',
                    path: 'api/payment/documentState'
                },
                'methodgetReportReceiptDocument':{
                    name:  'getReportReceiptDocument',
                    path: 'api/payment/document/receipt/download'
                },
                'methodgetReportReceiptDocumentEmail':{
                    name:  'getReportReceiptDocumentEmail',
                    path: 'api/payment/document/receipt/email'
                },
                'methodgetLinkPago':{
                    name:  'getLinkPago',
                    path: 'api/payment/linkPago'
                },
                'methodgetSendLinkPago':{
                    name:  'getSendLinkPago',
                    path: 'api/payment/sendLinkPago'
                },
                'methodgetCoordinationTypes':{
                    name: 'getCoordinationTypes',
                    path: 'lookup/bitacora/tipoCoordinacion'
                },
                'methodRegisterContact': {
                    name: 'registerContact',
                    path: 'payment/bitacora/add'
                },
                'methodgetRegisteredLogs': {
                    name: 'getRegisteredLogs',
                    path: 'payment/document/bitacora'
                },
                'methodgetLinkAfiliacion':{
                    name:  'getLinkAfiliacion',
                    path: 'api/payment/linkAfiliacion'
                },
                'methodgetSendLinkAfiliacion':{
                    name:  'getSendLinkAfiliacion',
                    path: 'api/payment/sendLinkAfiliacion'
                },
            }
        },
        controllerRenovation: {
            actions : {
                'methodgetRenovationListRenovationPaging':{
                    name:  'getRenovationListRenovationPaging',
                    path: 'api/renovation/paging'
                },
                'methodgetRenovationReportRenovation':{
                    name:  'getRenovationReportRenovation',
                    path: 'api/renovation/download'
                },
                'methodgetRenovationListRenovationResumePaging':{
                    name:  'getRenovationListRenovationResumePaging',
                    path: 'api/renovation/resume/paging'
                },
                'methodgetRenovationReportRenovationResume':{
                    name:  'getRenovationReportRenovationResume',
                    path: 'api/renovation/resume/download'
                },
                'methodgetRenovationResumeDetail':{
                    name:  'getRenovationResumeDetail',
                    path: 'api/renovation/resume/detail'
                },
            }
        },
        controllerCancellation: {
            actions : {
                'methodgetCollectionListCollectionPaging':{
                    name:  'getCollectionListCollectionPaging',
                    path: 'api/collection/cancellation/paging'
                },
                'methodgetCollectionReportListCollection':{
                    name:  'getCollectionReportListCollection',
                    path: 'api/collection/cancellation/download'
                },
                'methodgetCollectionReceipPendingDownload':{
                    name:  'getCollectionReceipPendingDownload',
                    path: 'api/collection/cancellation/receipPending/download'
                },
            }
        },
        controllerLiquidated: {
            actions : {
                'methodgetCommissionListLiquidatedPaging':{
                    name:  'getCommissionListLiquidatedPaging',
                    path: 'api/commission/liquidated/paging'
                },
                'methodgetCommissionReportLiquidated':{
                    name:  'getCommissionReportLiquidated',
                    path: 'api/commission/liquidated/download'
                },
                'methodgetCommissionReportLiquidatedDetail':{
                    name:  'getCommissionReportLiquidatedDetail',
                    path: 'api/commission/liquidated/download/detail'
                },
                'methodgetCommissionReportLiquidatedPreviousBalance':{
                    name:  'getCommissionReportLiquidatedPreviousBalance',
                    path: 'api/commission/liquidated/download/previousBalance'
                },
            }
        },
        controllerSinister: {
            actions : {
                'methodgetReplacementCar':{
                    name:  'getReplacementCar',
                    path: 'api/sinister/car/replacement/search'
                },
                'methodgetPayRoll':{
                    name:  'getPayRoll',
                    path: 'api/sinister/payroll/search'
                },
                'methodgetPayRollDownload':{
                    name:  'getPayRollDownload',
                    path: 'api/sinister/download/car'
                },
                'methodgetProvidersRequests':{
                    name:  'getProvidersRequests',
                    path: 'api/sinister/provider/requests'
                },
                'methodgetProvider':{
                    name:  'getProvider',
                    path: 'api/sinister/provider/search'
                },
                'methodaddProvider':{
                    name:  'addProvider',
                    path: 'api/sinister/provider/add'
                },
                'methodupdateProvider':{
                    name:  'updateProvider',
                    path: 'api/sinister/provider/edit'
                },
                'methodgetProviderId':{
                    name:  'getProviderId',
                    path: 'api/sinister/provider/{document}'
                },
                'methodgetCarFactories':{
                    name:  'getCarFactories',
                    path: 'api/sinister/car/factories/{name}/{company}'
                },
                'methodsetCarFactory':{
                    name:  'setCarFactory',
                    path: 'api/sinister/car/factory/notification'
                },
                'methodgetPolicyPrint':{
                    name:  'getPolicyPrint',
                    path: 'api/sinister/policy/print'
                },
                'methodperformRequest':{
                    name:  'performRequest',
                    path: 'api/sinister/car/replacement/request'
                },
                'methodRptPayRoll':{
                    name:  'RptPayRoll',
                    path: 'api/Sinister?extension={extension}'
                },
            }
        },
        controllerState: {
            actions : {
                'methodgetCollectionListStatePaging':{
                    name:  'getCollectionListStatePaging',
                    path: 'api/collection/state/paging'
                },
                'methodgetReportListState':{
                    name:  'getReportListState',
                    path: 'api/collection/state/download'
                },
            }
        },
        controllerParameter: {
            actions : {
                'methodgetListParameterByGroup':{
                    name:  'getListParameterByGroup',
                    path: 'api/lookup/parameterByGroup/{codeGroup}'
                },
                'methodgetListStatusPolicy':{
                    name:  'getListStatusPolicy',
                    path: 'api/lookup/statusPolicy'
                },
                'methodgetListCoinGlobal':{
                    name:  'getListCoinGlobal',
                    path: 'api/lookup/coinGlobal'
                },
                'methodgetListCoin':{
                    name:  'getListCoin',
                    path: 'api/lookup/coin'
                },
                'methodGetLookupListTypeliquidated':{
                    name:  'GetLookupListTypeliquidated',
                    path: 'api/lookup/typeLiquidated'
                },
                'methodgetLookupTypeClient':{
                    name:  'getLookupTypeClient',
                    path: 'api/lookup/typeClient'
                },
                'methodgetLookupStateSinister':{
                    name:  'getLookupStateSinister',
                    path: 'api/lookup/stateSinister'
                },
                'methodgetLookupGeneralStatus':{
                    name:  'getLookupGeneralStatus',
                    path: 'api/lookup/stateGeneral'
                },
                'methodgetLookupExternalLink':{
                    name:  'getLookupExternalLink',
                    path: 'api/lookup/externalLink'
                },
                'methodgetTypeUse':{
                    name:  'getTypeUse',
                    path: 'api/lookup/typeUse'
                },
            }
        },
        controllerInvoicesIssued: {
            actions : {
                'methodgetCollectionInvoicesIssuedListPaging':{
                    name:  'getCollectionInvoicesIssuedListPaging',
                    path: 'api/invoicesIssued/paging'
                },
                'methodgetCollectionInvoicesIssuedReport':{
                    name:  'getCollectionInvoicesIssuedReport',
                    path: 'api/invoicesIssued/download'
                },
            }
        },
        controllerVoucherForwarded: {
            actions : {
                'methodgetCollectionListVoucherForwardedPaging':{
                    name:  'getCollectionListVoucherForwardedPaging',
                    path: 'api/collection/VoucherForwarded/paging'
                },
                'methodgetCollectionReportVoucherForwarded':{
                    name:  'getCollectionReportVoucherForwarded',
                    path: 'api/collection/VoucherForwarded/download'
                },
            }
        },
        controllerMovement: {
            actions : {
                'methodgetCommissionListMovement':{
                    name:  'getCommissionListMovement',
                    path: 'api/commission/movement/paging'
                },
                'methodgetCommissionReportMovement':{
                    name:  'getCommissionReportMovement',
                    path: 'api/commission/movement/download'
                },
            }
        },
        controllerDocument: {
            actions : {
                'methodgetCollectionReportStatementAccount':{
                    name:  'getCollectionReportStatementAccount',
                    path: 'api/collection/document/statementAccount/download'
                },
            }
        },
        controllerStateReceipt: {
            actions : {
                'methodgetCommissionListStateReceipt':{
                    name:  'getCommissionListStateReceipt',
                    path: 'api/commission/stateReceipt/paging'
                },
                'methodgetCommissionReportStateReceipt':{
                    name:  'getCommissionReportStateReceipt',
                    path: 'api/commission/stateReceipt/download'
                },
            }
        },
        controllerSecurity: {
            actions : {
                'methodgetTicketUser':{
                    name:  'getTicketUser',
                    path: 'api/security/ticket'
                },
            }
        }
    })



     module.factory("proxySelfSettlement", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'selfSettlementGetPendingCommissions' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/self-settlement/comissions',
                                         filter, undefined, showSpin)
                },
                'selfSettlementAgentValidation' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/self-settlement/validation',
                                         request, undefined, showSpin)
                },
                'selfSettlementGenerationPaymentOrders' : function(paymentOrder, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/self-settlement/payment-order/massive',
                                         paymentOrder, undefined, showSpin)
                },
                'selfSettlementCancellationPaymentOrders' : function(orderId, request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + helper.formatNamed('api/self-settlement/payment-order/{orderId}/cancellation',
                                                    { 'orderId':orderId   }),
                                         request, undefined, showSpin)
                },
                'selfSettlementInvoiceUploader' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/self-settlement/invoice/uploader',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyGenerated", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListGenerated' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/generated/paging',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportGenerated' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/generated/download',
                                         undefined, undefined, showSpin)
                },
                'GetList' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/generated/getList',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAccident", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getDetailAccident' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/accident/paging',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDetraction", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListDetractionPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/detraction/paging',
                                         filter, undefined, showSpin)
                },
                'GetDetraction' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/detraction',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportDetraction' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/detraction/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyNetworkAgent", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListNetworkTray' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/networkagent/agenttray/paging',
                                         filter, undefined, showSpin)
                },
                'getListAgentClient' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/paging',
                                         filter, undefined, showSpin)
                },
                'getListAgentClientDetail' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/networkagent/agentclientdetail/paging',
                                         filter, undefined, showSpin)
                },
                'getListAgentClientFilterIntegrality' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/filterintegrality',
                                         undefined, undefined, showSpin)
                },
                'getListAgentClientFilterExpirationPolicy' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/filterexpirationpolicy',
                                         undefined, undefined, showSpin)
                },
                'getListAgentClientFilterDelinquency' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/filterdelinquency',
                                         undefined, undefined, showSpin)
                },
                'getListAgentClientFilterPolicyType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/filterpolictytype',
                                         undefined, undefined, showSpin)
                },
                'getListAgentClientDetailDownload' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/networkagent/agentclientdetail/download',
                                         filter, undefined, showSpin)
                },
                'getListAgentClientDownload' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/networkagent/agentclient/download',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDashboardOffice", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getIntegralitySection' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/integrality',
                                         filter, undefined, showSpin)
                },
                'getPolicyIndicatorSection' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/policyindicator',
                                         filter, undefined, showSpin)
                },
                'getAgentDetail' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/agentdetail',
                                         filter, undefined, showSpin)
                },
                'getSummaryIntegrality' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/integralitysummary',
                                         filter, undefined, showSpin)
                },
                'getSummaryIntegralityYear' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/integralitysummaryyear',
                                         filter, undefined, showSpin)
                },
                'getSummaryPolicyType' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/policytypesummary',
                                         filter, undefined, showSpin)
                },
                'getTotalClients' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/totalclients',
                                         filter, undefined, showSpin)
                },
                'getListAgentDetailDownload' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/dashboardoffice/agentdetail/downloadd',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBranchClient", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListBranchClient' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/branchClient/paging',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportBranchClient' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/branchClient/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getAutoCompleteManager' : function(filter, codeOffice, roleCode, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/manager/{filter}/{codeOffice}/{roleCode}',
                                                    { 'filter':filter  ,'codeOffice':codeOffice  ,'roleCode':roleCode   }),
                                         undefined, undefined, showSpin)
                },
                'getListManagerCollectionEmail' : function(companyId, id, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/managerCollectionEmail/{companyId}/{id}',
                                                    { 'companyId':companyId  ,'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'getAutoCompleteAgent' : function(idManager, filter, codeOffice, roleCode, networkId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/agent/{idManager}/{filter}/{codeOffice}/{roleCode}/{networkId}',
                                                    { 'idManager':idManager  ,'filter':filter  ,'codeOffice':codeOffice  ,'roleCode':roleCode  ,'networkId':  { value: networkId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'getAutoCompleteOffice' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/office/{filter}',
                                                    { 'filter':filter   }),
                                         undefined, undefined, showSpin)
                },
                'getDocumentType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/documentType',
                                         undefined, undefined, showSpin)
                },
                'getListRamo' : function(sectorCode, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/ramo?sectorCode={sectorCode}',
                                                    { 'sectorCode':  { value: sectorCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'getListRamoBySectorCode' : function(sectorCode, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/ramo/{sectorCode}',
                                                    { 'sectorCode':  { value: sectorCode, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'getListRamoMapfre' : function(companyId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/ramo/mapfre?companyId={companyId}',
                                                    { 'companyId':  { value: companyId, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'getListRamoMapfreByCompanyId' : function(companyId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/ramo/mapfre/{companyId}',
                                                    { 'companyId':  { value: companyId, defaultValue:'0' }  }),
                                         undefined, undefined, showSpin)
                },
                'getLookupAgentManagerByPolicy' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/lookup/agentManager/policy',
                                         filter, undefined, showSpin)
                },
                'getReplacementCarStatus' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/replacementCar/status',
                                         undefined, undefined, showSpin)
                },
                'getReplacementCarProvider' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/replacementCar/providers',
                                         undefined, undefined, showSpin)
                },
                'getLookupValidadeAgent' : function(agentId, agentIdSelected, companyId, roleCode, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/validadeAgent/{agentId}/{agentIdSelected}/{companyId}/{roleCode}',
                                                    { 'agentId':agentId  ,'agentIdSelected':agentIdSelected  ,'companyId':companyId  ,'roleCode':roleCode   }),
                                         undefined, undefined, showSpin)
                },
                'getLookupValidateAgent' : function(validateAgent, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/lookup/validateAgent',
                                         validateAgent, undefined, showSpin)
                },
                'GetAllNetworks' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/network',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicy", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListPagingPolicyFilter' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/policy/paging',
                                         filter, undefined, showSpin)
                },
                'getReportListPolicyFilter' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/policy/download',
                                         undefined, undefined, showSpin)
                },
                'getValidatePolicy' : function(policyNumber, roleType, codeManagerOffice, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/policy/validate/{policyNumber}/{roleType}/{codeManagerOffice}',
                                                    { 'policyNumber':policyNumber  ,'roleType':roleType  ,'codeManagerOffice':codeManagerOffice   }),
                                         undefined, undefined, showSpin)
                },
                'getListPolicySegmentationType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/policy/segmentation',
                                         undefined, undefined, showSpin)
                },
                'SendPoliciesUncertified' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/policy/send',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySector", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'GetSectors' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/sector',
                                         undefined, undefined, showSpin)
                },
                'GetListSubSector' : function(sectorId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sector/{sectorId}/subsector',
                                                    { 'sectorId':sectorId   }),
                                         undefined, undefined, showSpin)
                },
                'GetListRamosBySector' : function(sectorId, subSectorId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sector/{sectorId}/subsector/{subSectorId}/ramo',
                                                    { 'sectorId':sectorId  ,'subSectorId':subSectorId   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRenewal", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getDetailRenewalPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/paging',
                                         filter, undefined, showSpin)
                },
                'getDetailRenewal' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/list',
                                         filter, undefined, showSpin)
                },
                'getRenewalDownload' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/download',
                                         undefined, undefined, showSpin)
                },
                'getRenewalSinisterDownload' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/download/sinister',
                                         undefined, undefined, showSpin)
                },
                'getRenewalEmail' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/email',
                                         filter, undefined, showSpin)
                },
                'getDataPolicyElectronic' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/dataPolicyElectronic',
                                         filter, undefined, showSpin)
                },
                'getregisterFlagPolicyElectronic' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renewal/registerFlagPolicyElectronic',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBenefit", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getBenefitListPagingBenefitFilter' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/benefit/paging',
                                         filter, undefined, showSpin)
                },
                'getBenefitListPBenefitFilter' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/benefit/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLiquidationSoat", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionSoatPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/paging',
                                         filter, undefined, showSpin)
                },
                'getCollectionRegisterSoat' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/register',
                                         filter, undefined, showSpin)
                },
                'getCollectionRegisterSoatSelected' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/register/selected',
                                         filter, undefined, showSpin)
                },
                'getCollectionReportSoat' : function(extensionFile, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + helper.formatNamed('api/collection/soat/download?extensionFile={extensionFile}',
                                                    { 'extensionFile':  { value: extensionFile, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'getCollectionReportSoatV2' : function(extension, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + helper.formatNamed('api/collection/soat/download/{extension}',
                                                    { 'extension':extension   }),
                                         undefined, undefined, showSpin)
                },
                'getCollectionListSoatHeaderPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/history/paging',
                                         filter, undefined, showSpin)
                },
                'getCollectionCancelSoatCab' : function(preSettlement, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/collection/soat/history/cancel/{preSettlement}',
                                                    { 'preSettlement':preSettlement   }),
                                         undefined, undefined, showSpin)
                },
                'getCollectionReportSoatHistory' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/history/download',
                                         undefined, undefined, showSpin)
                },
                'getCollectionSendEmailConsult' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/soat/email/consult',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPerson", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListPersonType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/person/type',
                                         undefined, undefined, showSpin)
                },
                'getListPagingPersonFilter' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/person/paging',
                                         filter, undefined, showSpin)
                },
                'getListPagingPersonEpsFilter' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/person/eps/paging',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMapfreDollar", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getMapfreDollarListMapfreDollarPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/mapfredollar/paging',
                                         filter, undefined, showSpin)
                },
                'getMapfreDollarReportMapfreDollar' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/mapfredollar/download',
                                         undefined, undefined, showSpin)
                },
                'getMapfreDollarListStateMapfreDollarPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/mapfredollar/state/paging',
                                         filter, undefined, showSpin)
                },
                'getMapfreDollarReportStateMapfreDollar' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/mapfredollar/state/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyElement", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListPaidDocumentType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/document/paid',
                                         undefined, undefined, showSpin)
                },
                'getLookupListCommercialSegment' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/commercialSegment',
                                         undefined, undefined, showSpin)
                },
                'getListSector' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/sector',
                                         undefined, undefined, showSpin)
                },
                'getListProcessDate' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/processDate',
                                         undefined, undefined, showSpin)
                },
                'getListPolicyType' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/policyType',
                                         undefined, undefined, showSpin)
                },
                'getListSituation' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/situation',
                                         undefined, undefined, showSpin)
                },
                'getListDocumentTypePolicy' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/document/type',
                                         undefined, undefined, showSpin)
                },
                'getLookupListStateRenovation' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/stateRenovation',
                                         undefined, undefined, showSpin)
                },
                'getLookupListStateCCC' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/stateCCC',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinisterCar", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getSinisterListSinisterCarPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/paging',
                                         filter, undefined, showSpin)
                },
                'getSinisterReportSinister' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/download',
                                         undefined, undefined, showSpin)
                },
                'getSinisterSinisterCarDetail' : function(companyId, numberSinister, roleType, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/detail/{companyId}/{numberSinister}/{roleType}',
                                                    { 'companyId':companyId  ,'numberSinister':numberSinister  ,'roleType':roleType   }),
                                         undefined, undefined, showSpin)
                },
                'getSinisterReportSinisterCarDetailDownload' : function(companyId, numberSinister, roleType, agentId, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/detail/download/{companyId}/{numberSinister}/{roleType}/{agentId}',
                                                    { 'companyId':companyId  ,'numberSinister':numberSinister  ,'roleType':roleType  ,'agentId':agentId   }),
                                         undefined, undefined, showSpin)
                },
                'getSinisterNotificationSinister' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/notification',
                                         filter, undefined, showSpin)
                },
                'getSinisterListPayment' : function(checkNumber, companyId, documentNumber, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/documentPayment/{checkNumber}/{companyId}/{documentNumber}',
                                                    { 'checkNumber':checkNumber  ,'companyId':companyId  ,'documentNumber':documentNumber   }),
                                         undefined, undefined, showSpin)
                },
                'getSinisterDetailPaymentDownload' : function(companyId, issuerVoucher, documentNumber, sinisterOrigin, wayPay, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/detailPayment/download/{companyId}/{issuerVoucher}/{documentNumber}/{sinisterOrigin}/{wayPay}',
                                                    { 'companyId':companyId  ,'issuerVoucher':issuerVoucher  ,'documentNumber':documentNumber  ,'sinisterOrigin':sinisterOrigin  ,'wayPay':wayPay   }),
                                         undefined, undefined, showSpin)
                },
                'getSinisterRetentionDownload' : function(companyId, retention, sinisterOrigin, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/retention/download/{companyId}/{retention}/{sinisterOrigin}',
                                                    { 'companyId':companyId  ,'retention':retention  ,'sinisterOrigin':sinisterOrigin   }),
                                         undefined, undefined, showSpin)
                },
                'getSinisterDocumentDownload' : function(idDocument, formato, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/document/{idDocument}?formato={formato}',
                                                    { 'idDocument':idDocument  ,'formato':  { value: formato, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyHistory", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionVoucherPaymentReport' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/history/voucher/download',
                                         undefined, undefined, showSpin)
                },
                'getCollectionGetDonwloadInvoice' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/history/invoice/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPayment", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListPendingPayment' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/pending/paging',
                                         filter, undefined, showSpin)
                },
                'getListPagingHistoryPayment' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/history/paging',
                                         filter, undefined, showSpin)
                },
                'getReportHistoryPayment' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/history/download',
                                         undefined, undefined, showSpin)
                },
                'getListDocumentPayment2' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/paging2',
                                         filter, undefined, showSpin)
                },
                'getListDocumentPayment' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/paging/group',
                                         filter, undefined, showSpin)
                },
                'getReportDocumentPayment' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/download',
                                         request, undefined, showSpin)
                },
                'getReportDocumentPayment2' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/download2',
                                         undefined, undefined, showSpin)
                },
                'getDocumentByNumber' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document',
                                         filter, undefined, showSpin)
                },
                'getDocumentStateByNumber' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/documentState',
                                         filter, undefined, showSpin)
                },
                'getReportReceiptDocument' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/receipt/download',
                                         undefined, undefined, showSpin)
                },
                'getReportReceiptDocumentEmail' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/document/receipt/email',
                                         filter, undefined, showSpin)
                },
                'getLinkPago' : function(tokenPaymentRq, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/linkPago',
                                         tokenPaymentRq, undefined, showSpin)
                },
                'getSendLinkPago' : function(tokenPaymentRq, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/sendLinkPago',
                                         tokenPaymentRq, undefined, showSpin)
                },
                'getCoordinationTypes': function(showSpin) {
                    var datalog = 'log';
                    console.log(datalog);

                    return httpData['get'](
                        oimProxyGcw.endpoint + 'api/lookup/bitacora/tipoCoordinacion',
                        undefined, undefined, showSpin
                    );
                },
                'registerContact' : function(requestBody, showSpin){
                    return httpData['post'](
                        oimProxyGcw.endpoint + 'api/payment/bitacora/add',
                        requestBody, undefined, showSpin)
                },
                'getRegisteredLogs': function(requestBody, showSpin) {
                    return httpData['post'](
                        oimProxyGcw.endpoint + 'api/payment/document/bitacora',
                        requestBody, undefined, showSpin
                    );
                },
                'getLinkAfiliacion' : function(tokenAffiliationRq, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/linkAfiliacion',
                                         tokenAffiliationRq, undefined, showSpin)
                },
                'getSendLinkAfiliacion' : function(tokenAffiliationRq, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/payment/sendLinkAfiliacion',
                                         tokenAffiliationRq, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyRenovation", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getRenovationListRenovationPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renovation/paging',
                                         filter, undefined, showSpin)
                },
                'getRenovationReportRenovation' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renovation/download',
                                         undefined, undefined, showSpin)
                },
                'getRenovationListRenovationResumePaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renovation/resume/paging',
                                         filter, undefined, showSpin)
                },
                'getRenovationReportRenovationResume' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renovation/resume/download',
                                         undefined, undefined, showSpin)
                },
                'getRenovationResumeDetail' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/renovation/resume/detail',
                                         filter, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCancellation", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionListCollectionPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/cancellation/paging',
                                         filter, undefined, showSpin)
                },
                'getCollectionReportListCollection' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/cancellation/download',
                                         request, undefined, showSpin)
                },
                'getCollectionReceipPendingDownload' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/cancellation/receipPending/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLiquidated", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListLiquidatedPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/liquidated/paging',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportLiquidated' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/liquidated/download',
                                         undefined, undefined, showSpin)
                },
                'getCommissionReportLiquidatedDetail' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/liquidated/download/detail',
                                         undefined, undefined, showSpin)
                },
                'getCommissionReportLiquidatedPreviousBalance' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/liquidated/download/previousBalance',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinister", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getReplacementCar' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/replacement/search',
                                         request, undefined, showSpin)
                },
                'getPayRoll' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/payroll/search',
                                         request, undefined, showSpin)
                },
                'getPayRollDownload' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/download/car',
                                         request, undefined, showSpin)
                },
                'getProvidersRequests' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/sinister/provider/requests',
                                         undefined, undefined, showSpin)
                },
                'getProvider' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/provider/search',
                                         request, undefined, showSpin)
                },
                'addProvider' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/provider/add',
                                         request, undefined, showSpin)
                },
                'updateProvider' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/provider/edit',
                                         request, undefined, showSpin)
                },
                'getProviderId' : function(document, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/provider/{document}',
                                                    { 'document':document   }),
                                         undefined, undefined, showSpin)
                },
                'getCarFactories' : function(name, company, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/sinister/car/factories/{name}/{company}',
                                                    { 'name':name  ,'company':company   }),
                                         undefined, undefined, showSpin)
                },
                'setCarFactory' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/factory/notification',
                                         request, undefined, showSpin)
                },
                'getPolicyPrint' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/policy/print',
                                         request, undefined, showSpin)
                },
                'performRequest' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/sinister/car/replacement/request',
                                         request, undefined, showSpin)
                },
                'RptPayRoll' : function(request, extension, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + helper.formatNamed('api/Sinister?extension={extension}',
                                                    { 'extension':extension   }),
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyState", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionListStatePaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/state/paging',
                                         filter, undefined, showSpin)
                },
                'getReportListState' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/state/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyParameter", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getListParameterByGroup' : function(codeGroup, showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + helper.formatNamed('api/lookup/parameterByGroup/{codeGroup}',
                                                    { 'codeGroup':codeGroup   }),
                                         undefined, undefined, showSpin)
                },
                'getListStatusPolicy' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/statusPolicy',
                                         undefined, undefined, showSpin)
                },
                'getListCoinGlobal' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/coinGlobal',
                                         undefined, undefined, showSpin)
                },
                'getListCoin' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/coin',
                                         undefined, undefined, showSpin)
                },
                'GetLookupListTypeliquidated' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/typeLiquidated',
                                         undefined, undefined, showSpin)
                },
                'getLookupTypeClient' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/typeClient',
                                         undefined, undefined, showSpin)
                },
                'getLookupStateSinister' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/stateSinister',
                                         undefined, undefined, showSpin)
                },
                'getLookupGeneralStatus' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/stateGeneral',
                                         undefined, undefined, showSpin)
                },
                'getLookupExternalLink' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/externalLink',
                                         undefined, undefined, showSpin)
                },
                'getTypeUse' : function( showSpin){
                    return httpData['get'](oimProxyGcw.endpoint + 'api/lookup/typeUse',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInvoicesIssued", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionInvoicesIssuedListPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/invoicesIssued/paging',
                                         filter, undefined, showSpin)
                },
                'getCollectionInvoicesIssuedReport' : function(request, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/invoicesIssued/download',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyVoucherForwarded", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionListVoucherForwardedPaging' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/VoucherForwarded/paging',
                                         filter, undefined, showSpin)
                },
                'getCollectionReportVoucherForwarded' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/VoucherForwarded/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMovement", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListMovement' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/movement/paging',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportMovement' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/movement/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocument", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCollectionReportStatementAccount' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/collection/document/statementAccount/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyStateReceipt", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getCommissionListStateReceipt' : function(filter, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/stateReceipt/paging',
                                         filter, undefined, showSpin)
                },
                'getCommissionReportStateReceipt' : function( showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/commission/stateReceipt/download',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySecurity", ['oimProxyGcw', 'httpData', function(oimProxyGcw, httpData){
        return {
                'getTicketUser' : function(securityUserRq, showSpin){
                    return httpData['post'](oimProxyGcw.endpoint + 'api/security/ticket',
                                         securityUserRq, undefined, showSpin)
                }
        };
     }]);
});
