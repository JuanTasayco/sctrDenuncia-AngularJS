'use strict';
define([
  'angular',
  'NextFocusByMaxlengthDirective'
], function(angular) {
  InputCodesController.$inject = [];
  function InputCodesController() {
    var vm = this;

    vm.inputCodesQuantity = vm.inputCodesQuantity || 0;
    vm.arrInputCodes = [];
    vm.$onInit = onInit;
    vm.onPasteCode = onPasteCode;

    function onInit() {
      _generateArrInputCodesByInputCodesQuantity(vm.inputCodesQuantity);
    };

    function _generateArrInputCodesByInputCodesQuantity(v) {
      for (var index = 0; index < v; index++) {
        vm.arrInputCodes.push(index);
      }
    }

    function _getPasteValue(event) {
      var clipboardData = event.clipboardData ||
      (event.originalEvent && event.originalEvent.clipboardData ? event.originalEvent.clipboardData : window.clipboardData);

      return clipboardData.getData('text') || clipboardData.getData('text/plain');
    }

    function onPasteCode(event) {
      var codes = _getPasteValue(event).split('');

      angular.forEach(codes, function(code, codeIdx) {
        vm.ngModel[codeIdx.toString()] = code;
      });
    }
  }

  return angular
    .module('appLogin')
    .controller('InputCodesController', InputCodesController)
    .component('loginInputCodes', {
      templateUrl: '/login/app/mfa/features/input-codes/input-codes.html',
      controller: 'InputCodesController',
      controllerAs: 'vm',
      require: {
        ngModelCtrl: 'ngModel'
      },
      bindings: {
        ngModel: '=',
        inputCodesQuantity: '<',
      }
    });
});
