'use strict';

define([
    'angular',
    'lodash',
    'coreConstants',
    'cemeteryConstants'
], function (ng, _, coreConstants, cemeteryConstants) {

    ParameterSpaceComponent.$inject = ['$state', '$q', '$window', '$log', 'mModalAlert', 'CemeteryFactory'];

    function ParameterSpaceComponent($state, $q, $window, $log, mModalAlert, CemeteryFactory) {

        //environments
        var vm = this;
        vm.form = {};
        vm.tabs = [{ name: "General", active: false, href: "parameterGeneral" }, { name: "Configuración de espacios", active: true, href: "parameterSpace" }]

        //methods
        vm.$onInit = onInit;
        vm.updateParameters = updateParameters;

        //events
        function onInit() {
            _setScrollTop();
            _initValues();
            _setData();
        }

        //init
        function _initValues() {
            vm.parameters = [];
            vm.sections = [];
        }

        //scroll
        function _setScrollTop() {
            $window.scroll(0, 0);
        }

        //set
        function _setData() {
            var defered = $q.defer();
            var promise = defered.promise;
            try {
                _getListSync().then(function (res) {
                    _setDataForm().then(function (res) {
                        defered.resolve();
                    });
                });
            } catch (e) {
                $log.log('Error', e);
                defered.reject(e);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            }
            return promise;
        }

        //methods promises
        function _getParameters() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetParameters(cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION + ',' + cemeteryConstants.PARAMETER.SUBDOMAIN.SEPULTURE + ',' + cemeteryConstants.PARAMETER.SUBDOMAIN.CREMATION).then(function (res) {
                vm.parameters = res.data;
                vm.sections = _.filter(_.filter(vm.parameters, { subDominio: cemeteryConstants.PARAMETER.SUBDOMAIN.SECTION }), { nombre: cemeteryConstants.PARAMETER.NAME.SPACE });
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _getListSync() {
            var defered = $q.defer();
            var promise = defered.promise;
            try {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _getParameters().then(function (res) {
                        defered.resolve();
                    });
                });
            } catch (e) {
                $log.log('Error', e);
                defered.reject(e);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            }
            return promise;
        }

        //set form
        function _setDataForm() {
            var defered = $q.defer();
            var promise = defered.promise;

            vm.form.spaces = vm.sections;
            _.forEach(vm.form.spaces, function (space) {
                space.valor5 = '0';
            });

            defered.resolve();
            return promise;
        }

        //methods business
        function updateParameters() {
            CemeteryFactory.LoginApiGateway().then(function (res) {
                CemeteryFactory.UpdateParameters({ parametros: vm.form.spaces }).then(function (res) {
                    _setData();
                    mModalAlert.showSuccess("", "Cambios realizados");
                }).catch(function (error) {
                    mModalAlert.showError(error.data.mensaje, 'Error');
                });
            });
        }

    }

    return ng.module(coreConstants.ngMainModule).controller('ParameterSpaceComponent', ParameterSpaceComponent);
});
