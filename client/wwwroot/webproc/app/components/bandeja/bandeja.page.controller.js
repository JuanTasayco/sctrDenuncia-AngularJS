'use strict';

define(['angular'], function(ng) {
  BandejaPageController.$inject = ['wpFactory', 'role'];
  function BandejaPageController(wpFactory, role) {
    // HACK: usado para los componentes de bandeja
    wpFactory.setRole(role);
    wpFactory.cache.setConsolidado(null)
  } // end controller

  return ng.module('appWp').controller('BandejaPageController', BandejaPageController);
});
