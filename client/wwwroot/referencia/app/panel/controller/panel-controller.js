'use strict';
define(['angular',
  '/referencia/app/clientesProveedores/component/clienteProveedoresModal.js'
], function(ng) {

  panelRController.$inject = ['$scope', '$state', '$uibModal', 'localStorageService', '$rootScope', 'oimPrincipal', '$window', 'panelService'];

  function panelRController($scope, $state, $uibModal, localStorageService, $rootScope, oimPrincipal, $window, panelService) {
    var vm = this;
    vm.loader = {};
    vm.animationsEnabled = true;
    vm.go = function goFn(state) {
      $state.go(state);
    };
    localStorageService.clearAll();
    vm.isAdmin = oimPrincipal.get_role() === 'ADMREF';
    vm.isDoctor = oimPrincipal.get_role() === 'MEDREF';

    console.log("V2023-07-28 0900");

    function trackHome() {
      let ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Aplicación Proveedor",
        "descripcionOperacion": "Ingreso a la aplicación",
        "filtros": "",
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    trackHome();

    vm.openClientProveedoresModal = function modalCPFn() {
      if ($rootScope.backendError) {
        $rootScope.$emit('onBackendError');
        return;
      }
      var modalInstance = $uibModal.open({
        backdrop: false,
        backdropClick: true,
        dialogFade: false,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cp modal-home',
        template: '<modalcp-referencia close="close()" loader="$ctrl.loader"></modalcp-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };
  }

  return ng.module('referenciaApp')
  .controller('panelRController', panelRController);

});
