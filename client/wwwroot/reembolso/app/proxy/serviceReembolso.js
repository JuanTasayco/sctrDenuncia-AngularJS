/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.reembolso", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyReembolso', {
        endpoint: constants.system.api.endpoints['reembolso'],
        controllerBeneficiary: {
            actions : {
                'methodResource_PowerEps_Beneficiary_GetAll':{
                    name:  'Resource_PowerEps_Beneficiary_GetAll',
                    path: 'api/Beneficiary/GetAll'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Beneficiary?key={key}'
                },
            }
        },
        controllerLocation: {
            actions : {
                'methodResource_PowerEps_Location_GetAllDepartment':{
                    name:  'Resource_PowerEps_Location_GetAllDepartment',
                    path: 'api/location/GetAllDepartment'
                },
                'methodResource_PowerEps_Location_GetAllProvinceBy':{
                    name:  'Resource_PowerEps_Location_GetAllProvinceBy',
                    path: 'api/location/GetAllProvince/{departmentCode}'
                },
                'methodResource_PowerEps_Location_GetAllDistrictBy':{
                    name:  'Resource_PowerEps_Location_GetAllDistrictBy',
                    path: 'api/location/GetAllDistrict/{departmentCode}/{idProvince}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Location?key={key}'
                },
            }
        },
        controllerDocument: {
            actions : {
                'methodResource_PowerEps_Document_Type_GetAll':{
                    name:  'Resource_PowerEps_Document_Type_GetAll',
                    path: 'api/document/GetAlltype'
                },
                'methodResource_PowerEps_Document_Received_Type':{
                    name:  'Resource_PowerEps_Document_Received_Type',
                    path: 'api/document/GetAllDocumentsReceivedType'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Document?key={key}'
                },
            }
        },
        controllerPowerEpsProduct: {
            actions : {
                'methodResource_PowerEps_Product_GetAll':{
                    name:  'Resource_PowerEps_Product_GetAll',
                    path: 'api/product/GetAll/{userCode}/{idCompany}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsProduct?key={key}'
                },
            }
        },
        controllerPowerEpsValidation: {
            actions : {
                'methodExistPolicyBy':{
                    name:  'ExistPolicyBy',
                    path: 'api/validation/existPolicy'
                },
                'methodPolicySupplementValid':{
                    name:  'PolicySupplementValid',
                    path: 'api/validation/PolicySupplementValid'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsValidation?key={key}'
                },
            }
        },
        controllerBroker: {
            actions : {
                'methodGetAllBrokerBy':{
                    name:  'GetAllBrokerBy',
                    path: 'api/broker/GetAll?searchCriteria={searchCriteria}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Broker?key={key}'
                },
            }
        },
        controllerSpecialty: {
            actions : {
                'methodResource_PowerEps_Specialty_GetAll':{
                    name:  'Resource_PowerEps_Specialty_GetAll',
                    path: 'api/Specialty/GetAll'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Specialty?key={key}'
                },
            }
        },
        controllerSinister: {
            actions : {
                'methodResource_PowerEps_Sinister_GenerateOpening':{
                    name:  'Resource_PowerEps_Sinister_GenerateOpening',
                    path: 'api/sinister/GenerateOpening'
                },
                'methodResource_PowerEps_CoverageSinister_GetAll':{
                    name:  'Resource_PowerEps_CoverageSinister_GetAll',
                    path: 'api/sinister/Coverage'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Sinister?key={key}'
                },
            }
        },
        controllerCompany: {
            actions : {
                'methodResource_PowerEps_Company_GetAll':{
                    name:  'Resource_PowerEps_Company_GetAll',
                    path: 'api/company/getAll/{userCode}/{systemCode}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Company?key={key}'
                },
            }
        },
        controllerPowerEpsLookUp: {
            actions : {
                'methodGetAllParametersForPowerEps':{
                    name:  'GetAllParametersForPowerEps',
                    path: 'api/LookUp/GetAllParametersForPowerEps'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsLookUp?key={key}'
                },
            }
        },
        controllerPolicy: {
            actions : {
                'methodResource_PowerEps_Policy_AAPP_Get':{
                    name:  'Resource_PowerEps_Policy_AAPP_Get',
                    path: 'api/policy/GetAAPP/{policyNumber}'
                },
                'methodResource_PowerEps_Policy_Soat_Get':{
                    name:  'Resource_PowerEps_Policy_Soat_Get',
                    path: 'api/policy/GetSoat/{plateNumber}'
                },
                'methodResource_PowerEps_Policy_Car_Get':{
                    name:  'Resource_PowerEps_Policy_Car_Get',
                    path: 'api/policy/GetCar/{plateNumber}'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Policy?key={key}'
                },
            }
        },
        controllerDocumentStatus: {
            actions : {
                'methodGetAllDocumentStatus':{
                    name:  'GetAllDocumentStatus',
                    path: 'api/DocumentStatus/GetAllDocumentStatus'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/DocumentStatus?key={key}'
                },
            }
        },
        controllerPowerEpsAffiliate: {
            actions : {
                'methodResource_PowerEps_Affiliate_GetSearch':{
                    name:  'Resource_PowerEps_Affiliate_GetSearch',
                    path: 'api/affiliate/GetSearchBy'
                },
                'methodResource_PowerEps_Affiliate_Get':{
                    name:  'Resource_PowerEps_Affiliate_Get',
                    path: 'api/affiliate'
                },
                'methodResource_PowerEps_Affiliate_Save':{
                    name:  'Resource_PowerEps_Affiliate_Save',
                    path: 'api/affiliate/Save'
                },
                'methodResource_PowerEps_Affiliation_Load':{
                    name:  'Resource_PowerEps_Affiliation_Load',
                    path: 'api/affiliate/LoadAffiliation'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsAffiliate?key={key}'
                },
            }
        },
        controllerCause: {
            actions : {
                'methodResource_PowerEps_Cause_GetAll':{
                    name:  'Resource_PowerEps_Cause_GetAll',
                    path: 'api/cause/Soat'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Cause?key={key}'
                },
            }
        },
        controllerSex: {
            actions : {
                'methodResource_PowerEps_Sex_GetAll':{
                    name:  'Resource_PowerEps_Sex_GetAll',
                    path: 'api/sex/GetAll'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Sex?key={key}'
                },
            }
        },
        controllerMobility: {
            actions : {
                'methodResource_PowerEps_Mobility_GetAll':{
                    name:  'Resource_PowerEps_Mobility_GetAll',
                    path: 'api/mobility/GetAll'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Mobility?key={key}'
                },
            }
        },
        controllerEquifax: {
            actions : {
                'methodResource_PowerEps_Equifax_Get':{
                    name:  'Resource_PowerEps_Equifax_Get',
                    path: 'api/Equifax'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Equifax?key={key}'
                },
            }
        },
        controllerReservation: {
            actions : {
                'methodResource_PowerEps_Reservation_Save':{
                    name:  'Resource_PowerEps_Reservation_Save',
                    path: 'api/reservation/Save'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Reservation?key={key}'
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
        },
        controllerPowerEpsApi: {
            actions : {
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsApi?key={key}'
                },
            }
        }
    })



     module.factory("proxyBeneficiary", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Beneficiary_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/Beneficiary/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Beneficiary?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLocation", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Location_GetAllDepartment' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/location/GetAllDepartment',
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Location_GetAllProvinceBy' : function(departmentCode, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/location/GetAllProvince/{departmentCode}',
                                                    { 'departmentCode':departmentCode   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Location_GetAllDistrictBy' : function(departmentCode, idProvince, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/location/GetAllDistrict/{departmentCode}/{idProvince}',
                                                    { 'departmentCode':departmentCode  ,'idProvince':idProvince   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Location?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocument", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Document_Type_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/document/GetAlltype',
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Document_Received_Type' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/document/GetAllDocumentsReceivedType',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Document?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsProduct", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Product_GetAll' : function(userCode, idCompany, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/product/GetAll/{userCode}/{idCompany}',
                                                    { 'userCode':userCode  ,'idCompany':idCompany   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/PowerEpsProduct?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsValidation", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'ExistPolicyBy' : function(existePolicyCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/validation/existPolicy',
                                         existePolicyCriteria, undefined, showSpin)
                },
                'PolicySupplementValid' : function(policySupplementValidCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/validation/PolicySupplementValid',
                                         policySupplementValidCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/PowerEpsValidation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBroker", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'GetAllBrokerBy' : function(searchCriteria, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/broker/GetAll?searchCriteria={searchCriteria}',
                                                    { 'searchCriteria':searchCriteria   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Broker?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySpecialty", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Specialty_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/Specialty/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Specialty?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinister", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Sinister_GenerateOpening' : function(generateOpeningCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/sinister/GenerateOpening',
                                         generateOpeningCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_CoverageSinister_GetAll' : function(CoverageSinisterCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/sinister/Coverage',
                                         CoverageSinisterCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Sinister?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCompany", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Company_GetAll' : function(userCode, systemCode, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/company/getAll/{userCode}/{systemCode}',
                                                    { 'userCode':userCode  ,'systemCode':systemCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Company?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsLookUp", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'GetAllParametersForPowerEps' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/LookUp/GetAllParametersForPowerEps',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/PowerEpsLookUp?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicy", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Policy_AAPP_Get' : function(policyNumber, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/policy/GetAAPP/{policyNumber}',
                                                    { 'policyNumber':policyNumber   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Policy_Soat_Get' : function(plateNumber, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/policy/GetSoat/{plateNumber}',
                                                    { 'plateNumber':plateNumber   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Policy_Car_Get' : function(plateNumber, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/policy/GetCar/{plateNumber}',
                                                    { 'plateNumber':plateNumber   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Policy?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocumentStatus", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'GetAllDocumentStatus' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/DocumentStatus/GetAllDocumentStatus',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/DocumentStatus?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsAffiliate", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Affiliate_GetSearch' : function(searchCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/affiliate/GetSearchBy',
                                         searchCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliate_Get' : function(AffiliateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/affiliate',
                                         AffiliateCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliate_Save' : function(affiliateCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/affiliate/Save',
                                         affiliateCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliation_Load' : function(loadAffiliationCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/affiliate/LoadAffiliation',
                                         loadAffiliationCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/PowerEpsAffiliate?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCause", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Cause_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/cause/Soat',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Cause?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySex", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Sex_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/sex/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Sex?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMobility", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Mobility_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + 'api/mobility/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Mobility?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEquifax", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Equifax_Get' : function(searchCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/Equifax',
                                         searchCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Equifax?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReservation", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'Resource_PowerEps_Reservation_Save' : function(saveReserveCriteria, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + 'api/reservation/Save',
                                         saveReserveCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/Reservation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyServiceDescriptor", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'NegotiateGet' : function(value, showSpin){
                    return httpData['post'](oimProxyReembolso.endpoint + helper.formatNamed('api/ServiceDescriptor',
                                                    { 'value':value   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsApi", ['oimProxyReembolso', 'httpData', function(oimProxyReembolso, httpData){
        return {
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyReembolso.endpoint + helper.formatNamed('api/PowerEpsApi?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
