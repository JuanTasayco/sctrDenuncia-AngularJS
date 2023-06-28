define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfCotizacionResumen', CotizacionResumenDirective);

    CotizacionResumenDirective.$inject = [];

    function CotizacionResumenDirective() {
      var directive = {
        controller: CotizacionResumenDirectiveController,
        controllerAs: 'vm',
        restrict: 'E',
        templateUrl: '/polizas/app/vida-ley/components/cotizacion-resumen/cotizacion-resumen.template.html',
        transclude: true,
        scope: {
          showContratante: '=?',
          showPoliza: '=?',
          showAsegurados: '=?',
          disabled: '=?ngDisabled'
        }
      };

      return directive;
    }

    CotizacionResumenDirectiveController.$inject = ['$scope', 'vidaLeyFactory', '$state', 'vidaLeyService'];
    function CotizacionResumenDirectiveController($scope, vidaLeyFactory, $state, vidaLeyService) {
      var vm = this;
      var cotizacion$ = vidaLeyFactory.cotizacionObservable();

      vm.cotizacion = {};

      vm.getNameFrecuencia = GetNameFrecuencia;

      (function load_CotizacionResumenDirectiveController() {
        if (!$state.params.quotation) {
          vm.cotizacion = vidaLeyFactory.cotizacion;
          isDeficit();
          cotizacion$.subscribe($scope, function changes() {
            vm.cotizacion = vidaLeyFactory.cotizacion;
          });
          return;
        }
        
        _getCotizacion($state.params.quotation);

      })();

      function _getCotizacion(documentId) {
        vidaLeyService.getCotizacion(documentId)
          .then(function (response) {
            if(response.OperationCode === constants.operationCode.success) {
              vidaLeyFactory.setResumeStep1Emit(response.Data);
              vm.cotizacion = vidaLeyFactory.cotizacion;
              isDeficit();
            }
          });
      }

      function GetNameFrecuencia() {
        return vidaLeyFactory.getNameFrecuencia(vm.cotizacion.duracion.tipoDeclaracionDesc);
      }

      function isDeficit(){
        var params = {
          'codigoAplicacion': 'EMISA',
          "TipoRol": vidaLeyFactory.getUserActualRole(),
          "tipoValidacion": []
        };
        vidaLeyService.isDeficit(vm.cotizacion.contratante.tipoDocumento +'-'+vm.cotizacion.contratante.numeroDocumento, params)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.cotizacion.clienteEsDeficitario = response.Data.Codigo === '9834';
          }
        })
        .catch(function (error) {
          return false;
        });
      }

    }

});
