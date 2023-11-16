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
        var baseSecurity = constants.system.api.endpoints.security;
        var baseUrlPortal = constants.ORIGIN_SYSTEMS.selfService.url;

        function getEconomicsActivities(actEco, showSpin) {
             return httpData['post'](basePoliza+ 'api/general/actividadeconomica/sunat',
                                 actEco, undefined, showSpin);
        }

        function getTokenRedirect(body) {
            return httpData['post'](baseSecurity+ 'api/token', body, undefined, true);
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

        function storageActter() {
            return JSON.parse(localStorage.getItem('evoSubMenuACTTER'));
        }

        function getStorageValueObject(group, key) {
            var groups = storageActter() || [];

            if (groups.length === 0) return false;

            var itemGroup = groups.find(function (item) {
                return item.nombreCabecera.includes(group)
            }) || [];

            if (itemGroup.length === 0) return false;

            var valueObject = itemGroup.items.find(function (item) {
                return item.nombreCorto.includes(key)
            });

            return valueObject;
        }

        function isRedirectPortal(){
            return !!getStorageValueObject('ACCIONES', 'REDIRECT_PORTAL');
        }

        function isOptModify(){
            return !!getStorageValueObject('ACCIONES', 'OPC_MODIFICAR');
        }

        return {
            ubigeo: {
                getCountries: getCountries,
                getDepartament: getDepartament,
                getProvinces: getProvinces,
                getDistrict: getDistrict,
                mapUbigeo: mapUbigeo
            },
            getEconomicsActivities : getEconomicsActivities,
            getTokenRedirect: getTokenRedirect,
            storageActter: storageActter,
            getStorageValueObject: getStorageValueObject,
            isRedirectPortal: isRedirectPortal,
            isOptModify: isOptModify,
            baseUrlPortal: baseUrlPortal
        }
    }

    return angular.module(generalConstant.APP_MODULE).factory('actterFactory', actterFactory);
})
