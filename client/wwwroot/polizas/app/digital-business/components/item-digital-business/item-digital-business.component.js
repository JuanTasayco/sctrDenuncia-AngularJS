define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appAutos')
    .component('mpfItemDigitalBusiness', ItemDigitalBusinessComponent());

  function ItemDigitalBusinessComponent() {
    var component = {
      templateUrl: '/polizas/app/digital-business/components/item-digital-business/item-digital-business.template.html',
      controller: ItemDigitalBusinessComponentController,
      controllerAs: 'vm',
      bindings: {
        item: '=',
        edit: '&',
        delete: '&',
      }
    };

    return component;
  }

  ItemDigitalBusinessComponentController.$inject = ['$interval'];
  function ItemDigitalBusinessComponentController($interval) {
    var vm = this;
    var timer;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
    }

    function onDestroy() {
      $interval.cancel(timer);
    }
  }
});
