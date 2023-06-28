'use strict';

define(['angular'], function(ng) {
  CabeceraController.$inject = ['$state', 'wpFactory'];
  function CabeceraController($state, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.currentState = $state.current.name;
      vm.isAdmin = wpFactory.isAdmin();
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('CabeceraController', CabeceraController)
    .component('wpCabecera', {
      templateUrl: '/webproc/app/common/cabecera/cabecera.html',
      controller: 'CabeceraController',
      bindings: {
        wptitle: '=?'
      }
    });
});
