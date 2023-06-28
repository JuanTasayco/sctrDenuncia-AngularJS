'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('modalcpSaveAuditController', [function ctrFn() {
  }]).component('modalcpSaveAudit', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresModalGuardarAuditoria.html',
    controller: 'modalcpSaveAuditController',
    bindings: {
      close: '&',
      save: '&',
      saveExit: '&'
    }
  });
});
