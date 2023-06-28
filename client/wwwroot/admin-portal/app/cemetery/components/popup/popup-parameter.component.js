'use strict';

define([
    'angular',
    'lodash',
    'system',
    'coreConstants',
    'cemeteryConstants'
], function (ng, _, system, coreConstants, cemeteryConstants) {

    PopupParameterComponent.$inject = ['$interval', '$scope', '$q', 'mModalAlert', 'CemeteryFactory'];

    var folder = system.apps.ap.location;

    function PopupParameterComponent($interval, $scope, $q, mModalAlert, CemeteryFactory) {

        //environments
        var vm = this;
        var timer;
        vm.form = {};
        vm.nombreImagen = '';

        //methods
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.uploadImage = uploadImage;
        vm.trashImage = trashImage;
        vm.saveParameter = saveParameter;

        //events
        function onInit() {
            _initValues();
        }

        function onDestroy() {
            $interval.cancel(timer);
        }

        //init
        function _initValues() {
            vm.showButton = true;
            vm.isDisabled = true;
            vm.showDescription = (vm.parameter.nombre === 'SUBESPACIO' && (vm.parameter.subDominio === 'SEPULTURA' || vm.parameter.subDominio === 'CREMACION'));
            vm.rutaImagen = '';
        }

        //upload
        function uploadImage(event) {
            vm.upload({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                vm.rutaImagen = photo.rutaTemporal;
                vm.nombreImagen = photo.nombre;
                vm.showButton = false;
                vm.isDisabled = false;
            });
        }

        //methods promises
        function _saveParameters() {
            var defered = $q.defer();
            var promise = defered.promise;
            var parameters = _getNewParameters();
            CemeteryFactory.SaveParameters({ parametros: parameters }).then(function (res) {
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

        //methods business
        function trashImage() {
            vm.showButton = true;
            vm.rutaImagen = '';
            vm.isDisabled = true;
        }

        function _getNewParameters() {
            var parameters = []
            var newParameter = vm.parameter;
            newParameter.valor1 = capitalize(vm.form.nombre);
            newParameter.valor6 = vm.rutaImagen;
            if (vm.showDescription) {
                newParameter.valor3 = capitalize(vm.form.description);
            }
            parameters.push(newParameter);
            return parameters;
        }

        function capitalize(str) {
            const lower = str.toLowerCase();
            const resp = str.charAt(0).toUpperCase() + lower.slice(1);
            return resp;
        }

        function saveParameter() {
            if (_validationForm()) {
                CemeteryFactory.LoginApiGateway().then(function (res) {
                    _saveParameters().then(function (res) {
                        vm.success();
                        mModalAlert.showSuccess("", "Cambios realizados");
                    });
                });
            }
        }

    }

    return ng
        .module(coreConstants.ngMainModule)
        .controller('PopupParameterComponent', PopupParameterComponent)
        .component('popupParameter', {
            templateUrl: folder + '/app/cemetery/components/popup/popup-parameter.component.html',
            controller: 'PopupParameterComponent',
            bindings: {
                format: '=?',
                label: '=?',
                parameter: '=?',
                success: '&',
                close: '&',
                dismiss: '&',
                upload: '&'
            }
        });
});
