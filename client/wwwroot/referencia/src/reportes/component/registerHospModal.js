'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('registerHospModalController', ['reportesService', function ctrFn(reportesService) {
    var vm = this;
    vm.dateFormat = 'dd/MM/yyyy';

    vm.$onInit = function() {
      vm.registro = {
        idReferencia: vm.entity.idReferencia,
        idRefProveedor: vm.entity.idRefProveedor,
        fechaIngreso: null,
        fechaFin: null,
        diagnosticoIngreso: null,
        diagnosticoEgreso: null,
        condicionPaciente: null,
        descripcionOtro: null,
        procedimiento: null,
        nombreResponsable: null,
        colegiaturaMedico: null,
        especialidadResponsable: null
      };

      vm.selectValues = {
        condicion: []
      };

      reportesService
        .getCondicion()
        .then(function(data) {
          vm.selectValues.condicion = data.Data;
        });

      vm.changeCondicionPaciente = function() {
        if (vm.registro.condicionPaciente !== '007') {
          vm.registro.descripcionOtro = null;
        }
      };
    };

    vm.onSubmit = function(isValid) {
      if (isValid) {
        var registro = ng.copy(vm.registro);
        vm.save({registro: registro});
      }
    };

    vm.searchCIE10 = function(str) {
      return reportesService.getCIE10({Patron: str});
    };

  }]).component('registerHospModal', {
    templateUrl: '/referencia/app/reportes/component/registerHospModal.html',
    controller: 'registerHospModalController',
    bindings: {
      close: '&',
      save: '&',
      entity: '<'
    }
  });
});
