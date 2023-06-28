'use strict';

define([
  'angular'
], function(ng){

  ctrlModalSucursal.$inject = ['$window'];

  function ctrlModalSucursal($window) {
    var vm = this;

    vm.selectedSucursal = selectedSucursal;

    function selectedSucursal(sucursal){
      $window.sessionStorage.setItem('cgwHome', JSON.stringify(sucursal.code));
      $window.sessionStorage.setItem('sucursal', JSON.stringify(sucursal));
      vm.dismiss();
    }
  }

  return ng.module('mapfre.controls')
    .controller('CtrlModalSucursal', ctrlModalSucursal)
    .component('mpfModalSucursal', {
      templateUrl: '/scripts/mpf-main-controls/components/modalSucursal/component/modalSucursal.html',
      controller: 'CtrlModalSucursal',
      controllerAs: 'vm',
      bindings: {
        data: '=',
        close: '&',
        dismiss: '&'
      }
    });
});
