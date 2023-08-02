'use strict'

define([
    'angular', 'constants'
], function(angular, constants) {

    var appAutos = angular.module('appAutos');

    appAutos.factory('usedCarEmitFactory', ['$http', '$q', 'proxyMail', 'proxyProducto', 'proxyCotizacion', 'proxyEmision', 'proxyDocumento', 'proxyContratante', 'proxyClaims',
        function($http, $q, proxyMail, proxyProducto, proxyCotizacion, proxyEmision, proxyDocumento, proxyContratante, proxyClaims) {

            var base = constants.system.api.endpoints.policy;
            var baseLogin = constants.system.api.endpoints.security;
            var numCotizacion = '';

            function getNumCotizacion(){
                return numCotizacion;
            }

            function setNumCotizacion(value){
                numCotizacion = value;
            }

            function concatenateUrl(params) {
                var url = '';
                angular.forEach(params, function(value, key) {
                    url += '/' + value;
                });
                url ? url : url = '/';
                return url;
            }

            function getData(base, url, params) {
                var newUrl = url + concatenateUrl(params)
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: base + newUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }

            function postData(base, url, params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: base + url,
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response.data);
                });
                return deferred.promise;
            }

            function searchCarInspected(params) {
                return getData(base, 'api/inspeccion/validar', params);
            }

            function searchContractor(params) {
                return getData(base, 'api/contratante/datos/1', params);
            }

            function getCirculation(params) {
                return postData(base, 'api/general/ubigeo/buscar', params);
            }

            function getColors() {
                return getData(base, 'api/automovil/color');
            }

            function getProducts(params) {
                return postData(base, 'api/producto/porproducto/', params);
            }

            function getTypesUse(params) {
                return getData(base, 'api/automovil/tipouso/' + constants.module.polizas.autos.codeRamo, params);
            }

            function getSuggestedValue(params) {
                return getData(base, 'api/automovil/valorsugerido/1', params);
            }

            function getGroupPolizev2(params) {
                return getData(base, 'api/automovil/polizav2', params);
            }

            function getGroupPolize(params) {
                return getData(base, 'api/automovil/poliza', params);
            }

            function getFinancing(params) {
                return getData(base, 'api/general/financiamiento/tipo', params);
            }

            function getFinancingROL(params) {
                return getData(base, 'api/general/financiamiento/tipoPorRol', params);
            }

            function getEndorsee() {
                return getData(base, 'api/contratante/endosatario');
            }

            function getDiscountCommission(params) {
                return postData(base, 'api/automovil/descuento/comision', params);
            }

            function getCalculatePremium(params, showSpin) {
                return proxyCotizacion.CalcularPrimaVehiculoIndividual(params, showSpin);
            }

            function getGps(params) {
                return getData(base, 'api/automovil/gps', params);
            }

            function sendEmission(params, showSpin) {
                return proxyEmision.grabarEmisionConInspeccion(params, showSpin);
            }

            function getClaims() {
              return proxyClaims.GetClaims();
            }

            function downloadPDF(params) {
                return getData(base, 'api/documento/descargardocumento', params);
            }

            function getAgent(params) {
                return $http.get(base + 'api/agente/buscar?codigoNombre=' + params);
            }


            function sendEmailNotification(type, params, showSpin) {
                return proxyMail.SendMailEmisionUsadoNotificar(type, params, showSpin);
            }

            function getNewProducts(showSpin) {
                return proxyProducto.getListProductoNuevo(showSpin);
            }

            function getEmission(documentNumber, showSpin) {
                var codeCompany = constants.module.polizas.autos.companyCode;
                var codRamo = constants.module.polizas.autos.codeRamo;
                return proxyDocumento.GetDocumentoByNumber(codeCompany, documentNumber, codRamo, showSpin);
            }

            function searchEndorsee(documentNumber, showSpin){
              return proxyContratante.GetEndosatarioTercero(documentNumber, showSpin);
            }

            function downloadInspectPdf(Nro_Riesgo, NumeroInspeccion) {
              return getData(constants.system.api.endpoints.inspec, 'api/report/resume/' + Nro_Riesgo + '/' + NumeroInspeccion);
            }

            return {
                getNumCotizacion: getNumCotizacion,
                setNumCotizacion: setNumCotizacion,
                searchCarInspected: searchCarInspected,
                searchContractor: searchContractor,
                getCirculation: getCirculation,
                getColors: getColors,
                getProducts: getProducts,
                getTypesUse: getTypesUse,
                getSuggestedValue: getSuggestedValue,
                getGroupPolize: getGroupPolize,
                getGroupPolizev2:getGroupPolizev2,
                getFinancing: getFinancing,
                getEndorsee: getEndorsee,
                getDiscountCommission: getDiscountCommission,
                getCalculatePremium: getCalculatePremium,
                getGps: getGps,
                sendEmission: sendEmission,
                getClaims: getClaims,
                downloadPDF: downloadPDF,
                getAgent: getAgent,
                sendEmailNotification: sendEmailNotification,
                getNewProducts: getNewProducts,
                getEmission: getEmission,
                searchEndorsee: searchEndorsee,
                getFinancingROL: getFinancingROL,
                downloadInspectPdf: downloadInspectPdf
            };

        }
    ]);

});
