/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.farmapfre", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyFarmapfre', {
        endpoint: constants.system.api.endpoints['farmapfre'],
        controllerProvider: {
            actions : {
                'methodGetBranchOffices':{
                    name:  'GetBranchOffices',
                    path: 'api/provider/{providerCode}/branchoffices?onlyCM={onlyCM}'
                },
                'methodSearch':{
                    name:  'Search',
                    path: 'api/provider/branchoffice/search'
                },
                'methodGetRelationsProviderPharmaciesPremises':{
                    name:  'GetRelationsProviderPharmaciesPremises',
                    path: 'api/provider/{providerCode}/branchoffice/{branchOfficeCode}/relation/pharmacy-premises'
                },
                'methodSaveRelationProviderPharmaciesPremises':{
                    name:  'SaveRelationProviderPharmaciesPremises',
                    path: 'api/provider/branchoffice/relation/pharmacy-premises/save'
                },
                'methodGetPremisesForProviderBranchOfficePharmacy':{
                    name:  'GetPremisesForProviderBranchOfficePharmacy',
                    path: 'api/provider/{providerId}/branchoffice/{branchOfficeId}/allied-pharmacy/{pharmacyId}/premises'
                },
            }
        },
        controllerSiteds: {
            actions : {
                'methodGetReportAuthorizationSiteds':{
                    name:  'GetReportAuthorizationSiteds',
                    path: 'api/siteds/report/authorization/download'
                },
            }
        },
        controllerDocumentType: {
            actions : {
                'methodGetDocumentTypes':{
                    name:  'GetDocumentTypes',
                    path: 'api/document/type'
                },
            }
        },
        controllerBODistrict: {
            actions : {
                'methodSearch':{
                    name:  'Search',
                    path: 'api/bodistrict/search'
                },
                'methodAdd':{
                    name:  'Add',
                    path: 'api/BODistrict'
                },
                'methodUpdate':{
                    name:  'Update',
                    path: 'api/BODistrict'
                },
                'methodDelete':{
                    name:  'Delete',
                    path: 'api/BODistrict/{id}'
                },
            }
        },
        controllerMovementType: {
            actions : {
                'methodGetMovementType':{
                    name:  'GetMovementType',
                    path: 'api/movement/type'
                },
                'methodGetMovementTypeDispatch':{
                    name:  'GetMovementTypeDispatch',
                    path: 'api/movement/dispatch/type'
                },
            }
        },
        controllerWarehouse: {
            actions : {
                'methodGet':{
                    name:  'Get',
                    path: 'api/warehouse?branchId={branchId}'
                },
            }
        },
        controllerUser: {
            actions : {
                'methodGetUsersConfig':{
                    name:  'GetUsersConfig',
                    path: 'api/user/configuration?filter={filter}&boDispatch={boDispatch}&pageSize={pageSize}&pageNumber={pageNumber}'
                },
                'methodSaveUserConfig':{
                    name:  'SaveUserConfig',
                    path: 'api/user/{userCode}/configuration'
                },
                'methodUpdateUserConfig':{
                    name:  'UpdateUserConfig',
                    path: 'api/user/{userCode}/configuration'
                },
            }
        },
        controllerParameter: {
            actions : {
                'methodGetParameterOrderRefresh':{
                    name:  'GetParameterOrderRefresh',
                    path: 'api/parameter/order/refresh'
                },
                'methodGetParameterDispatchRefresh':{
                    name:  'GetParameterDispatchRefresh',
                    path: 'api/parameter/dispatch/refresh'
                },
            }
        },
        controllerSurvey: {
            actions : {
                'methodSaveSurvey':{
                    name:  'SaveSurvey',
                    path: 'api/survey'
                },
                'methodGetSurveyFarmapfre':{
                    name:  'GetSurveyFarmapfre',
                    path: 'api/survey'
                },
                'methodGetSurveyGroups':{
                    name:  'GetSurveyGroups',
                    path: 'api/survey/group?filter={filter}&pageSize={pageSize}&pageNumber={pageNumber}'
                },
                'methodUpdateSurvey':{
                    name:  'UpdateSurvey',
                    path: 'api/survey/{surveyId}'
                },
                'methodSendSurveyMail':{
                    name:  'SendSurveyMail',
                    path: 'api/survey/sendMailTest?mail={mail}'
                },
                'methodDownloadReportSurvey':{
                    name:  'DownloadReportSurvey',
                    path: 'api/survey/report?type={type}&firstDate={firstDate}&lastDate={lastDate}'
                },
            }
        },
        controllerUbigeo: {
            actions : {
                'methodGetDepartments':{
                    name:  'GetDepartments',
                    path: 'api/ubigeo/departments'
                },
                'methodGetProvinces':{
                    name:  'GetProvinces',
                    path: 'api/ubigeo/department/{departmentCode}/provinces'
                },
                'methodGetDistricts':{
                    name:  'GetDistricts',
                    path: 'api/ubigeo/province/{provinceCode}/districts'
                },
                'methodGetDistrictsLimaCallao':{
                    name:  'GetDistrictsLimaCallao',
                    path: 'api/ubigeo/province/lima-callao/districts'
                },
            }
        },
        controllerAttentionType: {
            actions : {
                'methodGetAttentionTypesFromMedicalCenters':{
                    name:  'GetAttentionTypesFromMedicalCenters',
                    path: 'api/attentionType'
                },
            }
        },
        controllerInsured: {
            actions : {
                'methodGetInsured':{
                    name:  'GetInsured',
                    path: 'api/insured/{documentType}/{documentNumber}'
                },
                'methodSendDeliveredSmsEmail':{
                    name:  'SendDeliveredSmsEmail',
                    path: 'api/insured/resend/sms-email'
                },
                'methodGetReportInfoResendSmsEmail':{
                    name:  'GetReportInfoResendSmsEmail',
                    path: 'api/insured/resend/report/download'
                },
            }
        },
        controllerAudit: {
            actions : {
                'methodGetAuditReasons':{
                    name:  'GetAuditReasons',
                    path: 'api/audit/reasons'
                },
            }
        },
        controllerAlliedPharmacy: {
            actions : {
                'methodSearch':{
                    name:  'Search',
                    path: 'api/allied-pharmacy/search'
                },
                'methodGetAlliedPharmacyById':{
                    name:  'GetAlliedPharmacyById',
                    path: 'api/allied-pharmacy/{id}'
                },
                'methodSave':{
                    name:  'Save',
                    path: 'api/allied-pharmacy/save'
                },
                'methodSearchPremises':{
                    name:  'SearchPremises',
                    path: 'api/allied-pharmacy/premises/search'
                },
                'methodGetAlliedPharmacyForCollect':{
                    name:  'GetAlliedPharmacyForCollect',
                    path: 'api/allied-pharmacy/collect'
                },
                'methodSavePremises':{
                    name:  'SavePremises',
                    path: 'api/allied-pharmacy/premises/save'
                },
            }
        },
        controllerOrder: {
            actions : {
                'methodSearchOrder':{
                    name:  'SearchOrder',
                    path: 'api/order/search'
                },
                'methodGetOrderById':{
                    name:  'GetOrderById',
                    path: 'api/order/{id}'
                },
                'methodSaveOrder':{
                    name:  'SaveOrder',
                    path: 'api/order/{id}'
                },
                'methodGetHeadOrderById':{
                    name:  'GetHeadOrderById',
                    path: 'api/order/{id}/head'
                },
                'methodGetOrderDetailsById':{
                    name:  'GetOrderDetailsById',
                    path: 'api/order/{id}/details'
                },
                'methodSaveOrderDetail':{
                    name:  'SaveOrderDetail',
                    path: 'api/order/detail'
                },
                'methodCancelOrder':{
                    name:  'CancelOrder',
                    path: 'api/order/cancel'
                },
                'methodSavePreOrders':{
                    name:  'SavePreOrders',
                    path: 'api/order/preorder'
                },
                'methodGetPreOrders':{
                    name:  'GetPreOrders',
                    path: 'api/order/{orderId}/preorders'
                },
                'methodSaveDispatchs':{
                    name:  'SaveDispatchs',
                    path: 'api/order/dispatch'
                },
                'methodSearchDispatch':{
                    name:  'SearchDispatch',
                    path: 'api/order/dispatch/search'
                },
                'methodGetDispatch':{
                    name:  'GetDispatch',
                    path: 'api/order/{id}/dispatch/{dispatchId}'
                },
                'methodSendDispatch':{
                    name:  'SendDispatch',
                    path: 'api/order/dispatch/send?id={id}&dispatchId={dispatchId}'
                },
                'methodConfirmDeliveryDispatch':{
                    name:  'ConfirmDeliveryDispatch',
                    path: 'api/order/dispatch/confirm?id={id}&dispatchId={dispatchId}'
                },
                'methodCancelDispatch':{
                    name:  'CancelDispatch',
                    path: 'api/order/dispatch/cancel'
                },
                'methodTransferOrder':{
                    name:  'TransferOrder',
                    path: 'api/order/{id}/transfer'
                },
                'methodAuditOrder':{
                    name:  'AuditOrder',
                    path: 'api/order/{id}/audit'
                },
                'methodGetAuditOrder':{
                    name:  'GetAuditOrder',
                    path: 'api/order/{id}/audit/{auditId}'
                },
                'methodGetOrdersConfig':{
                    name:  'GetOrdersConfig',
                    path: 'api/order/configuration?boDispatchId={boDispatchId}&warehouseId={warehouseId}'
                },
                'methodSaveOrderConfig':{
                    name:  'SaveOrderConfig',
                    path: 'api/order/configuration'
                },
                'methodUpdateOrderConfig':{
                    name:  'UpdateOrderConfig',
                    path: 'api/order/configuration'
                },
                'methodSaveDeliveryMan':{
                    name:  'SaveDeliveryMan',
                    path: 'api/order/{orderId}/dispatch/{dispatchId}/deliveryMan'
                },
                'methodGetDeliveryMan':{
                    name:  'GetDeliveryMan',
                    path: 'api/order/{orderId}/dispatch/{dispatchId}/deliveryMan'
                },
                'methodGetDeliveryEvidences':{
                    name:  'GetDeliveryEvidences',
                    path: 'api/order/{orderId}/dispatch/{dispatchId}/evidences'
                },
            }
        },
        controllerBODispatch: {
            actions : {
                'methodSearch':{
                    name:  'Search',
                    path: 'api/bodispatch/search'
                },
                'methodAdd':{
                    name:  'Add',
                    path: 'api/BODispatch'
                },
                'methodUpdate':{
                    name:  'Update',
                    path: 'api/BODispatch'
                },
                'methodDelete':{
                    name:  'Delete',
                    path: 'api/BODispatch/{id}'
                },
            }
        },
        controllerTeCuidamos: {
            actions : {
                'methodGetAllProgramsDelivery':{
                    name:  'GetAllProgramsDelivery',
                    path: 'api/tecuidamos/programs'
                },
            }
        },
        controllerMedicine: {
            actions : {
                'methodSearchMedicine':{
                    name:  'SearchMedicine',
                    path: 'api/medicine/search/{boDispachId}/{name}'
                },
            }
        },
        controllerProduct: {
            actions : {
                'methodGetProducts':{
                    name:  'GetProducts',
                    path: 'api/Product'
                },
            }
        },
        controllerMotiveCancel: {
            actions : {
                'methodGetAll':{
                    name:  'GetAll',
                    path: 'api/MotiveCancel/{id}'
                },
            }
        },
        controllerDistrict: {
            actions : {
                'methodGetAll':{
                    name:  'GetAll',
                    path: 'api/District'
                },
            }
        },
        controllerPayType: {
            actions : {
                'methodGetPayType':{
                    name:  'GetPayType',
                    path: 'api/PayType'
                },
            }
        },
        controllerCreditCardType: {
            actions : {
                'methodGetCreditCardType':{
                    name:  'GetCreditCardType',
                    path: 'api/CreditCardType'
                },
            }
        }
    })



     module.factory("proxyProvider", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetBranchOffices' : function(providerCode, onlyCM, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/provider/{providerCode}/branchoffices?onlyCM={onlyCM}',
                                                    { 'providerCode':providerCode  ,'onlyCM':  { value: onlyCM, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'Search' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/provider/branchoffice/search',
                                         request, undefined, showSpin)
                },
                'GetRelationsProviderPharmaciesPremises' : function(providerCode, branchOfficeCode, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/provider/{providerCode}/branchoffice/{branchOfficeCode}/relation/pharmacy-premises',
                                                    { 'providerCode':providerCode  ,'branchOfficeCode':branchOfficeCode   }),
                                         undefined, undefined, showSpin)
                },
                'SaveRelationProviderPharmaciesPremises' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/provider/branchoffice/relation/pharmacy-premises/save',
                                         request, undefined, showSpin)
                },
                'GetPremisesForProviderBranchOfficePharmacy' : function(providerId, branchOfficeId, pharmacyId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/provider/{providerId}/branchoffice/{branchOfficeId}/allied-pharmacy/{pharmacyId}/premises',
                                                    { 'providerId':providerId  ,'branchOfficeId':branchOfficeId  ,'pharmacyId':pharmacyId   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySiteds", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetReportAuthorizationSiteds' : function(param, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/siteds/report/authorization/download',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocumentType", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetDocumentTypes' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/document/type',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBODistrict", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'Search' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/bodistrict/search',
                                         request, undefined, showSpin)
                },
                'Add' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/BODistrict',
                                         request, undefined, showSpin)
                },
                'Update' : function(request, showSpin){
                    return httpData['put'](oimProxyFarmapfre.endpoint + 'api/BODistrict',
                                         request, undefined, showSpin)
                },
                'Delete' : function(id, showSpin){
                    return httpData['delete'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/BODistrict/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMovementType", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetMovementType' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/movement/type',
                                         undefined, undefined, showSpin)
                },
                'GetMovementTypeDispatch' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/movement/dispatch/type',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyWarehouse", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'Get' : function(branchId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/warehouse?branchId={branchId}',
                                                    { 'branchId':branchId   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUser", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetUsersConfig' : function(filter, boDispatch, pageSize, pageNumber, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/user/configuration?filter={filter}&boDispatch={boDispatch}&pageSize={pageSize}&pageNumber={pageNumber}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'boDispatch':  { value: boDispatch, defaultValue:'' } ,'pageSize':  { value: pageSize, defaultValue:'10' } ,'pageNumber':  { value: pageNumber, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveUserConfig' : function(userCode, request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/user/{userCode}/configuration',
                                                    { 'userCode':userCode   }),
                                         request, undefined, showSpin)
                },
                'UpdateUserConfig' : function(userCode, request, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/user/{userCode}/configuration',
                                                    { 'userCode':userCode   }),
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyParameter", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetParameterOrderRefresh' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/parameter/order/refresh',
                                         undefined, undefined, showSpin)
                },
                'GetParameterDispatchRefresh' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/parameter/dispatch/refresh',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySurvey", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'SaveSurvey' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/survey',
                                         request, undefined, showSpin)
                },
                'GetSurveyFarmapfre' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/survey',
                                         undefined, undefined, showSpin)
                },
                'GetSurveyGroups' : function(filter, pageSize, pageNumber, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/survey/group?filter={filter}&pageSize={pageSize}&pageNumber={pageNumber}',
                                                    { 'filter':  { value: filter, defaultValue:'' } ,'pageSize':  { value: pageSize, defaultValue:'100' } ,'pageNumber':  { value: pageNumber, defaultValue:'1' }  }),
                                         undefined, undefined, showSpin)
                },
                'UpdateSurvey' : function(surveyId, request, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/survey/{surveyId}',
                                                    { 'surveyId':surveyId   }),
                                         request, undefined, showSpin)
                },
                'SendSurveyMail' : function(mail, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/survey/sendMailTest?mail={mail}',
                                                    { 'mail':mail   }),
                                         undefined, undefined, showSpin)
                },
                'DownloadReportSurvey' : function(type, firstDate, lastDate, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/survey/report?type={type}&firstDate={firstDate}&lastDate={lastDate}',
                                                    { 'type':type  ,'firstDate':firstDate  ,'lastDate':lastDate   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyUbigeo", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetDepartments' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/ubigeo/departments',
                                         undefined, undefined, showSpin)
                },
                'GetProvinces' : function(departmentCode, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/ubigeo/department/{departmentCode}/provinces',
                                                    { 'departmentCode':departmentCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetDistricts' : function(provinceCode, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/ubigeo/province/{provinceCode}/districts',
                                                    { 'provinceCode':provinceCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetDistrictsLimaCallao' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/ubigeo/province/lima-callao/districts',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAttentionType", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetAttentionTypesFromMedicalCenters' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/attentionType',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyInsured", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetInsured' : function(documentType, documentNumber, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/insured/{documentType}/{documentNumber}',
                                                    { 'documentType':documentType  ,'documentNumber':documentNumber   }),
                                         undefined, undefined, showSpin)
                },
                'SendDeliveredSmsEmail' : function(req, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/insured/resend/sms-email',
                                         req, undefined, showSpin)
                },
                'GetReportInfoResendSmsEmail' : function(param, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/insured/resend/report/download',
                                         param, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAudit", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetAuditReasons' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/audit/reasons',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyAlliedPharmacy", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'Search' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/allied-pharmacy/search',
                                         request, undefined, showSpin)
                },
                'GetAlliedPharmacyById' : function(id, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/allied-pharmacy/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'Save' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/allied-pharmacy/save',
                                         request, undefined, showSpin)
                },
                'SearchPremises' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/allied-pharmacy/premises/search',
                                         request, undefined, showSpin)
                },
                'GetAlliedPharmacyForCollect' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/allied-pharmacy/collect',
                                         undefined, undefined, showSpin)
                },
                'SavePremises' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/allied-pharmacy/premises/save',
                                         request, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyOrder", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'SearchOrder' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/search',
                                         request, undefined, showSpin)
                },
                'GetOrderById' : function(id, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'SaveOrder' : function(id, request, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}',
                                                    { 'id':id   }),
                                         request, undefined, showSpin)
                },
                'GetHeadOrderById' : function(id, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/head',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'GetOrderDetailsById' : function(id, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/details',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                },
                'SaveOrderDetail' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/detail',
                                         request, undefined, showSpin)
                },
                'CancelOrder' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/cancel',
                                         request, undefined, showSpin)
                },
                'SavePreOrders' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/preorder',
                                         request, undefined, showSpin)
                },
                'GetPreOrders' : function(orderId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{orderId}/preorders',
                                                    { 'orderId':orderId   }),
                                         undefined, undefined, showSpin)
                },
                'SaveDispatchs' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/dispatch',
                                         request, undefined, showSpin)
                },
                'SearchDispatch' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/dispatch/search',
                                         request, undefined, showSpin)
                },
                'GetDispatch' : function(id, dispatchId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/dispatch/{dispatchId}',
                                                    { 'id':id  ,'dispatchId':dispatchId   }),
                                         undefined, undefined, showSpin)
                },
                'SendDispatch' : function(id, dispatchId, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/dispatch/send?id={id}&dispatchId={dispatchId}',
                                                    { 'id':id  ,'dispatchId':dispatchId   }),
                                         undefined, undefined, showSpin)
                },
                'ConfirmDeliveryDispatch' : function(id, dispatchId, files, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/dispatch/confirm?id={id}&dispatchId={dispatchId}',
                                                    { 'id':id  ,'dispatchId':dispatchId   }),
                                         files, undefined, showSpin)
                },
                'CancelDispatch' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/dispatch/cancel',
                                         request, undefined, showSpin)
                },
                'TransferOrder' : function(id, request, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/transfer',
                                                    { 'id':id   }),
                                         request, undefined, showSpin)
                },
                'AuditOrder' : function(id, request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/audit',
                                                    { 'id':id   }),
                                         request, undefined, showSpin)
                },
                'GetAuditOrder' : function(id, auditId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{id}/audit/{auditId}',
                                                    { 'id':id  ,'auditId':auditId   }),
                                         undefined, undefined, showSpin)
                },
                'GetOrdersConfig' : function(boDispatchId, warehouseId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/configuration?boDispatchId={boDispatchId}&warehouseId={warehouseId}',
                                                    { 'boDispatchId':  { value: boDispatchId, defaultValue:'' } ,'warehouseId':  { value: warehouseId, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveOrderConfig' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/order/configuration',
                                         request, undefined, showSpin)
                },
                'UpdateOrderConfig' : function(request, showSpin){
                    return httpData['patch'](oimProxyFarmapfre.endpoint + 'api/order/configuration',
                                         request, undefined, showSpin)
                },
                'SaveDeliveryMan' : function(orderId, dispatchId, request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{orderId}/dispatch/{dispatchId}/deliveryMan',
                                                    { 'orderId':orderId  ,'dispatchId':dispatchId   }),
                                         request, undefined, showSpin)
                },
                'GetDeliveryMan' : function(orderId, dispatchId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{orderId}/dispatch/{dispatchId}/deliveryMan',
                                                    { 'orderId':orderId  ,'dispatchId':dispatchId   }),
                                         undefined, undefined, showSpin)
                },
                'GetDeliveryEvidences' : function(orderId, dispatchId, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/order/{orderId}/dispatch/{dispatchId}/evidences',
                                                    { 'orderId':orderId  ,'dispatchId':dispatchId   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBODispatch", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'Search' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/bodispatch/search',
                                         request, undefined, showSpin)
                },
                'Add' : function(request, showSpin){
                    return httpData['post'](oimProxyFarmapfre.endpoint + 'api/BODispatch',
                                         request, undefined, showSpin)
                },
                'Update' : function(request, showSpin){
                    return httpData['put'](oimProxyFarmapfre.endpoint + 'api/BODispatch',
                                         request, undefined, showSpin)
                },
                'Delete' : function(id, showSpin){
                    return httpData['delete'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/BODispatch/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyTeCuidamos", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetAllProgramsDelivery' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/tecuidamos/programs',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMedicine", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'SearchMedicine' : function(boDispachId, name, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/medicine/search/{boDispachId}/{name}',
                                                    { 'boDispachId':boDispachId  ,'name':name   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyProduct", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetProducts' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/Product',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMotiveCancel", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetAll' : function(id, showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + helper.formatNamed('api/MotiveCancel/{id}',
                                                    { 'id':id   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDistrict", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetAll' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/District',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPayType", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetPayType' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/PayType',
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCreditCardType", ['oimProxyFarmapfre', 'httpData', function(oimProxyFarmapfre, httpData){
        return {
                'GetCreditCardType' : function( showSpin){
                    return httpData['get'](oimProxyFarmapfre.endpoint + 'api/CreditCardType',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
