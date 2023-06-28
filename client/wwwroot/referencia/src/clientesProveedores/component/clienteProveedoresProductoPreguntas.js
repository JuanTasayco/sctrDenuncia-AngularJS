'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('CPProductoPreguntasController', ['$scope', function ctrFn($scope) {
    var vm = this;
    vm.auditSaving = false;

    vm.onChange = function() {
      vm.onProductChange();
    };

    $scope.$on('auditSaved', function() {
      vm.auditSaving = false;
    });

    $scope.$on('savingAudit', function() {
      vm.auditSaving = true;
    });

  }]).component('cpProductoPreguntas', {
    templateUrl: '/referencia/app/clientesProveedores/component/clienteProveedoresProductoPreguntas.html',
    controller: 'CPProductoPreguntasController',
    bindings: {
      items: '=',
      onProductChange: '&'
    }
  });
});
