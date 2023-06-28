(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper) {
  var appInspec = angular.module('appInspec');

  appInspec
    .controller('polizaEmitidaController', [
      '$scope',
      '$window',
      '$state',
      '$timeout',
      '$uibModal',
      'mModalAlert',
      'oimPrincipal',
      '$rootScope',
      'mModalConfirm',
      function($scope, $window, $state, $timeout, $uibModal, mModalAlert, oimPrincipal, $rootScope, mModalConfirm) {
        document.title = 'OIM - Inspecciones Autos - Solicitud Nueva';

        $scope.showEnviarPoliza = function(option, index, event) {
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lm',
            templateUrl: '/inspec/app/polizaEmitida/controller/modal-enviar-poliza.html',
            controller: [
              '$scope',
              '$location',
              '$uibModalInstance',
              '$uibModal',
              function($scope, $location, $uibModalInstance, $uibModal) {
                $scope.closeModal = function() {
                  $uibModalInstance.close();
                };
              }
            ]
          });
          vModal.result.then(
            function() {
              //  todo
            },
            function() {
              //  todo
            }
          );
        };
      }
    ])
    .directive('inspecMenu', [
      '$document',
      '$window',
      '$timeout',
      function($document, $window, $timeout) {
        return {
          link: link,
          restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
          scope.isPopupVisible = false;
          scope.showSubMenu = false;
          scope.toggleSelect = function() {
            scope.isPopupVisible = !scope.isPopupVisible;
          };
          $document.bind('click', function(event) {
            var isClickedElementChildOfPopup = element.find(event.target).length > 0;
            if (isClickedElementChildOfPopup) return;
            scope.isPopupVisible = false;
            scope.showSubMenu = false;
            scope.$apply();
          });
        }
      }
    ]);
});
