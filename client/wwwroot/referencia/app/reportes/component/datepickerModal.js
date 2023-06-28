'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalDatepickerController', [function ctrFn() {
    var vm = this;

    vm.$onInit = function oiFn() {
    };

    vm.setFecha = function sfFn() {
      vm.close({a: 'ok'});
    };

    vm.cancel = function sfFn() {
      vm.close(void 0);
    };

  }]).component('modalDatepicker', {
    templateUrl: '/referencia/app/reportes/component/datepickerModal.html',
    controller: 'ModalDatepickerController',
    bindings: {
      close: '&',
      datepicker1: '=',
      datepicker2: '='
    }
  });
});
