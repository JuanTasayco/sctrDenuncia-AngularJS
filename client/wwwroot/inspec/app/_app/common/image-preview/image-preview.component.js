'use strict';

define(['angular', 'helper'], function(ng, helper) {
  imagePreviewController.$inject = ['FileReaderService', '$scope', 'inspecFactory', '$uibModal', 'mModalAlert', 'oimAbstractFactory', '$window'];

  function imagePreviewController(FileReaderService, $scope, inspecFactory, $uibModal, mModalAlert,  oimAbstractFactory, $window) {
    var vm = this;
    var track;
    vm.$onInit = onInit;
    vm.removePreview = removePreview;
    vm.modalPhoto = modalPhoto;
    vm.modalCamera = modalCamera;

    function onInit() {
      vm.maxSize = 2097152;
      vm.imageLoaded = !ng.isUndefined(vm.photo.image64) && !vm.photo.isImageTemplate;
      vm.currentClass = getClass();
      vm.isMyDream = oimAbstractFactory.isMyDream();
      vm.isMobile = helper.isMobile();
    }

    function getClass() {
      switch (vm.photo.parameterId) {
        case 1:
          return 'tarj-propiedad-frontal';
        case 2:
          return 'tarj-propiedad-posterior';
        case 3:
          return 'vista-lateral-derecha';
        case 4:
          return 'vista-lateral-izquierda';
        case 5:
          return 'vista-tablero';
        case 6:
          return 'vista-maletera';
        case 7:
          return 'serie-vin';
        default:
          return '';
      }
    }

    function createPreview(file) {
      vm.photo.name = file.name;
      FileReaderService.readAsDataURL(file, $scope).then(function(ib64) {
        vm.imageLoaded = true;
        vm.photoBase64 = 'data:image/jpeg'+ ib64;
      });
      uploadFile(file);
    }

    function uploadFile(file) {
      vm.photo.image64 = null;
      inspecFactory.inspec.addInspectionImage(file, vm.riskId, vm.photo).then(function(response) {
        vm.photo.sequenceId = response.data.sequenceId;
        vm.photo.inspectionId = response.data.inspectionId;
      });
    }

    function removePreview() {
      var request = {
        InspectionId: vm.photo.inspectionId,
        SequenceId: vm.photo.sequenceId
      };
      inspecFactory.inspec.deleteInspectionImage(request, true).then(function(response) {
        if (response === '') {
          vm.photo.name = null;
          vm.photoBase64 = null;
          vm.photo.image64 = null;
          vm.imageLoaded = false;
        }
      });
    }
    function modalPhoto(photo, photo2) {
      if (photo) {
        inspecFactory.inspec
          .showInspectionImage(photo.inspectionId, photo.sequenceId, photo.parameterId || photo.photoTypeId, true)
          .then(function(response) {
            vm.photoBase64 = response;
            showImage(response);
          });
      } else {
        showImage(photo2);
      }
    }

    function showImage(photo) {
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: 'tplModal.html',
        controllerAs: '$ctrl',
        controller: [
          '$uibModalInstance',
          function($uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.$onInit = onInit1;

            function onInit1() {
              vm.photoBase64 = photo;
            }
            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ]
      });
    }

    function previewMobile(f) {
      if (f.size > vm.maxSize) {
        return void(mModalAlert.showInfo('Peso del archivo es mayor al permitido ' + vm.maxSize + ' bytes', 'Tamaño del archivo'));
      }

      if (f.name.length > 45) {
        return void(mModalAlert.showError('El nombre del archivo sobrepasa los 45 caracteres. Renombrar.', 'Error'));
      }

      inspecFactory.picture.getOrientation(f, function(orientation) {
        vm.orientation = orientation;
      });

      createPreview(f);
    }

    $scope.$watchCollection(
      '$ctrl.photoFile',
      function(newValue) {
        if (newValue && newValue.length > 0 && !vm.isMobile) {
            createPreview(newValue[0]);
        }
      },
      true
    );

    function modalCamera() {
     if (vm.isMobile && vm.isMyDream) {
        $uibModal.open({
          backdrop: 'static', // background de fondo
          backdropClick: true,
          windowClass: 'c-modal-camara',
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/common/camera/modal-camera.html',
          controllerAs: '$ctrl',
          controller: [
            '$uibModalInstance', '$timeout',
            function($uibModalInstance, $timeout) {
              var vm = this;
              vm.closeModal = closeModal;

              function closeModal() {
                video.pause();
                track.stop();
                $uibModalInstance.close();
              }

              $timeout(function() {
                var video = document.getElementById('video');

                if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' }}}).then(function(stream) {
                        video.srcObject = stream;
                        video.play();
                        track = stream.getVideoTracks()[0];
                    });
                }

                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');

                document.getElementById("snap").addEventListener("click", function() {

                  context.drawImage(video, 0, 0, 440, 330);
                  video.pause();
                  track.stop();

                  var image = new Image();
                  image.id = "pic";
                  image.src = canvas.toDataURL();

                  $uibModalInstance.close();

                  vm.photoBase64 = image.src;
                  vm.imageLoaded = true;
                  $scope.apply;

                  previewMobile(new File([helper.dataURItoBlob(image.src)], "fileName.jpeg", {
                    type: "'image/jpeg'"
                  }));
               });
              }, 0);
            }
          ]
        });
      }
    }
  }
  return ng
    .module('appInspec')
    .controller('ImagePreviewController', imagePreviewController)
    .component('inspecImagePreview', {
      templateUrl: '/inspec/app/_app/common/image-preview/image-preview.html',
      controller: 'ImagePreviewController',
      controllerAs: '$ctrl',
      bindings: {
        photo: '=',
        riskId: '=',
        inspectionId: '=?',
        disabled: '='
      }
    });
});
