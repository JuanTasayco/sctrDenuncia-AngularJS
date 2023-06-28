'use strict';

define(['angular'], function(ng) {
  previewInspectionController.$inject = ['$scope', '$rootScope', '$uibModal'];

  function previewInspectionController($scope, $rootScope, $uibModal) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.events = [];
      vm.events.push(vm.event);
      vm.inspectionDate = vm.event.start;
    }

    $scope.$on('eventClick', function(e, args) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/_app/common/calendar/modal-detalle.html',
        controller: [
          '$scope',
          '$location',
          '$uibModalInstance',
          function($scope, $location, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.data = args.calEvent.data;

            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ],
        controllerAs: '$ctrl'
      });
    });

    $scope.$watch(
      function() {
        return vm.render;
      },
      function(newValue) {
        if (newValue) {
          $rootScope.$broadcast('forceRenderCalendar');
          $rootScope.$broadcast('unselect');
        }
      }
    );
  }

  return ng
    .module('appInspec')
    .controller('PreviewInspectionController', previewInspectionController)
    .component('inspecPreviewInspection', {
      templateUrl: '/inspec/app/_app/common/preview-inspection/preview-inspection.html',
      controller: 'PreviewInspectionController',
      controllerAs: '$ctrl',
      bindings: {
        render: '=?',
        event: '=?'
      }
    });
});
