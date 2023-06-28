define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfItemReglasAjusteSalud', ItemReglasAjusteSaludDirective);

  ItemReglasAjusteSaludDirective.$inject = [];

  function ItemReglasAjusteSaludDirective() {
    var directive = {
      controller: ItemReglasAjusteSaludDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/item-reglas-ajuste/item-reglas-ajuste.template.html',
      transclude: true,
      scope: {
        documento: '=ngDocumento',
        ngSeleccionadoCallback: '&?ngSeleccionado',
        ngAccionCallback: '&?ngAccion',
      }
    };

    return directive;
  }

  ItemReglasAjusteSaludDirectiveController.$inject = ['$scope', '$timeout', 'mModalAlert', 'mModalConfirm', 'saludFactory', '$uibModal'];
  function ItemReglasAjusteSaludDirectiveController($scope, $timeout, mModalAlert, mModalConfirm, saludFactory, $uibModal) {
    var vm = this;

    vm.documento = {};

    vm.verCotizacion = VerCotizacion;
    vm.eliminarDocumento = EliminarDocumento;
    vm.showModalEditarReglaAjuste = ShowModalEditarReglaAjuste;
    vm.getRequestEditar = GetRequestEditar;

    (function load_ItemReglasAjusteSaludDirectiveController() {
      vm.documento = _transformScopeDocument($scope.documento);
    })();

    function VerCotizacion(accion) {
      if ($scope.ngAccionCallback) {
        // var accion = constantsVidaLey.ESTADOS_PERMITIDOS_ACTUALIZACION.indexOf(vm.documento.CodigoEstado) !== -1 ? 'edit' : 'resumen';
        $scope.ngAccionCallback({ '$event': { evento: accion, documento: vm.documento } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }

     function EliminarDocumento(){
       mModalConfirm
         .confirmInfo('', '¿Estás seguro de eliminar registro?', 'Si')
         .then(function(){
           _servicioEliminarDocumento();
         }).catch(function(){
       });
     }

    function ShowModalEditarReglaAjuste(){
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/polizas/app/salud/popup/controller/popupEditarReglaAjuste.html',
        controller : ['$scope', '$uibModalInstance', 'saludFactory', 'mModalAlert',
          function($scope, $uibModalInstance, saludFactory, mModalAlert) {
            /*## closeModal ##*/
            $scope.documento = angular.copy(vm.documento);

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.guardar = function () {
              var request = vm.getRequestEditar($scope.documento);

              saludFactory.actualizacionReglasAjuste(request, true)
                .then(function (response) {
                  if (response.OperationCode === constants.operationCode.success) {
                    mModalAlert.showSuccess(response.Message, 'Exito');
                    $scope.closeModal();
                    vm.verCotizacion('editar');
                  } else {
                    mModalAlert.showError(response.Message, 'Error');
                  }

                }).catch(function (err) {
                mModalAlert.showError(err.data.message, 'Error');
              });

            };
          }
        ]
      });
      vModalProof.result.then(function(){
        //$scope.cleanModal();
        //Action after CloseButton Modal
      },function(){
        //Action after CancelButton Modal
      });
    }

    function GetRequestEditar(document){
      return {
        'idRenovSaludCriter': document && document.idRenovSaludCriter,
        'numContrato': document &&  document.numContrato,
        'numSubcontrato': document && document.numSubcontrato,
        'sinAjustDesde': document && document.sinAjustDesde,
        'sinAjustHasta': document && document.sinAjustHasta,
        'frecAjustDesde': document && document.frecAjustDesde,
        'frecAjustHasta': document && document.frecAjustHasta,
        'cambRangEdad': document && document.cambRangEdad,
        'codAccion': document && document.codAccion,
        'mcaInh': document && document.mcaInh
      };
    }

    function _servicioEliminarDocumento(){
      saludFactory.eliminarReglasAjuste(vm.documento.idRenovSaludCriter, vm.documento.mcaInh, true)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess(response.Message, 'Exito');
            vm.verCotizacion('eliminar');
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function _transformScopeDocument(document) {
      return {
        'idRenovSaludCriter': document && document.idRenovSaludCriter,
        'numContrato': document &&  document.numContrato,
        'numSubcontrato': document && document.numSubcontrato,
        'sinAjustDesde': document && document.sinAjustDesde,
        'sinAjustHasta': document && document.sinAjustHasta,
        'frecAjustDesde': document && document.frecAjustDesde,
        'frecAjustHasta': document && document.frecAjustHasta,
        'cambRangEdad': document && document.cambRangEdad,
        'codAccion': document && document.codAccion,
        'nombreContratoMigracion': document && document.nombreContratoMigracion,
        'nombreSubContratoMigracion': document && document.nombreSubContratoMigracion,
        'mcaInh': document && document.mcaInh
      };
    }
  }
});
