'use strict';

define([
    'angular',
    'lodash',
    'system',
    'coreConstants'
], function (ng, _, system, coreConstants) {

    PopupCemeteryComponent.$inject = ['$state', '$interval', '$scope', '$q', 'mModalAlert', 'CemeteryFactory'];

    var folder = system.apps.ap.location;

    function PopupCemeteryComponent($state, $interval, $scope, $q, mModalAlert, CemeteryFactory) {

        //environments
        var vm = this;
        var timer;
        vm.form = {};

        //methods
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.validateName = validateName;
        vm.saveCemetery = saveCemetery;

        //events
        function onInit() {
            _initValues();
            _getCemeteries();
        }

        function onDestroy() {
            $interval.cancel(timer);
        }

        //init
        function _initValues() {
            vm.cemetery = {};
            vm.spaces = [];
            vm.cemeteries = [];
            vm.hasError = false;
            vm.showNameError = false;
        }

        //methods promises
        function _getCemeteries() {
            CemeteryFactory.LoginApiGateway().then(function (res) {
                CemeteryFactory.GetCemeteries().then(function (res) {
                    vm.cemeteries = res.data;
                }).catch(function (error) {
                    $state.go('errorCemetery', {}, { reload: true, inherit: false });
                });
            });
        }

        function _saveCemetery() {
            var defered = $q.defer();
            var promise = defered.promise;
            vm.cemetery = angular.copy(vm.form.cemetery);
            vm.cemetery.idCamposanto = 0;
            vm.cemetery.estadoVisualizacion = '0'
            vm.cemetery.nombre = vm.form.cemeteryName.toUpperCase();
            CemeteryFactory.SaveCemetery(vm.cemetery).then(function (res) {
                vm.cemetery.idCamposanto = res.data.idCamposanto
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });
            return promise;
        }

        function _getSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            CemeteryFactory.GetSpaces(vm.form.cemetery.idCamposanto).then(function (res) {
                vm.spaces = res.data;
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                $state.go('errorCemetery', {}, { reload: true, inherit: false });
            });
            return promise;
        }

        function _saveSpaces() {
            var defered = $q.defer();
            var promise = defered.promise;
            var newSpaces = _.map(vm.spaces, function (space) {
                return {
                    tipoEspacio: space.tipoEspacio,
                    subtipoEspacio: space.subtipoEspacio,
                    descripcionGeneral: space.descripcionGeneral,
                    cesion: space.cesion,
                    activo: space.activo,
                    plataformas: space.plataformas
                }
            });
            CemeteryFactory.SaveSpaces(vm.cemetery.idCamposanto, { espacios: newSpaces }).then(function (res) {
                defered.resolve();
            }).catch(function (error) {
                defered.reject(error);
                mModalAlert.showError(error.data.mensaje, 'Error');
            });
            return promise;
        }

        //validate
        function _validationForm() {
            $scope.frmRegister.markAsPristine();
            return $scope.frmRegister.$valid;
        }

        function validateName() {
            var cemeteryNames = _.map(vm.cemeteries, 'nombre');
            vm.showNameError = _.contains(cemeteryNames, vm.form.cemeteryName ? vm.form.cemeteryName.toUpperCase() : "");
            $scope.frmRegister.$invalid = vm.showNameError;
        }

        //methods business
        function saveCemetery() {
            if (_validationForm()) {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _getSpaces().then(function (res) {
                        _saveCemetery().then(function (res) {
                            _saveSpaces().then(function (res) {
                                mModalAlert.showSuccess("Camposanto ", "Creado con éxito");
                                vm.success();
                            });
                        });
                    });
                });
            }
        }
    }

    return ng
        .module(coreConstants.ngMainModule)
        .controller('PopupCemeteryComponent', PopupCemeteryComponent)
        .component('popupCemetery', {
            templateUrl: folder + '/app/cemetery/components/popup/popup-cemetery.component.html',
            controller: 'PopupCemeteryComponent',
            bindings: {
                success: '&',
                close: '&',
                dismiss: '&',
            }
        });
});
