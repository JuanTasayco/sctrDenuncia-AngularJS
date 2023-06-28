'use strict';
define(['angular', 'moment'], function(ng, moment) {
  var module = ng.module('referenciaApp');
  module.controller('modalcpIniAuditController', [function ctrFn() {
    var vm = this;
    if (vm.lastAudit) {
      vm.date = moment(vm.lastAudit.fechaInicio || vm.lastAudit.fechaFin).format('LL');
    } else {
      vm.auditSelected = 0;
    }

    vm.selectAudit = function(auditId) {
      vm.auditSelected = auditId;
    };

    vm.newAudit = function() {
      vm.auditSelected = 0;
    };

  }]).component('modalcpIniAudit', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresModalIniciarAuditoria.html',
    controller: 'modalcpIniAuditController',
    bindings: {
      close: '&',
      lastAudit: '<',
      onAuditInit: '&',
      auditSelected: '='
    }
  });
});
