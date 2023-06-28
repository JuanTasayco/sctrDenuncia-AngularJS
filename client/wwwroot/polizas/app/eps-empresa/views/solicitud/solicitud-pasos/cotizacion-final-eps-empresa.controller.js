define([
    'angular', 'lodash', 'constants', 'constantsEpsEmpresa', 'mpfPersonDirective', 'mpfModalConfirmationSteps'
  ], function (angular, _, constants, constantsEpsEmpresa) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .controller('cotizacionFinalEpsEmpresaController',CotizacionFinalEpsEmpresaController);

    CotizacionFinalEpsEmpresaController.$inject = ['$state', 'epsEmpresaFactory'];

    function CotizacionFinalEpsEmpresaController($state, epsEmpresaFactory) {
        var vm = this;


        vm.estado = -1;
        vm.resultado = {};
        vm.validaciones = {};

        // Funciones
        vm.cerrarSolicitud = CerrarSolicitud;

        (function load_CotizacionFinalEpsEmpresaController() {
          vm.resultado = epsEmpresaFactory.cotizacion.final;
          vm.estado = vm.resultado.estado;
          vm.validaciones = epsEmpresaFactory.validaciones;

          var steps = document.getElementById('stepsSolicitud');
          steps.classList.add("disabled-steps");
        })();

        function CerrarSolicitud() {
          return $state.go(constantsEpsEmpresa.ROUTES.HOME, {}, { reload: true, inherit: false });
      }
    }
});