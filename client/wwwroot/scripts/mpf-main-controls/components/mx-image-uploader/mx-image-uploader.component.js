'use strict';
/**
 * mxImageUploader:
 * Sube una imagen en binario y genera la vista previa en Base64
 *
 * @param {(photo: binary) => void} onUpload - Callback cuando se sube la imagen
 * @param {() => void} onRemove - Callback cuando se borra la imagen
 * @param {string} locationPath - Url de la imagen
 * @param {Array} photos - Array refente a las fotos
 */

define(['angular'], function (ng) {
  MxImageUploaderController.$inject = ['$scope', '$q', '$log', 'mModalAlert', '$uibModal'];
  function MxImageUploaderController($scope, $q, $log, mModalAlert, $uibModal) {
    var vm = this;
    var maxMb, watchFileModel;
    var kb = 1024;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.removePhoto = removePhoto;
    vm.viewModalImg = viewModalImg;

    function onInit() {
      vm.maxPhotos = vm.maxPhotos || 999;
      vm.fileTypes = vm.fileTypes || '.jpg,.bmp,.jpeg';
      vm.label = vm.label || 'Agregar Foto';
      vm.maxKbSize = (vm.maxKbSize || 2000000);
      vm.canDelete = ng.isUndefined(vm.canDelete) ? true : vm.canDelete;
      maxMb = vm.maxKbSize / kb;
      watcherFileModel();
    }

    function onDestroy() {
      watchFileModel();
    }

    function _showModalImg(foto) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'u-zi-xs--100002',
        templateUrl: '/scripts/mpf-main-controls/components/mx-image-uploader/mx-image-modal.html',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.close = function (type) {
              $uibModalInstance.close();
            };
            scope.photo = foto;
            if (!foto.photoBase64) {
              vm.servicePhotoModal({
                  $event: {
                    nombreFisico: foto.nombreFisico
                  }
                })
                .then(function spmPr(resp) {
                  resp.operationCode === 200 && (scope.photo.srcImgFull = resp.data);
                }).catch(function spmEP(err) {
                  $log.error('Falló el obtener imagen para modal', err);
                });
            }
          }
        ]
      });
    }

    function viewModalImg(photo) {
      _showModalImg(photo);
    }

    function createPreview(file) {
      if (file.size > vm.maxKbSize) {
        return void(mModalAlert.showError('El tamaño máximo es de ' + maxMb + ' MB.', 'Error'));
      }
      if (file.name.length > 45) {
        return void(mModalAlert.showError('El nombre del archivo sobrepasa los 45 caracteres. Renombrar.', 'Error'));
      }
      if (vm.photos.length > vm.maxPhotos) {
        return void(vm.hideUploader = true);
      }
      var photo = {
        name: buildName(vm.nombreImg)
      };

      readAsDataURL(file, $scope).then(function (ib64) {
        photo.photoBase64 = ib64;
        vm.onUpload({
          $event: {
            photoToUpload: file,
            photoData: photo
          }
        });
      });
    }

    function buildName(name) {
      name = name.replace(/ /g, '-');
      var idx = vm.photos.length + 1;
      return name + '-' + idx + '.jpg';
    }

    function removePhoto(idx, photo) {
      vm.onRemove({
        $event: {
          idx: idx,
          photoToRemove: photo
        }
      });
    }

    function watcherFileModel() {
      watchFileModel = $scope.$watchCollection(
        '$ctrl.photoFile',
        function (newValue) {
          if (newValue && newValue.length > 0) {
            ng.forEach(newValue, function feFM(item, idx) {
              createPreview(newValue[idx]);
            });
          }
        },
        true
      );
    }

    /**
     * FileReaderService
     */

    function readAsDataURL(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    }

    function getReader(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      return reader;
    }

    function onLoad(reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
          deferred.resolve(reader.result);
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
  }

  return ng
    .module('mapfre.controls')
    .controller('MxImageUploaderController', MxImageUploaderController)
    .component('mxImageUploader', {
      templateUrl: '/scripts/mpf-main-controls/components/mx-image-uploader/mx-image-uploader.html',
      controller: 'MxImageUploaderController',
      bindings: {
        canDelete: '=?',
        disabled: '=?',
        label: '=?',
        maxKbSize: '<?',
        maxPhotos: '=?',
        nombreImg: '<?',
        onRemove: '&?',
        onUpload: '&?',
        photos: '=?',
        fileTypes: '<?',
        servicePhotoModal: '&?'
      }
    })
});
