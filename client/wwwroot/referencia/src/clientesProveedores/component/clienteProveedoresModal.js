'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalCPController', ['$state', function ctrFn($state) {
    var vm = this;
    vm.openClientes = function opFn() {
      $state.go('referencia.panel.clientes');
      vm.loader.text = 'Estamos cargando la información de clientes';
      vm.loader.loading = true;
      vm.close();
    };
    vm.openProveedores = function ocFn() {
      $state.go('referencia.panel.proveedores');
      vm.loader.text = 'Estamos cargando la información de proveedores';
      vm.loader.loading = true;
      vm.close();
    };
  }]).component('modalcpReferencia', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresModal.html',
    controller: 'ModalCPController',
    bindings: {
      close: '&',
      loader: '='
    }
  });
});
