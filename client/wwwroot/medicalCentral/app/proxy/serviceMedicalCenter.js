/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.medicalCenter", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxyMedicalCenter', {
        endpoint: constants.system.api.endpoints['medicalCenter'],
        controllerPanel: {
            actions : {
                'methodGetReportWeb':{
                    name:  'GetReportWeb',
                    path: 'api/panel/reportweb/{codeReport}?sede={sede}&store={store}&toDate={toDate}&fromDate={fromDate}&movementType={movementType}&movementCode={movementCode}'
                },
                'methodGetReport':{
                    name:  'GetReport',
                    path: 'api/panel/report/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}&contractCategory={contractCategory}'
                },
                'methodexport':{
                    name:  'export',
                    path: 'api/panel/$downloadweb/{codeReport}'
                },
                'methodexport':{
                    name:  'export',
                    path: 'api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}&contractCategory={contractCategory}'
                },
            }
        },
        controllerLookup: {
            actions : {
                'methodGetLookups':{
                    name:  'GetLookups',
                    path: 'api/lookup/lookups'
                },
                'methodGetSedes':{
                    name:  'GetSedes',
                    path: 'api/lookup/sedes'
                },
                'methodGetPeriodTypes':{
                    name:  'GetPeriodTypes',
                    path: 'api/lookup/periodtypes'
                },
                'methodGetStores':{
                    name:  'GetStores',
                    path: 'api/lookup/stores/{sede}'
                },
                'methodGetMovements':{
                    name:  'GetMovements',
                    path: 'api/lookup/movements/{tipo}'
                },
                'methodGetEspecialty':{
                    name:  'GetEspecialty',
                    path: 'api/lookup/especialities/{sede}'
                },
                'methodGetDetailTypes':{
                    name:  'GetDetailTypes',
                    path: 'api/lookup/detailtypes'
                },
                'methodGetFinancials':{
                    name:  'GetFinancials',
                    path: 'api/lookup/financials'
                },
                'methodGetEndContract':{
                    name:  'GetEndContract',
                    path: 'api/lookup/endcontracs/{financial}'
                },
                'methodGetContractCategories':{
                    name:  'GetContractCategories',
                    path: 'api/lookup/contractcategories'
                },
            }
        }
    })



     module.factory("proxyPanel", ['oimProxyMedicalCenter', 'httpData', function(oimProxyMedicalCenter, httpData){
        return {
                'GetReportWeb' : function(codeReport, sede, store, toDate, fromDate, movementType, movementCode, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/panel/reportweb/{codeReport}?sede={sede}&store={store}&toDate={toDate}&fromDate={fromDate}&movementType={movementType}&movementCode={movementCode}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'store':store  ,'toDate':toDate  ,'fromDate':fromDate  ,'movementType':movementType  ,'movementCode':movementCode   }),
                                         undefined, undefined, showSpin)
                },
                'GetReport' : function(codeReport, sede, typePeriod, specialty, toDate, fromDate, detailType, codeFinancial, contractNumber, providers, contractCategory, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/panel/report/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}&contractCategory={contractCategory}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'typePeriod':typePeriod  ,'specialty':specialty  ,'toDate':toDate  ,'fromDate':fromDate  ,'detailType':detailType  ,'codeFinancial':codeFinancial  ,'contractNumber':contractNumber  ,'providers':providers  ,'contractCategory':contractCategory   }),
                                         undefined, undefined, showSpin)
                },
                'export' : function(codeReport, showSpin){
                    return httpData['post'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/panel/$downloadweb/{codeReport}',
                                                    { 'codeReport':codeReport   }),
                                         undefined, undefined, showSpin)
                },
                'export' : function(codeReport, sede, typePeriod, specialty, toDate, fromDate, detailType, codeFinancial, contractNumber, providers, contractCategory, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/panel/$download/{codeReport}?sede={sede}&typePeriod={typePeriod}&specialty={specialty}&toDate={toDate}&fromDate={fromDate}&detailType={detailType}&codeFinancial={codeFinancial}&contractNumber={contractNumber}&providers={providers}&contractCategory={contractCategory}',
                                                    { 'codeReport':codeReport  ,'sede':sede  ,'typePeriod':typePeriod  ,'specialty':specialty  ,'toDate':toDate  ,'fromDate':fromDate  ,'detailType':detailType  ,'codeFinancial':codeFinancial  ,'contractNumber':contractNumber  ,'providers':providers  ,'contractCategory':contractCategory   }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);



     module.factory("proxyLookup", ['oimProxyMedicalCenter', 'httpData', function(oimProxyMedicalCenter, httpData){
        return {
                'GetLookups' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/lookups',
                                         undefined, undefined, showSpin)
                },
                'GetSedes' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/sedes',
                                         undefined, undefined, showSpin)
                },
                'GetPeriodTypes' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/periodtypes',
                                         undefined, undefined, showSpin)
                },
                'GetStores' : function(sede, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/lookup/stores/{sede}',
                                                    { 'sede':sede   }),
                                         undefined, undefined, showSpin)
                },
                'GetMovements' : function(tipo, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/lookup/movements/{tipo}',
                                                    { 'tipo':tipo   }),
                                         undefined, undefined, showSpin)
                },
                'GetEspecialty' : function(sede, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/lookup/especialities/{sede}',
                                                    { 'sede':sede   }),
                                         undefined, undefined, showSpin)
                },
                'GetDetailTypes' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/detailtypes',
                                         undefined, undefined, showSpin)
                },
                'GetFinancials' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/financials',
                                         undefined, undefined, showSpin)
                },
                'GetEndContract' : function(financial, showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + helper.formatNamed('api/lookup/endcontracs/{financial}',
                                                    { 'financial':financial   }),
                                         undefined, undefined, showSpin)
                },
                'GetContractCategories' : function( showSpin){
                    return httpData['get'](oimProxyMedicalCenter.endpoint + 'api/lookup/contractcategories',
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
