'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('CPProductoItemController', ['$scope', function ctrFn($scope) {
    var vm = this;

    vm.auditSaving = false;

    vm.$onInit = function() {
      if (vm.item.idTipoCaracteristica === 1) {
        if (!vm.item.idValor) {
          vm.item.idValor = 0;
        } else {
          vm.item.idValor = +vm.item.idValor;
        }
      }
    };

    vm.add = function() {
      vm.item.idValor = +vm.item.idValor + 1;
    };

    vm.testValue = function() {
      if (!/\d+$/.test(vm.item.idValor)) {
        vm.item.idValor = null;
      }
    };

    vm.substract = function() {
      vm.item.idValor = +vm.item.idValor ? +vm.item.idValor - 1 : +vm.item.idValor;
    };

    vm.numberChange = function() {
      vm.item.idValor = +vm.item.idValor < 0 ? 0 : vm.item.idValor;
    };

    vm.enableModule = function() {
      vm.onProductEnable();
    };

    vm.disableModule = function() {
      vm.onProductDisable();
    };

    vm.enableEmergency = function() {
      vm.onEmergencyEnable();
    };

    vm.disableEmergency = function() {
      vm.onEmergencyDisable();
    };

    vm.onChange = function() {
      vm.onProductChange();
    };

    $scope.$on('auditSaved', function() {
      vm.auditSaving = false;
    });

    $scope.$on('savingAudit', function() {
      vm.auditSaving = true;
    });

  }]).component('cpProductoItem', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresProductoItem.html',
    controller: 'CPProductoItemController',
    bindings: {
      item: '=',
      onProductDisable: '&',
      onProductEnable: '&',
      onProductChange: '&',
      onEmergencyEnable: '&',
      onEmergencyDisable: '&'
    }
  });
});
