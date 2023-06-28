'use strict';

define([
  'angular'
  ], function(ng) {

  SeguroviajeHomeController.$inject = ['authorizedResource', '$filter']
  function SeguroviajeHomeController(authorizedResource, $filter) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.menu = $filter('filter')(authorizedResource.accessSubMenu, {nombreCabecera : "SEGURVIAJES"})[0]
    }
  }

  return ng.module('appSeguroviaje').controller('SeguroviajeHomeController', SeguroviajeHomeController);
});
