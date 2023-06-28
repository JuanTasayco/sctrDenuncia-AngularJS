define([
    'angular', 'constants', 'constantsEpsEmpresa'
  ], function (angular, constants, constantsEpsEmpresa) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .controller('cotizacionEpsEmpresaController', CotizacionEpsEmpresaController);

    CotizacionEpsEmpresaController.$inject = ['$scope', '$state', 'epsEmpresaFactory', 'epsEmpresaService'];

    function CotizacionEpsEmpresaController($scope, $state, epsEmpresaFactory, epsEmpresaService) {
        var vm = this;

        // Propiedades
        vm.userRoot = false;
        vm.user = {};
        vm.currentStep = 1;
        
        // Funciones:
        vm.nextStep = NextStep;

        
        (function load_CotizacionEpsEmpresaController() {
          epsEmpresaFactory.initCotizacion();

          epsEmpresaService.getListParametros().then(function (response) { 
            if(response.rows) epsEmpresaFactory.setParametros(response.rows);
          }).catch(function() {
            _mostrarErrorInterno();
          });

          epsEmpresaService.getListTarifas().then(function (response) {
            if(response.rows) epsEmpresaFactory.setTarifas(response.rows);
          }).catch(function() {
            _mostrarErrorInterno();
          });
        })();
        

        function NextStep(step) {
            var e = { cancel: false, step: step }
            $scope.$broadcast('changingStep', e);
            return !e.cancel;
        }

        // Funciones privadas
        function _validSteps(step, prevent, event) {
          if (step === constantsEpsEmpresa.STEPS.INFORMACION_EMPRESA) {
            if (!epsEmpresaFactory.validStepDatosEmpresa()) {
              if (prevent) event.preventDefault();
              $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.DATOS_EMPRESA }, { reload: true, inherit: false });
              return (void 0);
            }
          }

          if (step === constantsEpsEmpresa.STEPS.INFORMACION_TRABAJADORES) {
            if (!epsEmpresaFactory.validStepInformacionEmpresa()) {
              if (prevent) event.preventDefault();
              $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_EMPRESA }, { reload: true, inherit: false });
              return (void 0);
            }
          }
          if (step === constantsEpsEmpresa.STEPS.INFORMACION_ADICIONAL) {
            if (!epsEmpresaFactory.validStepInformacionTrabajadores()) {
              if (prevent) event.preventDefault();
              $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_TRABAJADORES }, { reload: true, inherit: false });
              return (void 0);
            }
          }
          if (step === constantsEpsEmpresa.STEPS.INFORMACION_FINAL) {
            if (!epsEmpresaFactory.validStepInformacionAdicional()) {
              if (prevent) event.preventDefault();
              $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_ADICIONAL }, { reload: true, inherit: false });
              return (void 0);
            }
          }
        }

        function _mostrarErrorInterno() {
          return $state.go(constantsEpsEmpresa.ROUTES.ERROR_INTERNO, {}, { reload: true, inherit: false });
        }

        // Listener
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          _validSteps(toParams.step, true, event);
        });

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          _validSteps(toParams.step, false);
          vm.currentStep = toParams.step;
        });
    }
});