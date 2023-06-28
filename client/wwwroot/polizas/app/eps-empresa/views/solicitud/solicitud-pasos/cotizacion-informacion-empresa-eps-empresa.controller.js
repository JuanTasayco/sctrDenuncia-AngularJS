define([
    'angular', 'lodash', 'constants', 'constantsEpsEmpresa', 'mpfPersonDirective', 'mpfModalConfirmationSteps'
  ], function (angular, _, constants, constantsEpsEmpresa) {
    'use strict';

    angular
    .module(constants.module.polizas.epsEmpresa.moduleName)
    .controller('cotizacionInformacionEmpresaEpsEmpresaController', CotizacionInformacionEmpresaEpsEmpresaController);

    CotizacionInformacionEmpresaEpsEmpresaController.$inject = ['$scope', '$state', 'epsEmpresaFactory'];

    function CotizacionInformacionEmpresaEpsEmpresaController($scope, $state, epsEmpresaFactory) {
        var vm = this;

        //Variables
        vm.informacionEmpresa = {};
        vm.eps_cia = {};
        vm.formService = constantsEpsEmpresa.VALIDATORS.INFORMACION_EMPRESA;

        // Funciones:
        vm.cambioEpsCia = CambioEpsCia;
        vm.getValidations = GetValidations;
        vm.activeBotonSiguiente = ActiveBotonSiguiente;
        vm.stepDisabled = StepDisabled;
        vm.goToNextStep = GoToNextStep;

        (function load_CotizacionInformacionEpsEmpresaController() {
            vm.eps_cia = epsEmpresaFactory.getParametro("EPS_CIA");
            vm.informacionEmpresa = epsEmpresaFactory.cotizacion.informacionEmpresa;

            var steps = document.getElementById('stepsSolicitud');
            steps.classList.remove("disabled-steps");
        })();

        function CambioEpsCia(seleccion) {
          if (angular.isUndefined(seleccion)) {
            vm.informacionEmpresa.mepsCia = void(0);
            vm.informacionEmpresa.epsCia = '';
            return;
          }else{
            vm.informacionEmpresa.epsCia = seleccion.valorNumerico;
            if(seleccion.valorNumerico === 3){
              vm.informacionEmpresa.nombre = '';
              vm.informacionEmpresa.nroAsegurados = 0;
            }
          }
        }

        function GetValidations(controlCode) {
          var findControl = _findControlObject(controlCode);
          return findControl ? findControl.Validations : {};
        }

        function ActiveBotonSiguiente() {
          return epsEmpresaFactory.validStepInformacionEmpresa() && _validationForm();
        }

        function GoToNextStep() {
          if (vm.stepDisabled()) {
              _goStepInformacionTrabajadores();
              return;
          }
    
          if (epsEmpresaFactory.validStepInformacionEmpresa() && _validationForm()) {
              _grabarCotizacionContratante();
          } 
          else {
              mModalAlert.showWarning('Obeservación', 'Debe llenar todos los datos obligatorios.');
          }
        }

        function StepDisabled() {
          return epsEmpresaFactory.getCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_EMPRESA)
        }

        // Funciones privadas:
        function _findControlObject(controlCode) {
          return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
        }

        function _validationForm() {
          $scope.frmInformacionEmpresa.markAsPristine();
          return (
            (
              vm.informacionEmpresa.epsCia == 3 && 
              vm.informacionEmpresa.nombre == "" && 
              +vm.informacionEmpresa.nroAsegurados == 0
              ) || 
              (
                vm.informacionEmpresa.epsCia !== 3 && 
                vm.informacionEmpresa.nombre && 
                !_isUndefinedOrNullOrEmpty(vm.informacionEmpresa.nombre) && 
                vm.informacionEmpresa.nroAsegurados &&
                !_isUndefinedOrNullOrEmpty(vm.informacionEmpresa.nroAsegurados) &&
                +vm.informacionEmpresa.nroAsegurados > 0 
              )
            ) && 
            $scope.frmInformacionEmpresa.$valid;
        }

        function _isUndefinedOrNullOrEmpty(value) {
          return value === null || value === undefined || value === '';
      }

        function _goStepInformacionTrabajadores() {
          $state.go(constantsEpsEmpresa.ROUTES.REGISTRAR_SOLICITUD_STEPS, { step: constantsEpsEmpresa.STEPS.INFORMACION_TRABAJADORES });
        }

        function _grabarCotizacionContratante() {
          if (epsEmpresaFactory.validStepInformacionEmpresa() && _validationForm()) {
              epsEmpresaFactory.setCompleteStep(constantsEpsEmpresa.STEPS.INFORMACION_EMPRESA);
              _goStepInformacionTrabajadores();
          }
        }
    }
});