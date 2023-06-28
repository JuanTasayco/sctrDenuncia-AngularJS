define([
  'angular', 'mfpModalQuestion'
], function(ng) {

  solicitudAuditoriaExternaController.$inject = ['$scope', '$uibModal'];

  function solicitudAuditoriaExternaController($scope, $uibModal) {

    $scope.carta = {};
    $scope.carta.estado = '1';

    function alertaGenerarInforme() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function clFn() {
            $uibModalInstance.close();
          };
          scope.generarInforme = function giFn() {
            // TODO: simulando
            setTimeout(function() {
              $uibModalInstance.close();
            }, 1500);
          };
          scope.data = {
            title: 'Generando Informe',
            subtitle: 'Estás seguro de generar el informe',
            btns: [
              {
                lbl: 'Cancelar',
                accion: scope.close,
                clases: 'g-btn-transparent'
              },
              {
                lbl: 'Generar Informe',
                accion: scope.generarInforme,
                clases: 'g-btn-verde'
              }
            ]
          };

        }] // end Controller uibModal
      });
    }

    $scope.generarInforme = function sgiFn() {
      alertaGenerarInforme();
    };

  } //  end controller

  return ng.module('appCgw')
    .controller('SolicitudAuditoriaExternaController', solicitudAuditoriaExternaController)
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});