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

define(['angular'], function(ng) {
  MxImageUploaderController.$inject = ['$scope', '$q', '$log', 'mModalAlert'];

  function MxImageUploaderController($scope, $q, $log, mModalAlert) {
    var vm = this;
    var maxMb, watchFileModel;
    var kb = 1024;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.removePhoto = removePhoto;

    function onInit() {
      vm.maxPhotos = vm.maxPhotos || 999;
      vm.label = vm.label || 'Agregar Foto';
      vm.maxKbSize = (vm.maxKbSize || 4000000);
      maxMb = vm.maxKbSize / kb;
      watcherFileModel();
    }

    function onDestroy() {
      watchFileModel();
    }

    function createPreview(file) {
      if (file.size > vm.maxKbSize) {
        mModalAlert.showError('El tamaño máximo es de ' + maxMb , 'Error');
        return void 0;
      }
      if (vm.photos.length > vm.maxPhotos) {
        vm.hideUploader = true;
        return void 0;
      }
      var photo = {
        name: buildName(vm.nombreImg)
      };

      readAsDataURL(file, $scope).then(function(ib64) {
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
      name = name.replace(' ', '-');
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
        function(newValue) {
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
      // reader.onprogress = onProgress(reader, scope);
      return reader;
    }

    function onLoad(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    }

    function onError(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
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
        label: '=?',
        maxKbSize: '<?',
        maxPhotos: '=?',
        nombreImg: '<?',
        onRemove: '&?',
        onUpload: '&?',
        photos: '=?'
      }
    })
});
