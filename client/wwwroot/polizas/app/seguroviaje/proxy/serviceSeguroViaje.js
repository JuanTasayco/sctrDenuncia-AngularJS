/* eslint-disable */
(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants'], function(angular, constants){
    var module = angular.module("oim.proxyService.seguroviaje", ['oim.wrap.gaia.httpSrv']);
    module.constant('oimProxySeguroViaje', {
        endpoint: constants.system.api.endpoints['seguroviaje'],
        controllerTrip: {
            actions : {
                'methodGetMotivesOfTrip':{
                    name:  'GetMotivesOfTrip',
                    path: 'api/Trip/GetMotivesOfTrip'
                },
                'methodGetGroupPolicies':{
                    name:  'GetGroupPolicies',
                    path: 'api/Trip/GetGroupPolicies?codeMotive={codeMotive}'
                },
                'methodGetProducts':{
                    name:  'GetProducts',
                    path: 'api/Trip/GetProducts?codeGroupPolicy={codeGroupPolicy}'
                },
                'methodGetLookup':{
                    name:  'GetLookup',
                    path: 'api/Trip/GetLookup'
                },
                'methodCalculateBonus':{
                    name:  'CalculateBonus',
                    path: 'api/Trip/CalculateBonus'
                },
                'methodGetCoverages':{
                    name:  'GetCoverages',
                    path: 'api/Trip/GetCoverages?codeProduct={codeProduct}&codeSubProduct={codeSubProduct}&codeModality={codeModality}&codePlan={codePlan}'
                },
                'methodSaveQuotation':{
                    name:  'SaveQuotation',
                    path: 'api/Trip/SaveQuotation'
                },
                'methodGetQuotationSummary':{
                    name:  'GetQuotationSummary',
                    path: 'api/Trip/GetQuotationSummary?documentNumber={documentNumber}'
                },
                'methodSaveEmission':{
                    name:  'SaveEmission',
                    path: 'api/Trip/SaveEmission'
                },
                'methodGetEmissionSummary':{
                    name:  'GetEmissionSummary',
                    path: 'api/Trip/GetEmissionSummary?documentNumber={documentNumber}'
                },
                'methodTravelQuotationReport':{
                    name:  'TravelQuotationReport',
                    path: 'api/Trip/TravelQuotationReport?documentNumber={documentNumber}'
                },
                'methodSendEmailQuotation':{
                    name:  'SendEmailQuotation',
                    path: 'api/Trip/SendEmailQuotation'
                },
                'methodGetQuotationPage':{
                    name:  'GetQuotationPage',
                    path: 'api/Trip/GetQuotationPage'
                },
                'methodGetListStatePolicy':{
                    name:  'GetListStatePolicy',
                    path: 'api/Trip/GetListStatePolicy'
                },
                'methodGetEmissionPage':{
                    name:  'GetEmissionPage',
                    path: 'api/Trip/GetEmissionPage'
                },
                'methodExportEmission':{
                    name:  'ExportEmission',
                    path: 'api/Trip/ExportEmission'
                },
                'methodEmissionReport':{
                    name:  'EmissionReport',
                    path: 'api/Trip/EmissionReport?policyNumber={policyNumber}'
                },
                'methodSendEmailEmission':{
                    name:  'SendEmailEmission',
                    path: 'api/Trip/SendEmailEmission'
                },
                'methodGetTypesEconomicActivity':{
                    name:  'GetTypesEconomicActivity',
                    path: 'api/Trip/GetTypesEconomicActivity'
                },
                'methodGetLogApis':{
                    name:  'GetLogApis',
                    path: 'api/Trip/log?directory={directory}&disk={disk}&basePath={basePath}'
                },
            }
        }
    })



     module.factory("proxyTrip", ['oimProxySeguroViaje', 'httpData', function(oimProxySeguroViaje, httpData){
        return {
                'GetMotivesOfTrip' : function( showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + 'api/Trip/GetMotivesOfTrip',
                                         undefined, undefined, showSpin)
                },
                'GetGroupPolicies' : function(codeMotive, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/GetGroupPolicies?codeMotive={codeMotive}',
                                                    { 'codeMotive':  { value: codeMotive, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetProducts' : function(codeGroupPolicy, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/GetProducts?codeGroupPolicy={codeGroupPolicy}',
                                                    { 'codeGroupPolicy':  { value: codeGroupPolicy, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'GetLookup' : function( showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + 'api/Trip/GetLookup',
                                         undefined, undefined, showSpin)
                },
                'CalculateBonus' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/CalculateBonus',
                                         request, undefined, showSpin)
                },
                'GetCoverages' : function(codeProduct, codeSubProduct, codeModality, codePlan, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/GetCoverages?codeProduct={codeProduct}&codeSubProduct={codeSubProduct}&codeModality={codeModality}&codePlan={codePlan}',
                                                    { 'codeProduct':  { value: codeProduct, defaultValue:'' } ,'codeSubProduct':  { value: codeSubProduct, defaultValue:'' } ,'codeModality':  { value: codeModality, defaultValue:'' } ,'codePlan':  { value: codePlan, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveQuotation' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/SaveQuotation',
                                         request, undefined, showSpin)
                },
                'GetQuotationSummary' : function(documentNumber, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/GetQuotationSummary?documentNumber={documentNumber}',
                                                    { 'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SaveEmission' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/SaveEmission',
                                         request, undefined, showSpin)
                },
                'GetEmissionSummary' : function(documentNumber, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/GetEmissionSummary?documentNumber={documentNumber}',
                                                    { 'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'TravelQuotationReport' : function(documentNumber, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/TravelQuotationReport?documentNumber={documentNumber}',
                                                    { 'documentNumber':  { value: documentNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendEmailQuotation' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/SendEmailQuotation',
                                         request, undefined, showSpin)
                },
                'GetQuotationPage' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/GetQuotationPage',
                                         request, undefined, showSpin)
                },
                'GetListStatePolicy' : function( showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + 'api/Trip/GetListStatePolicy',
                                         undefined, undefined, showSpin)
                },
                'GetEmissionPage' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/GetEmissionPage',
                                         request, undefined, showSpin)
                },
                'ExportEmission' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/ExportEmission',
                                         request, undefined, showSpin)
                },
                'EmissionReport' : function(policyNumber, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/EmissionReport?policyNumber={policyNumber}',
                                                    { 'policyNumber':  { value: policyNumber, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                },
                'SendEmailEmission' : function(request, showSpin){
                    return httpData['post'](oimProxySeguroViaje.endpoint + 'api/Trip/SendEmailEmission',
                                         request, undefined, showSpin)
                },
                'GetTypesEconomicActivity' : function( showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + 'api/Trip/GetTypesEconomicActivity',
                                         undefined, undefined, showSpin)
                },
                'GetLogApis' : function(directory, disk, basePath, showSpin){
                    return httpData['get'](oimProxySeguroViaje.endpoint + helper.formatNamed('api/Trip/log?directory={directory}&disk={disk}&basePath={basePath}',
                                                    { 'directory':  { value: directory, defaultValue:'' } ,'disk':  { value: disk, defaultValue:'' } ,'basePath':  { value: basePath, defaultValue:'' }  }),
                                         undefined, undefined, showSpin)
                }
        };
     }]);
});
