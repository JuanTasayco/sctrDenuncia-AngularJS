'use strict';
define(['angular', 'moment'], function(ng, moment) {
  var module = ng.module('referenciaApp');
  module.controller('ModalCPHController', [function ctrFn() {
    var vm = this;
    vm.$onInit = function() {
      vm.audits = vm.audits.map(function(audit) {
        var date = moment(audit.fechaFin || audit.fechaInicio);
        audit.day = date.format('D');
        audit.month = date.format('MMM');
        return audit;
      });
    };

    vm.onSelectAudit = function(audit) {
      vm.selectAudit(audit);
    };

  }]).component('modalcphReferencia', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresHistorialModal.html',
    controller: 'ModalCPHController',
    bindings: {
      close: '&',
      audits: '<',
      selectAudit: '&'
    }
  });
});
