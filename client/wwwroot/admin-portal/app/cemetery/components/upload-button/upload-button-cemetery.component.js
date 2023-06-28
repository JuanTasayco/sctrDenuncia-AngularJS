'use strict';

define(['angular', 'system', 'coreConstants', 'cemeteryConstants'], function (
    ng,
    system,
    coreConstants,
    cemeteryConstants
) {
    var folder = system.apps.ap.location;

    UploadButtonCemeteryController.$inject = ['$scope', '$q', 'mModalAlert'];

    function UploadButtonCemeteryController($scope, $q, mModalAlert) {

        //environments
        var vm = this;
        var kb = 1024;
        var watchFileModel;

        //methods
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;

        //events
        function onInit() {
            vm.fileTypes = cemeteryConstants.FILE_TYPES;
            vm.maxKbSize = cemeteryConstants.MAX_KB_SIZE;
            vm.maxMbSize = vm.maxKbSize / kb;
            watcherFileModel();
        }

        function onDestroy() {
            watchFileModel();
        }

        function watcherFileModel() {
            watchFileModel = $scope.$watchCollection('$ctrl.photoFile', function (newValue) {
                    if (newValue && newValue.length > 0) {
                        ng.forEach(newValue, function (item, index) {
                            createPreview(newValue[index]);
                        });
                    }
                },
                true
            );
        }

        function onLoad(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    var image = new Image();
                    image.src = reader.result;
                    image.onload = function () {
                        deferred.resolve({
                            base64: reader.result,
                            width: image.width,
                            height: image.height
                        });
                    };
                });
            };
        }

        function onError(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        }

        function createPreview(file) {
            if (file.size / kb > vm.maxKbSize) {
                return void mModalAlert.showWarning('La imagen supera los ' + vm.maxMbSize + 'MB', 'No se pudo generar la carga del archivo');
            }

            var photo = { name: file.name.replace(/ /g, '-') };

            readAsDataURL(file, $scope).then(function (image) {
                if (image.width != vm.imgWidth || image.height != vm.imgHeight) {
                    return void mModalAlert.showError( 'Las dimensiones del imagen deben ser: ' + vm.imgWidth + 'px x ' + vm.imgHeight + 'px<br>Actualmente: ' + image.width + 'px x ' + image.height + 'px', 'Error');
                }
                photo.photoBase64 = image.base64;
                vm.onUpload({ $event: { photoToUpload: file, photoData: photo } });
            });
        }

        function readAsDataURL(file, scope) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        }
        
    }

    return ng
        .module(coreConstants.ngMainModule)
        .controller('UploadButtonCemeteryController', UploadButtonCemeteryController)
        .component('uploadButtonCemetery', {
            templateUrl: folder + '/app/cemetery/components/upload-button/upload-button-cemetery.component.html',
            controller: 'UploadButtonCemeteryController',
            bindings: {
                isLight: '=?',
                isIcon: '=?',
                label: '=?',
                titleButton: '=',
                imgWidth: '=?',
                imgHeight: '=?',
                onUpload: '&?'
            }
        });
});
