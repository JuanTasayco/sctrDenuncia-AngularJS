'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('registerNoHospModalController', [function ctrFn() {
    var vm = this;
    vm.dateFormat = 'dd/MM/yyyy';

    vm.$onInit = function() {
      vm.registro = {
        idReferencia: vm.entity.idReferencia,
        idRefProveedor: vm.entity.idRefProveedor,
        procedimiento: null
      };
    };

    vm.onSubmit = function(isValid) {
      if (isValid) {
        var registro = ng.copy(vm.registro);
        vm.save({registro: registro});
      }
    };

  }]).component('registerNohospModal', {
    templateUrl: '/referencia/app/reportes/component/registerNoHospModal.html',
    controller: 'registerNoHospModalController',
    bindings: {
      close: '&',
      save: '&',
      entity: '<'
    }
  });
});
