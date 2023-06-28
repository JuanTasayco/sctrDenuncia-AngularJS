'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('modalcpEndAuditController', [function ctrFn() {
  }]).component('modalcpEndAudit', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresModalFinalizarAuditoria.html',
    controller: 'modalcpEndAuditController',
    bindings: {
      comment: '=',
      close: '&',
      save: '&'
    }
  });
});
