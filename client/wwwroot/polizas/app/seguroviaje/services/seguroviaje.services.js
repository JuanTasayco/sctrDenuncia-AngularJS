define([
    'angular',
    'constants',
    '/scripts/mpf-main-controls/components/contractorData/service/contractorDataFactory.js',
    '/polizas/app/seguroviaje/proxy/serviceSeguroViaje.js'
    ], function(ng, constants) {

    function seguroviajeService($http, contractorDataFactory, proxyAgente, proxyGestor, proxyTrip, httpData) {

        return {
            getContractor: function(document){
                return contractorDataFactory.getContractorAutos2(document.type, document.number);
            },
            getManagers: function(params, showSpin) {
                return proxyGestor.GetListGestor(params, showSpin);
            },
            getAgents: function(params, showSpin){
                return proxyAgente.GetListAgenteVida(params, showSpin);
            },
            getTravelReasons: function(showSpin){
                return proxyTrip.GetMotivesOfTrip(showSpin);
            },
            getPolicies: function(travelReason, showSpin){
                return proxyTrip.GetGroupPolicies(travelReason, showSpin);
            },
            getProducts: function(polizy, showSpin){
                return proxyTrip.GetProducts(polizy, showSpin);
            },
            getCountries: function(showSpin){
                return proxyTrip.GetLookup(showSpin);
            },
            calculateBonus: function(body, showSpin){
                return proxyTrip.CalculateBonus(body, showSpin)
            },
            getCoverages: function(codeProduct, codeSubProduct, codeModality, codePlan, showSpin){
                return proxyTrip.GetCoverages(codeProduct, codeSubProduct, codeModality, codePlan, showSpin)
            },
            saveQuotation : function(object, showSpin){
                const opcMenu = localStorage.getItem('currentBreadcrumb');
                return httpData.post(
                    constants.system.api.endpoints.seguroviaje +  'api/Trip/SaveQuotation?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                    object,
                    undefined,
                    showSpin
                );
            },
            getQuotationSummary : function(object, showSpin){
                return proxyTrip.GetQuotationSummary(object, showSpin);
            },
            saveEmission : function(object, showSpin){
                const opcMenu = localStorage.getItem('currentBreadcrumb');
                return httpData.post(
                    constants.system.api.endpoints.seguroviaje +  'api/Trip/SaveEmission?COD_OBJETO=.&OPC_MENU='+ opcMenu,
                    object,
                    undefined,
                    showSpin
                );
            },
            getEmissionSummary : function(object, showSpin){
                return proxyTrip.GetEmissionSummary(object, showSpin);
            },
            getQuotationPage: function(object, showSpin){
                return proxyTrip.GetQuotationPage(object, showSpin);
            },
            getEmissionPage: function(object, showSpin){
                return proxyTrip.GetEmissionPage(object, showSpin);
            },
            getListStatePolicy : function(showSpin){
                return proxyTrip.GetListStatePolicy(showSpin);
            },
            getPDF: function(numDoc, emission){
                var action = emission ? 'Emission' : 'TravelQuotation'
                var typeDoc = emission ? 'policyNumber' : 'documentNumber'
                return $http({
                    url : constants.system.api.endpoints['seguroviaje'] + 'api/Trip/' + action + 'Report?' + typeDoc + '=' + numDoc,
                    method : "GET",
                    data : '',
                    responseType : "blob"
                }).then(function(response) {
                    return response;
                });
            },
            exportEmission : function(object, showSpin){
                return $http({
                    url : constants.system.api.endpoints['seguroviaje'] + 'api/Trip/ExportEmission',
                    method : "POST",
                    data : object,
                    responseType : "arraybuffer"
                }).then(function(response) {
                    return response;
                });
            },
            getEconomicsActivities : function(){
                return proxyTrip.GetTypesEconomicActivity(false);
            }
        };
    }
    return ng.module('appSeguroviaje')
        .factory('seguroviajeService', seguroviajeService)
 })