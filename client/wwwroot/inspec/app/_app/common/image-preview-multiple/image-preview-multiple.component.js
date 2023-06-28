'use strict';

define(['angular', 'helper', 'constants'], function(ng, helper) {
  imagePreviewMultipleController.$inject = ['FileReaderService', '$scope', 'inspecFactory', '$uibModal', 'oimAbstractFactory', '$window'];

  function imagePreviewMultipleController(FileReaderService, $scope, inspecFactory, $uibModal, oimAbstractFactory, $window) {
    var vm = this;
    var track;
    vm.$onInit = onInit;
    vm.maxLength = 7;
    vm.removeCurrent = removeCurrent;
    vm.modalPhoto = modalPhoto;
    vm.modalCamera = modalCamera;

    function onInit() {
      vm.isMyDream = oimAbstractFactory.isMyDream();
      vm.isMobile = helper.isMobile();
    }

    function removeCurrent(index, photo) {
      var request = {
        InspectionId: photo.inspectionId,
        SequenceId: photo.sequenceId
      };

      inspecFactory.inspec.deleteInspectionImage(request, true).then(function(response) {
        if (response === '') {
          vm.photos.splice(index, 1);
        }
      });
    }
    function createPreview(file) {
      var photo = {
        name: file.name
      };

      FileReaderService.readAsDataURL(file, $scope).then(function(ib64) {
        photo.photoBase64 = ib64;
        uploadFile(file, photo);
      });
    }

    function uploadFile(file, photo) {
      photo.locationPath = null;
      photo.inspectionId = vm.inspectionId;
      photo.parameterId = vm.parameterId;
      inspecFactory.inspec.addInspectionImage(file, vm.riskId, photo).then(function(response) {
        photo.sequenceId = response.data.sequenceId;
        photo.inspectionId = response.data.inspectionId;
        vm.photos.push(photo);
      });
    }

    $scope.$watchCollection(
      '$ctrl.photoFile',
      function(newValue) {
        if (newValue && newValue.length > 0) {
          createPreview(newValue[0]);
        }
      },
      true
    );

    function modalPhoto(photo) {
      if (!photo.photoBase64) {
        inspecFactory.inspec
          .showInspectionImage(photo.inspectionId, photo.sequenceId, 8, true)
          .then(function(response) {
            vm.photoBase64 = response;
            showImage(response);
          });
      } else {
        showImage(photo.photoBase64);
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
            vm.photoBase64 = photo;
            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ]
      });
    }

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
    .controller('ImagePreviewMultipleController', imagePreviewMultipleController)
    .component('inspecImagePreviewMultiple', {
      templateUrl: '/inspec/app/_app/common/image-preview-multiple/image-preview-multiple.html',
      controller: 'ImagePreviewMultipleController',
      controllerAs: '$ctrl',
      bindings: {
        photos: '=',
        riskId: '=',
        parameterId: '=?',
        inspectionId: '=?',
        disabled: '='
      }
    });
});
