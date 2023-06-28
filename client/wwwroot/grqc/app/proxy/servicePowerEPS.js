(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.powereps", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyPowerEPS', {
        endpoint: constants.system.api.endpoints['powereps'],
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
        controllerDocument: {
            actions : {
                'methodResource_PowerEps_Document_Type_GetAll':{
                    name:  'Resource_PowerEps_Document_Type_GetAll',
                    path: 'api/document/GetAlltype'
                },
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/Document?key={key}'
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
        controllerPowerEpsApi: {
            actions : {
                'methodGetValueFromClaims':{
                    name:  'GetValueFromClaims',
                    path: 'api/PowerEpsApi?key={key}'
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



     module.factory("proxyLocation", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Location_GetAllDepartment' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/location/GetAllDepartment',
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Location_GetAllProvinceBy' : function(departmentCode, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/location/GetAllProvince/{departmentCode}',
                                                    { 'departmentCode':departmentCode   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Location_GetAllDistrictBy' : function(departmentCode, idProvince, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/location/GetAllDistrict/{departmentCode}/{idProvince}',
                                                    { 'departmentCode':departmentCode  ,'idProvince':idProvince   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Location?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCompany", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Company_GetAll' : function(userCode, systemCode, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/company/getAll/{userCode}/{systemCode}',
                                                    { 'userCode':userCode  ,'systemCode':systemCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Company?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyReservation", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Reservation_Save' : function(saveReserveCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/reservation/Save',
                                         saveReserveCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Reservation?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsLookUp", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'GetAllParametersForPowerEps' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/LookUp/GetAllParametersForPowerEps',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/PowerEpsLookUp?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsAffiliate", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Affiliate_GetSearch' : function(searchCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/affiliate/GetSearchBy',
                                         searchCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliate_Get' : function(AffiliateCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/affiliate',
                                         AffiliateCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliate_Save' : function(affiliateCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/affiliate/Save',
                                         affiliateCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_Affiliation_Load' : function(loadAffiliationCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/affiliate/LoadAffiliation',
                                         loadAffiliationCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/PowerEpsAffiliate?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySex", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Sex_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/sex/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Sex?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyCause", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Cause_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/cause/Soat',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Cause?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySinister", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Sinister_GenerateOpening' : function(generateOpeningCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/sinister/GenerateOpening',
                                         generateOpeningCriteria, undefined, showSpin)
                },
                'Resource_PowerEps_CoverageSinister_GetAll' : function(CoverageSinisterCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/sinister/Coverage',
                                         CoverageSinisterCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Sinister?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyMobility", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Mobility_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/mobility/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Mobility?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxySpecialty", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Specialty_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/Specialty/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Specialty?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyBeneficiary", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Beneficiary_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/Beneficiary/GetAll',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Beneficiary?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsProduct", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Product_GetAll' : function(userCode, idCompany, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/product/GetAll/{userCode}/{idCompany}',
                                                    { 'userCode':userCode  ,'idCompany':idCompany   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/PowerEpsProduct?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyEquifax", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Equifax_Get' : function(searchCriteria, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + 'api/Equifax',
                                         searchCriteria, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Equifax?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyDocument", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Document_Type_GetAll' : function( showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + 'api/document/GetAlltype',
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Document?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPolicy", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'Resource_PowerEps_Policy_AAPP_Get' : function(policyNumber, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/policy/GetAAPP/{policyNumber}',
                                                    { 'policyNumber':policyNumber   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Policy_Soat_Get' : function(plateNumber, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/policy/GetSoat/{plateNumber}',
                                                    { 'plateNumber':plateNumber   }),
                                         undefined, undefined, showSpin)
                },
                'Resource_PowerEps_Policy_Car_Get' : function(plateNumber, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/policy/GetCar/{plateNumber}',
                                                    { 'plateNumber':plateNumber   }),
                                         undefined, undefined, showSpin)
                },
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/Policy?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyPowerEpsApi", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'GetValueFromClaims' : function(key, showSpin){
                    return httpData['get'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/PowerEpsApi?key={key}',
                                                    { 'key':key   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyServiceDescriptor", ['oimProxyPowerEPS', 'httpData', function(oimProxyPowerEPS, httpData){
        return {
                'NegotiateGet' : function(value, showSpin){
                    return httpData['post'](oimProxyPowerEPS.endpoint + helper.formatNamed('api/ServiceDescriptor',
                                                    { 'value':value   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
