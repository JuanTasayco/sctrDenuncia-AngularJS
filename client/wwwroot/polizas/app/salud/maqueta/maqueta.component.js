'use strict';
define(['angular'], function(angular) {
  MaquetaController.$inject = [];
  function MaquetaController() {
    var vm = this;

    vm.$onInit = function() {};
  }

  return angular
    .module('appSalud')
    .controller('MaquetaController', MaquetaController)
    .component('saludMaqueta', {
      templateUrl: '/polizas/app/salud/maqueta/maqueta.component.html',
      controller: 'MaquetaController'
    });
});
