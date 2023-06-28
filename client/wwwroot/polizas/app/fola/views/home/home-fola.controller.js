define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular.module(constants.module.polizas.fola.moduleName).controller('homeFolaController', HomeFolaController);

  HomeFolaController.$inject = ['$state','isAdmin'];

  function HomeFolaController($state, isAdmin) {
    var vm = this;
    vm.isAdmin = isAdmin;
    // Funciones:
    vm.irCotizarPoliza = IrCotizarPoliza;
    vm.irEmitirPoliza = IrEmitirPoliza;
    vm.irBandejaDocumentoPolizaFola = IrBandejaDocumentoPolizaFola;
    vm.irPlanesFola = IrPlanesFola;

    function IrCotizarPoliza() {
      return $state.href(constantsFola.ROUTES.COTIZACION, {}, {reload: true, inherit: false});
    }
    function IrEmitirPoliza() {
      return $state.href(constantsFola.ROUTES.EMITIR_POLIZA, {}, {reload: true, inherit: false});
    }
    function IrBandejaDocumentoPolizaFola() {
      return $state.href(constantsFola.ROUTES.BANDEJA_DOCUMENTOS, {}, {reload: true, inherit: false});
    }
    function IrPlanesFola() {
      return $state.href(constantsFola.ROUTES.PLANES_FOLA, {}, {reload: true, inherit: false});
    }
  }
});
