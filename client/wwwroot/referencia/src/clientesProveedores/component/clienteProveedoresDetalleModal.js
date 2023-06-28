'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalCPDController', function ctrFn() {
    var vm = this;
    vm.data = {};

  }).component('modalcpdReferencia', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresDModal.html',
    controller: 'ModalCPDController',
    bindings: {
      close: '&',
      afiliado: '='
    }
  });
});
