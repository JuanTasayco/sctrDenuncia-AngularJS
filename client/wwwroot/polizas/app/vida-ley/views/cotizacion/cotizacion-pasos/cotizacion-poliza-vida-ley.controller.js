define([
  'angular', 'constants', 'constantsVidaLey', 'mpfModalConfirmationSteps'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('cotizacionPolizaVidaLeyController', CotizacionPolizaVidaLeyController);

  CotizacionPolizaVidaLeyController.$inject = ['$scope', '$state', '$uibModal', 'mainServices', 'mModalAlert', 'vidaLeyService', 'vidaLeyFactory'];

  function CotizacionPolizaVidaLeyController($scope, $state, $uibModal, mainServices, mModalAlert, vidaLeyService, vidaLeyFactory) {
    var vm = this;

    vm.cotizacion = {};
    vm.categorias = [];
    vm.isMultiriesgo = false;
    vm.currentStep = null;
    vm.isDeficit = isDeficit;

    vm.activeBotonSiguiente = ActiveBotonSiguiente;
    vm.stepDisabled = StepDisabled;
    vm.showModalConfirmation = ShowModalConfirmation;

    (function load_CotizacionPolizaVidaLeyController() {
      if(!vidaLeyFactory.cotizacion.step['1']){
        $state.go('.',{step: 1});
        return;
      }
      vm.currentStep = $state.params.step;
      vm.cotizacion = vidaLeyFactory.cotizacion;
      
    })();

    function ActiveBotonSiguiente() {
      return vidaLeyFactory.validStepPoliza();
    }

    function StepDisabled() {
      return vidaLeyFactory.getCompleteStepQuote(constantsVidaLey.STEPS.COTIZACION.POLIZA);
    }

    function ShowModalConfirmation() {

        if (vm.stepDisabled()) {
          _grabarCotizacionPoliza();
          return;
        }

        if (_validationForm()) {
          $scope.dataConfirmation = {
            save: false,
            title: '¿Estás seguro que quieres guardar los datos?',
            subTitle: 'Recuerda que una vez guardados los datos no podrás hacer cambios',
            lblClose: 'Seguir editando',
            lblSave: 'Guardar y continuar'
          };
          
          if (vm.cotizacion && vm.cotizacion.codEstado === 'AC') {
            $scope.dataConfirmation.title = '¿Estás seguro que quieres actualizar los datos?';
            $scope.dataConfirmation.lblSave = 'Actualizar y continuar'
          }

          var vModalSteps = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
            controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalSteps.result.then(function () {
            var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
              if (value.save) _grabarCotizacionPoliza();
            });
            $scope.$on('$destroy', function () { dataConfirmationWatch(); });
          }, function () { });
        } else {
          mModalAlert.showWarning('Observación', 'Debe llenar todos los datos obligatorios.');
        }
    }

    function _grabarCotizacionPoliza() {
      if (vm.activeBotonSiguiente()) {
        if (_validationForm()) {
          vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.POLIZA, vidaLeyFactory.getParametrosPoliza())
            .then(function (response) {
              //grabar paso 2
              vidaLeyFactory.setCompleteStep(constantsVidaLey.STEPS.COTIZACION.POLIZA);
              _goStepAsegurados();
            })
            .catch(function (error) {
              mModalAlert.showError(error.Message, "¡Error!")
            });
        }
      }
    }

    function _validationForm() {
      return true;
    }

    function _goStepAsegurados() {
      $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: constantsVidaLey.STEPS.COTIZACION.ASEGURADOS });
    }

    function isDeficit() {
      var params = {
        'codigoAplicacion': 'EMISA',
        "TipoRol": vidaLeyFactory.getUserActualRole(),
        "tipoValidacion": []
      };
      
      if(vm.cotizacion && vm.cotizacion.codEstado === 'AC') {
        params.tipoValidacion = ["CVS", "CVA"]
      }

      return vidaLeyService.isDeficit(vm.cotizacion.contratante.tipoDocumento +'-'+vm.cotizacion.contratante.numeroDocumento, params);
    }

  }



});
