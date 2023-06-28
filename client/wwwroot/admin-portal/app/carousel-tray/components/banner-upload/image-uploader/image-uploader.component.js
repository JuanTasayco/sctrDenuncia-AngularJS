'use strict';

define(['angular', 'coreConstants', 'generalConstants', 'system'], function(
  ng,
  coreConstants,
  generalConstants,
  system
) {
  var folder = system.apps.ap.location;

  ApImageUploaderController.$inject = ['$scope', '$q', 'mModalAlert', 'mainServices'];
  function ApImageUploaderController($scope, $q, mModalAlert, mainServices) {
    var vm = this;
    var maxMb, watchFileModel;
    var kb = 1024;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.downloadPhoto = downloadPhoto;

    function onInit() {
      vm.fileTypes = vm.fileTypes || '.jpg,.jpeg,.png';
      vm.label = vm.label || 'Agregar Foto';
      vm.label2 = vm.imgWidth + 'px x ' + vm.imgHeight + 'px';
      vm.labeUpload = vm.labeUpload || 'Subir imagen';
      vm.customWidth = vm.customWidth || 'col-md-12';
      vm.customHeight = vm.customHeight || 'row-height-138';
      vm.maxKbSize = vm.maxKbSize || generalConstants.defaultMaxKbSize;
      maxMb = vm.maxKbSize / kb;
      watcherFileModel();
    }

    function onDestroy() {
      watchFileModel();
    }

    function createPreview(file) {
      if (file.size / kb > vm.maxKbSize) {
        return void mModalAlert.showError('El tamaño máximo es de ' + maxMb + ' MB.', 'Error');
      }
      if (file.name.length > generalConstants.bannerFileNaleLength) {
        return void mModalAlert.showError('El nombre del archivo sobrepasa los 45 caracteres. Renombrar.', 'Error');
      }

      var photo = {name: buildName(file.name)};

      readAsDataURL(file, $scope).then(function(img) {
        if (img.width != vm.imgWidth || img.height != vm.imgHeight) {
          return void mModalAlert.showError(
            'Las dimensiones del banner deben ser: ' +
              vm.imgWidth +
              'px x ' +
              vm.imgHeight +
              'px<br>Actualmente: ' +
              img.width +
              'px x ' +
              img.height +
              'px',
            'Error'
          );
        }
        photo.photoBase64 = img.base64;
        vm.onUpload({
          $event: {
            photoToUpload: file,
            photoData: photo
          }
        });
      });
    }

    function buildName(name) {
      return name.replace(/ /g, '-');
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

    function downloadURI(uri, name) {
      var link = angular.element('<a/>');
      link.attr({
        href: uri,
        download: name
      });
      link[0].click();
    }

    function downloadPhoto() {
      var fileName = vm.photo[0].nombreImagen;
      if (vm.photo[0].nombreFisico) {
        var base64 = vm.photo[0].srcImg.split(',')[1];
        var fileType = vm.photo[0].srcImg.split(/[/;]/)[1];
        mainServices.fnDownloadFileBase64(base64, fileType, fileName);
      } else {
        downloadURI(vm.photo[0].srcImg, fileName);
      }
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
      return function() {
        scope.$apply(function() {
          var image = new Image();
          image.src = reader.result;
          image.onload = function() {
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
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    }
  }

  return ng
    .module(coreConstants.ngMainModule)
    .controller('ApImageUploaderController', ApImageUploaderController)
    .component('apImageUploader', {
      templateUrl: folder + '/app/carousel-tray/components/banner-upload/image-uploader/image-uploader.component.html',
      controller: 'ApImageUploaderController',
      bindings: {
        disabled: '=?',
        label: '=?',
        imgWidth: '=?',
        imgHeight: '=?',
        labeUpload: '=?',
        customWidth: '=?',
        customHeight: '=?',
        maxKbSize: '<?',
        nombreImg: '<?',
        onUpload: '&?',
        photo: '=?',
        fileTypes: '<?'
      }
    });
});
