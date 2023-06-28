'use strict';
define(['angular', 'constants', 'generalConstant'], function (angular, constants, generalConstant) {
    actterFactory.$inject = [
        '$http',
        'httpData'
    ];

    function actterFactory(
        $http,
        httpData
    ) {
        var basePoliza = constants.system.api.endpoints.policy;

        function getEconomicsActivities(actEco, showSpin) {
             return httpData['post'](basePoliza+ 'api/general/actividadeconomica/sunat',
                                 actEco, undefined, showSpin);
        }

        // Ubigeo
        function getCountries() {
            return httpData['get'](basePoliza + 'api/general/ubigeo/pais', undefined, undefined, false);
        }
        function getDepartament(params) {
            return httpData['get'](basePoliza + helper.formatNamed('api/general/ubigeo/departamento?codPais={codPais}', { 'codPais': { value: params.codPais, defaultValue: '' } }), undefined, undefined, false);
        }
        function getProvinces(idDepartment, params) {
            return httpData['get'](basePoliza + helper.formatNamed('api/general/ubigeo/provincia/{idDepartment}?codPais={codPais}', { 'idDepartment': idDepartment, 'codPais': { value: params.codPais, defaultValue: '' } }), undefined, undefined, false);
        }
        function getDistrict(idProvince, params) {
            return httpData['get'](basePoliza + helper.formatNamed('api/general/ubigeo/distrito/{idProvince}?codPais={codPais}', { 'idProvince': idProvince, 'codPais': { value: params.codPais, defaultValue: '' } }), undefined, undefined, false);
        }

        function mapUbigeo(data) {
            return _.map(data, function (p) {
                return { codigo: p.Codigo, descripcion: p.Descripcion };
            })
        }

        return {
            ubigeo: {
                getCountries: getCountries,
                getDepartament: getDepartament,
                getProvinces: getProvinces,
                getDistrict: getDistrict,
                mapUbigeo: mapUbigeo
            },
            getEconomicsActivities : getEconomicsActivities
        }
    }

    return angular.module(generalConstant.APP_MODULE).factory('actterFactory', actterFactory);
})
