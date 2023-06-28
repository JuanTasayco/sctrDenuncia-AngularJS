'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalReporteController', [function ctrFn() {
    var vm = this;
    vm.startDownload = function opFn() {
      vm.close();
    };
  }]).component('modalDownload', {
    templateUrl: '/referencia/app/reportes/component/downloadModal.html',
    controller: 'ModalReporteController',
    bindings: {
      close: '&',
      opciones: '='
    }
  });
});
