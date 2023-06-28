define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('cotizacionAseguradosVidaLeyController', CotizacionAseguradosVidaLeyController);

  CotizacionAseguradosVidaLeyController.$inject = ['$scope', '$state', '$uibModal', 'mModalConfirm', 'mModalAlert', 'vidaLeyService', 'vidaLeyFactory'];

  function CotizacionAseguradosVidaLeyController($scope, $state, $uibModal, mModalConfirm, mModalAlert, vidaLeyService, vidaLeyFactory) {
    var vm = this;

    vm.currentStep = null;
    vm.cotizacion = {};
    vm.categorias = [];
    vm.isMultiriesgo = false;
    vm.cambiarTipoRegistro = CambiarTipoRegistro;
    vm.agregarRiesgo = AgregarRiesgo;
    vm.showModalConfirmation = ShowModalConfirmation;
    vm.getHrefDescargarFormato = GetHrefDescargarFormato;
    vm.activeBotonSiguiente = ActiveBotonSiguiente;
    vm.stepDisabled = StepDisabled;
    vm.enActualizacion = enActualizacion;

    (function load_CotizacionAseguradosVidaLeyController() {
      if(!vidaLeyFactory.cotizacion.step['1'] || !vidaLeyFactory.cotizacion.step['2']){
        $state.go('.',{step: 2});
        return;
      }
      vidaLeyFactory.initiliceRiesgos();
      vm.currentStep = $state.params.step;
      vm.cotizacion = vidaLeyFactory.cotizacion;
      if(vidaLeyFactory.cotizacion.step['3'] && vm.cotizacion.codEstado != 'AC'){
        $state.go('.',{step: 4});
        return;
      }

      if (vm.cotizacion && (vm.cotizacion.codEstado === 'RE' || vm.cotizacion.codEstado === 'AC')) {
        vidaLeyService.getCotizacion(vm.cotizacion.numDoc)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vidaLeyFactory.setCotizacion(response.Data, 5);
            vm.cotizacion = vidaLeyFactory.cotizacion;
          }
        });
      }

      vm.isMultiriesgo = vidaLeyFactory.isMultiriesgo();
      _getListadoCategorias();
      _getInfoAplication();
    })();

    function CambiarTipoRegistro($event, $selectedIndex, riesgo) {
      if ($selectedIndex !== riesgo.tipo ) {
        if (riesgo.numeroTrabajadores > 0) {
          $event.stopPropagation();
          $event.preventDefault();
          var titulo = $selectedIndex ? "REGISTRO MANUAL" : "REGISTRO MASIVO";
          mModalConfirm.confirmWarning('Si realiza el cambio se perdera todos los datos registrados', titulo, '')
            .then(function (response) {
              riesgo.tipo = $selectedIndex;
              riesgo.numMovimiento = '';
              riesgo.numeroTrabajadores = 0;
              riesgo.montoTrabajadores = 0;
              riesgo.montoTrabajadoresReal = 0;
              riesgo.asegurados = [];
              riesgo.errorFile = 2;
              riesgo.fileName = '';
              riesgo.planilla = (void 0);
              riesgo.coberturas = [];
              riesgo.modelo = { mCategoria: riesgo.modelo.mCategoria };
            }, function (error) { });
        } else {
          riesgo.tipo = $selectedIndex;
        }
        
      } else {
        if ($event) {
          $event.stopPropagation();
          $event.preventDefault();
        }
      }
    }

    function AgregarRiesgo() {
      vidaLeyFactory.agregarRiesgo();
      _setCategoriaRiesgoDefault();
    }

    function ShowModalConfirmation() {
      if (vidaLeyFactory.validStepResultados()) {
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
              if (value.save) _grabarCotizacionAsegurados();
            });
            $scope.$on('$destroy', function () { dataConfirmationWatch(); });
          }, function () { });
      }
    }

    function GetHrefDescargarFormato() {
      return constantsVidaLey.ARCHIVOS.PLANTILLA_EXCEL_ASEGURADOS;
    }

    function ActiveBotonSiguiente() {
      return vidaLeyFactory.validStepResultados();
    }

    function StepDisabled() {
      return vidaLeyFactory.getCompleteStepQuote(constantsVidaLey.STEPS.COTIZACION.ASEGURADOS)
    }

    function _grabarCotizacionAsegurados() {
      if (vm.activeBotonSiguiente()) {
        if (_validationForm()) {
          vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.ASEGURADOS, vidaLeyFactory.getParametrosRiesgo())
            .then(function (response) {
              vidaLeyFactory.setRiesgoMontoTopado(response);
              vidaLeyFactory.setCompleteStep(constantsVidaLey.STEPS.COTIZACION.ASEGURADOS);
              vidaLeyFactory.setRiegosAC(response.RiesgoDTO);

              _goStepResultados();
            })
            .catch(function (error) {
              mModalAlert.showError(error.Message, "¡Error!")
            });
        }
      }
    }

    function _getListadoCategorias() {
      vidaLeyService.getListCategorias().then(function (response) {
        vm.categorias = response;
        _setCategoriaRiesgoDefault();
      });
    }

    function _setCategoriaRiesgoDefault() {
      vm.cotizacion.riesgos.forEach(function (riesgo) {
        if (!riesgo.modelo.mCategoria) {
          setTimeout(function () {
            riesgo.modelo.mCategoria = vm.categorias.find(function (categoria) { return categoria.NomCategoria === vidaLeyFactory.getCategoriaDefault() });
          }, 200);
        }
      });
    }

    function _getInfoAplication() {
      vidaLeyService.getInfoAplication(vidaLeyFactory.getParametrosPoliza()).then(function (response) {
        vidaLeyFactory.setInfoAplicacion(response);
      });
    }

    function _validationForm() {
      return vm.cotizacion.riesgos.filter(function (riesgo) { return !!riesgo.modelo.mCategoria }).length;
    }

    function _goStepResultados() {
      $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: constantsVidaLey.STEPS.COTIZACION.RESULTADOS });
    }

    function enActualizacion(){
      return vm.cotizacion && vm.cotizacion.codEstado === 'AC';
    }
  }

});
