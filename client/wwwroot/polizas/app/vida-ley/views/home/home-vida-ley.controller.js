define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('homeVidaLeyController', HomeVidaLeyController);

  HomeVidaLeyController.$inject = ['$state', 'oimAuthorize', 'vidaLeyFactory', 'proxyMenu', '$window'];

  function HomeVidaLeyController($state, oimAuthorize, vidaLeyFactory, proxyMenu, $window){
    var vm = this;

    (function loadHomeVidaLeyController() {      
      _loadMenu();

    })();

    function _loadMenu(){
      _getMenuItem();
    }

    function _getMenuItem(){
      vm.dataMenu = vidaLeyFactory.storageVidaLey();

      vm.menuNames = vm.dataMenu.map(function (item) {
        return item.nombreLargo
        }
      );
    }

    vm.goTo = function (item) {
      if(item === constantsVidaLey.ROUTES.COTIZACION_STEPS.name){
        vidaLeyFactory.clearCotizacion();
        $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: 1 }, { reload: true, inherit: false });
      }

      if(item === constantsVidaLey.ROUTES.BANDEJA_COTIZACION.name){
        $state.go(constantsVidaLey.ROUTES.BANDEJA_COTIZACION.url, {}, { reload: true, inherit: false });

      }

      if(item === constantsVidaLey.ROUTES.EMISION_STEPS.name){
        $state.go(constantsVidaLey.ROUTES.BANDEJA_COTIZACION.url, {parameter: 5}, { reload: true, inherit: false });

      }

      if(item === constantsVidaLey.ROUTES.MANTENIMIENTO.name){
        $state.go(constantsVidaLey.ROUTES.MANTENIMIENTO.url, {}, { reload: true, inherit: false });

      }

      if(item === constantsVidaLey.ROUTES.BANDEJA_REPORTES.name){
        $state.go(constantsVidaLey.ROUTES.BANDEJA_REPORTES.url, {}, { reload: true, inherit: false });

      }

    }

  }

});
